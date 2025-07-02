'use client';

import { useState } from 'react';
import { SearchResult, SearchFilters } from '@/types';
import { OptimizedImage } from './OptimizedImage';
import { 
  HeartIcon, 
  EyeIcon, 
  ChatBubbleLeftIcon, 
  CalendarIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface SearchResultsProps {
  results: SearchResult | null;
  isSearching: boolean;
  onLoadMore: () => void;
}

export function SearchResults({ results, isSearching, onLoadMore }: SearchResultsProps) {
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  if (isSearching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">검색 중...</span>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  if (results.posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
          <p className="text-sm">다른 검색어나 필터를 시도해보세요.</p>
        </div>
      </div>
    );
  }

  const togglePostExpansion = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <div className="space-y-6">
      {/* 검색 결과 요약 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              총 <span className="font-semibold text-gray-900">{results.total}</span>개의 결과
            </span>
            <span className="text-sm text-gray-500">
              검색 시간: {results.searchTime}ms
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {results.filters.type === 'semantic' ? '의미 기반 검색' : '키워드 검색'}
          </div>
        </div>
      </div>

      {/* 검색 결과 목록 */}
      <div className="space-y-4">
        {results.posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {/* 작성자 정보 */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{post.author.name}</div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { 
                    addSuffix: true, 
                    locale: ko 
                  })}
                </div>
              </div>
            </div>

            {/* 게시글 내용 */}
            <div className="mb-3">
              <p className={`text-gray-800 ${expandedPost === post.id ? '' : 'line-clamp-3'}`}>
                {post.content}
              </p>
              {post.content.length > 200 && (
                <button
                  onClick={() => togglePostExpansion(post.id)}
                  className="text-blue-500 text-sm hover:text-blue-600 mt-1"
                >
                  {expandedPost === post.id ? '접기' : '더보기'}
                </button>
              )}
            </div>

            {/* 이미지 */}
            {post.images && post.images.length > 0 && (
              <div className="mb-3">
                <div className="grid grid-cols-2 gap-2">
                  {post.images.slice(0, 4).map((image, index) => (
                    <OptimizedImage
                      key={index}
                      src={image}
                      alt={`게시글 이미지 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 통계 */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <HeartIcon className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
              </div>
              
              {/* 관련성 점수 (의미 기반 검색인 경우) */}
              {post.relevance && (
                <div className="text-blue-600 font-medium">
                  관련성: {Math.round(post.relevance * 100)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {results.posts.length < results.total && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={isSearching}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? '로딩 중...' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  );
} 