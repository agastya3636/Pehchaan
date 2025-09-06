'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { PostCard } from '@/components/community/PostCard';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  MessageSquare, 
  Users 
} from 'lucide-react';

export default function CommunityPage() {
  const { isAuthenticated } = useAppStore();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts = [], refetch: refetchPosts, isLoading, error } = useQuery({
    queryKey: ['community-posts'],
    queryFn: () => api.getPosts(),
  });

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const trendingPosts = [...posts].sort((a, b) => {
    const aLikes = a.likeCount || a.likes?.length || 0;
    const bLikes = b.likeCount || b.likes?.length || 0;
    return bLikes - aLikes;
  }).slice(0, 5);
  
  const recentPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50 dark:from-gray-950 dark:via-orange-900/20 dark:to-yellow-900/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-orange-500 via-red-600 to-orange-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Traditional Indian patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-400/20 rounded-full blur-lg"></div>
        </div>
        
        {/* Traditional Indian border pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-sm text-white text-sm font-bold mb-8 border border-white/20 shadow-lg">
            <Users className="h-5 w-5 mr-2 text-yellow-300" />
            🤝 Artisan Community Hub 🤝
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-white to-orange-200 bg-clip-text text-transparent drop-shadow-2xl">
            Community Forum
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            🌟 Connect, share, and learn with fellow artisans from across India 🌟
          </p>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Discussions</h2>
            <p className="text-gray-600">Join the conversation and share your craft journey</p>
          </div>
          
          {isAuthenticated && (
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              ✍️ Create Post
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform duration-300">{posts.length}</h3>
              <p className="text-gray-600 font-semibold">💬 Community Posts</p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-black text-green-600 mb-2 group-hover:scale-105 transition-transform duration-300">500+</h3>
              <p className="text-gray-600 font-semibold">👥 Active Members</p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-black text-purple-600 mb-2 group-hover:scale-105 transition-transform duration-300">2.5k</h3>
              <p className="text-gray-600 font-semibold">📈 Total Interactions</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Posts */}
            <Tabs defaultValue="recent" className="space-y-6">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-6">
                {isLoading ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Loading posts...</h3>
                      <p className="text-gray-500">Please wait while we fetch the latest discussions</p>
                    </CardContent>
                  </Card>
                ) : error ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-red-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading posts</h3>
                      <p className="text-gray-500">Please try refreshing the page</p>
                    </CardContent>
                  </Card>
                ) : filteredPosts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                      <p className="text-gray-500">Be the first to start a conversation!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {filteredPosts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                <div className="space-y-6">
                  {trendingPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-orange-800">🏷️ Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { tag: 'weaving', emoji: '🧵' },
                    { tag: 'traditional', emoji: '🏺' },
                    { tag: 'pottery', emoji: '🏺' },
                    { tag: 'tips', emoji: '💡' },
                    { tag: 'heritage', emoji: '🏛️' },
                    { tag: 'business', emoji: '💼' },
                    { tag: 'marketing', emoji: '📈' },
                    { tag: 'techniques', emoji: '🎨' }
                  ].map(({ tag, emoji }) => (
                    <Button key={tag} variant="outline" size="sm" className="text-xs bg-white/50 hover:bg-orange-100 border-orange-200">
                      {emoji} #{tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-green-800">📋 Community Guidelines</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✅</span>
                    <p>Be respectful and supportive</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✅</span>
                    <p>Share authentic experiences</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✅</span>
                    <p>Help fellow artisans grow</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✅</span>
                    <p>No spam or self-promotion</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-purple-800">🌟 Featured Artisans</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Priya Sharma', craft: 'Kashmiri Shawls', location: 'Srinagar' },
                    { name: 'Rajesh Kumar', craft: 'Rajasthani Pottery', location: 'Jaipur' },
                    { name: 'Lakshmi Devi', craft: 'Bengali Textiles', location: 'Kolkata' }
                  ].map((artisan, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {artisan.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{artisan.name}</p>
                        <p className="text-xs text-gray-600">{artisan.craft} • {artisan.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreatePostModal 
        isOpen={showCreatePost} 
        onClose={() => setShowCreatePost(false)}
        onPostCreated={() => refetchPosts()}
      />
    </div>
  );
}