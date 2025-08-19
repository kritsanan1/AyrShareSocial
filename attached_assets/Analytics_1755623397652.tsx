import React, { useState } from 'react';
import MetricsOverview from '../components/analytics/MetricsOverview';
import ContentPerformance from '../components/analytics/ContentPerformance';
import ChannelAnalytics from '../components/analytics/ChannelAnalytics';
import PlanningInsights from '../components/analytics/PlanningInsights';
import SentimentAnalysis from '../components/analytics/SentimentAnalysis';
import ContentPredictor from '../components/analytics/ContentPredictor';
import RealTimeSentiment from '../components/analytics/RealTimeSentiment';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorDisplay from '../components/ErrorDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { CardSkeleton } from '../components/SkeletonLoader';
import { Download, Calendar, Filter, TrendingUp, Heart, Target } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    data: analyticsData,
    loading,
    error,
    refetch,
    clearError
  } = useApi('/analytics', {
    dependencies: [timeRange]
  });

  const handleExport = async () => {
    try {
      setExportLoading(true);
      // Simulate export API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Analytics data exported successfully');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleTimeRangeChange = (range: string) => {
    clearError();
    setTimeRange(range);
  };

  const timeRanges = [
    { label: 'Last 24 hours', value: '24h' },
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'sentiment', label: 'Sentiment', icon: Heart },
    { id: 'predictor', label: 'Predictor', icon: Target },
  ];

  if (loading) {
    return (
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
            <CardSkeleton key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CardSkeleton />
          <CardSkeleton />
        </div>

        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading analytics data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        </div>
        <ErrorDisplay
          error={error}
          onRetry={refetch}
          className="min-h-[400px] flex items-center justify-center"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Content Analytics</h1>
          <p className="text-neutral-600">Track performance and gain insights for better content planning</p>
        </div>

        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {exportLoading ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className="flex space-x-1 mb-8 bg-neutral-100 rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-sage shadow-soft'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          <ErrorBoundary>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <MetricsOverview />
            </div>
          </ErrorBoundary>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ErrorBoundary>
              <ContentPerformance />
            </ErrorBoundary>
            <ErrorBoundary>
              <ChannelAnalytics />
            </ErrorBoundary>
          </div>

          <ErrorBoundary>
            <PlanningInsights />
          </ErrorBoundary>
        </>
      )}

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ErrorBoundary>
            <ContentPerformance />
          </ErrorBoundary>
          <ErrorBoundary>
            <ChannelAnalytics />
          </ErrorBoundary>
        </div>
      )}

      {activeTab === 'sentiment' && (
        <ErrorBoundary>
          <SentimentAnalysis />
        </ErrorBoundary>
      )}

      {activeTab === 'predictor' && (
        <ErrorBoundary>
          <ContentPredictor />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Analytics;