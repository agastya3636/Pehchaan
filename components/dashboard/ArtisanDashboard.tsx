'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Plus, 
  Package, 
  TrendingUp, 
  ShoppingBag, 
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductUploadModal } from './ProductUploadModal';
import { SocialMediaGenerator } from './SocialMediaGenerator';
import { VideoGenerator } from './VideoGenerator';
import { PricePrediction } from './PricePrediction';
import { CompetitorAnalysis } from './CompetitorAnalysis';

export function ArtisanDashboard() {
  const { user } = useAppStore();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['sales-analytics', user?.id],
    queryFn: () => api.getSalesAnalytics(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['artisan-products', user?.id],
    queryFn: () => api.getProducts(),
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-blue-800/10 dark:from-blue-400/10 dark:via-purple-400/5 dark:to-blue-600/10 rounded-2xl"></div>
        <Card className="relative border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Artisan Dashboard</h1>
                  <p className="text-muted-foreground text-lg">Welcome back, {user?.name}!</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant="default"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                >
                  <CheckCircle className="h-4 w-4" />
                  Verified Artisan
                </Badge>
                <Button onClick={() => setShowUploadModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Revenue</CardTitle>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">₹{analytics?.totalRevenue.toLocaleString() || '0'}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Orders</CardTitle>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{analytics?.totalOrders || '0'}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg. Order Value</CardTitle>
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">₹{analytics?.averageOrderValue || '0'}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Products</CardTitle>
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{products.length}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              2 pending approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="analytics" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-12 bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Products
          </TabsTrigger>
          <TabsTrigger value="ai-tools" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            AI Tools
          </TabsTrigger>
          <TabsTrigger value="marketing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Marketing
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Overview
                </CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics?.monthlyData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: 'none', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Trends
                </CardTitle>
                <CardDescription>Monthly order volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-foreground">My Products</h3>
            <Button onClick={() => setShowUploadModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group card-hover border-0 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge 
                      variant={product.stock > 0 ? 'default' : 'destructive'}
                      className="shadow-lg"
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-1">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>245 views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-foreground font-medium">4.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">AI-Powered Tools</h3>
            <p className="text-muted-foreground mb-8">Leverage artificial intelligence to optimize your business</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PricePrediction />
            <CompetitorAnalysis />
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Marketing & Content Creation</h3>
            <p className="text-muted-foreground mb-8">Create engaging content and reach more customers</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <SocialMediaGenerator />
            <VideoGenerator />
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Platform Integrations</h3>
            <p className="text-muted-foreground mb-8">Expand your reach by connecting to popular marketplaces</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">S</span>
                  </div>
                  <div>
                    <div className="font-bold">Shopify</div>
                    <div className="text-sm text-muted-foreground">E-commerce platform</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sync your products to your Shopify store and reach millions of customers worldwide.
                </p>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Shopify
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">A</span>
                  </div>
                  <div>
                    <div className="font-bold">Amazon</div>
                    <div className="text-sm text-muted-foreground">Global marketplace</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  List your handcrafted products on Amazon and tap into their massive customer base.
                </p>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Amazon
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">F</span>
                  </div>
                  <div>
                    <div className="font-bold">Flipkart</div>
                    <div className="text-sm text-muted-foreground">Indian marketplace</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Reach Indian customers through Flipkart's extensive marketplace network.
                </p>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Flipkart
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ProductUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </div>
  );
}