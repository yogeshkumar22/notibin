export interface Notification {
  id: string;
  appName: string;
  title: string;
  content: string;
  timestamp: number; // Store as Unix timestamp
  category?: string; // Optional: derived from appName for filtering
  summary?: string; // Optional: for AI-generated summary
}
