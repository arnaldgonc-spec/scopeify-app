export type ProposalPath = 'proposal' | 'estimate' | 'assessment';
export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface Company {
  id: string;
  user_id: string;
  name: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  license_number: string;
  logo_url: string | null;
  certifications: string[];
  created_at: string;
}

export interface RoofData {
  existing_roof_type: string;
  area_sqft: number;
  roof_age: number;
  stories: number;
  slope: string;
  eave_height: number | null;
  sections: number;
  hvac_count: number;
  pipe_count: number;
  drain_count: number;
  skylight_count: number;
  parapet_lf: number | null;
  access: string;
}

export interface ScopeData {
  work_types: string[];
  new_membrane_type: string;
  attachment_method: string;
  insulation_r_value: string;
  phasing: string;
  estimated_duration: string;
  deck_allowance_sqft: number;
  prevailing_wage: string;
  notes: string;
}

export interface LineItem {
  title: string;
  description: string;
  specification: string;
  quantity: number;
  unit: string;
  line_total: number;
}

export interface PaymentTerms {
  deposit_pct: number;
  deposit_note: string;
  progress_pct: number;
  progress_note: string;
  final_pct: number;
  final_note: string;
}

export interface WarrantyData {
  manufacturer: string;
  manufacturer_years: number;
  warranty_type: string;
  registered_in: string;
  workmanship_years: number;
  leak_free_years: number;
}

export interface Proposal {
  id: string;
  company_id: string;
  proposal_number: string;
  path: ProposalPath;
  status: ProposalStatus;
  client_name: string;
  client_contact_name: string;
  client_email: string;
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  property_type: string;
  roof_data: RoofData;
  scope_data: ScopeData;
  ai_scope_narrative: string | null;
  ai_line_items: LineItem[];
  ai_estimate_low: number | null;
  ai_estimate_high: number | null;
  final_price: number | null;
  price_source: 'ai' | 'manual';
  confidence_score: number | null;
  photo_condition_score: number | null;
  template_id: string | null;
  template_preset: string | null;
  payment_terms: PaymentTerms;
  warranty_data: WarrantyData;
  valid_days: number;
  invoice_terms: string;
  credit_card_accepted: string;
  pdf_url: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type PhotoSeverity = 'none' | 'low' | 'moderate' | 'severe';

export interface PhotoAnalysis {
  is_roof_photo: boolean;
  damage_types: string[];
  severity: PhotoSeverity;
  condition_score: number;
  suggested_caption: string;
  observations: string;
}

export interface ProposalPhoto {
  id: string;
  proposal_id: string;
  storage_path: string;
  public_url: string;
  caption: string;
  slot_label: string;
  sort_order: number;
  analysis: PhotoAnalysis | null;
  analysis_status: 'pending' | 'done' | 'failed' | 'skipped';
  ai_caption: string | null;
}

export interface FormPhoto {
  file: File;
  slot_label: string;
  caption: string;
  analysis?: PhotoAnalysis | null;
  analysis_status?: 'pending' | 'done' | 'failed' | 'skipped';
}

export interface FormState {
  path: ProposalPath;
  company: Partial<Company>;
  logoFile: File | null;
  coverPhotoFile: File | null;
  coverPhotoBase64: string | null;
  client_name: string;
  client_contact_name: string;
  client_email: string;
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  property_type: string;
  roof_data: Partial<RoofData>;
  scope_data: Partial<ScopeData>;
  photos: FormPhoto[];
  line_items: Partial<LineItem>[];
  final_price: number | null;
  price_source: 'ai' | 'manual';
  ai_estimate_low: number | null;
  ai_estimate_high: number | null;
  payment_terms: Partial<PaymentTerms>;
  warranty_data: Partial<WarrantyData>;
  valid_days: number;
  invoice_terms: string;
  credit_card_accepted: string;
  template_preset: string | null;
  template_id: string | null;
}
