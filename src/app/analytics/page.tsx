"use client";

import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, TrendingUp, Bell, Package, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { format, startOfDay, subDays, isWithinInterval } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export default function AnalyticsPage() {
  const { notifications, isLoading } = useNotifications();

  const analytics = useMemo(() => {
    if (!notifications.length) {
      return {
        total: 0,
        byApp: [],
        byCategory: [],
        byDay: [],
        byHour: [],
        unreadCount: 0,
        todayCount: 0,
        weekCount: 0,
      };
    }

    const now = new Date();
    const today = startOfDay(now);
    const weekAgo = subDays(today, 7);

    // Count by app
    const appCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const dayCounts: Record<string, number> = {};
    const hourCounts: Record<number, number> = {};
    let unreadCount = 0;
    let todayCount = 0;
    let weekCount = 0;

    notifications.forEach(notification => {
      const notifDate = new Date(notification.timestamp);
      
      // Count by app
      appCounts[notification.appName] = (appCounts[notification.appName] || 0) + 1;
      
      // Count by category
      const category = notification.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      
      // Count by day (last 7 days)
      if (isWithinInterval(notifDate, { start: weekAgo, end: now })) {
        const dayKey = format(notifDate, 'MMM dd');
        dayCounts[dayKey] = (dayCounts[dayKey] || 0) + 1;
        weekCount++;
      }
      
      // Count by hour
      const hour = notifDate.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      
      // Count unread
      if (!notification.isRead) {
        unreadCount++;
      }
      
      // Count today
      if (notifDate >= today) {
        todayCount++;
      }
    });

    // Convert to array format for charts
    const byApp = Object.entries(appCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 apps

    const byCategory = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Fill in missing days for the week
    const byDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayKey = format(date, 'MMM dd');
      byDay.push({
        day: dayKey,
        count: dayCounts[dayKey] || 0,
      });
    }

    // Hour distribution (0-23)
    const byHour = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      count: hourCounts[hour] || 0,
    }));

    return {
      total: notifications.length,
      byApp,
      byCategory,
      byDay,
      byHour,
      unreadCount,
      todayCount,
      weekCount,
    };
  }, [notifications]);

  const COLORS = ['#64B5F6', '#4DD0E1', '#81C784', '#FFD54F', '#FF8A65', '#BA68C8', '#4DB6AC', '#F06292'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total}</div>
            <p className="text-xs text-muted-foreground">
              All time notifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.todayCount}</div>
            <p className="text-xs text-muted-foreground">
              Notifications today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.weekCount}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              Unread notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Apps */}
        <Card>
          <CardHeader>
            <CardTitle>Top Apps</CardTitle>
            <CardDescription>Most notifications by app</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.byApp.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.byApp}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#64B5F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.byCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.byCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Daily Trend</CardTitle>
            <CardDescription>Notifications over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.byDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.byDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4DD0E1" 
                    strokeWidth={2}
                    dot={{ fill: '#4DD0E1', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hourly Distribution */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Hourly Distribution</CardTitle>
            <CardDescription>When notifications arrive throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.byHour.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.byHour}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-xs" interval={2} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#81C784" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
