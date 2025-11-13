"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Palette, Brain, Database } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [aiFeatures, setAiFeatures] = useState(true);
  const [autoCategory, setAutoCategory] = useState(true);
  const [duplicateDetection, setDuplicateDetection] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const settings = localStorage.getItem('notibin-settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setAiFeatures(parsed.aiFeatures ?? true);
        setAutoCategory(parsed.autoCategory ?? true);
        setDuplicateDetection(parsed.duplicateDetection ?? true);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = (key: string, value: boolean) => {
    try {
      const current = localStorage.getItem('notibin-settings');
      const settings = current ? JSON.parse(current) : {};
      settings[key] = value;
      localStorage.setItem('notibin-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  const handleAiFeaturesChange = (checked: boolean) => {
    setAiFeatures(checked);
    updateSettings('aiFeatures', checked);
  };

  const handleAutoCategoryChange = (checked: boolean) => {
    setAutoCategory(checked);
    updateSettings('autoCategory', checked);
  };

  const handleDuplicateDetectionChange = (checked: boolean) => {
    setDuplicateDetection(checked);
    updateSettings('duplicateDetection', checked);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>
            Customize the look and feel of NotiBin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use dark theme for comfortable viewing
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Features</CardTitle>
          </div>
          <CardDescription>
            Configure AI-powered notification insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-features">Enable AI Features</Label>
              <p className="text-sm text-muted-foreground">
                Use AI to summarize and analyze notifications
              </p>
            </div>
            <Switch
              id="ai-features"
              checked={aiFeatures}
              onCheckedChange={handleAiFeaturesChange}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-category">Auto Categorization</Label>
              <p className="text-sm text-muted-foreground">
                Automatically categorize notifications by content
              </p>
            </div>
            <Switch
              id="auto-category"
              checked={autoCategory}
              onCheckedChange={handleAutoCategoryChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Data Management</CardTitle>
          </div>
          <CardDescription>
            Control how your notifications are stored and managed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="duplicate-detection">Duplicate Detection</Label>
              <p className="text-sm text-muted-foreground">
                Prevent duplicate notifications from being saved
              </p>
            </div>
            <Switch
              id="duplicate-detection"
              checked={duplicateDetection}
              onCheckedChange={handleDuplicateDetectionChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Storage</CardTitle>
          <CardDescription>
            Information about your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              All your notification data is stored locally in your browser's localStorage.
            </p>
            <p>
              No data is sent to external servers except when using AI features,
              which may send notification content to AI services for processing.
            </p>
            <p>
              You can export your data anytime from the Profile page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
