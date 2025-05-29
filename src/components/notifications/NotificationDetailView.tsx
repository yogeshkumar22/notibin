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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface NotificationDetailViewProps {
  notification: Notification;
  onDelete: (id: string) => void;
  onUpdateSummary: (id: string, summary: string) => void;
}

export function NotificationDetailView({ notification, onDelete, onUpdateSummary }: NotificationDetailViewProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
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
      </CardContent>
      <CardFooter>
        {/* Additional actions or info can go here */}
      </CardFooter>
    </Card>
  );
}
