import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Heart, MousePointer, UserPlus, Download, TrendingUp, ArrowUp } from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["/api/analytics", { timeRange, platform: selectedPlatform }],
  });

  // Fetch social accounts for platform filter
  const { data: socialAccounts = [] } = useQuery<any[]>({
    queryKey: ["/api/social-accounts"],
  });

  // Fetch recent posts for top performing posts
  const { data: recentPosts = [] } = useQuery<any[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Mock analytics data since we don't have real data yet
  const mockAnalytics = {
    impressions: 847200,
    engagement: 41800,
    clickThroughRate: 3.2,
    newFollowers: 2100,
    platformPerformance: socialAccounts.map((account: any) => ({
      platform: account.platform,
      name: account.platformName,
      engagement: Math.floor(Math.random() * 20000) + 5000,
      rate: (Math.random() * 8 + 2).toFixed(1),
      growth: Math.floor(Math.random() * 30) + 5,
    })),
  };

  // Top performing posts based on recent posts
  const topPosts = recentPosts
    .filter((post: any) => post.status === 'published')
    .slice(0, 3)
    .map((post: any) => ({
      ...post,
      likes: Math.floor(Math.random() * 2000) + 100,
      comments: Math.floor(Math.random() * 200) + 10,
      shares: Math.floor(Math.random() * 300) + 20,
    }));

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <section className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
              <p className="text-gray-600">Track your social media performance and optimize your strategy</p>
            </div>

            {/* Analytics Header */}
            <Card className="shadow-soft border-gray-100 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        {socialAccounts.map((account: any) => (
                          <SelectItem key={account.id} value={account.platform}>
                            {account.platformName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="bg-sage hover:bg-sage/90 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={Eye}
                iconColor="text-sage"
                iconBg="bg-sage/10"
                title="Total Impressions"
                value={mockAnalytics.impressions.toLocaleString()}
                subtitle="vs. previous period"
                trend="+18%"
                trendColor="text-green-600"
              />
              <StatsCard
                icon={Heart}
                iconColor="text-warm-blue"
                iconBg="bg-warm-blue/10"
                title="Total Engagement"
                value={mockAnalytics.engagement.toLocaleString()}
                subtitle="likes, comments, shares"
                trend="+24%"
                trendColor="text-green-600"
              />
              <StatsCard
                icon={MousePointer}
                iconColor="text-dusty-purple"
                iconBg="bg-dusty-purple/10"
                title="Click-through Rate"
                value={`${mockAnalytics.clickThroughRate}%`}
                subtitle="average across platforms"
                trend="+7%"
                trendColor="text-green-600"
              />
              <StatsCard
                icon={UserPlus}
                iconColor="text-warm-amber"
                iconBg="bg-warm-amber/10"
                title="New Followers"
                value={mockAnalytics.newFollowers.toLocaleString()}
                subtitle="this month"
                trend="+31%"
                trendColor="text-green-600"
              />
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                    {mockAnalytics.platformPerformance.map((platform: any, index: number) => {
                      const platformColors = {
                        facebook: 'bg-blue-50 text-blue-500',
                        instagram: 'bg-pink-50 from-purple-500 to-pink-500',
                        linkedin: 'bg-blue-50 text-blue-600',
                        twitter: 'bg-gray-50 text-gray-900',
                      };
                      
                      return (
                        <div key={index} className={`flex items-center justify-between p-4 ${platformColors.facebook} rounded-xl`}>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {platform.platform.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{platform.platform}</div>
                              <div className="text-sm text-gray-600">{platform.rate}% engagement rate</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{(platform.engagement / 1000).toFixed(1)}K</div>
                            <div className="text-sm text-green-600 flex items-center">
                              <ArrowUp className="w-3 h-3 mr-1" />
                              +{platform.growth}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Posts */}
            <Card className="shadow-soft border-gray-100">
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPosts.length > 0 ? (
                    topPosts.map((post: any) => (
                      <div key={post.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <div className="w-16 h-16 bg-gradient-to-br from-sage to-soft-emerald rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">P</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            {post.content.slice(0, 80)}...
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            Posted {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-gray-600">{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="w-4 h-4 text-blue-500">💬</span>
                              <span className="text-sm text-gray-600">{post.comments}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="w-4 h-4 text-green-500">🔄</span>
                              <span className="text-sm text-gray-600">{post.shares}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {post.platforms?.map((platform: string) => (
                            <span key={platform} className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs">{platform.charAt(0).toUpperCase()}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No published posts yet.</p>
                      <p className="text-sm">Create and publish posts to see performance data here.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
