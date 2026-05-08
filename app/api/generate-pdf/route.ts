import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { proposalId, coverPhotoBase64 } = await request.json();

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

    const { data: photos } = await supabase
      .from('proposal_photos')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('sort_order');

    const templatePath = path.join(process.cwd(), 'public', 'proposal-template.html');
    let html = readFileSync(templatePath, 'utf-8');

    // Always use Scopeify logo
    const defaultLogoPath = path.join(process.cwd(), 'public', 'Scopeify_logo_2.png');
    const logoBase64: string = 'data:image/png;base64,' + readFileSync(defaultLogoPath).toString('base64');

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let puppeteerModule: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let launchOptions: any;

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      puppeteerModule = (await import('puppeteer-core')).default;
      // Try common Windows Chrome paths
      const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.CHROME_PATH,
      ].filter(Boolean);
      launchOptions = {
        executablePath: chromePaths[0],
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
