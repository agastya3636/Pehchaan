'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ProductFilters } from '@/components/marketplace/ProductFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Grid, List, Package, TrendingUp, Filter } from 'lucide-react';

export default function MarketplacePage() {
  const { language } = useAppStore();
  const { t } = useTranslation(language);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    minPrice: 0,
    maxPrice: 10000,
    region: 'All',
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', filters, sortBy],
    queryFn: () => {
      const apiFilters: any = {};
      if (filters.search) apiFilters.search = filters.search;
      if (filters.category !== 'All') apiFilters.category = filters.category;
      if (filters.region !== 'All') apiFilters.region = filters.region;
      if (filters.minPrice > 0) apiFilters.minPrice = filters.minPrice;
      if (filters.maxPrice < 10000) apiFilters.maxPrice = filters.maxPrice;
      
      return api.getProducts(apiFilters);
    },
  });

  // Sort products based on selection
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return 4.8 - 4.7; // Mock rating sort
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="relative py-20 bg-gradient-to-r from-orange-500 via-red-600 to-orange-700 text-white overflow-hidden animate-gradient-shift">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Traditional Indian patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-2xl animate-float animate-delay-200"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-400/20 rounded-full blur-lg animate-float animate-delay-400"></div>
          {/* Mandala pattern elements */}
          <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white/20 rounded-full animate-rotate-slow"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 border border-white/20 rounded-full animate-rotate-slow animate-delay-300"></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
        </div>
        
        {/* Traditional Indian border pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-sm text-white text-sm font-bold mb-8 border border-white/20 shadow-lg animate-bounce-in">
            <TrendingUp className="h-5 w-5 mr-2 text-yellow-300 animate-pulse" />
            Discover Authentic Craftsmanship
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-white to-orange-200 bg-clip-text text-transparent drop-shadow-2xl animate-bounce-in animate-delay-200">
            Handcrafted Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md animate-slide-up-fade animate-delay-300">
            Explore thousands of unique products made by skilled artisans from across India
          </p>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
              <div className="animate-slide-in-left">
                <h1 className="text-4xl font-bold text-foreground mb-3">Artisan Marketplace</h1>
                <div className="flex items-center gap-3">
                  <p className="text-muted-foreground text-lg">
                    <span className="font-bold text-foreground text-xl">{sortedProducts.length}</span> handcrafted products
                  </p>
                  {filters.search && (
                    <Badge variant="secondary" className="px-3 py-1 bg-orange-100 text-orange-800 border-orange-200">
                      "{filters.search}"
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 animate-slide-in-right">
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 h-10 border-0 bg-card/50 backdrop-blur-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-card/50 backdrop-blur-sm rounded-lg p-1 border-0">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                    <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg"></div>
                    <CardContent className="p-6 space-y-4">
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-orange-50 backdrop-blur-sm animate-scale-in">
                <CardContent className="p-20 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Package className="h-10 w-10 text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">No Products Found</h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                    We couldn't find any products matching your criteria. Try adjusting your filters to discover amazing handcrafted items.
                  </p>
                  <Button 
                    onClick={() => setFilters({
                      search: '',
                      category: 'All',
                      minPrice: 0,
                      maxPrice: 10000,
                      region: 'All',
                    })}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }>
                {sortedProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {sortedProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="px-8">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}