// ============================================================
// Ending type definitions
// ============================================================

export type EndingType = 'A' | 'B' | 'C' | 'D1' | 'D2' | 'D3' | 'E' | 'F';

export interface EndingDetail {
  type: EndingType;
  title: string;
  text: string;
  subtitle?: string;
}
