// Enhanced AI flow for analyzing notifications and extracting insights

'use server';

/**
 * @fileOverview Analyzes notifications to extract structured data and insights.
 *
 * - analyzeNotification - A function that analyzes a notification for actionable insights.
 * - AnalyzeNotificationInput - The input type for the analyzeNotification function.
 * - AnalyzeNotificationOutput - The return type for the analyzeNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNotificationInputSchema = z.object({
  title: z.string().describe('The title of the notification'),
  content: z.string().describe('The content of the notification'),
  appName: z.string().describe('The app that sent the notification'),
});

export type AnalyzeNotificationInput = z.infer<
  typeof AnalyzeNotificationInputSchema
>;

const AnalyzeNotificationOutputSchema = z.object({
  categories: z.array(z.string()).describe('Detected categories (e.g., deals, social, work, finance)'),
  extractedData: z.object({
    couponCodes: z.array(z.string()).optional().describe('Any coupon or promo codes found'),
    discounts: z.array(z.string()).optional().describe('Discount amounts or percentages found'),
    deadlines: z.array(z.string()).optional().describe('Any deadlines or expiry dates found'),
    prices: z.array(z.string()).optional().describe('Prices or monetary amounts found'),
    links: z.array(z.string()).optional().describe('URLs found in the notification'),
  }),
  actionSuggestions: z.array(z.object({
    type: z.enum(['reminder', 'save_deal', 'reply', 'open_link', 'save_coupon']).describe('Type of suggested action'),
    description: z.string().describe('Description of the suggested action'),
    priority: z.number().min(1).max(5).describe('Priority level (1-5, 5 being highest)'),
  })).describe('Suggested actions the user could take'),
  sentiment: z.enum(['positive', 'neutral', 'negative']).describe('Overall sentiment of the notification'),
  summary: z.string().describe('A concise summary of the notification'),
});

export type AnalyzeNotificationOutput = z.infer<
  typeof AnalyzeNotificationOutputSchema
>;

export async function analyzeNotification(
  input: AnalyzeNotificationInput
): Promise<AnalyzeNotificationOutput> {
  return analyzeNotificationFlow(input);
}

const analyzeNotificationPrompt = ai.definePrompt({
  name: 'analyzeNotificationPrompt',
  input: {schema: AnalyzeNotificationInputSchema},
  output: {schema: AnalyzeNotificationOutputSchema},
  prompt: `You are an intelligent notification analyzer. Analyze the following notification and extract actionable insights.

App: {{appName}}
Title: {{title}}
Content: {{content}}

Your task:
1. Identify relevant categories (deals, social, work, finance, health, travel, shopping, entertainment, news)
2. Extract structured data like coupon codes, discounts, prices, deadlines, and links
3. Suggest useful actions the user could take
4. Determine the sentiment (positive, neutral, or negative)
5. Provide a concise summary

Be thorough but concise. If you can't find specific data (like coupon codes), leave that field empty.`,
});

const analyzeNotificationFlow = ai.defineFlow(
  {
    name: 'analyzeNotificationFlow',
    inputSchema: AnalyzeNotificationInputSchema,
    outputSchema: AnalyzeNotificationOutputSchema,
  },
  async input => {
    const {output} = await analyzeNotificationPrompt(input);
    return output!;
  }
);
