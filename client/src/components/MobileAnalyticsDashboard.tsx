
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Gauge, 
  TrendingUp, 
  Clock,
  Target,
  RefreshCw
} from 'lucide-react';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface MobileAnalytics {
  totalSessions: number;
  mobilePercentage: number;
  tabletPercentage: number;
  desktopPercentage: number;
  avgLoadTime: number;
  avgSessionDuration: number;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  performanceMetrics: {
    averageLoadTime: number;
    averageFCP: number;
    averageLCP: number;
    averageCLS: number;
  };
}

interface LighthouseResults {
  score: number;
  categories: {
    performance: { score: number };
    accessibility: { score: number };
    'best-practices': { score: number };
    seo: { score: number };
    pwa: { score: number };
  };
  audits: {
    'viewport': { score: number };
    'tap-targets': { score: number };
    'font-size': { score: number };
  };
  url: string;
  timestamp: string;
}

export function MobileAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<MobileAnalytics | null>(null);
  const [lighthouseResults, setLighthouseResults] = useState<LighthouseResults | null>(null);
  const [testUrl, setTestUrl] = useState('');
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { deviceInfo, isMobile } = useMobileDetection();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/mobile/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const runLighthouseTest = async () => {
    if (!testUrl) return;

    setIsTestingUrl(true);
    try {
      const response = await fetch('/api/lighthouse/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl })
      });

      if (response.ok) {
        const results = await response.json();
        setLighthouseResults(results);
      }
    } catch (error) {
      console.error('Lighthouse test failed:', error);
    } finally {
      setIsTestingUrl(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mobile-padding">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mobile Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor mobile responsiveness and performance</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Badge variant="outline" className="w-fit">
            <Smartphone className="w-3 h-3 mr-1" />
            Current: {deviceInfo.type} ({deviceInfo.width}×{deviceInfo.height})
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">Device Analytics</TabsTrigger>
          <TabsTrigger value="lighthouse">Lighthouse Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <>
              {/* Device Distribution */}
              <div className="responsive-grid">
                <Card className="shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                      Mobile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {analytics.mobilePercentage}%
                    </div>
                    <Progress value={analytics.mobilePercentage} className="mb-2" />
                    <p className="text-sm text-gray-600">{analytics.deviceBreakdown.mobile} sessions</p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Tablet className="w-5 h-5 mr-2 text-green-600" />
                      Tablet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {analytics.tabletPercentage}%
                    </div>
                    <Progress value={analytics.tabletPercentage} className="mb-2" />
                    <p className="text-sm text-gray-600">{analytics.deviceBreakdown.tablet} sessions</p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Monitor className="w-5 h-5 mr-2 text-purple-600" />
                      Desktop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {analytics.desktopPercentage}%
                    </div>
                    <Progress value={analytics.desktopPercentage} className="mb-2" />
                    <p className="text-sm text-gray-600">{analytics.deviceBreakdown.desktop} sessions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gauge className="w-5 h-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="text-xl font-semibold">{analytics.performanceMetrics.averageLoadTime}s</div>
                      <div className="text-sm text-gray-600">Avg Load Time</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="text-xl font-semibold">{analytics.performanceMetrics.averageFCP}s</div>
                      <div className="text-sm text-gray-600">First Contentful Paint</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Target className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="text-xl font-semibold">{analytics.performanceMetrics.averageLCP}s</div>
                      <div className="text-sm text-gray-600">Largest Contentful Paint</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Gauge className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="text-xl font-semibold">{analytics.performanceMetrics.averageCLS}</div>
                      <div className="text-sm text-gray-600">Cumulative Layout Shift</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="lighthouse" className="space-y-6">
          {/* Lighthouse Test Form */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Run Lighthouse Mobile Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter URL to test (e.g., https://example.com)"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={runLighthouseTest}
                  disabled={!testUrl || isTestingUrl}
                  className="touch-target"
                >
                  {isTestingUrl ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Run Test'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lighthouse Results */}
          {lighthouseResults && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Mobile Lighthouse Results</CardTitle>
                <p className="text-sm text-gray-600">
                  URL: {lighthouseResults.url} • {new Date(lighthouseResults.timestamp).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Score */}
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(lighthouseResults.score)}`}>
                    {lighthouseResults.score}
                  </div>
                  <div className="text-gray-600">Overall Score</div>
                </div>

                {/* Category Scores */}
                <div className="responsive-grid">
                  {Object.entries(lighthouseResults.categories).map(([category, data]) => (
                    <div key={category} className="text-center p-4 border rounded-lg">
                      <Badge variant={getScoreBadgeVariant(data.score)} className="mb-2">
                        {data.score}
                      </Badge>
                      <div className="text-sm font-medium capitalize">
                        {category.replace('-', ' ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile-specific Audits */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Mobile-Specific Audits</h4>
                  <div className="space-y-3">
                    {Object.entries(lighthouseResults.audits).map(([audit, data]) => (
                      <div key={audit} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium capitalize">{audit.replace('-', ' ')}</span>
                        <Badge variant={getScoreBadgeVariant(data.score)}>
                          {data.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
