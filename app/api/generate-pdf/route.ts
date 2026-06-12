import { NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serviceClient } from '@/lib/billing';
import { resolveTemplate } from '@/lib/templates/resolve';
import { renderProposalHtml } from '@/lib/templates/render';

// Headless Chromium must run on the Node runtime, and a PDF render routinely
// takes longer than Vercel's default 10s function timeout.
export const runtime = 'nodejs';
export const maxDuration = 60;

// Cover photos arrive inline as data URIs; cap at ~10MB of base64.
const MAX_COVER_PHOTO_CHARS = 14_000_000;

export async function POST(request: Request) {
  const supabase = serviceClient();
  try {
    const { proposalId, coverPhotoBase64 } = await request.json();
    if (typeof proposalId !== 'string' || !proposalId) {
      return NextResponse.json({ error: 'missing_proposal_id' }, { status: 400 });
    }
    if (
      coverPhotoBase64 != null &&
      (typeof coverPhotoBase64 !== 'string' ||
        !coverPhotoBase64.startsWith('data:image/') ||
        coverPhotoBase64.length > MAX_COVER_PHOTO_CHARS)
    ) {
      return NextResponse.json({ error: 'invalid_cover_photo' }, { status: 400 });
    }

    const supabaseAuth = await createServerSupabaseClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data: proposal, error: propErr } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single();
    if (propErr || !proposal) {
      return NextResponse.json({ error: 'proposal_not_found' }, { status: 404 });
    }

    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', proposal.company_id)
      .single();
    if (!company || company.user_id !== user.id) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const { data: photos } = await supabase
      .from('proposal_photos')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('sort_order');

    // Always available: Scopeify logo as base64 fallback.
    const defaultLogoPath = path.join(process.cwd(), 'public', 'Scopeify_logo_2.png');
    const logoBase64: string = 'data:image/png;base64,' + readFileSync(defaultLogoPath).toString('base64');

    // New section-based template system (opt-in via template_id / template_preset).
    // Falls back to the legacy proposal-template.html when no template is selected.
    const def = await resolveTemplate(supabase, {
      template_id: proposal.template_id,
      template_preset: proposal.template_preset,
      company_id: proposal.company_id,
    });

    let html: string;
    if (def) {
      html = renderProposalHtml(def, {
        company,
        proposal,
        photos: photos || [],
        logoSrc: company?.logo_url || logoBase64,
        coverPhoto: coverPhotoBase64 || null,
      });
    } else {
      const templatePath = path.join(process.cwd(), 'public', 'proposal-template.html');
      html = readFileSync(templatePath, 'utf-8');
      html = html.replaceAll('__LOGO_SRC__', logoBase64);

      // Cover photo: use base64 sent directly from client (no storage round-trip)
      const coverHeroStyle = coverPhotoBase64
        ? `background-image:url(${coverPhotoBase64});background-size:cover;background-position:center;`
        : '';
      html = html.replace('__COVER_HERO_STYLE__', coverHeroStyle);

      // Remove photos page entirely when no photos were uploaded
      if (!photos || photos.length === 0) {
        const p3Start = html.indexOf('<!-- ═══════════════════════════════════════\n     PAGE 3');
        const p4Start = html.indexOf('<!-- ═══════════════════════════════════════\n     PAGE 4');
        if (p3Start !== -1 && p4Start !== -1) {
          html = html.slice(0, p3Start) + html.slice(p4Start);
        }
      }

      const dataScript = `<script>window.__PROPOSAL_DATA__ = ${JSON.stringify({ company, proposal, photos: photos || [] })};</script>`;
      html = html.replace('<script>', dataScript + '\n<script>');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let puppeteerModule: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let launchOptions: any;

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      puppeteerModule = (await import('puppeteer-core')).default;
      // Try common Windows Chrome paths
      const chromePaths = [
        process.env.CHROME_PATH,
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      ].filter((p): p is string => Boolean(p));
      const chromePath = chromePaths.find((p) => existsSync(p));
      if (!chromePath) {
        return NextResponse.json({ error: 'chrome_not_found' }, { status: 500 });
      }
      launchOptions = {
        executablePath: chromePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chromiumModule = (await import('@sparticuz/chromium')).default as any;
      puppeteerModule = (await import('puppeteer-core')).default;
      launchOptions = {
        args: chromiumModule.args,
        defaultViewport: chromiumModule.defaultViewport,
        executablePath: await chromiumModule.executablePath(),
        headless: chromiumModule.headless,
      };
    }

    const browser = await puppeteerModule.launch(launchOptions);

    const page = await browser.newPage();
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await browser.close();

    const storagePath = `proposals/${proposalId}/proposal.pdf`;
    const { error: uploadErr } = await supabase.storage
      .from('proposal-pdfs')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
        cacheControl: '0',
      });

    if (uploadErr) {
      console.error('PDF upload error:', uploadErr);
      return NextResponse.json({ error: 'upload_failed' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('proposal-pdfs')
      .getPublicUrl(storagePath);

    const pdf_url = urlData.publicUrl;

    await supabase
      .from('proposals')
      .update({ pdf_url })
      .eq('id', proposalId);

    return NextResponse.json({ pdf_url });
  } catch (err) {
    console.error('generate-pdf error:', err);
    return NextResponse.json({ error: 'generation_failed' }, { status: 500 });
  }
}
