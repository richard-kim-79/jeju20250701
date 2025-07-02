'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const firstInputEntry = entry as PerformanceEventTiming;
        if (firstInputEntry.processingStart && firstInputEntry.startTime) {
          const fid = firstInputEntry.processingStart - firstInputEntry.startTime;
          setMetrics(prev => ({ ...prev, fid }));
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  const getScore = (metric: number | null, thresholds: { good: number; needsImprovement: number }) => {
    if (metric === null) return '측정 중';
    if (metric <= thresholds.good) return '좋음';
    if (metric <= thresholds.needsImprovement) return '개선 필요';
    return '나쁨';
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case '좋음': return 'text-green-600';
      case '개선 필요': return 'text-yellow-600';
      case '나쁨': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // 프로덕션에서는 숨김
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-medium text-gray-900 mb-3">성능 모니터링</h3>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor(getScore(metrics.fcp, { good: 1800, needsImprovement: 3000 }))}>
            {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : '측정 중'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor(getScore(metrics.lcp, { good: 2500, needsImprovement: 4000 }))}>
            {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : '측정 중'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={getScoreColor(getScore(metrics.fid, { good: 100, needsImprovement: 300 }))}>
            {metrics.fid ? `${Math.round(metrics.fid)}ms` : '측정 중'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getScoreColor(getScore(metrics.cls, { good: 0.1, needsImprovement: 0.25 }))}>
            {metrics.cls ? metrics.cls.toFixed(3) : '측정 중'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getScoreColor(getScore(metrics.ttfb, { good: 800, needsImprovement: 1800 }))}>
            {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : '측정 중'}
          </span>
        </div>
      </div>
    </div>
  );
} 