"use client";

import type { Notification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Clock, Eye, AlertCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { getDefaultAppIcon } from '@/lib/notificationUtils';

interface NotificationListItemProps {
  notification: Notification;
  onDelete: (id: string) => void;
}

export function NotificationListItem({ notification, onDelete }: NotificationListItemProps) {
  const appIcon = notification.appIcon || getDefaultAppIcon(notification.appName);
  
  const priorityConfig = {
    urgent: { icon: AlertCircle, color: 'destructive', label: 'Urgent' },
    high: { icon: AlertTriangle, color: 'orange', label: 'High' },
    normal: { icon: Info, color: 'default', label: 'Normal' },
    low: { icon: Info, color: 'secondary', label: 'Low' },
  };
  
  const priority = notification.priority || 'normal';
  const PriorityIcon = priorityConfig[priority].icon;

  return (
    <Card className={`mb-4 shadow-md hover:shadow-lg transition-all duration-200 ${
      !notification.isRead ? 'border-l-4 border-l-accent' : ''
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-2xl flex-shrink-0 mt-1" title={notification.appName}>
              {appIcon}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg text-primary flex items-start gap-2 flex-wrap">
                <span className="break-words">{notification.title}</span>
                {!notification.isRead && (
                  <Badge variant="default" className="text-xs">New</Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-sm text-muted-foreground">{notification.appName}</p>
                {priority !== 'normal' && (
                  <Badge variant={priorityConfig[priority].color as any} className="text-xs flex items-center gap-1">
                    <PriorityIcon className="h-3 w-3" />
                    {priorityConfig[priority].label}
                  </Badge>
                )}
                {notification.category && notification.category !== notification.appName && (
                  <Badge variant="outline" className="text-xs">
                    {notification.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0">
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
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <p className="text-sm line-clamp-2 text-foreground/80">{notification.content}</p>
        {notification.imageUrl && (
          <div className="mt-3 relative rounded-md overflow-hidden bg-muted max-w-md">
            <img 
              src={notification.imageUrl} 
              alt={notification.title ? `Image for notification: ${notification.title}` : `Image for notification: ${notification.content}`} 
              className="w-full h-auto max-h-48 object-cover"
              onError={(e) => {
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.style.display = 'none';
                }
              }}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between items-center pt-0 flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
        </div>
        <div className="flex gap-2">
          {notification.deepLink && (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="h-8"
            >
              <a href={notification.deepLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                Open
              </a>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground h-8"
          >
            <Link href={`/notifications/${notification.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
