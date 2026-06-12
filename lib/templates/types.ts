export type SectionId =
  | 'cover' | 'scope' | 'photos' | 'pricing' | 'warranty' | 'terms' | 'signature' | 'textBlock';

export type LogoPlacement = 'header-left' | 'header-center' | 'cover-only';

export interface TemplateSection {
  id: SectionId;
  enabled: boolean;
  order: number;
  // Per-section options, e.g. { showLineItems: true } for pricing.
  options?: Record<string, unknown>;
  // For textBlock sections: heading + body copy.
  heading?: string;
  text?: string;
}

export interface TemplateTheme {
  primary: string;   // headings / accents
  accent: string;    // secondary accent
  text: string;      // body text color
  headingFont: string;
  bodyFont: string;
  logoPlacement: LogoPlacement;
}

export interface TemplateDefinition {
  theme: TemplateTheme;
  sections: TemplateSection[];
}

// Shape of the data passed to the renderer.
export interface RenderData {
  company: {
    name?: string; owner_name?: string; email?: string; phone?: string;
    city?: string; state?: string; license_number?: string;
    logo_url?: string | null; certifications?: string[];
  } | null;
  proposal: {
    proposal_number?: string;
    client_name?: string; client_contact_name?: string; client_email?: string;
    property_address?: string; property_city?: string; property_state?: string; property_zip?: string;
    property_type?: string;
    ai_scope_narrative?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ai_line_items?: any[];
    final_price?: number | null;
    ai_estimate_low?: number | null;
    ai_estimate_high?: number | null;
    photo_condition_score?: number | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payment_terms?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warranty_data?: any;
    valid_days?: number;
    invoice_terms?: string;
  };
  photos: {
    public_url: string; caption: string; slot_label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analysis?: any; ai_caption?: string | null;
  }[];
  logoSrc: string;          // resolved data/URL for the logo
  coverPhoto?: string | null;
}
