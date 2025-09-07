'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter, Mic, Search, X, Sparkles } from 'lucide-react';

interface ProductFiltersProps {
  filters: {
    search: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    region: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { language } = useAppStore();
  const { t } = useTranslation(language);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  const categories = ['All', 'Textiles', 'Pottery', 'Woodwork', 'Metalwork', 'Leatherwork', 'Jewelry'];
  const regions = ['All', 'Varanasi', 'Jaipur', 'Jodhpur', 'Gujarat', 'Moradabad', 'Kolhapur'];

  const handleVoiceSearch = () => {
    setIsVoiceRecording(true);
    // Mock voice search - in real app would use Web Speech API
    setTimeout(() => {
      setIsVoiceRecording(false);
      onFiltersChange({ ...filters, search: 'silk saree' });
    }, 2000);
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ 
      ...filters, 
      minPrice: value[0], 
      maxPrice: value[1] 
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'All',
      minPrice: 0,
      maxPrice: 10000,
      region: 'All',
    });
  };

  const hasActiveFilters = filters.search || filters.category !== 'All' || filters.region !== 'All' || filters.minPrice > 0 || filters.maxPrice < 10000;

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder={`${t('search')} handcrafted treasures...`}
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-12 pr-14 h-12 text-base border-0 bg-background/50 focus:bg-background transition-colors"
            />
            <Button
              variant="ghost"
              size="sm"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                isVoiceRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={handleVoiceSearch}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          {isVoiceRecording && (
            <div className="mt-2 flex items-center justify-center text-sm text-red-500">
              <div className="animate-pulse flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Listening...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-foreground">Active Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: "{filters.search}"
                </Badge>
              )}
              {filters.category !== 'All' && (
                <Badge variant="secondary" className="px-3 py-1">
                  {filters.category}
                </Badge>
              )}
              {filters.region !== 'All' && (
                <Badge variant="secondary" className="px-3 py-1">
                  {filters.region}
                </Badge>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                <Badge variant="secondary" className="px-3 py-1">
                  ₹{filters.minPrice} - ₹{filters.maxPrice}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile Filter Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full h-12 border-2">
              <Filter className="h-4 w-4 mr-2" />
              {t('filter')} & Sort
              {hasActiveFilters && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Filters
              </SheetTitle>
              <SheetDescription>
                Refine your search to find the perfect handcrafted products
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent 
                filters={filters} 
                onFiltersChange={onFiltersChange}
                categories={categories}
                regions={regions}
                handlePriceChange={handlePriceChange}
                t={t}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <FilterContent 
          filters={filters} 
          onFiltersChange={onFiltersChange}
          categories={categories}
          regions={regions}
          handlePriceChange={handlePriceChange}
          t={t}
        />
      </div>
    </div>
  );
}

function FilterContent({ 
  filters, 
  onFiltersChange, 
  categories, 
  regions, 
  handlePriceChange, 
  t 
}: any) {
  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('category')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select 
            value={filters.category} 
            onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
          >
            <SelectTrigger className="h-11 border-0 bg-background/50">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: string) => (
                <SelectItem key={category} value={category} className="cursor-pointer">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Region Filter */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('region')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select 
            value={filters.region} 
            onValueChange={(value) => onFiltersChange({ ...filters, region: value })}
          >
            <SelectTrigger className="h-11 border-0 bg-background/50">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region: string) => (
                <SelectItem key={region} value={region} className="cursor-pointer">
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('price')} Range</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-foreground bg-background/50 px-3 py-1 rounded-lg">
              ₹{filters.minPrice.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">to</div>
            <div className="text-sm font-medium text-foreground bg-background/50 px-3 py-1 rounded-lg">
              ₹{filters.maxPrice.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start h-9"
              onClick={() => onFiltersChange({ ...filters, category: 'Textiles' })}
            >
              🧵 Textiles
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start h-9"
              onClick={() => onFiltersChange({ ...filters, category: 'Pottery' })}
            >
              🏺 Pottery
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start h-9"
              onClick={() => onFiltersChange({ ...filters, category: 'Jewelry' })}
            >
              💎 Jewelry
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start h-9"
              onClick={() => onFiltersChange({ ...filters, category: 'Woodwork' })}
            >
              🪵 Woodwork
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}