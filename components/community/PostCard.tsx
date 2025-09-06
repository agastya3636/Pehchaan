'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  authorName: string;
  authorAvatar: string | null;
  title: string;
  content: string;
  images: Array<{ url: string; alt?: string; order?: number }>;
  tags: string[];
  category: string;
  likes: Array<{ user: string; likedAt: string }>;
  comments: Array<{ author: string; authorName: string; content: string; createdAt: string }>;
  shares: Array<{ user: string; sharedAt: string }>;
  createdAt: string;
  updatedAt: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const likeCount = post.likeCount || post.likes?.length || 0;
  const commentCount = post.commentCount || post.comments?.length || 0;
  const shareCount = post.shareCount || post.shares?.length || 0;

  return (
    <Link href={`/community/post/${post._id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
              {post.authorName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-gray-900">{post.authorName}</h4>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              
              <p className="text-gray-600 mb-3 line-clamp-3">
                {post.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{likeCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{commentCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="h-4 w-4" />
                  <span>{shareCount}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}