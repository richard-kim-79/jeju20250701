'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { LoginButton } from './LoginButton';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">제</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">제주</h1>
          </Link>

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 검색 아이콘 */}
            <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 사용자 메뉴 */}
            {session?.user ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link 
                  href={`/users/${session.user.id}`}
                  className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || '프로필'}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 