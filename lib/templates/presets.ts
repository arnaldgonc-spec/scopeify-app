import type { TemplateDefinition, TemplateSection } from './types';

const FULL_SECTIONS: TemplateSection[] = [
  { id: 'cover', enabled: true, order: 0 },
  { id: 'scope', enabled: true, order: 1 },
  { id: 'photos', enabled: true, order: 2 },
  { id: 'pricing', enabled: true, order: 3, options: { showLineItems: true } },
  { id: 'warranty', enabled: true, order: 4 },
  { id: 'terms', enabled: true, order: 5 },
  { id: 'signature', enabled: true, order: 6 },
];

function sections(overrides: Partial<Record<string, boolean>> = {}): TemplateSection[] {
  return FULL_SECTIONS.map((s) => ({ ...s, enabled: overrides[s.id] ?? s.enabled }));
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  definition: TemplateDefinition;
}

export const PRESETS: Preset[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'The signature Scopeify navy proposal — balanced and professional.',
    definition: {
      theme: {
        primary: '#1b2a5e', accent: '#b4c8dc', text: '#1f2933',
        headingFont: "'Bebas Neue', sans-serif", bodyFont: "'Barlow', sans-serif",
        logoPlacement: 'cover-only',
      },
      sections: sections(),
    },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High-contrast headings and a strong accent bar for impact.',
    definition: {
      theme: {
        primary: '#0f172a', accent: '#f97316', text: '#1f2933',
        headingFont: "'Barlow Condensed', sans-serif", bodyFont: "'Barlow', sans-serif",
        logoPlacement: 'header-left',
      },
      sections: sections(),
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, restrained typography. Drops photos and signature for a tight 1-2 page quote.',
    definition: {
      theme: {
        primary: '#111827', accent: '#9ca3af', text: '#374151',
        headingFont: "'Barlow', sans-serif", bodyFont: "'Barlow', sans-serif",
        logoPlacement: 'header-left',
      },
      sections: sections({ photos: false, signature: false }),
    },
  },
  {
    id: 'photo-forward',
    name: 'Photo-forward',
    description: 'Leads with the condition assessment — ideal for the Full Assessment workflow.',
    definition: {
      theme: {
        primary: '#134e4a', accent: '#14b8a6', text: '#1f2933',
        headingFont: "'Bebas Neue', sans-serif", bodyFont: "'Barlow', sans-serif",
        logoPlacement: 'cover-only',
      },
      sections: [
        { id: 'cover', enabled: true, order: 0 },
        { id: 'photos', enabled: true, order: 1 },
        { id: 'scope', enabled: true, order: 2 },
        { id: 'pricing', enabled: true, order: 3, options: { showLineItems: true } },
        { id: 'warranty', enabled: true, order: 4 },
        { id: 'signature', enabled: true, order: 5 },
      ],
    },
  },
];

export function getPreset(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}

export const DEFAULT_PRESET_ID = 'classic';
