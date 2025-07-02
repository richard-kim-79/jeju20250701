'use client';

import { useState } from 'react';
import { Advertisement, AdCategory } from '@/types/advertisement';
import { OptimizedImage } from './OptimizedImage';
import { MapPinIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

interface AdvertisementCardProps {
  ad: Advertisement;
  onImpression: (adId: string) => void;
  onClick: (adId: string) => void;
  variant?: 'feed' | 'sidebar' | 'banner';
}

const categoryLabels: Record<AdCategory, string> = {
  [AdCategory.RESTAURANT]: '맛집',
  [AdCategory.ACCOMMODATION]: '숙박',
  [AdCategory.ACTIVITY]: '액티비티',
  [AdCategory.TRANSPORT]: '교통',
  [AdCategory.SHOPPING]: '쇼핑',
  [AdCategory.CULTURE]: '문화',
  [AdCategory.NATURE]: '자연',
  [AdCategory.OTHER]: '기타'
};

const categoryColors: Record<AdCategory, string> = {
  [AdCategory.RESTAURANT]: 'bg-orange-100 text-orange-800',
  [AdCategory.ACCOMMODATION]: 'bg-blue-100 text-blue-800',
  [AdCategory.ACTIVITY]: 'bg-green-100 text-green-800',
  [AdCategory.TRANSPORT]: 'bg-purple-100 text-purple-800',
  [AdCategory.SHOPPING]: 'bg-pink-100 text-pink-800',
  [AdCategory.CULTURE]: 'bg-yellow-100 text-yellow-800',
  [AdCategory.NATURE]: 'bg-emerald-100 text-emerald-800',
  [AdCategory.OTHER]: 'bg-gray-100 text-gray-800'
};

export function AdvertisementCard({ 
  ad, 
  onImpression, 
  onClick, 
  variant = 'feed' 
}: AdvertisementCardProps) {
  const [isImpressionTracked, setIsImpressionTracked] = useState(false);

  const handleImpression = () => {
    if (!isImpressionTracked) {
      onImpression(ad.id);
      setIsImpressionTracked(true);
    }
  };

  const handleClick = () => {
    onClick(ad.id);
    window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
  };

  const baseClasses = "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden";
  const variantClasses = {
    feed: "mb-4",
    sidebar: "mb-3",
    banner: "mb-2"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} relative`}
      onMouseEnter={handleImpression}
    >
      {/* 광고 라벨 */}
      <div className="absolute top-2 left-2 z-10">
        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          광고
        </span>
      </div>

      {/* 이미지 */}
      <div className="relative">
        <OptimizedImage
          src={ad.imageUrl}
          alt={ad.title}
          className="w-full h-48 sm:h-56 object-cover"
          onClick={handleClick}
        />
        
        {/* 카테고리 태그 */}
        <div className="absolute bottom-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[ad.category]}`}>
            {categoryLabels[ad.category]}
          </span>
        </div>
      </div>

      {/* 광고 내용 */}
      <div className="p-4">
        {/* 광고주 정보 */}
        <div className="flex items-center mb-2">
          {ad.advertiser.logo && (
            <OptimizedImage
              src={ad.advertiser.logo}
              alt={ad.advertiser.name}
              className="w-6 h-6 rounded-full mr-2"
              width={24}
              height={24}
            />
          )}
          <span className="text-sm text-gray-600 font-medium">
            {ad.advertiser.name}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {ad.title}
        </h3>

        {/* 설명 */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {ad.description}
        </p>

        {/* 위치 및 날짜 */}
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
          {ad.location && (
            <div className="flex items-center">
              <MapPinIcon className="w-3 h-3 mr-1" />
              <span>{ad.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span>{new Date(ad.endDate).toLocaleDateString('ko-KR')}까지</span>
          </div>
        </div>

        {/* 태그 */}
        {ad.tags.length > 0 && (
          <div className="flex items-center mb-3">
            <TagIcon className="w-3 h-3 text-gray-400 mr-1" />
            <div className="flex flex-wrap gap-1">
              {ad.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA 버튼 */}
        <button
          onClick={handleClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          자세히 보기
        </button>
      </div>
    </div>
  );
} 