'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Play, 
  Download, 
  Upload, 
  Sparkles, 
  Clock, 
  Zap,
  Image as ImageIcon,
  Music,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoProject {
  id: string;
  name: string;
  duration: number;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  progress: number;
  thumbnail: string;
  createdAt: Date;
  platform: string;
  style: string;
}

export function VideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [videoStyle, setVideoStyle] = useState('product-showcase');
  const [duration, setDuration] = useState('15');
  const [platform, setPlatform] = useState('instagram');
  const [script, setScript] = useState('');
  const [videoProjects, setVideoProjects] = useState<VideoProject[]>([]);
  const { toast } = useToast();

  const mockProducts = [
    { id: '1', name: 'Handwoven Silk Saree', category: 'Textiles' },
    { id: '2', name: 'Terracotta Pottery Set', category: 'Pottery' },
    { id: '3', name: 'Wooden Carved Bowl', category: 'Woodwork' }
  ];

  const videoStyles = [
    { id: 'product-showcase', name: 'Product Showcase', description: 'Highlight product features and details' },
    { id: 'behind-scenes', name: 'Behind the Scenes', description: 'Show the making process' },
    { id: 'lifestyle', name: 'Lifestyle', description: 'Product in use scenarios' },
    { id: 'tutorial', name: 'Tutorial', description: 'How-to or educational content' },
    { id: 'testimonial', name: 'Customer Testimonial', description: 'Customer reviews and stories' }
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram Reels', aspect: '9:16' },
    { id: 'youtube', name: 'YouTube Shorts', aspect: '9:16' },
    { id: 'tiktok', name: 'TikTok', aspect: '9:16' },
    { id: 'facebook', name: 'Facebook Video', aspect: '16:9' }
  ];

  const generateVideo = async () => {
    setIsGenerating(true);
    
    const newProject: VideoProject = {
      id: Date.now().toString(),
      name: `${selectedProduct} - ${videoStyle}`,
      duration: parseInt(duration),
      status: 'generating',
      progress: 0,
      thumbnail: '/api/placeholder/300/200',
      createdAt: new Date(),
      platform,
      style: videoStyle
    };
    
    setVideoProjects(prev => [newProject, ...prev]);
    
    // Simulate video generation progress
    const interval = setInterval(() => {
      setVideoProjects(prev => prev.map(project => 
        project.id === newProject.id 
          ? { ...project, progress: Math.min(project.progress + 10, 100) }
          : project
      ));
    }, 500);
    
    setTimeout(() => {
      clearInterval(interval);
      setVideoProjects(prev => prev.map(project => 
        project.id === newProject.id 
          ? { ...project, status: 'completed', progress: 100 }
          : project
      ));
      setIsGenerating(false);
      toast({
        title: "Video Generated!",
        description: "Your AI-generated video is ready for download.",
      });
    }, 5000);
  };

  const downloadVideo = (project: VideoProject) => {
    toast({
      title: "Download Started",
      description: `Downloading ${project.name}...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'generating': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Ready';
      case 'generating': return 'Generating...';
      case 'failed': return 'Failed';
      default: return 'Draft';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-500" />
          AI Video Generator with Veo
        </CardTitle>
        <CardDescription>
          Create engaging marketing videos for your products using AI video generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(plat => (
                  <SelectItem key={plat.id} value={plat.id}>
                    {plat.name} ({plat.aspect})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="style">Video Style</Label>
            <Select value={videoStyle} onValueChange={setVideoStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {videoStyles.map(style => (
                  <SelectItem key={style.id} value={style.id}>
                    <div>
                      <div className="font-medium">{style.name}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="120">2 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="script">Custom Script (Optional)</Label>
          <Textarea
            placeholder="Describe what you want in the video, or let AI generate it automatically..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={generateVideo} 
          disabled={isGenerating || !selectedProduct}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Generating Video...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Generate AI Video
            </>
          )}
        </Button>

        {/* Video Projects */}
        {videoProjects.length > 0 && (
          <div className="space-y-4">
            <Separator />
            <h3 className="text-lg font-semibold">Video Projects</h3>
            
            <div className="grid gap-4">
              {videoProjects.map(project => (
                <Card key={project.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-20 h-12 bg-muted rounded-lg flex items-center justify-center">
                          {project.status === 'completed' ? (
                            <Play className="h-6 w-6 text-green-500" />
                          ) : (
                            <Video className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        {project.status === 'generating' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{project.platform}</Badge>
                          <span>•</span>
                          <span>{project.duration}s</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                            {getStatusText(project.status)}
                          </div>
                        </div>
                        
                        {project.status === 'generating' && (
                          <div className="w-48">
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {project.status === 'completed' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadVideo(project)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Features Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">Powered by Veo AI</h4>
                <p className="text-sm text-blue-700">
                  Our AI video generator uses advanced machine learning to create professional-quality videos 
                  with custom animations, transitions, and effects tailored to your product and brand.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Auto-generated scripts</Badge>
                  <Badge variant="secondary" className="text-xs">Smart transitions</Badge>
                  <Badge variant="secondary" className="text-xs">Brand consistency</Badge>
                  <Badge variant="secondary" className="text-xs">Multiple formats</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

