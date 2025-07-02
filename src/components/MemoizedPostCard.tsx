'use client';

import { memo } from 'react';
import { PostCard } from './PostCard';

interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  images?: string[];
  createdAt: string;
  likes: number;
  views: number;
}

interface MemoizedPostCardProps {
  post: Post;
}

export const MemoizedPostCard = memo<MemoizedPostCardProps>(({ post }) => {
  return <PostCard post={post} />;
});

MemoizedPostCard.displayName = 'MemoizedPostCard'; 