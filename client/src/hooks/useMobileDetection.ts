
import { useState, useEffect } from 'react';

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  userAgent: string;
  touchSupported: boolean;
  orientation: 'portrait' | 'landscape';
}

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

export function useMobileDetection() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    width: 0,
    height: 0,
    userAgent: '',
    touchSupported: false,
    orientation: 'landscape'
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

  const detectDeviceType = (width: number): 'mobile' | 'tablet' | 'desktop' => {
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const getOrientation = (width: number, height: number): 'portrait' | 'landscape' => {
    return height > width ? 'portrait' : 'landscape';
  };

  const measurePerformance = (): PerformanceMetrics | null => {
    if (typeof window === 'undefined' || !window.performance) return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    const lcp = paint.find(entry => entry.name === 'largest-contentful-paint')?.startTime || 0;
    
    return {
      loadTime: navigation?.loadEventEnd - navigation?.navigationStart || 0,
      firstContentfulPaint: fcp,
      largestContentfulPaint: lcp,
      cumulativeLayoutShift: 0 // Would need additional measurement
    };
  };

  const updateDeviceInfo = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setDeviceInfo({
      type: detectDeviceType(width),
      width,
      height,
      userAgent: navigator.userAgent,
      touchSupported: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      orientation: getOrientation(width, height)
    });
  };

  const trackSession = async () => {
    try {
      const sessionId = crypto.randomUUID();
      const metrics = measurePerformance();
      
      if (metrics) {
        setPerformanceMetrics(metrics);
      }

      // Track session with API
      await fetch('/api/mobile/track-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          device_type: deviceInfo.type,
          screen_width: deviceInfo.width,
          screen_height: deviceInfo.height,
          user_agent: deviceInfo.userAgent,
          page_url: window.location.href,
          timestamp: new Date().toISOString(),
          performance_metrics: metrics
        })
      });
    } catch (error) {
      console.error('Failed to track mobile session:', error);
    }
  };

  useEffect(() => {
    updateDeviceInfo();
    
    const handleResize = () => {
      updateDeviceInfo();
    };

    const handleOrientationChange = () => {
      setTimeout(updateDeviceInfo, 100); // Delay to ensure dimensions are updated
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Track session on mount
    trackSession();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    deviceInfo,
    performanceMetrics,
    isMobile: deviceInfo.type === 'mobile',
    isTablet: deviceInfo.type === 'tablet',
    isDesktop: deviceInfo.type === 'desktop',
    isTouchDevice: deviceInfo.touchSupported,
    isPortrait: deviceInfo.orientation === 'portrait',
    isLandscape: deviceInfo.orientation === 'landscape'
  };
}
