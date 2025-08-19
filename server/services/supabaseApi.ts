
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface MobileAnalytics {
  id?: string;
  user_id: string;
  session_id: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  screen_width: number;
  screen_height: number;
  user_agent: string;
  page_url: string;
  timestamp: string;
  performance_metrics?: {
    load_time: number;
    first_contentful_paint: number;
    largest_contentful_paint: number;
    cumulative_layout_shift: number;
  };
  interaction_data?: {
    clicks: number;
    scrolls: number;
    time_spent: number;
  };
}

interface ResponsivenessTest {
  id?: string;
  url: string;
  device_type: string;
  lighthouse_score: number;
  viewport_score: number;
  tap_targets_score: number;
  font_size_score: number;
  test_date: string;
  issues?: any[];
}

export class SupabaseTrackingService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async trackMobileSession(analytics: Omit<MobileAnalytics, 'id'>): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('mobile_analytics')
        .insert([analytics])
        .select('id')
        .single();

      if (error) {
        console.error('Error tracking mobile session:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Failed to track mobile session:', error);
      return null;
    }
  }

  async updateSessionMetrics(sessionId: string, metrics: Partial<MobileAnalytics>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('mobile_analytics')
        .update(metrics)
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating session metrics:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to update session metrics:', error);
      return false;
    }
  }

  async saveResponsivenessTest(test: Omit<ResponsivenessTest, 'id'>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('responsiveness_tests')
        .insert([test]);

      if (error) {
        console.error('Error saving responsiveness test:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to save responsiveness test:', error);
      return false;
    }
  }

  async getMobileAnalytics(userId: string, days = 30): Promise<MobileAnalytics[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('mobile_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching mobile analytics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch mobile analytics:', error);
      return [];
    }
  }

  async getResponsivenessHistory(days = 30): Promise<ResponsivenessTest[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('responsiveness_tests')
        .select('*')
        .gte('test_date', startDate.toISOString())
        .order('test_date', { ascending: false });

      if (error) {
        console.error('Error fetching responsiveness history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch responsiveness history:', error);
      return [];
    }
  }
}
