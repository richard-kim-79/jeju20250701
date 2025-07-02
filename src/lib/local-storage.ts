import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export interface UploadResult {
  url: string;
  key: string;
}

export async function saveImageLocally(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<UploadResult> {
  // 업로드 디렉토리 생성
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const timestamp = Date.now();
  const key = `uploads/${timestamp}-${fileName}`;
  const filePath = join(UPLOAD_DIR, `${timestamp}-${fileName}`);

  // 파일 저장
  await writeFile(filePath, file);

  return {
    url: `/uploads/${timestamp}-${fileName}`,
    key,
  };
}

export function getPublicUrl(key: string): string {
  return `/${key}`;
}

// 로컬 스토리지 유틸리티
export const localStorage = {
  // 데이터 저장
  setItem: (key: string, value: any): void => {
    if (typeof window !== 'undefined') {
      try {
        const serializedValue = JSON.stringify(value);
        window.localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error('로컬 스토리지 저장 실패:', error);
      }
    }
  },

  // 데이터 조회
  getItem: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch (error) {
        console.error('로컬 스토리지 조회 실패:', error);
        return defaultValue || null;
      }
    }
    return defaultValue || null;
  },

  // 데이터 삭제
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error('로컬 스토리지 삭제 실패:', error);
      }
    }
  },

  // 모든 데이터 삭제
  clear: (): void => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.error('로컬 스토리지 초기화 실패:', error);
      }
    }
  }
}; 