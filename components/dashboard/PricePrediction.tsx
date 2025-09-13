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
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  Lightbulb,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PricePrediction {
  productName: string;
  category: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  factors: {
    material: { impact: number; description: string };
    craftsmanship: { impact: number; description: string };
    market: { impact: number; description: string };
    seasonality: { impact: number; description: string };
    competition: { impact: number; description: string };
  };
  recommendations: string[];
  marketInsights: {
    demand: 'high' | 'medium' | 'low';
    trend: 'rising' | 'stable' | 'falling';
    seasonality: string;
  };
}

export function PricePrediction() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [complexity, setComplexity] = useState('');
  const [timeToMake, setTimeToMake] = useState('');
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
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

  const materials = [
    'Silk', 'Cotton', 'Wool', 'Clay', 'Wood', 'Metal', 'Stone', 'Leather', 'Bamboo', 'Jute'
  ];

  const complexityLevels = [
    'Simple', 'Moderate', 'Complex', 'Expert', 'Masterpiece'
  ];

  const analyzePrice = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentPriceNum = parseFloat(currentPrice) || 0;
    const predictedPrice = currentPriceNum * (0.8 + Math.random() * 0.4); // 80-120% of current price
    const confidence = 75 + Math.random() * 20; // 75-95% confidence
    
    const mockPrediction: PricePrediction = {
      productName,
      category,
      currentPrice: currentPriceNum,
      predictedPrice: Math.round(predictedPrice),
      confidence: Math.round(confidence),
      factors: {
        material: {
          impact: Math.random() * 20 + 10,
          description: `${material} is in high demand this season`
        },
        craftsmanship: {
          impact: Math.random() * 15 + 5,
          description: `${complexity} level work commands premium pricing`
        },
        market: {
          impact: Math.random() * 25 + 15,
          description: 'Market conditions favor handmade products'
        },
        seasonality: {
          impact: Math.random() * 10 + 5,
          description: 'Peak season for this category'
        },
        competition: {
          impact: Math.random() * 15 + 5,
          description: 'Moderate competition in this niche'
        }
      },
      recommendations: [
        'Consider premium packaging to justify higher pricing',
        'Highlight unique craftsmanship in product description',
        'Offer limited edition variants at 20% premium',
        'Bundle with complementary products for value perception'
      ],
      marketInsights: {
        demand: Math.random() > 0.5 ? 'high' : 'medium',
        trend: Math.random() > 0.3 ? 'rising' : 'stable',
        seasonality: 'Peak demand expected in next 2-3 months'
      }
    };
    
    setPrediction(mockPrediction);
    setIsAnalyzing(false);
    toast({
      title: "Price Analysis Complete!",
      description: `AI recommends ₹${mockPrediction.predictedPrice} for your product.`,
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'falling': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-500" />;
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          AI Price Prediction
        </CardTitle>
        <CardDescription>
          Get AI-powered pricing recommendations based on market analysis and product factors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              placeholder="e.g., Handwoven Silk Saree"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentPrice">Current Price (₹)</Label>
            <Input
              type="number"
              placeholder="1000"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="material">Primary Material</Label>
            <Select value={material} onValueChange={setMaterial}>
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map(mat => (
                  <SelectItem key={mat} value={mat}>
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="complexity">Complexity Level</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger>
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                {complexityLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeToMake">Time to Make (hours)</Label>
          <Input
            type="number"
            placeholder="8"
            value={timeToMake}
            onChange={(e) => setTimeToMake(e.target.value)}
          />
        </div>

        <Button 
          onClick={analyzePrice} 
          disabled={isAnalyzing || !productName || !category || !currentPrice}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Market Data...
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Analyze & Predict Price
            </>
          )}
        </Button>

        {/* Results */}
        {prediction && (
          <div className="space-y-6">
            <Separator />
            
            {/* Price Prediction Summary */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Price Prediction</h3>
                  <Badge variant="outline" className="text-green-600">
                    {prediction.confidence}% Confidence
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-2xl font-bold text-gray-600">₹{prediction.currentPrice}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">AI Recommended</p>
                    <p className="text-2xl font-bold text-green-600">₹{prediction.predictedPrice}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Difference</p>
                    <p className={`text-2xl font-bold ${prediction.predictedPrice > prediction.currentPrice ? 'text-green-600' : 'text-red-600'}`}>
                      {prediction.predictedPrice > prediction.currentPrice ? '+' : ''}₹{prediction.predictedPrice - prediction.currentPrice}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Demand:</span>
                    <Badge className={getDemandColor(prediction.marketInsights.demand)}>
                      {prediction.marketInsights.demand.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Trend:</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(prediction.marketInsights.trend)}
                      <span className="text-sm capitalize">{prediction.marketInsights.trend}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Seasonality:</span>
                    <span className="text-sm text-muted-foreground">Peak Season</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {prediction.marketInsights.seasonality}
                </p>
              </CardContent>
            </Card>

            {/* Pricing Factors */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Factors Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(prediction.factors).map(([key, factor]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-sm text-muted-foreground">+{factor.impact.toFixed(1)}%</span>
                    </div>
                    <Progress value={factor.impact} className="h-2" />
                    <p className="text-xs text-muted-foreground">{factor.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prediction.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Features Info */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-900">AI-Powered Analysis</h4>
                <p className="text-sm text-purple-700">
                  Our AI analyzes market trends, competitor pricing, material costs, craftsmanship complexity, 
                  and seasonal demand to provide accurate pricing recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Market analysis</Badge>
                  <Badge variant="secondary" className="text-xs">Competitor tracking</Badge>
                  <Badge variant="secondary" className="text-xs">Demand forecasting</Badge>
                  <Badge variant="secondary" className="text-xs">Seasonal trends</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

