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

    // 광고 노출 기록 생성
    const impression = await prisma.adImpression.create({
      data: {
        adId,
        userId,
        userAgent,
        ipAddress,
        referrer,
        timestamp: new Date()
      }
    });

    // 광고의 총 노출 수 업데이트
    const updatedAd = await prisma.advertisement.update({
      where: { id: adId },
      data: {
        impressionCount: { increment: 1 }
      }
    });

    return NextResponse.json({ success: true, impressionId: impression.id });

  } catch (error) {
    console.error('광고 노출 기록 실패:', error);
    return NextResponse.json(
      { error: '광고 노출 기록에 실패했습니다.' },
      { status: 500 }
    );
  }
} 