"use client";

import type { Notification } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'notiBinNotifications';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Failed to load notifications from localStorage", error);
      // Initialize with empty array if parsing fails or localStorage is inaccessible
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) { // Only save to localStorage after initial load
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
      } catch (error) {
        console.error("Failed to save notifications to localStorage", error);
      }
    }
  }, [notifications, isLoading]);

  const addNotification = useCallback((newNotificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const notification: Notification = {
      ...newNotificationData,
      id: generateId(),
      timestamp: Date.now(),
      category: newNotificationData.category || newNotificationData.appName,
      isRead: newNotificationData.isRead ?? false,
      priority: newNotificationData.priority || 'normal',
    };
    setNotifications(prev => [notification, ...prev]); // Add to the beginning (newest first)
    return notification;
  }, []);

  const getNotificationById = useCallback((id: string): Notification | undefined => {
    return notifications.find(n => n.id === id);
  }, [notifications]);

  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updates } : n))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUniqueAppNames = useCallback((): string[] => {
    const appNames = new Set(notifications.map(n => n.appName));
    return Array.from(appNames);
  }, [notifications]);

  return {
    notifications,
    isLoading,
    addNotification,
    getNotificationById,
    updateNotification,
    deleteNotification,
    clearAllNotifications,
    getUniqueAppNames,
  };
}
