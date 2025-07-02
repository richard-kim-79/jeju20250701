'use client';

import { useState } from 'react';
import { 
  HomeIcon, 
  CakeIcon, 
  BuildingOfficeIcon, 
  TruckIcon, 
  UserGroupIcon, 
  BriefcaseIcon,
  ChevronRightIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { SearchFilters } from '@/types';

interface RecommendedSearchesProps {
  onSearch: (filters: SearchFilters) => void;
  popularSearches?: Array<{
    keyword: string;
    count: number;
    category: string;
  }>;
}

export function RecommendedSearches({ onSearch, popularSearches = [] }: RecommendedSearchesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const recommendedCategories = [
    {
      category: '부동산',
      icon: HomeIcon,
      keywords: ['제주 아파트', '제주 빌라', '제주 원룸', '제주 투룸', '제주 오피스텔', '제주 상가', '제주 토지', '제주 전원주택'],
      description: '제주도 부동산 정보를 찾아보세요'
    },
    {
      category: '맛집',
      icon: CakeIcon,
      keywords: ['제주 해산물', '제주 흑돼지', '제주 한라봉', '제주 감귤', '제주 전통음식', '제주 카페', '제주 디저트', '제주 술집'],
      description: '제주도 맛집과 음식 정보를 찾아보세요'
    },
    {
      category: '숙박',
      icon: BuildingOfficeIcon,
      keywords: ['제주 호텔', '제주 펜션', '제주 게스트하우스', '제주 리조트', '제주 민박', '제주 캠핑', '제주 풀빌라', '제주 한옥'],
      description: '제주도 숙박 시설을 찾아보세요'
    },
    {
      category: '렌트',
      icon: TruckIcon,
      keywords: ['제주 렌터카', '제주 자전거', '제주 오토바이', '제주 전기차', '제주 캠핑카', '제주 보트', '제주 장비', '제주 의류'],
      description: '제주도 렌트 서비스를 찾아보세요'
    },
    {
      category: '구인',
      icon: UserGroupIcon,
      keywords: ['제주 알바', '제주 파트타임', '제주 풀타임', '제주 인턴', '제주 아르바이트', '제주 취업', '제주 채용', '제주 일자리'],
      description: '제주도 구인 정보를 찾아보세요'
    },
    {
      category: '구직',
      icon: BriefcaseIcon,
      keywords: ['제주 취업', '제주 이직', '제주 경력', '제주 신입', '제주 프리랜서', '제주 재택근무', '제주 원격근무', '제주 스타트업'],
      description: '제주도 구직 정보를 찾아보세요'
    }
  ];

  const handleKeywordClick = (keyword: string) => {
    const searchFilters: SearchFilters = {
      query: keyword,
      type: 'semantic',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 10,
      offset: 0
    };
    onSearch(searchFilters);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="space-y-6">
      {/* 인기 검색어 */}
      {popularSearches.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <FireIcon className="w-5 h-5 text-orange-500" />
            <h3 className="font-medium text-gray-900">인기 검색어</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.slice(0, 8).map((item, index) => (
              <button
                key={index}
                onClick={() => handleKeywordClick(item.keyword)}
                className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm hover:bg-orange-100 transition-colors border border-orange-200"
              >
                {item.keyword}
                <span className="ml-1 text-xs text-orange-500">({item.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 추천 검색 카테고리 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recommendedCategories.map((category) => (
          <div key={category.category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <button
              onClick={() => handleCategoryClick(category.category)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <category.icon className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium text-gray-900">{category.category}</h3>
                </div>
                <ChevronRightIcon 
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    selectedCategory === category.category ? 'rotate-90' : ''
                  }`} 
                />
              </div>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
            </button>

            {/* 카테고리별 키워드 */}
            {selectedCategory === category.category && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {category.keywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => handleKeywordClick(keyword)}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 빠른 검색 팁 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 검색 팁</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• "제주 맛집 추천"처럼 자연스럽게 검색해보세요</li>
          <li>• "부동산 시세"처럼 구체적인 키워드를 사용하세요</li>
          <li>• 날짜 필터로 최신 정보만 확인할 수 있습니다</li>
          <li>• 작성자 필터로 특정 사용자의 게시글을 찾을 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
} 