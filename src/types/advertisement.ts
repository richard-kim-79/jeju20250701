export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  advertiser: {
    name: string;
    logo?: string;
  };
  category: AdCategory;
  location?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  ctr: number; // Click Through Rate
  budget: number;
  spent: number;
  targetAudience: TargetAudience;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export enum AdCategory {
  RESTAURANT = 'restaurant',
  ACCOMMODATION = 'accommodation',
  ACTIVITY = 'activity',
  TRANSPORT = 'transport',
  SHOPPING = 'shopping',
  CULTURE = 'culture',
  NATURE = 'nature',
  OTHER = 'other'
}

export interface TargetAudience {
  ageRange?: {
    min: number;
    max: number;
  };
  interests?: string[];
  location?: string;
  gender?: 'male' | 'female' | 'all';
}

export interface AdImpression {
  id: string;
  adId: string;
  userId?: string;
  timestamp: string;
  userAgent: string;
  ipAddress: string;
  referrer?: string;
}

export interface AdClick {
  id: string;
  adId: string;
  userId?: string;
  timestamp: string;
  userAgent: string;
  ipAddress: string;
  referrer?: string;
}

export interface AdAnalytics {
  adId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  date: string;
} 