import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateAdCost, isBudgetExhausted } from '@/utils/budget';

// 예산 정보 조회
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const ad = await prisma.advertisement.findUnique({
      where: { id },
      include: {
        impressions: true,
        clicks: true
      }
    });

    if (!ad) {
      return NextResponse.json(
        { error: '광고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const budgetStatus = {
      budget: ad.budget,
      spent: ad.spent,
      balance: Math.max(0, (ad.budget || 0) - (ad.spent || 0)),
      exhaustionRate: ad.budget ? ((ad.spent || 0) / ad.budget) * 100 : 0,
      isExhausted: isBudgetExhausted(ad),
      clicks: ad.clickCount,
      impressions: ad.impressionCount,
      isActive: ad.isActive
    };

    return NextResponse.json(budgetStatus);

  } catch (error) {
    console.error('예산 정보 조회 실패:', error);
    return NextResponse.json(
      { error: '예산 정보 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 예산 업데이트
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { budget, action } = body;

    const ad = await prisma.advertisement.findUnique({
      where: { id }
    });

    if (!ad) {
      return NextResponse.json(
        { error: '광고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    let updatedData: any = {};

    if (action === 'update_budget') {
      if (typeof budget !== 'number' || budget < 0) {
        return NextResponse.json(
          { error: '올바른 예산을 입력해주세요.' },
          { status: 400 }
        );
      }
      updatedData.budget = budget;
    } else if (action === 'reset_spent') {
      updatedData.spent = 0;
    } else if (action === 'add_budget') {
      if (typeof budget !== 'number' || budget <= 0) {
        return NextResponse.json(
          { error: '올바른 예산을 입력해주세요.' },
          { status: 400 }
        );
      }
      updatedData.budget = (ad.budget || 0) + budget;
    }

    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: updatedData
    });

    return NextResponse.json({
      success: true,
      budget: updatedAd.budget,
      spent: updatedAd.spent
    });

  } catch (error) {
    console.error('예산 업데이트 실패:', error);
    return NextResponse.json(
      { error: '예산 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 클릭 비용 차감 (광고 클릭 시 자동 호출)
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { cpc = 1000 } = body; // 기본 CPC 1,000원

    const ad = await prisma.advertisement.findUnique({
      where: { id }
    });

    if (!ad) {
      return NextResponse.json(
        { error: '광고를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 예산 소진 확인
    if (isBudgetExhausted(ad)) {
      return NextResponse.json(
        { error: '예산이 소진되어 광고가 비활성화되었습니다.' },
        { status: 400 }
      );
    }

    // 비용 차감
    const newSpent = (ad.spent || 0) + cpc;
    
    // 예산 초과 확인
    if (ad.budget && newSpent > ad.budget) {
      return NextResponse.json(
        { error: '예산을 초과하여 클릭이 차단되었습니다.' },
        { status: 400 }
      );
    }

    // 예산 업데이트
    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: {
        spent: newSpent,
        clickCount: (ad.clickCount || 0) + 1
      }
    });

    // 예산 소진 시 광고 비활성화
    if (isBudgetExhausted(updatedAd)) {
      await prisma.advertisement.update({
        where: { id },
        data: { isActive: false }
      });
    }

    return NextResponse.json({
      success: true,
      spent: updatedAd.spent,
      balance: Math.max(0, (ad.budget || 0) - newSpent),
      isExhausted: isBudgetExhausted(updatedAd)
    });

  } catch (error) {
    console.error('비용 차감 실패:', error);
    return NextResponse.json(
      { error: '비용 차감에 실패했습니다.' },
      { status: 500 }
    );
  }
} 