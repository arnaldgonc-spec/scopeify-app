import type { TemplateDefinition, TemplateSection, RenderData, TemplateTheme } from './types';

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// URLs land inside src="" attributes and CSS url(...) — restrict schemes and
// strip characters that could break out of either context.
function safeUrl(s: unknown): string {
  const url = String(s ?? '').trim();
  if (!/^(https?:\/\/|data:image\/)/i.test(url)) return '';
  return url.replace(/["'()<>\\]/g, (c) => encodeURIComponent(c));
}

// Theme values are interpolated into a <style> block; keep them inert.
function cssSafe(s: unknown): string {
  return String(s ?? '').replace(/[<>{};"\\]/g, '');
}

function money(n: number | null | undefined): string {
  if (n == null) return '—';
  return '$' + Math.round(n).toLocaleString('en-US');
}

const SEVERITY_LABEL: Record<string, string> = {
  none: 'No major damage', low: 'Minor wear', moderate: 'Moderate damage', severe: 'Severe damage',
};

// ── Section renderers ──────────────────────────────────────────────

function coverSection(d: RenderData, t: TemplateTheme): string {
  const p = d.proposal;
  const coverUrl = safeUrl(d.coverPhoto);
  const logoUrl = safeUrl(d.logoSrc);
  const heroStyle = coverUrl
    ? `background-image:linear-gradient(rgba(15,20,40,0.55),rgba(15,20,40,0.75)),url(${coverUrl});background-size:cover;background-position:center;`
    : `background:${cssSafe(t.primary)};`;
  const logo = (t.logoPlacement !== 'cover-only' || logoUrl) && logoUrl
    ? `<img src="${logoUrl}" alt="logo" style="height:46px;width:auto;object-fit:contain;margin-bottom:28px;filter:brightness(0) invert(1);" />`
    : '';
  return `<section class="page cover" style="${heroStyle}color:#fff;">
    <div class="cover-inner">
      ${logo}
      <div class="kicker">Roofing Proposal</div>
      <h1>${esc(p.client_name) || 'Client Proposal'}</h1>
      <div class="cover-sub">${esc(p.property_address)}${p.property_city ? `, ${esc(p.property_city)}` : ''} ${esc(p.property_state)} ${esc(p.property_zip)}</div>
      <div class="cover-meta">
        <div><span>Proposal #</span>${esc(p.proposal_number)}</div>
        <div><span>Prepared by</span>${esc(d.company?.name)}</div>
        <div><span>Valid for</span>${esc(p.valid_days ?? 30)} days</div>
      </div>
    </div>
  </section>`;
}

function scopeSection(d: RenderData): string {
  const p = d.proposal;
  const items = Array.isArray(p.ai_line_items) ? p.ai_line_items : [];
  const rows = items.map((it) => `
    <div class="scope-item">
      <div class="scope-item-head">${esc(it.title)}</div>
      <div class="scope-item-spec">${esc(it.specification || it.description || '')}</div>
    </div>`).join('');
  return `<section class="page">
    <h2 class="sec-title">Scope of Work</h2>
    ${p.ai_scope_narrative ? `<p class="narrative">${esc(p.ai_scope_narrative)}</p>` : ''}
    <div class="scope-list">${rows}</div>
  </section>`;
}

function photosSection(d: RenderData): string {
  if (!d.photos || d.photos.length === 0) return '';
  const score = d.proposal.photo_condition_score;
  const tiles = d.photos.map((ph) => {
    const sev = ph.analysis?.severity as string | undefined;
    const cond = ph.analysis?.condition_score as number | undefined;
    const badge = sev
      ? `<div class="photo-badge sev-${esc(sev).replace(/[^a-z-]/gi, '')}">${SEVERITY_LABEL[sev] ?? esc(sev)}${cond != null ? ` · ${esc(cond)}/100` : ''}</div>`
      : '';
    return `<figure class="photo">
      <div class="photo-img" style="background-image:url(${safeUrl(ph.public_url)})"></div>
      ${badge}
      <figcaption>${esc(ph.caption || ph.ai_caption || ph.slot_label)}</figcaption>
    </figure>`;
  }).join('');
  return `<section class="page">
    <h2 class="sec-title">Site Photos & Condition Assessment</h2>
    ${score != null ? `<div class="cond-score">Overall roof condition score: <strong>${score}/100</strong></div>` : ''}
    <div class="photo-grid">${tiles}</div>
  </section>`;
}

function pricingSection(d: RenderData, section: TemplateSection): string {
  const p = d.proposal;
  const showLineItems = section.options?.showLineItems !== false;
  const items = Array.isArray(p.ai_line_items) ? p.ai_line_items : [];
  const lineRows = showLineItems && items.length
    ? `<table class="price-table"><thead><tr><th>Item</th><th>Qty</th><th class="r">Amount</th></tr></thead><tbody>
        ${items.map((it) => `<tr><td>${esc(it.title)}</td><td>${esc(it.quantity ?? '')} ${esc(it.unit ?? '')}</td><td class="r">${money(it.line_total)}</td></tr>`).join('')}
      </tbody></table>`
    : '';
  const total = p.final_price ?? (p.ai_estimate_low && p.ai_estimate_high ? Math.round((p.ai_estimate_low + p.ai_estimate_high) / 2) : null);
  const range = !p.final_price && p.ai_estimate_low && p.ai_estimate_high
    ? `<div class="price-range">Estimated range: ${money(p.ai_estimate_low)} – ${money(p.ai_estimate_high)}</div>` : '';
  const terms = p.payment_terms;
  return `<section class="page">
    <h2 class="sec-title">Investment</h2>
    ${lineRows}
    <div class="price-total"><span>Total Investment</span><strong>${money(total)}</strong></div>
    ${range}
    ${terms ? `<div class="terms-grid">
      <div><span>${terms.deposit_pct ?? 30}%</span>Deposit — ${esc(terms.deposit_note || 'Due at signing')}</div>
      <div><span>${terms.progress_pct ?? 40}%</span>Progress — ${esc(terms.progress_note || 'At tear-off')}</div>
      <div><span>${terms.final_pct ?? 30}%</span>Final — ${esc(terms.final_note || 'At completion')}</div>
    </div>` : ''}
    <div class="invoice-note">Invoice terms: ${esc(p.invoice_terms || 'Net-15')}</div>
  </section>`;
}

function warrantySection(d: RenderData): string {
  const w = d.proposal.warranty_data;
  if (!w) return '';
  return `<section class="page">
    <h2 class="sec-title">Warranty</h2>
    <div class="warranty-grid">
      ${w.manufacturer_years ? `<div><span>${esc(w.manufacturer_years)} yr</span>Manufacturer ${esc(w.manufacturer || '')} ${esc(w.warranty_type || '')}</div>` : ''}
      ${w.workmanship_years ? `<div><span>${esc(w.workmanship_years)} yr</span>Workmanship warranty</div>` : ''}
      ${w.leak_free_years ? `<div><span>${esc(w.leak_free_years)} yr</span>Leak-free guarantee</div>` : ''}
    </div>
  </section>`;
}

function termsSection(d: RenderData, section: TemplateSection): string {
  const body = section.text || 'This proposal is valid for the period stated on the cover. Work will be performed in accordance with manufacturer specifications and local code. Final pricing subject to inspection of concealed conditions.';
  return `<section class="page">
    <h2 class="sec-title">${esc(section.heading || 'Terms & Conditions')}</h2>
    <p class="narrative">${esc(body)}</p>
  </section>`;
}

function signatureSection(d: RenderData): string {
  return `<section class="page">
    <h2 class="sec-title">Acceptance</h2>
    <p class="narrative">By signing below, the client accepts the scope of work and pricing described in this proposal.</p>
    <div class="sign-grid">
      <div class="sign-line"><span></span>Client signature &amp; date</div>
      <div class="sign-line"><span></span>${esc(d.company?.name || 'Contractor')} authorized signature</div>
    </div>
  </section>`;
}

function textBlockSection(_d: RenderData, section: TemplateSection): string {
  return `<section class="page">
    ${section.heading ? `<h2 class="sec-title">${esc(section.heading)}</h2>` : ''}
    <p class="narrative">${esc(section.text || '')}</p>
  </section>`;
}

function renderSection(s: TemplateSection, d: RenderData, t: TemplateTheme): string {
  switch (s.id) {
    case 'cover': return coverSection(d, t);
    case 'scope': return scopeSection(d);
    case 'photos': return photosSection(d);
    case 'pricing': return pricingSection(d, s);
    case 'warranty': return warrantySection(d);
    case 'terms': return termsSection(d, s);
    case 'signature': return signatureSection(d);
    case 'textBlock': return textBlockSection(d, s);
    default: return '';
  }
}

function styles(theme: TemplateTheme): string {
  // Theme values come from user-editable template definitions — neutralize them
  // before interpolating into the stylesheet.
  const t = {
    bodyFont: cssSafe(theme.bodyFont),
    headingFont: cssSafe(theme.headingFont),
    primary: cssSafe(theme.primary),
    accent: cssSafe(theme.accent),
    text: cssSafe(theme.text),
  };
  return `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:${t.bodyFont}; color:${t.text}; }
    .page { width:816px; min-height:1056px; padding:64px 72px; page-break-after:always; position:relative; }
    .page:last-child { page-break-after:auto; }
    .cover { padding:0; display:flex; align-items:flex-end; }
    .cover-inner { padding:72px; width:100%; }
    .cover .kicker { font-family:${t.headingFont}; letter-spacing:0.2em; text-transform:uppercase; font-size:13px; opacity:0.8; margin-bottom:10px; }
    .cover h1 { font-family:${t.headingFont}; font-size:54px; line-height:1; margin-bottom:14px; }
    .cover-sub { font-size:15px; opacity:0.85; margin-bottom:32px; }
    .cover-meta { display:flex; gap:40px; border-top:1px solid rgba(255,255,255,0.25); padding-top:20px; }
    .cover-meta div { font-size:14px; }
    .cover-meta span { display:block; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.6; margin-bottom:3px; }
    .sec-title { font-family:${t.headingFont}; color:${t.primary}; font-size:30px; letter-spacing:0.02em; margin-bottom:20px; border-bottom:3px solid ${t.accent}; padding-bottom:10px; }
    .narrative { font-size:14px; line-height:1.7; margin-bottom:22px; }
    .scope-list { display:flex; flex-direction:column; gap:14px; }
    .scope-item { border-left:3px solid ${t.accent}; padding:6px 0 6px 16px; }
    .scope-item-head { font-weight:700; font-size:15px; color:${t.primary}; margin-bottom:3px; }
    .scope-item-spec { font-size:13px; line-height:1.6; }
    .photo-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .photo-img { aspect-ratio:4/3; background-size:cover; background-position:center; border:1px solid #e2e8f0; }
    .photo figcaption { font-size:12px; margin-top:6px; color:${t.text}; }
    .photo-badge { display:inline-block; font-size:10px; font-weight:700; padding:2px 8px; margin-top:6px; color:#fff; border-radius:2px; }
    .sev-none { background:#15803d; } .sev-low { background:#65a30d; } .sev-moderate { background:#d97706; } .sev-severe { background:#dc2626; }
    .cond-score { font-size:14px; margin-bottom:18px; }
    .price-table { width:100%; border-collapse:collapse; margin-bottom:20px; font-size:13px; }
    .price-table th { text-align:left; background:${t.primary}; color:#fff; padding:8px 12px; font-family:${t.headingFont}; letter-spacing:0.05em; text-transform:uppercase; font-size:11px; }
    .price-table td { padding:8px 12px; border-bottom:1px solid #e2e8f0; }
    .price-table .r { text-align:right; }
    .price-total { display:flex; justify-content:space-between; align-items:center; background:${t.primary}; color:#fff; padding:16px 22px; }
    .price-total span { font-family:${t.headingFont}; letter-spacing:0.1em; text-transform:uppercase; font-size:14px; }
    .price-total strong { font-size:28px; font-family:${t.headingFont}; }
    .price-range { font-size:13px; margin-top:10px; opacity:0.8; }
    .terms-grid, .warranty-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:20px; }
    .terms-grid div, .warranty-grid div { border:1px solid #e2e8f0; padding:14px; font-size:12px; }
    .terms-grid span, .warranty-grid span { display:block; font-family:${t.headingFont}; color:${t.primary}; font-size:24px; margin-bottom:4px; }
    .invoice-note { font-size:12px; margin-top:16px; opacity:0.7; }
    .sign-grid { display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-top:60px; }
    .sign-line span { display:block; border-bottom:1px solid ${t.text}; height:40px; margin-bottom:8px; }
    .sign-line { font-size:12px; }
  `;
}

// Render a full standalone HTML document for a proposal from a template definition.
export function renderProposalHtml(def: TemplateDefinition, data: RenderData): string {
  const sections = [...def.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)
    .map((s) => renderSection(s, data, def.theme))
    .join('\n');

  const fonts = 'https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700&family=Bebas+Neue&display=swap';

  return `<!DOCTYPE html><html><head><meta charset="utf-8" />
    <link href="${fonts}" rel="stylesheet" />
    <style>${styles(def.theme)}</style>
  </head><body>${sections}</body></html>`;
}
