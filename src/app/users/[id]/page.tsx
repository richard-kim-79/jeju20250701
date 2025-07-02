'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UserProfile } from '@/components/UserProfile';
import { UserPosts } from '@/components/UserPosts';
import { ApiResponse } from '@/types';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data: ApiResponse<User> = await response.json();

        if (data.success && data.data) {
          setUser(data.data);
        } else {
          setError(data.error || '사용자를 찾을 수 없습니다.');
        }
      } catch (error) {
        setError('사용자 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-24 sm:h-32 bg-gray-200 rounded-lg mb-4 sm:mb-6"></div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">사용자를 찾을 수 없습니다</h1>
            <p className="text-gray-600 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        <UserProfile user={user} />
        <div className="mt-6 sm:mt-8">
          <UserPosts userId={userId} />
        </div>
      </div>
    </div>
  );
} 