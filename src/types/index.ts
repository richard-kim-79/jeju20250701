// 사용자 관련 타입
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 게시글 관련 타입
export interface Post {
  id: string;
  content: string;
  author: User;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number; // 조회수 추가
  isLiked?: boolean;
}

// 검색 관련 타입
export interface SearchFilters {
  query: string;
  type: 'semantic' | 'keyword';
  dateRange?: {
    start: string;
    end: string;
  };
  author?: string;
  tags?: string[];
  sortBy: 'relevance' | 'date' | 'likes' | 'views';
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
}

export interface SearchResult {
  posts: Array<{
    id: string;
    content: string;
    images: string[];
    author: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
    createdAt: string;
    updatedAt: string;
    likes: number;
    views: number;
    comments: number;
    tags?: string[];
    relevance?: number;
  }>;
  total: number;
  searchTime: number;
  filters: SearchFilters;
}

export interface SearchSuggestion {
  text: string;
  type: 'popular' | 'recent' | 'related';
  count?: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션 타입
export interface PaginationParams {
  page: number;
  limit: number;
  cursor?: string;
}

// 검색 파라미터 타입
export interface SearchParams {
  query: string;
  filters?: {
    category?: string;
    location?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  pagination: PaginationParams;
}

// 소셜 로그인 제공자 타입
export type SocialProvider = 'google' | 'naver' | 'kakao';

// API 키 관련 타입
export interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
} 