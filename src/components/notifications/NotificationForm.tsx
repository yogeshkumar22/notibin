"use client";

import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, AppWindow, Type, FileTextIcon } from 'lucide-react';
import type { Notification } from '@/lib/types';

const notificationSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  appIcon: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  deepLink: z.string().url().optional().or(z.literal('')),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

interface NotificationFormProps {
  onAddNotification: (data: Omit<Notification, 'id' | 'timestamp' | 'category' | 'summary'>) => void;
}

export function NotificationForm({ onAddNotification }: NotificationFormProps) {
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      appName: '',
      title: '',
      content: '',
      appIcon: '',
      imageUrl: '',
      deepLink: '',
      priority: 'normal',
    },
  });

  const onSubmit: SubmitHandler<NotificationFormData> = (data) => {
    onAddNotification(data);
    form.reset();
  };

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <PlusCircle className="mr-2 h-6 w-6" />
          Add New Notification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="appName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <AppWindow className="mr-2 h-4 w-4 text-muted-foreground" /> App Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Email, Slack, Calendar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Type className="mr-2 h-4 w-4 text-muted-foreground" /> Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Notification title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <FileTextIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Content
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full notification content..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-5 w-5" />
              Save Notification
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
