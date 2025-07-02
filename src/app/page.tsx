'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { RecommendedSearches } from '@/components/RecommendedSearches';
import CreatePost from '@/components/CreatePost';
import { PostFeed } from '@/components/PostFeed';
import { Header } from '@/components/Header';
import { LoginButton } from '@/components/LoginButton';
import { AdvertisementFeed } from '@/components/AdvertisementFeed';
import { SearchFilters, SearchResult } from '@/types';

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);
  const [popularSearches, setPopularSearches] = useState<Array<{
    keyword: string;
    count: number;
    category: string;
  }>>([]);

  // 인기 검색어 로드
  useEffect(() => {
    const loadPopularSearches = async () => {
      try {
        const response = await fetch('/api/search/popular?limit=8');
        const data = await response.json();
        if (data.success) {
          setPopularSearches(data.data);
        }
      } catch (error) {
        console.error('인기 검색어 로드 오류:', error);
      }
    };

    loadPopularSearches();
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    setIsSearching(true);
    setCurrentFilters(filters);

    try {
      const params = new URLSearchParams({
        q: filters.query,
        type: filters.type,
        limit: filters.limit.toString(),
        offset: filters.offset.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      if (filters.dateRange?.start) {
        params.append('dateStart', filters.dateRange.start);
      }
      if (filters.dateRange?.end) {
        params.append('dateEnd', filters.dateRange.end);
      }
      if (filters.author) {
        params.append('author', filters.author);
      }
      if (filters.tags && filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      } else {
        console.error('검색 오류:', data.error);
        setSearchResults(null);
      }
    } catch (error) {
      console.error('검색 요청 오류:', error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadMore = async () => {
    if (!currentFilters || !searchResults) return;

    const newFilters = {
      ...currentFilters,
      offset: currentFilters.offset + currentFilters.limit
    };

    try {
      const params = new URLSearchParams({
        q: newFilters.query,
        type: newFilters.type,
        limit: newFilters.limit.toString(),
        offset: newFilters.offset.toString(),
        sortBy: newFilters.sortBy,
        sortOrder: newFilters.sortOrder
      });

      if (newFilters.dateRange?.start) {
        params.append('dateStart', newFilters.dateRange.start);
      }
      if (newFilters.dateRange?.end) {
        params.append('dateEnd', newFilters.dateRange.end);
      }
      if (newFilters.author) {
        params.append('author', newFilters.author);
      }
      if (newFilters.tags && newFilters.tags.length > 0) {
        params.append('tags', newFilters.tags.join(','));
      }

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults({
          ...data.data,
          posts: [...searchResults.posts, ...data.data.posts]
        });
        setCurrentFilters(newFilters);
      }
    } catch (error) {
      console.error('더보기 로딩 오류:', error);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setCurrentFilters(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <Header />
      
      {/* 메인 컨텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
        {/* 검색바 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            제주 SNS
          </h1>
          <SearchBar onSearch={handleSearch} isSearching={isSearching} />
          
          {/* 검색 결과가 있을 때만 표시 */}
          {searchResults && (
            <div className="mt-4">
              <button
                onClick={clearSearch}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← 전체 게시글 보기
              </button>
            </div>
          )}
        </div>
        
        {/* 검색 결과 또는 일반 피드 */}
        {searchResults ? (
          <SearchResults 
            results={searchResults} 
            isSearching={isSearching} 
            onLoadMore={handleLoadMore} 
          />
        ) : (
          <>
            {/* 추천 검색어 */}
            <div className="mb-8">
              <RecommendedSearches 
                onSearch={handleSearch} 
                popularSearches={popularSearches}
              />
            </div>

            <CreatePost />
            <PostFeed />
          </>
        )}
        
        {/* 광고 섹션 */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            제주도 추천 정보
          </h2>
          <AdvertisementFeed limit={2} variant="feed" />
        </div>
      </main>
    </div>
  );
}
