'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, SparklesIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { AdvancedSearchFilters } from './AdvancedSearchFilters';
import { SearchFilters } from '@/types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  isSearching?: boolean;
}

export function SearchBar({ onSearch, isSearching = false }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'semantic',
    sortBy: 'relevance',
    sortOrder: 'desc',
    limit: 10,
    offset: 0
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    const searchFilters = {
      ...filters,
      query: searchQuery.trim(),
      offset: 0 // 검색 시마다 오프셋 초기화
    };

    onSearch(searchFilters);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      query: searchQuery,
      type: 'semantic',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 10,
      offset: 0
    });
  };

  return (
    <div className="space-y-4">
      {/* 검색 입력 */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제주에서 찾고 싶은 것을 검색해보세요..."
            className="w-full pl-9 sm:pl-10 pr-20 sm:pr-24 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
          />
          <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-md transition-colors ${
                showFilters 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="고급 검색 필터"
            >
              <FunnelIcon className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
          </div>
        </div>
      </form>

      {/* 고급 검색 필터 */}
      {showFilters && (
        <AdvancedSearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />
      )}

      {/* 검색 정보 */}
      <div className="flex items-center space-x-1 text-xs text-gray-500">
        <SparklesIcon className="w-3 h-3" />
        <span>AI 기반 의미 분석 검색</span>
      </div>
    </div>
  );
} 