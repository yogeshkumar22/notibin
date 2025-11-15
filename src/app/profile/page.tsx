"use client";

import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Download, Upload, Trash2, Database, Calendar, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { useMemo } from 'react';

export default function ProfilePage() {
  const { notifications, clearAllNotifications } = useNotifications();
  const { toast } = useToast();

  const stats = useMemo(() => {
    const totalSize = JSON.stringify(notifications).length;
    const oldestNotif = notifications.length > 0 
      ? new Date(Math.min(...notifications.map(n => n.timestamp)))
      : null;
    const newestNotif = notifications.length > 0
      ? new Date(Math.max(...notifications.map(n => n.timestamp)))
      : null;

    return {
      totalSize: (totalSize / 1024).toFixed(2), // KB
      oldestNotif,
      newestNotif,
    };
  }, [notifications]);

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(notifications, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notibin-export-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your notifications have been exported to a JSON file.",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export notifications. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const importedNotifications = JSON.parse(text);
        
        if (!Array.isArray(importedNotifications)) {
          throw new Error('Invalid file format');
        }

        // Validate structure
        const valid = importedNotifications.every(n => 
          n.id && n.appName && n.title && n.content && n.timestamp
        );

        if (!valid) {
          throw new Error('Invalid notification data structure');
        }

        // Store imported notifications (replacing existing)
        localStorage.setItem('notiBinNotifications', JSON.stringify(importedNotifications));
        
        toast({
          title: "Import Successful",
          description: `Imported ${importedNotifications.length} notifications. Refresh to see changes.`,
        });

        // Reload page to reflect changes
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error("Import failed:", error);
        toast({
          title: "Import Failed",
          description: "Failed to import notifications. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  const handleClearAll = () => {
    clearAllNotifications();
    toast({
      title: "All Data Cleared",
      description: "All notifications have been permanently deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Profile & Data</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">
              Stored locally
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSize} KB</div>
            <p className="text-xs text-muted-foreground">
              Local storage usage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {stats.oldestNotif && stats.newestNotif ? (
                <>
                  {format(stats.oldestNotif, 'MMM d, yyyy')}
                  <br />
                  to {format(stats.newestNotif, 'MMM d, yyyy')}
                </>
              ) : (
                'No data'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export, import, or delete your notification data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleExport} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={handleImport} variant="outline" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all
                    your notifications and cannot be recovered.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearAll}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About NotiBin</CardTitle>
          <CardDescription>
            Your personal notification manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            NotiBin helps you capture, organize, and manage your notifications with AI-powered insights.
          </p>
          <div className="pt-4 text-xs text-muted-foreground">
            <p>Version: 1.0.0</p>
            <p>All data is stored locally in your browser.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
