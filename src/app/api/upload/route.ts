import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import fs from 'fs';

export async function POST(req: NextRequest) {
  // 파일 파싱 로직 필요 (예: formidable, multer 등)
  // 여기서는 예시로 /tmp/uploaded.jpg 경로 사용
  const filePath = '/tmp/uploaded.jpg';

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: '파일이 존재하지 않습니다.' }, { status: 400 });
  }

  const result = await uploadImage(filePath);
  return NextResponse.json({ url: result.secure_url });
} 