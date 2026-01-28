export enum AdPlatform {
  INSTAGRAM = 'Instagram',
  LINKEDIN = 'LinkedIn',
  GOOGLE = 'Google Search',
  TWITTER = 'X (Twitter)'
}

export interface AdContent {
  headline: string;
  body: string;
  cta: string;
  visualPrompt: string; // Used for image generation
  targetAudience: string;
  platform: AdPlatform;
}

export interface GeneratedAd extends AdContent {
  id: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface CampaignMetric {
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cost: number;
}
