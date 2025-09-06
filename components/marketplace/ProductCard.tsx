'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, MapPin, Eye } from 'lucide-react';
import { type Product } from '@/lib/mock-data';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, language } = useAppStore();
  const { t } = useTranslation(language);
  const isInWishlist = wishlist.includes(product._id || product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.primaryImage || product.images?.[0]?.url || product.image,
      artisanName: product.artisanName,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const productId = product._id || product.id;
    if (isInWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <Card className="group card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <Link href={`/product/${product._id || product.id}`}>
        <div className="relative overflow-hidden">
          <Image
            src={product.primaryImage || product.images?.[0]?.url || product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-gray-900 hover:bg-white"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 text-gray-900 hover:bg-white p-2"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 p-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.artisanProfile?.isVerified && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                <Star className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/90 text-gray-900 shadow-lg">
              {product.category}
            </Badge>
          </div>

          {/* Stock indicator */}
          {product.inventory?.quantity <= 5 && product.inventory?.quantity > 0 && (
            <Badge variant="destructive" className="absolute top-4 right-4 shadow-lg">
              Only {product.inventory.quantity} left
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-foreground group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Crafted by</span>
              <span className="font-semibold text-foreground">{product.artisanName}</span>
              {product.artisanProfile?.isVerified && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-yellow-600 font-medium">Verified</span>
                </div>
              )}
            </div>
            
            <p className="text-muted-foreground line-clamp-2 leading-relaxed text-sm">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <Badge variant="outline" className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200">
                    GST Included
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1 text-orange-500" />
                  <span className="font-medium">{product.region?.state || product.region}, India</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.isHandmade && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-orange-50 text-orange-700 border-orange-200">
                      Handmade
                    </Badge>
                  )}
                  {product.isEcoFriendly && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200">
                      Eco-Friendly
                    </Badge>
                  )}
                  {product.isFairTrade && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
                      Fair Trade
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <Badge 
                  variant={product.inventory?.quantity > 0 ? 'default' : 'destructive'}
                  className="mb-1"
                >
                  {product.inventory?.quantity > 0 ? `${product.inventory.quantity} in stock` : 'Out of stock'}
                </Badge>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < Math.floor(product.averageRating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{product.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}