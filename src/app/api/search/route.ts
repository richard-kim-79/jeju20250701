import { NextRequest, NextResponse } from 'next/server';
import { semanticSearch } from '@/lib/opensearch';
import { prisma } from '@/lib/prisma';
import { ApiResponse, SearchResult, SearchFilters } from '@/types';

// GET /api/search - 의미 기반 검색과 고급 필터를 지원하는 게시글 검색
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 기본 검색 파라미터
    const query = searchParams.get('q') || '';
    
    // 고급 필터 파라미터
    const dateStart = searchParams.get('dateStart');
    const dateEnd = searchParams.get('dateEnd');
    const author = searchParams.get('author');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: '검색어를 입력해주세요.'
      }, { status: 400 });
    }

    // 의미 기반 검색 수행
    const semanticResults = await semanticSearch(query.trim(), limit);
    
    // 실제 데이터베이스에서 검색
    const whereClause: any = {
      content: {
        contains: query.trim(),
        mode: 'insensitive'
      }
    };

    // 고급 필터 적용
    if (dateStart || dateEnd) {
      whereClause.createdAt = {};
      if (dateStart) whereClause.createdAt.gte = new Date(dateStart);
      if (dateEnd) whereClause.createdAt.lte = new Date(dateEnd);
    }

    if (author) {
      whereClause.author = {
        OR: [
          { name: { contains: author, mode: 'insensitive' } },
          { email: { contains: author, mode: 'insensitive' } }
        ]
      };
    }

    if (tags.length > 0) {
      whereClause.OR = whereClause.OR || [];
      tags.forEach((tag: string) => {
        whereClause.OR.push({ content: { contains: tag, mode: 'insensitive' } });
      });
    }

    // 정렬 설정
    let orderBy: any = {};
    switch (sortBy) {
      case 'date':
        orderBy.createdAt = sortOrder;
        break;
      case 'likes':
        orderBy._count = { likes: sortOrder };
        break;
      case 'views':
        orderBy.views = sortOrder;
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        likes: true,
        comments: true
      },
      orderBy,
      take: limit,
      skip: offset
    });

    const total = await prisma.post.count({ where: whereClause });

    const searchResult: SearchResult = {
      posts: posts.map((post: any) => ({
        id: post.id,
        content: post.content,
        images: post.images ? JSON.parse(post.images) : [],
        author: post.author,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        likes: post.likes.length,
        views: post.views || 0,
        comments: post.comments.length,
        relevance: 1.0 // 기본 관련성 점수
      })),
      total,
      searchTime: Date.now(),
      filters: {
        query: query.trim(),
        type: 'semantic',
        dateRange: dateStart || dateEnd ? { start: dateStart || '', end: dateEnd || '' } : undefined,
        author: author || undefined,
        tags: tags.length > 0 ? tags : undefined,
        sortBy: sortBy as any,
        sortOrder: sortOrder as 'asc' | 'desc',
        limit,
        offset
      }
    };

    const response: ApiResponse<SearchResult> = {
      success: true,
      data: searchResult
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('검색 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 