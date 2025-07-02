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

export interface RecommendedSearch {
  category: string;
  icon: string;
  keywords: string[];
  description: string;
}

export interface PopularSearch {
  keyword: string;
  count: number;
  category: string;
} 