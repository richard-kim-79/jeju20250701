import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id]/posts - 사용자 게시글 목록 조회
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const posts = await prisma.post.findMany({
      where: { authorId: id },
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
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.post.count({
      where: { authorId: id }
    });

    const formattedPosts = posts.map((post: any) => ({
      ...post,
      likes: post.likes.length,
      comments: post.comments.length,
      views: post.views || 0
    }));

    return NextResponse.json({
      posts: formattedPosts,
      total,
      hasMore: page * limit < total,
      currentPage: page
    });

  } catch (error) {
    console.error('사용자 게시글 조회 실패:', error);
    return NextResponse.json(
      { error: '사용자 게시글 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
} 