import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import ConnectedAccount from "@/components/ConnectedAccount";
import ActivityItem from "@/components/ActivityItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Share, Heart, Users, Clock, Plus, Calendar, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<{
    postsPublished: number;
    totalEngagement: number;
    newFollowers: number;
    scheduledPosts: number;
    connectedAccounts: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Fetch social accounts
  const { data: socialAccounts = [], isLoading: accountsLoading } = useQuery<any[]>({
    queryKey: ["/api/social-accounts"],
  });

  // Fetch scheduled posts
  const { data: scheduledPosts = [], isLoading: scheduledLoading } = useQuery<any[]>({
    queryKey: ["/api/posts/scheduled"],
  });

  // Fetch recent posts for activity
  const { data: recentPosts = [], isLoading: postsLoading } = useQuery<any[]>({
    queryKey: ["/api/posts"],
  });

  if (statsLoading || accountsLoading || scheduledLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
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

  const handleNewPost = () => {
    setLocation("/compose");
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <section className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Monitor your social media performance and manage your content strategy</p>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleNewPost}
                    className="bg-sage hover:bg-sage/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-soft transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/calendar")}
                    className="border border-gray-300 hover:border-sage text-gray-700 hover:text-sage px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/analytics")}
                    className="border border-gray-300 hover:border-sage text-gray-700 hover:text-sage px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={Share}
                iconColor="text-sage"
                iconBg="bg-sage/10"
                title="Posts Published"
                value={stats?.postsPublished || 0}
                subtitle="This month"
                trend="+12%"
                trendColor="text-green-600"
              />
              <StatsCard
                icon={Heart}
                iconColor="text-warm-blue"
                iconBg="bg-warm-blue/10"
                title="Total Engagement"
                value={stats?.totalEngagement || 0}
                subtitle="Last 30 days"
                trend="+8%"
                trendColor="text-green-600"
              />
              <StatsCard
                icon={Users}
                iconColor="text-dusty-purple"
                iconBg="bg-dusty-purple/10"
                title="New Followers"
                value={stats?.newFollowers || 0}
                subtitle="This month"
                trend="+15%"
                trendColor="text-green-600"
              />
              <StatsCard
                icon={Clock}
                iconColor="text-warm-amber"
                iconBg="bg-warm-amber/10"
                title="Scheduled Posts"
                value={stats?.scheduledPosts || 0}
                subtitle="Next 7 days"
                badge={scheduledPosts.length}
              />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Connected Accounts */}
              <div className="lg:col-span-2">
                <Card className="shadow-soft border-gray-100 mb-8">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Connected Accounts</CardTitle>
                      <Button 
                        variant="ghost" 
                        className="text-sage hover:text-sage/80"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Connect Account
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {socialAccounts.length > 0 ? (
                        socialAccounts.map((account: any) => (
                          <ConnectedAccount
                            key={account.id}
                            platform={account.platform}
                            name={account.platformName}
                            followers={account.followerCount}
                            isConnected={account.isActive}
                          />
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                          <Share className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No social accounts connected yet.</p>
                          <p className="text-sm">Connect your accounts to get started.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="shadow-soft border-gray-100">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPosts.length > 0 ? (
                        recentPosts.slice(0, 5).map((post: any) => (
                          <ActivityItem
                            key={post.id}
                            type={post.status === 'published' ? 'published' : 'scheduled'}
                            title={post.status === 'published' ? 'Post published successfully' : 'Post scheduled'}
                            description={`"${post.content.slice(0, 60)}..." ${post.status === 'published' ? 'was published to' : 'scheduled for'} ${post.platforms.join(', ')}`}
                            timestamp={formatTimeAgo(post.createdAt)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No recent activity.</p>
                          <p className="text-sm">Create your first post to see activity here.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-8">
                {/* Upcoming Posts */}
                <Card className="shadow-soft border-gray-100">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Upcoming Posts</CardTitle>
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scheduledPosts.length > 0 ? (
                        scheduledPosts.map((post: any) => (
                          <div key={post.id} className="border-l-4 border-sage pl-4 py-2">
                            <div className="font-medium text-gray-900 text-sm">
                              {post.content.slice(0, 30)}...
                            </div>
                            <div className="text-xs text-gray-500">
                              {post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString() : 'No date set'}
                            </div>
                            <div className="flex space-x-1 mt-2">
                              {post.platforms?.map((platform: string) => (
                                <span key={platform} className="w-4 h-4 bg-blue-500 rounded-sm" title={platform}></span>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No upcoming posts</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Summary */}
                <Card className="shadow-soft border-gray-100">
                  <CardHeader>
                    <CardTitle className="text-lg">This Week's Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Engagement Rate</span>
                        <span className="font-semibold text-gray-900">4.8%</span>
                      </div>
                      <Progress value={48} className="w-full" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Reach</span>
                        <span className="font-semibold text-gray-900">23.5K</span>
                      </div>
                      <Progress value={73} className="w-full" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Click-through Rate</span>
                        <span className="font-semibold text-gray-900">2.1%</span>
                      </div>
                      <Progress value={21} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
