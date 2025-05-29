"use client";

import type { Notification } from '@/lib/types';
import { NotificationListItem } from './NotificationListItem';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eraser, Filter, Inbox } from 'lucide-react';
import { useState } from 'react';

interface NotificationListProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  uniqueAppNames: string[];
}

export function NotificationList({ notifications, onDelete, onClearAll, uniqueAppNames }: NotificationListProps) {
  const [filterApp, setFilterApp] = useState<string>('');

  const filteredNotifications = filterApp
    ? notifications.filter(n => n.appName === filterApp)
    : notifications;

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-primary">Stored Notifications</h2>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          {uniqueAppNames.length > 0 && (
            <Select value={filterApp} onValueChange={setFilterApp}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by app..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Apps</SelectItem>
                {uniqueAppNames.map(appName => (
                  <SelectItem key={appName} value={appName}>{appName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {notifications.length > 0 && (
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Eraser className="mr-2 h-5 w-5" /> Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all notifications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearAll} className="bg-destructive hover:bg-destructive/90">
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground bg-card rounded-lg shadow-sm">
          <Inbox className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg">No notifications yet.</p>
          <p>Add some notifications using the form above, or adjust your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map(notification => (
            <NotificationListItem key={notification.id} notification={notification} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
