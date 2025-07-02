import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 광고 조회
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const ad = await prisma.advertisement.findUnique({
      where: { id },
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!ad) {
      return NextResponse.json(
        { error: '광고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(ad);
  } catch (error) {
    console.error('광고 조회 실패:', error);
    return NextResponse.json(
      { error: '광고 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 광고 수정
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title, description, imageUrl, linkUrl, budget, isActive } = body;

    const ad = await prisma.advertisement.findUnique({
      where: { id }
    });

    if (!ad) {
      return NextResponse.json(
        { error: '광고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: {
        title: title || ad.title,
        description: description || ad.description,
        imageUrl: imageUrl || ad.imageUrl,
        linkUrl: linkUrl || ad.linkUrl,
        budget: budget !== undefined ? budget : ad.budget,
        isActive: isActive !== undefined ? isActive : ad.isActive,
        updatedAt: new Date()
      },
      include: {
        advertiser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      ad: updatedAd
    });
  } catch (error) {
    console.error('광고 수정 실패:', error);
    return NextResponse.json(
      { error: '광고 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 광고 삭제
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const ad = await prisma.advertisement.findUnique({
      where: { id }
    });

    if (!ad) {
      return NextResponse.json(
        { error: '광고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.advertisement.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: '광고가 삭제되었습니다.'
    });
  } catch (error) {
    console.error('광고 삭제 실패:', error);
    return NextResponse.json(
      { error: '광고 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 