import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Post, ApiResponse } from '@/types';

// GET /api/posts - 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const cursor = searchParams.get('cursor');

    // 데이터베이스에서 게시글 조회
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.post.count();

    const formattedPosts: Post[] = posts.map((post: any) => ({
      id: post.id,
      content: post.content,
      author: {
        id: post.author.id,
        name: post.author.name || '익명',
        email: post.author.email || '',
        avatar: post.author.image || '',
        createdAt: post.author.createdAt.toISOString(),
        updatedAt: post.author.updatedAt.toISOString(),
      },
      images: post.images ? JSON.parse(post.images) : [],
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      likes: post._count.likes,
      views: post.views,
    }));

    const response: ApiResponse<{
      posts: Post[];
      total: number;
      hasMore: boolean;
      nextCursor?: string;
    }> = {
      success: true,
      data: {
        posts: formattedPosts,
        total,
        hasMore: page * limit < total,
        nextCursor: page * limit < total ? `page_${page + 1}` : undefined
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '게시글 조회 중 오류가 발생했습니다.'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/posts - 새 게시글 생성
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: '로그인이 필요합니다.'
      }, { status: 401 });
    }

    const body = await request.json();
    const { content, images } = body;

    // 입력 검증
    if (!content || content.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: '게시글 내용을 입력해주세요.'
      }, { status: 400 });
    }

    if (content.length > 300) {
      return NextResponse.json({
        success: false,
        error: '게시글은 300자를 초과할 수 없습니다.'
      }, { status: 400 });
    }

    if (images && images.length > 4) {
      return NextResponse.json({
        success: false,
        error: '이미지는 최대 4장까지 업로드할 수 있습니다.'
      }, { status: 400 });
    }

    // 데이터베이스에 게시글 저장
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        images: JSON.stringify(images || []),
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const newPost: Post = {
      id: post.id,
      content: post.content,
      author: {
        id: post.author.id,
        name: post.author.name || '익명',
        email: post.author.email || '',
        avatar: post.author.image || '',
        createdAt: post.author.createdAt.toISOString(),
        updatedAt: post.author.updatedAt.toISOString(),
      },
      images: JSON.parse(post.images),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      likes: 0,
      views: 0,
    };

    const response: ApiResponse<Post> = {
      success: true,
      data: newPost,
      message: '게시글이 성공적으로 작성되었습니다.'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('게시글 생성 오류:', error);
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '게시글 작성 중 오류가 발생했습니다.'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 