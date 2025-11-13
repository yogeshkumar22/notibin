import type { Notification } from './types';
import { createHash } from 'crypto';

/**
 * Generate a content hash for duplicate detection
 */
export function generateContentHash(notification: Pick<Notification, 'appName' | 'title' | 'content'>): string {
  // In browser environment, use a simpler hash
  const content = `${notification.appName}|${notification.title}|${notification.content}`;
  
  // Simple hash function for browser
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Check if a notification is a duplicate based on content hash and timestamp
 */
export function isDuplicate(
  newNotification: Pick<Notification, 'appName' | 'title' | 'content'>,
  existingNotifications: Notification[],
  timeWindowMs: number = 60000 // 1 minute window by default
): boolean {
  const newHash = generateContentHash(newNotification);
  const now = Date.now();
  
  return existingNotifications.some(existing => {
    // Check if hashes match and notification is within time window
    if (existing.contentHash === newHash) {
      const timeDiff = Math.abs(now - existing.timestamp);
      return timeDiff < timeWindowMs;
    }
    return false;
  });
}

/**
 * Auto-categorize notifications based on content
 */
export function autoCategorizeNotification(notification: Pick<Notification, 'title' | 'content' | 'appName'>): string {
  const lowerTitle = notification.title.toLowerCase();
  const lowerContent = notification.content.toLowerCase();
  const combined = `${lowerTitle} ${lowerContent}`;
  
  // Deal/Promotion keywords
  if (/(sale|discount|offer|deal|coupon|promo|save|% off)/i.test(combined)) {
    return 'Deals & Promotions';
  }
  
  // Social keywords
  if (/(liked|commented|followed|shared|tagged|mentioned|friend request)/i.test(combined)) {
    return 'Social';
  }
  
  // Work/Productivity keywords
  if (/(meeting|deadline|task|project|email|calendar|reminder|appointment)/i.test(combined)) {
    return 'Work & Productivity';
  }
  
  // Finance keywords
  if (/(payment|transaction|invoice|bill|account|balance|credit|debit|bank)/i.test(combined)) {
    return 'Finance';
  }
  
  // News/Updates keywords
  if (/(news|update|breaking|alert|headline)/i.test(combined)) {
    return 'News & Updates';
  }
  
  // Entertainment keywords
  if (/(video|music|game|movie|show|episode|stream)/i.test(combined)) {
    return 'Entertainment';
  }
  
  // Health/Fitness keywords
  if (/(workout|exercise|steps|health|fitness|meditation|water|calories)/i.test(combined)) {
    return 'Health & Fitness';
  }
  
  // Travel keywords
  if (/(flight|hotel|booking|travel|trip|reservation)/i.test(combined)) {
    return 'Travel';
  }
  
  // Shopping/Delivery keywords
  if (/(delivery|shipped|order|package|tracking|arrived)/i.test(combined)) {
    return 'Shopping & Delivery';
  }
  
  // Default to app name
  return notification.appName;
}

/**
 * Extract priority from notification content
 */
export function detectPriority(notification: Pick<Notification, 'title' | 'content'>): Notification['priority'] {
  const combined = `${notification.title} ${notification.content}`.toLowerCase();
  
  if (/(urgent|critical|emergency|important|asap|immediately)/i.test(combined)) {
    return 'urgent';
  }
  
  if (/(high priority|time sensitive|deadline|expires soon|limited time)/i.test(combined)) {
    return 'high';
  }
  
  if (/(low priority|fyi|optional|when you can)/i.test(combined)) {
    return 'low';
  }
  
  return 'normal';
}

/**
 * Get app icon emoji based on app name
 */
export function getDefaultAppIcon(appName: string): string {
  const lowerAppName = appName.toLowerCase();
  
  const iconMap: Record<string, string> = {
    'email': '📧',
    'gmail': '📧',
    'mail': '📧',
    'slack': '💬',
    'teams': '💼',
    'whatsapp': '💬',
    'telegram': '✈️',
    'messenger': '💬',
    'facebook': '👥',
    'instagram': '📷',
    'twitter': '🐦',
    'x': '✖️',
    'linkedin': '💼',
    'calendar': '📅',
    'reminder': '⏰',
    'amazon': '📦',
    'ebay': '🛒',
    'shop': '🛍️',
    'bank': '🏦',
    'paypal': '💳',
    'uber': '🚗',
    'lyft': '🚗',
    'spotify': '🎵',
    'youtube': '🎥',
    'netflix': '🎬',
    'news': '📰',
    'weather': '🌤️',
    'fitness': '💪',
    'health': '❤️',
  };
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerAppName.includes(key)) {
      return icon;
    }
  }
  
  return '📱'; // Default app icon
}
