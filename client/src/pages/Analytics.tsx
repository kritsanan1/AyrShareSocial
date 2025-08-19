import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { Download, Calendar, Filter, TrendingUp, Heart, Target, Users, Eye, MessageCircle, Share, BarChart3 } from 'lucide-react';

// Assuming MobileAnalyticsDashboard is correctly imported from "@/components/MobileAnalyticsDashboard"
// and the necessary meta tag and API routes/services are configured elsewhere.

const Analytics = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: analyticsData, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => apiRequest('/api/analytics'),
    enabled: !!user,
  });

  // Mock data for demonstration
  const mockAnalytics = {
    overview: {
      totalReach: 125420,
      engagement: 8.5,
      clicks: 2340,
      shares: 186,
    },
    platformPerformance: [
      { platform: 'facebook', name: 'Facebook', reach: 45230, engagement: 7.2 },
      { platform: 'instagram', name: 'Instagram', reach: 38540, engagement: 12.1 },
      { platform: 'linkedin', name: 'LinkedIn', reach: 28400, engagement: 6.8 },
      { platform: 'twitter', name: 'X (Twitter)', reach: 13250, engagement: 4.3 },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navigation />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="flex space-x-2">
                  <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navigation />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              </div>
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-600 mb-4">Error loading analytics data</p>
                  <Button onClick={() => refetch()}>Try Again</Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 30 Days
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-soft border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reach</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.totalReach.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-sage" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.engagement}%</p>
                    </div>
                    <div className="w-12 h-12 bg-warm-blue/10 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-warm-blue" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.clicks.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-dusty-purple/10 rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-dusty-purple" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Shares</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.shares}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Share className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Engagement Chart */}
                  <Card className="shadow-soft border-gray-100">
                    <CardHeader>
                      <CardTitle>Engagement Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <div className="text-gray-500 mb-2">Engagement Chart</div>
                          <div className="text-sm text-gray-400">Interactive chart showing engagement trends</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Platform Performance */}
                  <Card className="shadow-soft border-gray-100">
                    <CardHeader>
                      <CardTitle>Platform Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockAnalytics.platformPerformance.map((platform, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-sage rounded-full"></div>
                              <span className="font-medium">{platform.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{platform.reach.toLocaleString()} reach</div>
                              <div className="text-xs text-gray-500">{platform.engagement}% engagement</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card className="shadow-soft border-gray-100">
                  <CardHeader>
                    <CardTitle>Content Performance Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <div className="text-gray-500 mb-2">Performance Analytics</div>
                        <div className="text-sm text-gray-400">Detailed performance metrics coming soon</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="engagement" className="space-y-6">
                <Card className="shadow-soft border-gray-100">
                  <CardHeader>
                    <CardTitle>Engagement Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                      <div className="text-center">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <div className="text-gray-500 mb-2">Engagement Metrics</div>
                        <div className="text-sm text-gray-400">Detailed engagement analytics coming soon</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="growth" className="space-y-6">
                <Card className="shadow-soft border-gray-100">
                  <CardHeader>
                    <CardTitle>Growth Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                      <div className="text-center">
                        <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <div className="text-gray-500 mb-2">Growth Tracking</div>
                        <div className="text-sm text-gray-400">Growth analytics coming soon</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mobile">
                <MobileAnalyticsDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;