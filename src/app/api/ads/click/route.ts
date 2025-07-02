import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adId } = body;

    if (!adId) {
      return NextResponse.json(
        { error: '광고 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 세션에서 사용자 정보 가져오기
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // 클라이언트 정보 가져오기
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const referrer = request.headers.get('referer') || '';

    // 광고 클릭 기록 생성
    const click = await prisma.adClick.create({
      data: {
        adId,
        userId,
        userAgent,
        ipAddress,
        referrer,
        timestamp: new Date()
      }
    });

    // 광고의 총 클릭 수 업데이트
    const updatedAd = await prisma.advertisement.update({
      where: { id: adId },
      data: {
        clickCount: { increment: 1 }
      }
    });

    // 광고 정보 조회 (리다이렉트 URL 반환)
    const ad = await prisma.advertisement.findUnique({
      where: { id: adId },
      select: { linkUrl: true }
    });

    if (!ad) {
      return NextResponse.json(
        { error: '광고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      clickId: click.id,
      redirectUrl: ad.linkUrl 
    });

  } catch (error) {
    console.error('광고 클릭 기록 실패:', error);
    return NextResponse.json(
      { error: '광고 클릭 기록에 실패했습니다.' },
      { status: 500 }
    );
  }
} 