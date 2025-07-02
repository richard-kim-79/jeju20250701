'use client';

import { useState, useEffect } from 'react';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import CommentSection from './CommentSection';
import { OptimizedImage } from './OptimizedImage';

interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  images?: string[];
  createdAt: string;
  likes: number;
  views: number; // 조회수 추가
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [viewCount, setViewCount] = useState(post.views);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // 링크 자동 변환 함수
  const formatContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // 시간 포맷팅 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.data.liked);
        setLikeCount(prev => data.data.liked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
    }
  };

  const handleView = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setViewCount(data.data.views);
        }
      }
    } catch (error) {
      console.error('조회수 증가 중 오류:', error);
    }
  };

  // 좋아요 상태 초기화
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/posts/${post.id}/like`);
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.data.liked);
        }
      } catch (error) {
        console.error('좋아요 상태 확인 오류:', error);
      }
    };

    checkLikeStatus();
  }, [post.id]);

  const displayedImages = showAllImages ? post.images : post.images?.slice(0, 3);

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleView}
    >
      {/* 작성자 정보 */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {post.author.avatar ? (
              <OptimizedImage
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                width={40}
                height={40}
              />
            ) : (
              <span className="text-gray-600 font-medium text-sm sm:text-base">
                {post.author.name.charAt(0)}
              </span>
            )}
          </div>
        <div>
          <div className="font-medium text-gray-900 text-sm sm:text-base">{post.author.name}</div>
          <div className="text-xs sm:text-sm text-gray-500">{formatTime(post.createdAt)}</div>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="mb-3 sm:mb-4">
        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
          {formatContent(post.content)}
        </p>
      </div>

      {/* 이미지 */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3 sm:mb-4">
          <div className={`grid gap-1 sm:gap-2 ${
            displayedImages!.length === 1 ? 'grid-cols-1' :
            displayedImages!.length === 2 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {displayedImages!.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <OptimizedImage
                  src={image}
                  alt={`게시글 이미지 ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                  onClick={() => {
                    // TODO: 이미지 모달 구현
                    console.log('이미지 클릭:', image);
                  }}
                />
                {index === 2 && post.images && post.images.length > 3 && !showAllImages && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-lg">
                      +{post.images.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {post.images.length > 3 && (
            <button
              onClick={() => setShowAllImages(!showAllImages)}
              className="mt-2 text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium"
            >
              {showAllImages ? '이미지 접기' : `모든 이미지 보기 (${post.images.length}장)`}
            </button>
          )}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors p-1"
          >
            {isLiked ? (
              <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="text-xs sm:text-sm">{likeCount}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors p-1"
          >
            <ChatBubbleLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">댓글</span>
          </button>
          
          <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors p-1">
            <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm">공유</span>
          </button>
        </div>
        
        {/* 조회수 표시 */}
        <div className="flex items-center space-x-1 text-gray-500">
          <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">{viewCount}</span>
        </div>
      </div>

      {/* 댓글 섹션 */}
      {showComments && (
        <CommentSection postId={post.id} />
      )}
    </div>
  );
} 