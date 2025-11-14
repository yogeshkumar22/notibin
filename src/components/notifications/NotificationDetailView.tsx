"use client";

import type { Notification } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Clock, Trash2, Sparkles, AppWindow, Type, FileTextIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { summarizeNotification } from '@/ai/flows/summarize-notification';
import { analyzeNotification } from '@/ai/flows/analyze-notification';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

import type { AIInsights } from '@/lib/types';

interface NotificationDetailViewProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onUpdateSummary: (id: string, summary: string) => void;
  onUpdateInsights?: (id: string, insights: AIInsights) => void;
}

export function NotificationDetailView({ notification, onDelete, onUpdateSummary, onUpdateInsights }: NotificationDetailViewProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummaryError(null);
    try {
      const result = await summarizeNotification({ notificationText: notification.content });
      onUpdateSummary(notification.id, result.summary);
      toast({
        title: "Summary Generated",
        description: "AI summary has been added to the notification.",
      });
    } catch (error) {
      console.error("Error summarizing notification:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate summary.";
      setSummaryError(errorMessage);
      toast({
        title: "Summarization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await analyzeNotification({ 
        title: notification.title,
        content: notification.content,
        appName: notification.appName,
      });
      
      if (onUpdateInsights) {
        onUpdateInsights(notification.id, result);
      }
      
      toast({
        title: "Analysis Complete",
        description: "AI insights have been extracted from the notification.",
      });
    } catch (error) {
      console.error("Error analyzing notification:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze notification.";
      setAnalysisError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl text-primary flex items-center">
            <Bell className="mr-3 h-7 w-7" />
            {notification.title}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this notification.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(notification.id)} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription className="flex items-center gap-4 pt-1">
          <Badge variant="secondary" className="flex items-center gap-1">
            <AppWindow className="h-3 w-3" />
            {notification.appName}
          </Badge>
          <span className="flex items-center text-sm">
            <Clock className="mr-1.5 h-4 w-4" />
            {format(new Date(notification.timestamp), "PPpp")}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center"><FileTextIcon className="mr-2 h-4 w-4" />Full Content</h3>
          <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed p-4 bg-muted/50 rounded-md">{notification.content}</p>
        </div>
        
        <Separator />

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center"><Sparkles className="mr-2 h-4 w-4 text-accent" />AI Summary</h3>
            {!notification.summary && (
              <Button onClick={handleSummarize} disabled={isSummarizing} size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                {isSummarizing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Summarizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Summary
                  </>
                )}
              </Button>
            )}
          </div>
          {isSummarizing && !notification.summary && (
            <div className="p-4 bg-muted/50 rounded-md space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {summaryError && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{summaryError}</AlertDescription>
            </Alert>
          )}
          {notification.summary && !isSummarizing && (
            <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed p-4 bg-muted/50 rounded-md border border-accent/50">{notification.summary}</p>
          )}
        </div>

        <Separator />

        {/* AI Insights */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-accent" />AI Insights
            </h3>
            {!notification.aiInsights && (
              <Button onClick={handleAnalyze} disabled={isAnalyzing} size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                {isAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Analyze with AI
                  </>
                )}
              </Button>
            )}
          </div>
          {isAnalyzing && !notification.aiInsights && (
            <div className="p-4 bg-muted/50 rounded-md space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {analysisError && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{analysisError}</AlertDescription>
            </Alert>
          )}
          {notification.aiInsights && !isAnalyzing && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-md border border-accent/50">
              {/* Categories */}
              {notification.aiInsights.categories && notification.aiInsights.categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {notification.aiInsights.categories.map((cat, idx) => (
                      <Badge key={idx} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Data */}
              {notification.aiInsights.extractedData && (
                <div className="space-y-2">
                  {notification.aiInsights.extractedData.couponCodes && notification.aiInsights.extractedData.couponCodes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Coupon Codes</h4>
                      <div className="flex flex-wrap gap-2">
                        {notification.aiInsights.extractedData.couponCodes.map((code, idx) => (
                          <Badge key={idx} variant="default" className="font-mono">{code}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {notification.aiInsights.extractedData.discounts && notification.aiInsights.extractedData.discounts.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Discounts</h4>
                      <div className="flex flex-wrap gap-2">
                        {notification.aiInsights.extractedData.discounts.map((discount, idx) => (
                          <Badge key={idx} variant="outline">{discount}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {notification.aiInsights.extractedData.deadlines && notification.aiInsights.extractedData.deadlines.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Deadlines</h4>
                      <div className="flex flex-wrap gap-2">
                        {notification.aiInsights.extractedData.deadlines.map((deadline, idx) => (
                          <Badge key={idx} variant="destructive">{deadline}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Suggestions */}
              {notification.aiInsights.actionSuggestions && notification.aiInsights.actionSuggestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Suggested Actions</h4>
                  <div className="space-y-2">
                    {notification.aiInsights.actionSuggestions.map((action, idx) => (
                      <div key={idx} className="p-2 bg-background/50 rounded border border-border text-sm">
                        <span className="font-medium capitalize">{action.type.replace('_', ' ')}: </span>
                        {action.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment */}
              {notification.aiInsights.sentiment && (
                <div>
                  <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Sentiment</h4>
                  <Badge variant={
                    notification.aiInsights.sentiment === 'positive' ? 'default' : 
                    notification.aiInsights.sentiment === 'negative' ? 'destructive' : 
                    'secondary'
                  } className="capitalize">
                    {notification.aiInsights.sentiment}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {/* Additional actions or info can go here */}
      </CardFooter>
    </Card>
  );
}
