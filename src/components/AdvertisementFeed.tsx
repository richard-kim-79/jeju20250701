'use client';

import { useState, useEffect } from 'react';
import { Advertisement, AdCategory } from '@/types/advertisement';
import { AdvertisementCard } from './AdvertisementCard';

interface AdvertisementFeedProps {
  category?: AdCategory;
  location?: string;
  limit?: number;
  variant?: 'feed' | 'sidebar' | 'banner';
}

// 샘플 광고 데이터
const sampleAds: Advertisement[] = [
  {
    id: '1',
    title: '제주 흑돼지 맛집 - 제주시내 최고의 삼겹살',
    description: '제주도 현지인들이 추천하는 최고의 흑돼지 맛집입니다. 신선한 제주 흑돼지와 함께하는 특별한 식사 경험을 제공합니다.',
    imageUrl: '/images/ads/restaurant1.jpg',
    linkUrl: 'https://example.com/restaurant1',
    advertiser: {
      name: '제주흑돼지맛집',
      logo: '/images/ads/logo1.jpg'
    },
    category: AdCategory.RESTAURANT,
    location: '제주시',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    isActive: true,
    impressions: 1250,
    clicks: 89,
    ctr: 7.12,
    budget: 500000,
    spent: 125000,
    targetAudience: {
      ageRange: { min: 20, max: 50 },
      interests: ['맛집', '제주도', '흑돼지'],
      location: '제주도',
      gender: 'all'
    },
    tags: ['흑돼지', '맛집', '제주시', '삼겹살'],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  },
  {
    id: '2',
    title: '한라산 등반 가이드 투어 - 전문 가이드와 함께',
    description: '안전하고 즐거운 한라산 등반을 전문 가이드와 함께 경험하세요. 계절별 최적 코스와 안전 장비를 제공합니다.',
    imageUrl: '/images/ads/activity1.jpg',
    linkUrl: 'https://example.com/activity1',
    advertiser: {
      name: '제주액티비티',
      logo: '/images/ads/logo2.jpg'
    },
    category: AdCategory.ACTIVITY,
    location: '제주도',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-11-30T23:59:59Z',
    isActive: true,
    impressions: 890,
    clicks: 67,
    ctr: 7.53,
    budget: 300000,
    spent: 89000,
    targetAudience: {
      ageRange: { min: 18, max: 60 },
      interests: ['등산', '액티비티', '자연'],
      location: '제주도',
      gender: 'all'
    },
    tags: ['한라산', '등산', '가이드', '액티비티'],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  },
  {
    id: '3',
    title: '성산일출봉 근처 프리미엄 펜션',
    description: '성산일출봉에서 도보 5분 거리의 프리미엄 펜션입니다. 바다 전망과 함께하는 특별한 휴식을 경험하세요.',
    imageUrl: '/images/ads/accommodation1.jpg',
    linkUrl: 'https://example.com/accommodation1',
    advertiser: {
      name: '제주펜션',
      logo: '/images/ads/logo3.jpg'
    },
    category: AdCategory.ACCOMMODATION,
    location: '성산읍',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    isActive: true,
    impressions: 1100,
    clicks: 78,
    ctr: 7.09,
    budget: 400000,
    spent: 110000,
    targetAudience: {
      ageRange: { min: 25, max: 55 },
      interests: ['휴식', '바다', '펜션'],
      location: '제주도',
      gender: 'all'
    },
    tags: ['성산일출봉', '펜션', '바다전망', '휴식'],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  },
  {
    id: '4',
    title: '제주 특산품 쇼핑몰 - 현지인 추천 상품',
    description: '제주도 현지인들이 직접 추천하는 특산품들을 만나보세요. 감귤, 한라봉, 오메기떡 등 제주만의 특별한 상품들입니다.',
    imageUrl: '/images/ads/shopping1.jpg',
    linkUrl: 'https://example.com/shopping1',
    advertiser: {
      name: '제주특산품',
      logo: '/images/ads/logo4.jpg'
    },
    category: AdCategory.SHOPPING,
    location: '제주도',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    isActive: true,
    impressions: 950,
    clicks: 72,
    ctr: 7.58,
    budget: 350000,
    spent: 95000,
    targetAudience: {
      ageRange: { min: 20, max: 60 },
      interests: ['쇼핑', '특산품', '선물'],
      location: '전국',
      gender: 'all'
    },
    tags: ['특산품', '감귤', '한라봉', '선물'],
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z'
  }
];

export function AdvertisementFeed({ 
  category, 
  location, 
  limit = 4, 
  variant = 'feed' 
}: AdvertisementFeedProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 API 호출로 대체 예정
    const fetchAds = async () => {
      setLoading(true);
      
      // 필터링 로직
      let filteredAds = sampleAds.filter(ad => ad.isActive);
      
      if (category) {
        filteredAds = filteredAds.filter(ad => ad.category === category);
      }
      
      if (location) {
        filteredAds = filteredAds.filter(ad => 
          ad.location && ad.location.includes(location)
        );
      }
      
      // CTR 기준으로 정렬 (성과가 좋은 광고 우선)
      filteredAds.sort((a, b) => b.ctr - a.ctr);
      
      // 제한된 개수만 반환
      filteredAds = filteredAds.slice(0, limit);
      
      setAds(filteredAds);
      setLoading(false);
    };

    fetchAds();
  }, [category, location, limit]);

  const handleImpression = async (adId: string) => {
    try {
      // 실제 API 호출로 대체 예정
      console.log('광고 노출 기록:', adId);
      // await fetch('/api/ads/impression', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ adId })
      // });
    } catch (error) {
      console.error('광고 노출 기록 실패:', error);
    }
  };

  const handleClick = async (adId: string) => {
    try {
      // 실제 API 호출로 대체 예정
      console.log('광고 클릭 기록:', adId);
      // await fetch('/api/ads/click', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ adId })
      // });
    } catch (error) {
      console.error('광고 클릭 기록 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-2 w-3/4"></div>
              <div className="bg-gray-200 h-8 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>현재 표시할 광고가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <AdvertisementCard
          key={ad.id}
          ad={ad}
          onImpression={handleImpression}
          onClick={handleClick}
          variant={variant}
        />
      ))}
    </div>
  );
} 