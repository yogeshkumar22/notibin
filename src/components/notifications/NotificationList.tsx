
"use client";

import type { Notification } from '@/lib/types';
import { NotificationListItem } from './NotificationListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eraser, Filter, Inbox, Search, SortAsc } from 'lucide-react';
import { useState, useMemo } from 'react';

interface NotificationListProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  uniqueAppNames: string[];
}

export function NotificationList({ notifications, onDelete, onClearAll, uniqueAppNames }: NotificationListProps) {
  const [filterApp, setFilterApp] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');

  const uniqueCategories = useMemo(() => {
    const categories = new Set(notifications.map(n => n.category || 'Uncategorized'));
    return Array.from(categories);
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query) ||
        n.appName.toLowerCase().includes(query)
      );
    }

    // App filter
    if (filterApp !== 'all') {
      filtered = filtered.filter(n => n.appName === filterApp);
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(n => (n.category || 'Uncategorized') === filterCategory);
    }

    // Read/Unread filter
    if (readFilter === 'read') {
      filtered = filtered.filter(n => n.isRead);
    } else if (readFilter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return b.timestamp - a.timestamp;
      } else {
        return a.timestamp - b.timestamp;
      }
    });

    return filtered;
  }, [notifications, searchQuery, filterApp, filterCategory, sortBy, readFilter]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-primary">Notifications</h2>
          {notifications.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Eraser className="mr-2 h-4 w-4" /> Clear All
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

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          {uniqueAppNames.length > 0 && (
            <Select value={filterApp} onValueChange={setFilterApp}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="App" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Apps</SelectItem>
                {uniqueAppNames.map(appName => (
                  <SelectItem key={appName} value={appName}>{appName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {uniqueCategories.length > 0 && (
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={readFilter} onValueChange={(value: any) => setReadFilter(value)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground bg-card rounded-lg shadow-sm">
          <Inbox className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg">No notifications found.</p>
          <p>
            {searchQuery || filterApp !== 'all' || filterCategory !== 'all' || readFilter !== 'all'
              ? 'Try adjusting your filters or search query.'
              : 'Add some notifications using the form above.'}
          </p>
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

    