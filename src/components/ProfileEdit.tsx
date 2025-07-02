'use client';

import { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

interface ProfileEditProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

export function ProfileEdit({ user, onSave, onCancel }: ProfileEditProps) {
  const [name, setName] = useState(user.name);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        onSave({ ...user, name: name.trim() });
      } else {
        setError(data.error || '프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      setError('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">프로필 편집</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2.5 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            placeholder="이름을 입력하세요"
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            이메일
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-2.5 sm:px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm sm:text-base"
          />
          <p className="text-xs text-gray-500 mt-1">
            이메일은 변경할 수 없습니다.
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2.5 sm:p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{isLoading ? '저장 중...' : '저장'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
} 