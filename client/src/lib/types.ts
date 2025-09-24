export interface NewsStats {
  total: number;
  today: number;
  translated: number;
  byCategory: Record<string, number>;
  byBias: Record<string, number>;
  bySentiment: Record<string, number>;
}

// Import Language from shared schema
export type { Language } from "@shared/schema";

export const BIAS_COLORS = {
  left: 'hsl(207, 90%, 54%)', // blue
  right: 'hsl(0, 84.2%, 60.2%)', // red
  neutral: 'hsl(142, 76%, 36%)', // green
} as const;

export const SENTIMENT_COLORS = {
  positive: 'hsl(142, 76%, 36%)', // green
  negative: 'hsl(0, 84.2%, 60.2%)', // red
  neutral: 'hsl(240, 5%, 64.9%)', // gray
} as const;

export const CATEGORY_COLORS = {
  politics: 'hsl(271, 81%, 56%)', // purple
  technology: 'hsl(207, 90%, 54%)', // blue
  health: 'hsl(142, 76%, 36%)', // green
  finance: 'hsl(45, 93%, 47%)', // yellow
  sports: 'hsl(25, 95%, 53%)', // orange
  general: 'hsl(240, 5%, 64.9%)', // gray
} as const;
