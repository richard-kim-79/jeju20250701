import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

// GET /api/search/popular - 인기 검색어 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    // 실제 구현에서는 검색 로그를 분석하여 인기 검색어를 제공
    // 현재는 미리 정의된 인기 검색어를 반환
    const popularSearches = [
      { keyword: '제주 맛집', count: 1250, category: '맛집' },
      { keyword: '제주 호텔', count: 980, category: '숙박' },
      { keyword: '제주 렌터카', count: 756, category: '렌트' },
      { keyword: '제주 아파트', count: 634, category: '부동산' },
      { keyword: '제주 알바', count: 521, category: '구인' },
      { keyword: '제주 취업', count: 487, category: '구직' },
      { keyword: '제주 해산물', count: 445, category: '맛집' },
      { keyword: '제주 펜션', count: 398, category: '숙박' },
      { keyword: '제주 자전거', count: 356, category: '렌트' },
      { keyword: '제주 빌라', count: 312, category: '부동산' },
      { keyword: '제주 파트타임', count: 289, category: '구인' },
      { keyword: '제주 이직', count: 267, category: '구직' },
      { keyword: '제주 흑돼지', count: 234, category: '맛집' },
      { keyword: '제주 게스트하우스', count: 198, category: '숙박' },
      { keyword: '제주 전기차', count: 167, category: '렌트' },
      { keyword: '제주 원룸', count: 145, category: '부동산' },
      { keyword: '제주 풀타임', count: 123, category: '구인' },
      { keyword: '제주 경력', count: 98, category: '구직' },
      { keyword: '제주 카페', count: 87, category: '맛집' },
      { keyword: '제주 리조트', count: 76, category: '숙박' }
    ];

    let filteredSearches = popularSearches;

    // 카테고리별 필터링
    if (category) {
      filteredSearches = popularSearches.filter(item => item.category === category);
    }

    // 검색 횟수로 정렬하고 limit만큼 반환
    const result = filteredSearches
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('인기 검색어 조회 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '인기 검색어 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 