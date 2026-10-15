export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  notes: string;
  details: string;
  weight: string;
  image: string;
  badge?: string;
  type: 'beans' | 'drip' | 'subscription';
}

export type InterestType = 'subscription' | 'single_order' | 'question' | string;

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

export interface OrderFormData {
  name: string;
  phone: string;
  interest: InterestType;
  comment: string;
  utm: UtmParams;
}

export interface SubmissionRecord {
  phone: string;
  timestamp: number;
  name: string;
  interest: string;
}
