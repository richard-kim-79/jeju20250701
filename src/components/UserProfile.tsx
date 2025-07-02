'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ProfileEdit } from './ProfileEdit';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);

  const isOwnProfile = session?.user?.email === user.email;
  const joinDate = new Date(user.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleProfileUpdate = (updatedUser: User) => {
    setUserData(updatedUser);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <ProfileEdit 
        user={userData} 
        onSave={handleProfileUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            {userData.image ? (
              <img
                src={userData.image}
                alt={userData.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <UserCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
            )}
          </div>
          
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{userData.name}</h1>
            <p className="text-gray-600 text-sm sm:text-base">{userData.email}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              가입일: {joinDate}
            </p>
          </div>
        </div>

        {isOwnProfile && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>프로필 편집</span>
          </button>
        )}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">0</div>
            <div className="text-xs sm:text-sm text-gray-600">게시글</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">0</div>
            <div className="text-xs sm:text-sm text-gray-600">좋아요</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs sm:text-sm text-gray-600">조회수</div>
          </div>
        </div>
      </div>
    </div>
  );
} 