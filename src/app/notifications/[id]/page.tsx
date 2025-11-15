"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Notification } from '@/lib/types';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDetailView } from '@/components/notifications/NotificationDetailView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { getNotificationById, deleteNotification, updateNotification, isLoading: isLoadingNotifications } = useNotifications();
  
  const [notification, setNotification] = useState<Notification | null | undefined>(undefined); // undefined for loading, null for not found

  const id = typeof params.id === 'string' ? params.id : undefined;

  useEffect(() => {
    if (id && !isLoadingNotifications) {
      const foundNotification = getNotificationById(id);
      setNotification(foundNotification || null); // Set to null if not found after loading
    }
  }, [id, getNotificationById, isLoadingNotifications]);

  const handleDelete = (notificationId: string) => {
    deleteNotification(notificationId);
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
    });
    router.push('/notifications');
  };

  const handleUpdateSummary = (notificationId: string, summary: string) => {
    updateNotification(notificationId, { summary });
    // Re-fetch or update local state to show new summary
    const updatedNotification = getNotificationById(notificationId);
    if (updatedNotification) {
        setNotification(updatedNotification);
    }
  };

  const handleUpdateInsights = (notificationId: string, insights: import('@/lib/types').AIInsights) => {
    updateNotification(notificationId, { aiInsights: insights });
    // Re-fetch or update local state to show new insights
    const updatedNotification = getNotificationById(notificationId);
    if (updatedNotification) {
        setNotification(updatedNotification);
    }
  };
  
  // Show overall page loading skeleton if notifications hook is loading
  if (isLoadingNotifications || notification === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32 mb-6" /> {/* Back button skeleton */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-4 w-1/2 mb-6" />
          
          <Skeleton className="h-6 w-1/4 mb-2" />
          <Skeleton className="h-20 w-full mb-6" />

          <Skeleton className="h-px w-full mb-6" />

          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-1/4" />
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Notification Not Found</h2>
        <p className="text-muted-foreground mb-6">The notification you are looking for does not exist or may have been deleted.</p>
        <Button asChild variant="outline">
          <Link href="/notifications">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Notifications
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="mb-2">
        <Link href="/notifications">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Notifications
        </Link>
      </Button>
      <NotificationDetailView
        notification={notification}
        onDelete={handleDelete}
        onUpdateSummary={handleUpdateSummary}
        onUpdateInsights={handleUpdateInsights}
      />
    </div>
  );
}
