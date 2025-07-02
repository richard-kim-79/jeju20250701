import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/posts/[id]/view - 게시글 조회수 증가
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 조회수 증가
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      views: updatedPost.views
    });

  } catch (error) {
    console.error('조회수 증가 실패:', error);
    return NextResponse.json(
      { error: '조회수 증가에 실패했습니다.' },
      { status: 500 }
    );
  }
} 