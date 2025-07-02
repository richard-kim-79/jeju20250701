'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { MemoizedPostCard } from './MemoizedPostCard';

// 샘플 데이터 타입 정의
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

// 샘플 데이터
const samplePosts: Post[] = [
  {
    id: '1',
    content: '제주도 한라산 등반 완료! 정상에서 바라본 풍경이 정말 환상적이었어요. 특히 일출 시간대에 가시는 것을 추천합니다. #한라산 #제주도 #등산',
    author: {
      name: '제주러버',
      avatar: '/avatars/user1.jpg'
    },
    images: ['/images/hallasan1.jpg', '/images/hallasan2.jpg'],
    createdAt: '2024-07-01T10:30:00Z',
    likes: 24,
    views: 156
  },
  {
    id: '2',
    content: '성산일출봉 근처에 새로 생긴 카페 발견! 바다가 보이는 뷰가 최고예요. 아메리카노도 맛있고 분위기도 좋아서 다음에 또 올 것 같아요.',
    author: {
      name: '카페탐험가',
      avatar: '/avatars/user2.jpg'
    },
    images: ['/images/cafe1.jpg'],
    createdAt: '2024-07-01T09:15:00Z',
    likes: 18,
    views: 89
  },
  {
    id: '3',
    content: '우도에서 자전거 타기 완료! 해안도로를 따라 달리면서 바다 풍경을 감상했어요. 특히 코끼리바위 근처에서 찍은 사진이 인상적이었습니다.',
    author: {
      name: '자전거여행자',
      avatar: '/avatars/user3.jpg'
    },
    images: ['/images/udo1.jpg', '/images/udo2.jpg', '/images/udo3.jpg'],
    createdAt: '2024-07-01T08:45:00Z',
    likes: 31,
    views: 203
  },
  {
    id: '4',
    content: '제주 흑돼지 맛집 추천! 제주시내에 있는 이곳은 정말 맛있어요. 특히 삼겹살과 목살이 일품입니다. 예약 필수!',
    author: {
      name: '맛집탐험가',
      avatar: '/avatars/user4.jpg'
    },
    createdAt: '2024-07-01T07:20:00Z',
    likes: 42,
    views: 312
  },
  {
    id: '5',
    content: '오늘 제주 날씨 완벽! 맑고 화창해서 해변에서 수영하기 딱이에요. 협재해변 물이 정말 맑아서 스노클링도 즐겼습니다.',
    author: {
      name: '해변러버',
      avatar: '/avatars/user5.jpg'
    },
    images: ['/images/beach1.jpg', '/images/beach2.jpg', '/images/beach3.jpg', '/images/beach4.jpg'],
    createdAt: '2024-07-01T06:30:00Z',
    likes: 56,
    views: 445
  }
];

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // 초기 데이터 로드
    console.log('PostFeed: 초기 데이터 로드 중...');
    setPosts(samplePosts);
    console.log('PostFeed: 샘플 데이터 설정 완료', samplePosts.length);
  }, []);

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    // TODO: 실제 API 호출로 대체
    // 현재는 샘플 데이터를 복제해서 무한 스크롤 효과 시뮬레이션
    setTimeout(() => {
      const newPosts = samplePosts.map(post => ({
        ...post,
        id: `${post.id}_${Date.now()}`,
        createdAt: new Date().toISOString()
      }));
      
      setPosts(prev => [...prev, ...newPosts]);
      setLoading(false);
      
      // 5번째 로드 후 더 이상 로드하지 않음
      if (posts.length > 20) {
        setHasMore(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">테스트 게시글</h3>
        <p className="text-gray-600">PostFeed 컴포넌트가 정상적으로 렌더링되고 있습니다.</p>
        <p className="text-sm text-gray-500 mt-2">게시글 수: {posts.length}개</p>
      </div>
      
              {posts.map((post) => (
          <MemoizedPostCard key={post.id} post={post} />
        ))}
      
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">게시글을 불러오는 중...</p>
        </div>
      )}
      
      {!loading && hasMore && (
        <div className="text-center py-4">
          <button
            onClick={loadMorePosts}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            더 보기
          </button>
        </div>
      )}
      
      {!hasMore && (
        <div className="text-center py-4 text-gray-500">
          모든 게시글을 불러왔습니다.
        </div>
      )}
    </div>
  );
} 