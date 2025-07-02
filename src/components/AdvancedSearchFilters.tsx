'use client';

import { useState } from 'react';
import { 
  FunnelIcon, 
  CalendarIcon, 
  UserIcon, 
  TagIcon,
  ArrowsUpDownIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { SearchFilters } from '@/types';

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

export function AdvancedSearchFilters({ 
  filters, 
  onFiltersChange, 
  onReset 
}: AdvancedSearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const dateRange = filters.dateRange || { start: '', end: '' };
    handleFilterChange('dateRange', {
      ...dateRange,
      [type]: value
    });
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = filters.tags || [];
    const newTags = checked 
      ? [...currentTags, tag]
      : currentTags.filter(t => t !== tag);
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    onReset();
  };

  const hasActiveFilters = () => {
    return !!(
      filters.dateRange?.start || 
      filters.dateRange?.end || 
      filters.author || 
      (filters.tags && filters.tags.length > 0) ||
      filters.sortBy !== 'relevance'
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 필터 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FunnelIcon className="w-5 h-5" />
          <span className="font-medium">고급 검색 필터</span>
          {hasActiveFilters() && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              활성
            </span>
          )}
        </button>
        
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* 필터 내용 */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* 날짜 범위 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              날짜 범위
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">시작일</label>
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">종료일</label>
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 작성자 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-4 h-4 inline mr-1" />
              작성자
            </label>
            <input
              type="text"
              placeholder="작성자 이름 또는 이메일"
              value={filters.author || ''}
              onChange={(e) => handleFilterChange('author', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TagIcon className="w-4 h-4 inline mr-1" />
              태그
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['제주도', '맛집', '관광지', '카페', '숙박', '액티비티', '문화', '자연'].map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.tags?.includes(tag) || false}
                    onChange={(e) => handleTagChange(tag, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 정렬 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ArrowsUpDownIcon className="w-4 h-4 inline mr-1" />
              정렬 기준
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">정렬 기준</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">관련성</option>
                  <option value="date">날짜</option>
                  <option value="likes">좋아요</option>
                  <option value="views">조회수</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">정렬 순서</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">내림차순</option>
                  <option value="asc">오름차순</option>
                </select>
              </div>
            </div>
          </div>

          {/* 결과 수 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              결과 수
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10개</option>
              <option value={20}>20개</option>
              <option value={50}>50개</option>
              <option value={100}>100개</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
} 