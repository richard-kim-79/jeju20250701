'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { ApiResponse } from '@/types';

interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
}

interface UserPostsProps {
  userId: string;
}

export function UserPosts({ userId }: UserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPosts = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/posts?page=${pageNum}&limit=10`);
      const data = await response.json();

      if (response.ok && data.posts) {
        if (pageNum === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.hasMore);
      } else {
        setError(data.error || '게시글을 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">게시글</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {posts.length === 0 && !loading ? (
          <div className="p-4 sm:p-6 text-center">
            <p className="text-gray-500 text-sm sm:text-base">아직 작성한 게시글이 없습니다.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-3 sm:p-6">
              <PostCard post={post} />
            </div>
          ))
        )}

        {loading && (
          <div className="p-4 sm:p-6">
            <div className="animate-pulse space-y-3 sm:space-y-4">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        )}

        {hasMore && !loading && (
          <div className="p-4 sm:p-6 text-center">
            <button
              onClick={loadMore}
              className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              더 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 