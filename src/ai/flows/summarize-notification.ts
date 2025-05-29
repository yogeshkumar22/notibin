// Implemented Genkit flow for summarizing notifications.

'use server';

/**
 * @fileOverview Summarizes long or complex notifications.
 *
 * - summarizeNotification - A function that summarizes a notification.
 * - SummarizeNotificationInput - The input type for the summarizeNotification function.
 * - SummarizeNotificationOutput - The return type for the summarizeNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotificationInputSchema = z.object({
  notificationText: z
    .string()
    .describe('The text content of the notification to be summarized.'),
});

export type SummarizeNotificationInput = z.infer<
  typeof SummarizeNotificationInputSchema
>;

const SummarizeNotificationOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the notification content.'),
});

export type SummarizeNotificationOutput = z.infer<
  typeof SummarizeNotificationOutputSchema
>;

export async function summarizeNotification(
  input: SummarizeNotificationInput
): Promise<SummarizeNotificationOutput> {
  return summarizeNotificationFlow(input);
}

const summarizeNotificationPrompt = ai.definePrompt({
  name: 'summarizeNotificationPrompt',
  input: {schema: SummarizeNotificationInputSchema},
  output: {schema: SummarizeNotificationOutputSchema},
  prompt: `Summarize the following notification text. The summary should be concise and capture the key information:

Notification Text:
{{notificationText}}`,
});

const summarizeNotificationFlow = ai.defineFlow(
  {
    name: 'summarizeNotificationFlow',
    inputSchema: SummarizeNotificationInputSchema,
    outputSchema: SummarizeNotificationOutputSchema,
  },
  async input => {
    const {output} = await summarizeNotificationPrompt(input);
    return output!;
  }
);
