import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AdCategory } from '@/types/advertisement';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as AdCategory;
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    // 필터 조건 구성
    const where: any = {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() }
    };

    if (category) {
      where.category = category;
    }

    if (location) {
      where.location = { contains: location };
    }

    // 광고 조회
    const ads = await prisma.advertisement.findMany({
      where,
      include: {
        advertiser: true,
        impressions: true,
        clicks: true
      },
      orderBy: [
        { ctr: 'desc' },
        { impressionCount: 'desc' }
      ],
      take: limit,
      skip: (page - 1) * limit
    });

    // 총 광고 수 조회
    const total = await prisma.advertisement.count({ where });

    // 응답 데이터 구성
    const adsWithStats = ads.map((ad: any) => ({
      ...ad,
      impressions: ad.impressions.length,
      clicks: ad.clicks.length,
      ctr: ad.clicks.length > 0 ? (ad.clicks.length / ad.impressions.length) * 100 : 0
    }));

    return NextResponse.json({
      ads: adsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('광고 목록 조회 실패:', error);
    return NextResponse.json(
      { error: '광고 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      linkUrl,
      advertiserId,
      category,
      location,
      startDate,
      endDate,
      budget,
      targetAudience,
      tags
    } = body;

    // 필수 필드 검증
    if (!title || !description || !imageUrl || !linkUrl || !advertiserId || !category) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 광고 생성
    const ad = await prisma.advertisement.create({
      data: {
        title,
        description,
        imageUrl,
        linkUrl,
        advertiserId,
        category,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: budget || 0,
        targetAudience: targetAudience || {},
        tags: tags || [],
        isActive: true,
        impressionCount: 0,
        clickCount: 0,
        ctr: 0,
        spent: 0
      },
      include: {
        advertiser: true
      }
    });

    return NextResponse.json(ad, { status: 201 });

  } catch (error) {
    console.error('광고 생성 실패:', error);
    return NextResponse.json(
      { error: '광고 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 