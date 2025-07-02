import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 좋아요 추가
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: id
      }
    });

    if (existingLike) {
      return NextResponse.json(
        { error: '이미 좋아요를 눌렀습니다.' },
        { status: 400 }
      );
    }

    // 좋아요 추가
    await prisma.like.create({
      data: {
        userId: user.id,
        postId: id
      }
    });

    // 좋아요 수 업데이트
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        likes: {
          connect: { id: user.id }
        }
      },
      include: {
        likes: true,
        comments: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      likes: updatedPost.likes.length,
      isLiked: true
    });

  } catch (error) {
    console.error('좋아요 추가 실패:', error);
    return NextResponse.json(
      { error: '좋아요 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 좋아요 취소
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 좋아요가 있는지 확인
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: id
      }
    });

    if (!existingLike) {
      return NextResponse.json(
        { error: '좋아요를 누르지 않았습니다.' },
        { status: 400 }
      );
    }

    // 좋아요 삭제
    await prisma.like.delete({
      where: { id: existingLike.id }
    });

    // 좋아요 수 업데이트
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        likes: {
          disconnect: { id: user.id }
        }
      },
      include: {
        likes: true,
        comments: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      likes: updatedPost.likes.length,
      isLiked: false
    });

  } catch (error) {
    console.error('좋아요 취소 실패:', error);
    return NextResponse.json(
      { error: '좋아요 취소에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 좋아요 상태 확인
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 좋아요 상태 확인
    const like = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: id
      }
    });

    return NextResponse.json({
      success: true,
      isLiked: !!like
    });
  } catch (error) {
    console.error('좋아요 상태 확인 오류:', error);
    return NextResponse.json(
      { error: '좋아요 상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 