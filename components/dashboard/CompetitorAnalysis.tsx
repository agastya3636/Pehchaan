'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Star, 
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Competitor {
  id: string;
  name: string;
  platform: string;
  category: string;
  avgPrice: number;
  rating: number;
  reviews: number;
  followers: number;
  postsPerWeek: number;
  engagement: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface MarketAnalysis {
  marketSize: number;
  growthRate: number;
  avgPrice: number;
  priceRange: { min: number; max: number };
  topCategories: { name: string; percentage: number }[];
  trends: string[];
}

export function CompetitorAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const { toast } = useToast();

  const categories = [
    'Textiles & Embroidery',
    'Pottery & Ceramics',
    'Jewelry & Metalwork',
    'Woodwork & Carving',
    'Paintings & Art',
    'Leather Crafts',
    'Stone Carving',
    'Bamboo & Cane Crafts'
  ];

  const platforms = ['Instagram', 'Facebook', 'Etsy', 'Amazon Handmade', 'Local Markets'];

  const analyzeCompetitors = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockCompetitors: Competitor[] = [
      {
        id: '1',
        name: 'Heritage Crafts Co.',
        platform: 'Instagram',
        category: category || 'Textiles & Embroidery',
        avgPrice: 2500,
        rating: 4.8,
        reviews: 1240,
        followers: 15600,
        postsPerWeek: 5,
        engagement: 8.5,
        strengths: ['High quality', 'Strong brand', 'Good social presence'],
        weaknesses: ['Limited variety', 'High prices'],
        opportunities: ['Expand product range', 'International shipping'],
        threats: ['New competitors', 'Rising material costs']
      },
      {
        id: '2',
        name: 'Artisan Collective',
        platform: 'Etsy',
        category: category || 'Textiles & Embroidery',
        avgPrice: 1800,
        rating: 4.6,
        reviews: 890,
        followers: 8200,
        postsPerWeek: 3,
        engagement: 6.2,
        strengths: ['Affordable pricing', 'Good reviews', 'Quick shipping'],
        weaknesses: ['Limited marketing', 'Basic packaging'],
        opportunities: ['Social media growth', 'Premium products'],
        threats: ['Price competition', 'Supply chain issues']
      },
      {
        id: '3',
        name: 'Traditional Treasures',
        platform: 'Facebook',
        category: category || 'Textiles & Embroidery',
        avgPrice: 3200,
        rating: 4.9,
        reviews: 2100,
        followers: 23400,
        postsPerWeek: 7,
        engagement: 12.3,
        strengths: ['Premium positioning', 'Excellent quality', 'Strong community'],
        weaknesses: ['Very high prices', 'Limited accessibility'],
        opportunities: ['Mid-range products', 'Workshops'],
        threats: ['Economic downturn', 'Changing tastes']
      }
    ];

    const mockMarketAnalysis: MarketAnalysis = {
      marketSize: 1250000000, // 1.25B INR
      growthRate: 15.2,
      avgPrice: 2500,
      priceRange: { min: 500, max: 5000 },
      topCategories: [
        { name: 'Textiles & Embroidery', percentage: 35 },
        { name: 'Jewelry & Metalwork', percentage: 25 },
        { name: 'Pottery & Ceramics', percentage: 20 },
        { name: 'Woodwork & Carving', percentage: 15 },
        { name: 'Others', percentage: 5 }
      ],
      trends: [
        'Sustainable and eco-friendly products',
        'Customization and personalization',
        'Online marketplace growth',
        'Social media marketing importance',
        'Premium positioning strategies'
      ]
    };
    
    setCompetitors(mockCompetitors);
    setMarketAnalysis(mockMarketAnalysis);
    setIsAnalyzing(false);
    toast({
      title: "Analysis Complete!",
      description: `Found ${mockCompetitors.length} competitors in ${category || 'your category'}.`,
    });
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 10) return 'text-green-600';
    if (engagement >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPricePosition = (price: number, avgPrice: number) => {
    if (price > avgPrice * 1.2) return { label: 'Premium', color: 'bg-purple-100 text-purple-800' };
    if (price < avgPrice * 0.8) return { label: 'Budget', color: 'bg-green-100 text-green-800' };
    return { label: 'Mid-range', color: 'bg-blue-100 text-blue-800' };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500" />
          Competitor Analysis
        </CardTitle>
        <CardDescription>
          Analyze your competitors and market positioning with AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="searchQuery">Search Query</Label>
            <Input
              placeholder="e.g., handwoven silk sarees, pottery vases"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={analyzeCompetitors} 
          disabled={isAnalyzing || (!searchQuery && !category)}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Search className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Competitors...
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Analyze Competitors
            </>
          )}
        </Button>

        {/* Results */}
        {(competitors.length > 0 || marketAnalysis) && (
          <div className="space-y-6">
            <Separator />
            
            <Tabs defaultValue="competitors" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="market">Market Analysis</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>
              
              {/* Competitors Tab */}
              <TabsContent value="competitors" className="space-y-4">
                <h3 className="text-lg font-semibold">Competitor Analysis</h3>
                
                <div className="grid gap-4">
                  {competitors.map(competitor => {
                    const pricePosition = getPricePosition(competitor.avgPrice, marketAnalysis?.avgPrice || 2500);
                    
                    return (
                      <Card key={competitor.id} className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{competitor.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{competitor.platform}</Badge>
                                <span>•</span>
                                <span>{competitor.category}</span>
                              </div>
                            </div>
                            <Badge className={pricePosition.color}>
                              {pricePosition.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold">₹{competitor.avgPrice}</p>
                              <p className="text-xs text-muted-foreground">Avg Price</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold flex items-center justify-center gap-1">
                                {competitor.rating}
                                <Star className="h-4 w-4 text-yellow-500" />
                              </p>
                              <p className="text-xs text-muted-foreground">Rating</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold">{competitor.followers.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Followers</p>
                            </div>
                            <div className="text-center">
                              <p className={`text-2xl font-bold ${getEngagementColor(competitor.engagement)}`}>
                                {competitor.engagement}%
                              </p>
                              <p className="text-xs text-muted-foreground">Engagement</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-green-600 mb-2 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Strengths
                              </h5>
                              <div className="space-y-1">
                                {competitor.strengths.map((strength, index) => (
                                  <p key={index} className="text-sm text-green-700">• {strength}</p>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-red-600 mb-2 flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                Weaknesses
                              </h5>
                              <div className="space-y-1">
                                {competitor.weaknesses.map((weakness, index) => (
                                  <p key={index} className="text-sm text-red-700">• {weakness}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              {/* Market Analysis Tab */}
              <TabsContent value="market" className="space-y-4">
                {marketAnalysis && (
                  <>
                    <h3 className="text-lg font-semibold">Market Analysis</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600">
                            ₹{(marketAnalysis.marketSize / 1000000000).toFixed(1)}B
                          </p>
                          <p className="text-sm text-muted-foreground">Market Size</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">
                            {marketAnalysis.growthRate}%
                          </p>
                          <p className="text-sm text-muted-foreground">Growth Rate</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-purple-600">
                            ₹{marketAnalysis.avgPrice}
                          </p>
                          <p className="text-sm text-muted-foreground">Avg Price</p>
                        </div>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {marketAnalysis.topCategories.map((category, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{category.name}</span>
                              <span>{category.percentage}%</span>
                            </div>
                            <Progress value={category.percentage} className="h-2" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {marketAnalysis.trends.map((trend, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{trend}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
              
              {/* AI Insights Tab */}
              <TabsContent value="insights" className="space-y-4">
                <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
                
                <div className="grid gap-4">
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Pricing Strategy</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Based on competitor analysis, consider positioning your products in the mid-range segment 
                        (₹1,500 - ₹3,000) to capture the largest market share while maintaining healthy margins.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Competitive pricing</Badge>
                        <Badge variant="secondary">Value positioning</Badge>
                        <Badge variant="secondary">Market penetration</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Marketing Opportunities</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Focus on Instagram and Facebook marketing with 3-5 posts per week. 
                        Emphasize sustainability and craftsmanship in your content strategy.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Social media focus</Badge>
                        <Badge variant="secondary">Sustainability angle</Badge>
                        <Badge variant="secondary">Regular posting</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">Competitive Advantages</h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Differentiate through unique product stories, superior customer service, 
                        and eco-friendly packaging. Consider offering customization options.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Unique stories</Badge>
                        <Badge variant="secondary">Customer service</Badge>
                        <Badge variant="secondary">Customization</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* AI Features Info */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-900">AI-Powered Analysis</h4>
                <p className="text-sm text-indigo-700">
                  Our AI analyzes competitor data, market trends, pricing strategies, and social media performance 
                  to provide actionable insights for your business growth.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Competitor tracking</Badge>
                  <Badge variant="secondary" className="text-xs">Market intelligence</Badge>
                  <Badge variant="secondary" className="text-xs">Pricing insights</Badge>
                  <Badge variant="secondary" className="text-xs">Growth opportunities</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

