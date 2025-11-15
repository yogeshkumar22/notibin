export interface Notification {
  id: string;
  appName: string;
  title: string;
  content: string;
  timestamp: number; // Store as Unix timestamp
  category?: string; // Optional: derived from appName or AI categorization
  summary?: string; // Optional: for AI-generated summary
  appIcon?: string; // Optional: URL or emoji for app icon
  imageUrl?: string; // Optional: notification image/media
  deepLink?: string; // Optional: URL to open when clicked
  priority?: 'low' | 'normal' | 'high' | 'urgent'; // Notification priority
  isRead?: boolean; // Track read status
  tags?: string[]; // Custom tags for organization
  aiInsights?: AIInsights; // AI-extracted insights
  contentHash?: string; // Hash for duplicate detection
}

export interface AIInsights {
  categories?: string[]; // AI-detected categories
  extractedData?: {
    couponCodes?: string[];
    discounts?: string[];
    deadlines?: string[]; // ISO date strings
    prices?: string[];
    links?: string[];
  };
  actionSuggestions?: ActionSuggestion[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface ActionSuggestion {
  type: 'reminder' | 'save_deal' | 'reply' | 'open_link' | 'save_coupon';
  description: string;
  actionData?: ReminderActionData | SaveDealActionData | ReplyActionData | OpenLinkActionData | SaveCouponActionData;
  priority?: number;
}

// Action data types for each ActionSuggestion type
export interface ReminderActionData {
  reminderTime: string; // ISO date string
  note?: string;
}

export interface SaveDealActionData {
  dealId?: string;
  dealUrl?: string;
  expirationDate?: string; // ISO date string
}

export interface ReplyActionData {
  replyTo: string; // Email or user ID
  messageTemplate?: string;
}

export interface OpenLinkActionData {
  url: string;
}

export interface SaveCouponActionData {
  couponCode: string;
  expirationDate?: string; // ISO date string
}
