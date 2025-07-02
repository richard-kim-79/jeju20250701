import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, address, description } = body;

    // 필수 필드 검증
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingAdvertiser = await prisma.advertiser.findUnique({
      where: { email }
    });

    if (existingAdvertiser) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 12);

    // 광고주 생성
    const advertiser = await prisma.advertiser.create({
      data: {
        name,
        email,
        phone,
        address: address || null,
        description: description || null,
        isActive: true
      }
    });

    // 사용자 계정도 함께 생성 (광고주용)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return NextResponse.json({
      success: true,
      advertiser: {
        id: advertiser.id,
        name: advertiser.name,
        email: advertiser.email
      }
    }, { status: 201 });

  } catch (error) {
    console.error('광고주 회원가입 실패:', error);
    return NextResponse.json(
      { error: '회원가입에 실패했습니다.' },
      { status: 500 }
    );
  }
} 