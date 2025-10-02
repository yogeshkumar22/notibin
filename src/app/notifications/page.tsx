
"use client";

import { NotificationList } from '@/components/notifications/NotificationList';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsPage() {
  const { 
    notifications, 
    isLoading, 
    deleteNotification, 
    clearAllNotifications,
    getUniqueAppNames 
  } = useNotifications();
  const { toast } = useToast();

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
      variant: "default",
    });
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications();
    toast({
      title: "All Notifications Cleared",
      description: "All stored notifications have been removed.",
      variant: "default",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <ListSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <NotificationList
        notifications={notifications}
        onDelete={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
        uniqueAppNames={getUniqueAppNames()}
      />
    </div>
  );
}


function ListSkeleton() {
  return (
    <div className="mt-8 space-y-4">
       <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg shadow-sm bg-card">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

    