'use client';
import { useState, useEffect, useCallback } from 'react';

function fileToBase64(file: File, maxWidth = 1400): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = Math.min(img.width, maxWidth);
      const h = Math.round(img.height * (w / img.width));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.src = url;
  });
}


import { useRouter } from 'next/navigation';
import { generateProposalNumber } from '@/lib/proposalNumber';
import type { FormState, ProposalPath, Company, Proposal } from '@/lib/types';

function proposalToFormState(p: Proposal, company: Partial<Company>): FormState {
  return {
    path: p.path,
    company,
    logoFile: null,
    coverPhotoFile: null,
    coverPhotoBase64: (p.scope_data as { _cover_photo_b64?: string | null } | null)?._cover_photo_b64 ?? null,
    client_name: p.client_name,
    client_contact_name: p.client_contact_name,
    client_email: p.client_email,
    property_address: p.property_address,
    property_city: p.property_city,
    property_state: p.property_state,
    property_zip: p.property_zip,
    property_type: p.property_type,
    roof_data: p.roof_data || {},
    scope_data: p.scope_data || {},
    photos: [],
    line_items: (p.ai_line_items || []).map(item => ({
      title: item.title,
      specification: item.specification,
      quantity: item.quantity,
      unit: item.unit,
      line_total: item.line_total,
    })),
    final_price: p.final_price,
    price_source: p.price_source,
    ai_estimate_low: p.ai_estimate_low,
    ai_estimate_high: p.ai_estimate_high,
    payment_terms: p.payment_terms || {},
    warranty_data: p.warranty_data || {},
    valid_days: p.valid_days || 30,
    invoice_terms: p.invoice_terms || 'Net-15',
    credit_card_accepted: p.credit_card_accepted || 'Yes – 3% fee',
    template_preset: p.template_preset ?? null,
    template_id: p.template_id ?? null,
  };
}
import StepSidebar from './StepSidebar';
import StepTopbar from './StepTopbar';
import Step1Company from './steps/Step1Company';
import Step2Client from './steps/Step2Client';
import Step3Roof from './steps/Step3Roof';
import Step4Scope from './steps/Step4Scope';
import Step5Photos from './steps/Step5Photos';
import Step6Pricing from './steps/Step6Pricing';
import Step7Warranty from './steps/Step7Warranty';
import Step8Review from './steps/Step8Review';

const LOADING_MESSAGES = [
  'Analyzing roof data...',
  'Writing scope of work...',
  'Calculating line items...',
  'Building your proposal...',
];

const STEP_META: Record<number, { title: string; sub: string }> = {
  1: { title: 'Company Profile', sub: 'Saved to your account – fill in once, reused on every proposal' },
  2: { title: 'Client & Property', sub: 'Who are you sending this proposal to?' },
  3: { title: 'Roof Details', sub: 'Physical specs of the roof being worked on' },
  4: { title: 'Scope of Work', sub: 'What work are you proposing?' },
  5: { title: 'Site Photos', sub: 'Optional – photos appear in the PDF and drive confidence scoring' },
  6: { title: 'Pricing & Payment', sub: 'Use the AI estimate or enter your own number' },
  7: { title: 'Warranty', sub: 'What coverage are you offering the client?' },
  8: { title: 'Review & Generate', sub: 'Check everything before building your PDF' },
};

function defaultState(path: ProposalPath): FormState {
  return {
    path,
    company: {},
    logoFile: null,
    coverPhotoFile: null,
    coverPhotoBase64: null,
    client_name: '',
    client_contact_name: '',
    client_email: '',
    property_address: '',
    property_city: '',
    property_state: 'IL',
    property_zip: '',
    property_type: 'Industrial / Warehouse',
    roof_data: { stories: 1, sections: 1, hvac_count: 0, pipe_count: 0, drain_count: 0, skylight_count: 0 },
    scope_data: { work_types: [], deck_allowance_sqft: 0 },
    photos: [],
    line_items: [],
    final_price: null,
    price_source: path === 'proposal' ? 'manual' : 'ai',
    ai_estimate_low: null,
    ai_estimate_high: null,
    payment_terms: { deposit_pct: 30, progress_pct: 40, final_pct: 30 },
    warranty_data: { manufacturer_years: 20, workmanship_years: 5, leak_free_years: 2 },
    valid_days: 30,
    invoice_terms: 'Net-15',
    credit_card_accepted: 'Yes – 3% fee',
    template_preset: 'classic',
    template_id: null,
  };
}

function getTotalSteps(_path: ProposalPath) {
  return 8;
}

interface Props {
  path: ProposalPath;
  company: Company | null;
  existingProposal?: Proposal | null;
}

export default function ProposalForm({ path, company: initialCompany, existingProposal }: Props) {
  const router = useRouter();
  const isEditing = !!existingProposal;

  const [formState, setFormState] = useState<FormState>(() => {
    if (existingProposal) {
      return proposalToFormState(existingProposal, initialCompany || {});
    }
    // New proposals always start fresh; company is pre-filled via useEffect below
    return defaultState(path);
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Pre-fill company
  useEffect(() => {
    if (initialCompany) {
      setFormState((prev) => ({
        ...prev,
        company: {
          ...initialCompany,
          ...prev.company,
          id: initialCompany.id,
          user_id: initialCompany.user_id,
        },
      }));
    }
  }, [initialCompany]);


  const patch = useCallback((p: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...p }));
  }, []);

  function goToStep(n: number) {
    if (n > currentStep) setCompletedSteps((prev) => new Set([...prev, currentStep]));
    setCurrentStep(n);
    document.getElementById('form-content-scroll')?.scrollTo({ top: 0 });
  }

  const totalSteps = getTotalSteps(path);

  // Map logical step indices for paths without photo step
  function getComponentStep(logicalStep: number) {
    return logicalStep;
  }

  function handleNext() {
    if (currentStep < totalSteps) goToStep(currentStep + 1);
  }

  function handleBack() {
    if (currentStep > 1) goToStep(currentStep - 1);
    else router.push('/proposals/new');
  }

  async function handleGenerate() {
    setIsLoading(true);
    setLoadingError(null);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    let msgIdx = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 2200);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Calculate AI estimate if needed
      let ai_low = formState.ai_estimate_low;
      let ai_high = formState.ai_estimate_high;
      if (path !== 'proposal' && formState.price_source === 'ai' && !formState.final_price) {
        const estRes = await fetch('/api/calculate-estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: formState.property_state,
            roofType: formState.roof_data.existing_roof_type,
            workType: (formState.scope_data.work_types || [])[0],
            roofData: formState.roof_data,
          }),
        });
        if (estRes.ok) {
          const est = await estRes.json();
          ai_low = est.low;
          ai_high = est.high;
        }
      }

      // 2. Compute cover photo base64 early so it can be embedded in the proposal INSERT
      const coverPhotoBase64 = formState.coverPhotoFile
        ? await fileToBase64(formState.coverPhotoFile)
        : (formState.coverPhotoBase64 ?? null);

      // 2b. Summarize AI photo findings for the scope prompt + aggregate condition score
      const analyzedPhotos = formState.photos.filter((p) => p.analysis?.is_roof_photo);
      const photoConditionScore = analyzedPhotos.length
        ? Math.round(analyzedPhotos.reduce((s, p) => s + (p.analysis?.condition_score ?? 0), 0) / analyzedPhotos.length)
        : null;
      const photoFindings = analyzedPhotos.map((p) =>
        `${p.slot_label}: ${p.analysis?.severity} — ${(p.analysis?.damage_types || []).join(', ') || 'no major damage'}. ${p.analysis?.observations ?? ''}`.trim()
      );

      // 3. Generate scope via AI (strip cover photo base64 — too large to send to AI)
      const scopeRes = await fetch('/api/generate-scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formState, photos: undefined, photo_findings: photoFindings, coverPhotoBase64: undefined, scope_data: { ...formState.scope_data, _cover_photo_b64: undefined }, ai_estimate_low: ai_low, ai_estimate_high: ai_high }),
      });
      if (!scopeRes.ok) throw new Error('Scope generation failed');
      const { narrative, line_items } = await scopeRes.json();

      // 3. Proposal number
      let proposalNumber: string;
      if (isEditing) {
        // Strip any existing "Edited-" prefix so re-editing doesn't compound it
        const base = existingProposal!.proposal_number.replace(/^Edited-/, '');
        proposalNumber = 'Edited-' + base;
      } else {
        const { count } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', formState.company.id);
        proposalNumber = generateProposalNumber(count || 0);
      }

      // 4. Always persist company profile fields to DB; handle logo upload when present
      const companyUpdate: Record<string, unknown> = {
        name: formState.company.name || '',
        owner_name: formState.company.owner_name || '',
        license_number: formState.company.license_number || '',
        email: formState.company.email || '',
        phone: formState.company.phone || '',
        city: formState.company.city || '',
        state: formState.company.state || 'IL',
        certifications: formState.company.certifications || [],
      };
      if (formState.logoFile) {
        const logoPath = `${user.id}/logo/${formState.logoFile.name}`;
        await supabase.storage.from('company-assets').upload(logoPath, formState.logoFile, { upsert: true });
        const { data: urlData } = supabase.storage.from('company-assets').getPublicUrl(logoPath);
        companyUpdate.logo_url = urlData.publicUrl;
      }
      await supabase.from('companies').update(companyUpdate).eq('id', formState.company.id);

      // 5. Merge user line item prices into AI-generated items
      const userItems = formState.line_items || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mergedLineItems: any[] = (line_items as any[]).map((aiItem: any, i: number) => {
        const u = userItems[i];
        if (u && (u.line_total || 0) > 0) {
          return {
            ...aiItem,
            ...(u.title ? { title: u.title } : {}),
            ...(u.specification ? { specification: u.specification } : {}),
            ...(u.quantity && u.quantity > 0 ? { quantity: u.quantity } : {}),
            ...(u.unit ? { unit: u.unit } : {}),
            line_total: u.line_total,
          };
        }
        return aiItem;
      });
      for (let i = (line_items as any[]).length; i < userItems.length; i++) {
        const u = userItems[i];
        if (u?.title && (u.line_total || 0) > 0) {
          mergedLineItems.push({ title: u.title, description: '', specification: u.specification || '', quantity: u.quantity || 1, unit: u.unit || 'LS', line_total: u.line_total || 0 });
        }
      }
      const lineItemsTotal = mergedLineItems.reduce((s: number, item: any) => s + (item.line_total || 0), 0);

      // 6. Insert (new) or Update (editing) proposal
      const proposalFields = {
        client_name: formState.client_name,
        client_contact_name: formState.client_contact_name,
        client_email: formState.client_email,
        property_address: formState.property_address,
        property_city: formState.property_city,
        property_state: formState.property_state,
        property_zip: formState.property_zip,
        property_type: formState.property_type,
        roof_data: formState.roof_data,
        scope_data: { ...formState.scope_data, ...(coverPhotoBase64 ? { _cover_photo_b64: coverPhotoBase64 } : {}) },
        ai_scope_narrative: narrative,
        ai_line_items: mergedLineItems,
        ai_estimate_low: ai_low,
        ai_estimate_high: ai_high,
        final_price: formState.final_price || (lineItemsTotal > 0 ? lineItemsTotal : null) || (formState.price_source === 'ai' && ai_high ? Math.round((ai_low! + ai_high) / 2) : null),
        price_source: formState.price_source,
        photo_condition_score: photoConditionScore,
        payment_terms: { deposit_pct: 30, deposit_note: 'Due at signing', progress_pct: 40, progress_note: 'Upon tear-off completion', final_pct: 30, final_note: 'Upon substantial completion', ...formState.payment_terms },
        warranty_data: formState.warranty_data,
        valid_days: formState.valid_days,
        invoice_terms: formState.invoice_terms,
        credit_card_accepted: formState.credit_card_accepted,
        template_preset: formState.template_id ? null : (formState.template_preset ?? 'classic'),
        template_id: formState.template_id ?? null,
        notes: formState.scope_data.notes || '',
      };

      // Always insert — editing creates a new "Edited-" proposal, original is preserved
      const { data, error: insertErr } = await supabase
        .from('proposals')
        .insert({ company_id: formState.company.id, proposal_number: proposalNumber, path, status: 'draft', ...proposalFields })
        .select()
        .single();
      if (insertErr || !data) throw new Error('Failed to save proposal');
      const proposal = data;

      // 6. Upload photos
      if (formState.photos.length > 0) {
        for (let i = 0; i < formState.photos.length; i++) {
          const photo = formState.photos[i];
          const filePath = `${user.id}/${proposal.id}/${photo.file.name}`;
          const { error: uploadErr } = await supabase.storage
            .from('proposal-photos')
            .upload(filePath, photo.file, { upsert: true });
          if (!uploadErr) {
            const { data: urlData } = supabase.storage.from('proposal-photos').getPublicUrl(filePath);
            await supabase.from('proposal_photos').insert({
              proposal_id: proposal.id,
              storage_path: filePath,
              public_url: urlData.publicUrl,
              caption: photo.caption,
              slot_label: photo.slot_label,
              sort_order: i,
              analysis: photo.analysis ?? null,
              analysis_status: photo.analysis_status ?? 'pending',
              ai_caption: photo.analysis?.suggested_caption ?? null,
            });
          }
        }
      }

      // 7. Generate PDF
      const pdfRes = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: proposal.id, coverPhotoBase64 }),
      });
      if (!pdfRes.ok) {
        console.warn('PDF generation failed – proposal saved without PDF');
      }

      clearInterval(interval);
      router.push(`/proposals/${proposal.id}/preview`);
    } catch (err) {
      clearInterval(interval);
      setLoadingError(err instanceof Error ? err.message : 'Generation failed');
      setIsLoading(false);
    }
  }

  const meta = STEP_META[getComponentStep(currentStep)] || STEP_META[currentStep];
  const isLast = currentStep === totalSteps;

  function renderStep() {
    // getComponentStep maps logical step → component step, skipping step 5 (Photos) for estimate path
    const cs = getComponentStep(currentStep);
    switch (cs) {
      case 1: return <Step1Company state={formState} onChange={patch} />;
      case 2: return <Step2Client state={formState} onChange={patch} />;
      case 3: return <Step3Roof state={formState} onChange={patch} />;
      case 4: return <Step4Scope state={formState} onChange={patch} />;
      case 5: return <Step5Photos state={formState} onChange={patch} path={path} />;
      case 6: return <Step6Pricing state={formState} onChange={patch} path={path} />;
      case 7: return <Step7Warranty state={formState} onChange={patch} />;
      case 8: return <Step8Review state={formState} onChange={patch} onGoTo={goToStep} onGenerate={handleGenerate} />;
      default: return null;
    }
  }

  return (
    <>
      {/* Full-screen loading overlay */}
      {isLoading && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--nd)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <div className="flex items-center mb-2">
            <img src="/Scopeify_Logo_Inversed_v2.png" alt="Scopeify" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
          </div>

          {loadingError ? (
            <>
              <div style={{ fontSize: 16, color: '#f87171', fontWeight: 400 }}>{loadingError}</div>
              <button
                onClick={() => { setIsLoading(false); setLoadingError(null); }}
                style={{ background: 'var(--nm)', border: '1.5px solid var(--sv)', color: 'var(--sl)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '11px 24px', cursor: 'pointer' }}
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(180,200,220,0.15)', borderTopColor: 'var(--sv)', borderRadius: '50%' }} className="spinner" />
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 300, letterSpacing: '0.04em' }}>{loadingMsg}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>This takes about 15 seconds</div>
            </>
          )}
        </div>
      )}

      {/* Form shell */}
      <div className="flex w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        <StepSidebar
          path={path}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onGoTo={goToStep}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <StepTopbar
            title={meta?.title || ''}
            sub={meta?.sub || ''}
            onBack={handleBack}
            onNext={isLast ? handleGenerate : handleNext}
            nextLabel={isLast ? (isEditing ? 'Regenerate PDF' : 'Generate PDF') : 'Continue →'}
            isLast={isLast}
          />
          <div id="form-content-scroll" className="flex-1 overflow-y-auto" style={{ padding: '40px 40px 80px', maxWidth: 860 }}>
            <div className="fade-in" key={currentStep}>
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
