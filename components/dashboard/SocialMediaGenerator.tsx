'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Download, 
  Copy, 
  Sparkles, 
  Image as ImageIcon,
  Hash,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialMediaPost {
  platform: string;
  content: string;
  hashtags: string[];
  imagePrompt: string;
  optimalTime: string;
  engagement: number;
}

export function SocialMediaGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [postType, setPostType] = useState('promotional');
  const [tone, setTone] = useState('professional');
  const [generatedPosts, setGeneratedPosts] = useState<SocialMediaPost[]>([]);
  const { toast } = useToast();

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' }
  ];

  const mockProducts = [
    { id: '1', name: 'Handwoven Silk Saree', category: 'Textiles' },
    { id: '2', name: 'Terracotta Pottery Set', category: 'Pottery' },
    { id: '3', name: 'Wooden Carved Bowl', category: 'Woodwork' }
  ];

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPosts: SocialMediaPost[] = platforms.map(platform => ({
      platform: platform.id,
      content: `🌟 Discover the beauty of authentic ${selectedProduct || 'handcrafted'} work! Each piece tells a story of tradition, skill, and passion. Perfect for adding a touch of elegance to your space. #Handmade #Artisan #TraditionalCraft`,
      hashtags: ['#Handmade', '#Artisan', '#TraditionalCraft', '#IndianCraft', '#Sustainable', '#Unique'],
      imagePrompt: `Professional product photography of ${selectedProduct || 'handcrafted item'} with soft lighting, traditional background, showcasing intricate details`,
      optimalTime: platform.id === 'instagram' ? '2:00 PM' : platform.id === 'facebook' ? '1:00 PM' : '12:00 PM',
      engagement: Math.floor(Math.random() * 1000) + 500
    }));
    
    setGeneratedPosts(mockPosts);
    setIsGenerating(false);
    toast({
      title: "Content Generated!",
      description: "AI has created social media posts for all platforms.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const downloadContent = (post: SocialMediaPost) => {
    const content = `${post.content}\n\nHashtags: ${post.hashtags.join(' ')}\n\nOptimal posting time: ${post.optimalTime}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.platform}-post.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Social Media Content Generator
        </CardTitle>
        <CardDescription>
          Generate engaging social media content and hashtags for your products using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product">Select Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {mockProducts.map(product => (
                  <SelectItem key={product.id} value={product.name}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postType">Post Type</Label>
            <Select value={postType} onValueChange={setPostType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
                <SelectItem value="customer-story">Customer Story</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="storytelling">Storytelling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={generateContent} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Content
            </>
          )}
        </Button>

        {/* Generated Content */}
        {generatedPosts.length > 0 && (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold">Generated Content</h3>
            
            <Tabs defaultValue="instagram" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {platforms.map(platform => {
                  const Icon = platform.icon;
                  return (
                    <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {platform.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {platforms.map(platform => {
                const post = generatedPosts.find(p => p.platform === platform.id);
                if (!post) return null;
                
                return (
                  <TabsContent key={platform.id} value={platform.id} className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${platform.color}`}>
                              <platform.icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{platform.name} Post</h4>
                              <p className="text-sm text-muted-foreground">
                                Optimal time: {post.optimalTime} • Est. engagement: {post.engagement}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(post.content)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadContent(post)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Content</Label>
                          <p className="mt-1 p-3 bg-muted rounded-lg text-sm">
                            {post.content}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-1">
                            <Hash className="h-4 w-4" />
                            Hashtags
                          </Label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {post.hashtags.map((hashtag, index) => (
                              <Badge key={index} variant="secondary">
                                {hashtag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-1">
                            <ImageIcon className="h-4 w-4" />
                            Image Prompt
                          </Label>
                          <p className="mt-1 p-3 bg-muted rounded-lg text-sm">
                            {post.imagePrompt}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

