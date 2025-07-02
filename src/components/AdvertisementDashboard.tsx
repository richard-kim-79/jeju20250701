'use client';

import { useState, useEffect } from 'react';
import { Advertisement, AdCategory } from '@/types/advertisement';
import { getBudgetStatus, getBudgetBalance } from '@/utils/budget';
import { 
  ChartBarIcon, 
  EyeIcon, 
  CursorArrowRaysIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface AdvertisementDashboardProps {
  ads: Advertisement[];
  period?: 'today' | 'week' | 'month' | 'all';
}

interface DashboardStats {
  totalAds: number;
  activeAds: number;
  totalImpressions: number;
  totalClicks: number;
  totalSpent: number;
  totalBudget: number;
  averageCTR: number;
  topPerformingAd?: Advertisement;
  categoryBreakdown: Record<string, number>;
}

export function AdvertisementDashboard({ ads, period = 'all' }: AdvertisementDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalAds: 0,
    activeAds: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalSpent: 0,
    totalBudget: 0,
    averageCTR: 0,
    categoryBreakdown: {}
  });

  useEffect(() => {
    calculateStats();
  }, [ads, period]);

  const calculateStats = () => {
    const filteredAds = filterAdsByPeriod(ads, period);
    
    const totalAds = filteredAds.length;
    const activeAds = filteredAds.filter(ad => ad.isActive).length;
    const totalImpressions = filteredAds.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
    const totalClicks = filteredAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const totalSpent = filteredAds.reduce((sum, ad) => sum + (ad.spent || 0), 0);
    const totalBudget = filteredAds.reduce((sum, ad) => sum + (ad.budget || 0), 0);
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // 카테고리별 분류
    const categoryBreakdown: Record<string, number> = {};
    filteredAds.forEach(ad => {
      const category = ad.category;
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    // 최고 성과 광고
    const topPerformingAd = filteredAds.length > 0 
      ? filteredAds.reduce((best, current) => 
          (current.ctr || 0) > (best.ctr || 0) ? current : best
        )
      : undefined;

    setStats({
      totalAds,
      activeAds,
      totalImpressions,
      totalClicks,
      totalSpent,
      totalBudget,
      averageCTR,
      topPerformingAd,
      categoryBreakdown
    });
  };

  const filterAdsByPeriod = (ads: Advertisement[], period: string): Advertisement[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return ads.filter(ad => {
      const adDate = new Date(ad.createdAt);
      
      switch (period) {
        case 'today':
          return adDate >= today;
        case 'week':
          return adDate >= weekAgo;
        case 'month':
          return adDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      [AdCategory.RESTAURANT]: '맛집',
      [AdCategory.ACCOMMODATION]: '숙박',
      [AdCategory.ACTIVITY]: '액티비티',
      [AdCategory.TRANSPORT]: '교통',
      [AdCategory.SHOPPING]: '쇼핑',
      [AdCategory.CULTURE]: '문화',
      [AdCategory.NATURE]: '자연',
      [AdCategory.OTHER]: '기타'
    };
    return labels[category] || category;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number): string => {
    return `₩${amount.toLocaleString()}`;
  };

  const getBudgetUtilizationRate = (): number => {
    if (stats.totalBudget === 0) return 0;
    return (stats.totalSpent / stats.totalBudget) * 100;
  };

  return (
    <div className="space-y-6">
      {/* 기간 선택 */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">광고 통계 대시보드</h2>
        <div className="flex space-x-2">
          {(['today', 'week', 'month', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => {/* 기간 변경 로직 */}}
              className={`px-3 py-1 text-sm rounded-md ${
                period === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p === 'today' && '오늘'}
              {p === 'week' && '주간'}
              {p === 'month' && '월간'}
              {p === 'all' && '전체'}
            </button>
          ))}
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 광고</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(stats.totalAds)}</p>
              <p className="text-sm text-green-600">{stats.activeAds}개 활성</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 노출수</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(stats.totalImpressions)}</p>
              <p className="text-sm text-gray-500">노출</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CursorArrowRaysIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 클릭수</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumber(stats.totalClicks)}</p>
              <p className="text-sm text-purple-600">{stats.averageCTR.toFixed(2)}% CTR</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 지출</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
              <p className="text-sm text-yellow-600">{getBudgetUtilizationRate().toFixed(1)}% 사용</p>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 예산 현황 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">예산 현황</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">총 예산</span>
              <span className="font-medium">{formatCurrency(stats.totalBudget)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">총 지출</span>
              <span className="font-medium text-red-600">{formatCurrency(stats.totalSpent)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">잔액</span>
              <span className="font-medium text-green-600">
                {formatCurrency(stats.totalBudget - stats.totalSpent)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getBudgetUtilizationRate()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              예산 사용률: {getBudgetUtilizationRate().toFixed(1)}%
            </p>
          </div>
        </div>

        {/* 카테고리별 분포 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">카테고리별 분포</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {getCategoryLabel(category)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${(count / stats.totalAds) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}개</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 최고 성과 광고 */}
      {stats.topPerformingAd && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">최고 성과 광고</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{stats.topPerformingAd.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{stats.topPerformingAd.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>노출: {formatNumber(stats.topPerformingAd.impressions)}</span>
                  <span>클릭: {formatNumber(stats.topPerformingAd.clicks)}</span>
                  <span>CTR: {stats.topPerformingAd.ctr.toFixed(2)}%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">최고 성과</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getCategoryLabel(stats.topPerformingAd.category)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 