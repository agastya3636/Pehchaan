'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  CheckCircle, 
  Star,
  MapPin,
  Package,
  Truck,
  Shield,
  ArrowLeft,
  Plus,
  Minus,
  Eye,
  Award,
  Clock,
  Users,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// Generate static params for dynamic routes
export async function generateStaticParams() {
  // Return empty array for now - Next.js will generate pages on demand
  return [];
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, language } = useAppStore();
  const { t } = useTranslation(language);
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.getProduct(productId),
    enabled: !!productId,
  });

  const { data: artisan } = useQuery({
    queryKey: ['artisan', product?.artisanId],
    queryFn: () => api.getArtisan(product?.artisanId || ''),
    enabled: !!product?.artisanId,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: () => api.getProducts({ category: product?.category }),
    enabled: !!product?.category,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded-lg"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Product not found</h1>
              <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
              <Link href="/marketplace">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.includes(product.id);
  const mockImages = [product.image, product.image, product.image]; // Mock multiple images

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        artisanName: product.artisanName,
      });
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="relative group">
                <img
                  src={mockImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Image Overlay Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.artisanVerified && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t('verifiedArtisan')}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 dark:bg-gray-900/90 text-foreground shadow-lg">
                    {product.category}
                  </Badge>
                </div>

                {/* Stock indicator */}
                {product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="destructive" className="absolute top-4 right-4 shadow-lg animate-pulse">
                    Only {product.stock} left!
                  </Badge>
                )}

                {/* Image Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    {mockImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          selectedImageIndex === index 
                            ? 'bg-white shadow-lg scale-125' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-3">
              {mockImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                    selectedImageIndex === index 
                      ? 'ring-2 ring-primary shadow-lg scale-105' 
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-3 leading-tight">{product.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">(4.8)</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">127 reviews</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={`h-12 w-12 rounded-full ${isInWishlist ? 'text-red-500 bg-red-50 dark:bg-red-950' : 'hover:bg-muted'}`}
                >
                  <Heart className={`h-6 w-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{product.region}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {product.stock > 0 ? `${product.stock} ${t('inStock')}` : t('outOfStock')}
                  </span>
                </div>
              </div>
            </div>

            {/* Artisan Info Card */}
            {artisan && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={artisan.avatar}
                        alt={artisan.name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
                      />
                      {artisan.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-lg text-foreground">{artisan.name}</h3>
                        {artisan.verified && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="font-medium text-foreground">{artisan.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>{artisan.totalSales} sales</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Member since {new Date(artisan.joinedAt).getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/artisan/${artisan.id}`}>
                      <Button variant="outline" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Details Tabs */}
            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <Tabs defaultValue="description" className="w-full">
                <div className="border-b border-border/50">
                  <TabsList className="grid w-full grid-cols-3 bg-transparent h-12">
                    <TabsTrigger value="description" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="specifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="description" className="p-6 space-y-4">
                  <p className="text-foreground leading-relaxed text-lg">{product.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Crafting Process</h4>
                    <p className="text-muted-foreground">
                      This exquisite piece is handcrafted using traditional techniques passed down through generations. 
                      Each item is unique and may have slight variations that add to its authentic charm.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Care Instructions</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Handle with care to preserve the craftsmanship</li>
                      <li>• Store in a dry place away from direct sunlight</li>
                      <li>• Clean gently with appropriate methods for the material</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Category</span>
                        <p className="text-foreground">{product.category}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Region</span>
                        <p className="text-foreground">{product.region}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Stock</span>
                        <p className="text-foreground">{product.stock} available</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Artisan</span>
                        <p className="text-foreground">{product.artisanName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Added</span>
                        <p className="text-foreground">
                          {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">SKU</span>
                        <p className="text-foreground font-mono">PH-{product.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">Customer Reviews</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">4.8 out of 5 (127 reviews)</span>
                      </div>
                    </div>
                    <Button variant="outline">Write Review</Button>
                  </div>

                  {/* Mock Reviews */}
                  <div className="space-y-4">
                    {[
                      { name: 'Priya S.', rating: 5, comment: 'Absolutely beautiful craftsmanship! The quality exceeded my expectations.', date: '2024-02-01' },
                      { name: 'Rahul M.', rating: 4, comment: 'Great product, fast delivery. Very happy with my purchase.', date: '2024-01-28' },
                      { name: 'Anjali K.', rating: 5, comment: 'Authentic and well-made. Perfect for the festival season!', date: '2024-01-25' }
                    ].map((review, index) => (
                      <Card key={index} className="border-0 bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {review.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-foreground">{review.name}</span>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-muted-foreground text-sm">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Tags */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Product Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Purchase Section */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/50 p-4 lg:hidden">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{product.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlistToggle}
                className={isInWishlist ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
              <Button onClick={handleAddToCart} size="lg" disabled={product.stock === 0}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t('addToCart')}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Purchase Card */}
        <div className="hidden lg:block fixed top-24 right-8 w-80 z-40">
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-xl">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  ₹{product.price.toLocaleString()}
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quantity</Label>
                <div className="flex items-center justify-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold text-foreground w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="h-10 w-10 rounded-full"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('addToCart')}
                </Button>

                <Button variant="secondary" className="w-full h-12 font-semibold" size="lg">
                  {t('buyNow')}
                </Button>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleWishlistToggle}
                    variant="outline"
                    className={`flex-1 ${isInWishlist ? 'text-red-500 border-red-500 bg-red-50 dark:bg-red-950' : ''}`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                    {isInWishlist ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center space-x-3 text-sm">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-muted-foreground">Free shipping on orders above ₹1000</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Secure payment & buyer protection</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-muted-foreground">Authentic handcrafted guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">You Might Also Like</h2>
              <p className="text-muted-foreground text-lg">Discover more beautiful handcrafted items</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Social Proof Section */}
        <Card className="mt-16 border-0 shadow-xl bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950 dark:via-purple-950 dark:to-blue-950">
          <CardContent className="p-8 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">10,000+</h3>
                <p className="text-muted-foreground">Happy Customers</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">500+</h3>
                <p className="text-muted-foreground">Verified Artisans</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">4.9/5</h3>
                <p className="text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}