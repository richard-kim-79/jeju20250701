'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export function LoginButton() {
  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSocialLogin = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error('소셜 로그인 오류:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium animate-pulse">
        로딩 중...
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || '사용자'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {session.user.name?.[0] || 'U'}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-700">{session.user.name}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
      >
        로그인하고 글쓰기
      </button>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">로그인</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span className="text-red-500">●</span>
                <span>Google로 로그인</span>
              </button>

              <button
                onClick={() => handleSocialLogin('naver')}
                className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>●</span>
                <span>네이버로 로그인</span>
              </button>

              <button
                onClick={() => handleSocialLogin('kakao')}
                className="w-full bg-yellow-400 text-black px-4 py-3 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
              >
                <span>●</span>
                <span>카카오로 로그인</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                이메일로 로그인
              </Link>
              <span className="mx-2 text-gray-400">|</span>
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                회원가입
              </Link>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              로그인하면 제주 정보를 공유할 수 있어요!
            </div>
          </div>
        </div>
      )}
    </>
  );
} 