'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { ArtisanOnboardingModal } from '@/components/artisan/ArtisanOnboardingModal';
import { RegionalSelector } from '@/components/regional/RegionalSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Users, 
  ShoppingBag, 
  Heart, 
  Star, 
  ArrowRight,
  MapPin,
  Award,
  TrendingUp,
  Globe
} from 'lucide-react';

export default function Home() {
  const { language, isAuthenticated } = useAppStore();
  const { t } = useTranslation(language);
  const [showArtisanModal, setShowArtisanModal] = useState(false);

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.getProducts({ featured: true, limit: 6 }),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getStats(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <Navbar />
      
      {/* Hero Section */}
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
            <Sparkles className="h-5 w-5 mr-2 text-yellow-300 animate-pulse" />
            Empowering Artisans, Preserving Heritage
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-white to-orange-200 bg-clip-text text-transparent drop-shadow-2xl animate-bounce-in animate-delay-200">
            पहचान
          </h1>
          <div className="text-2xl md:text-3xl font-bold text-yellow-200 mb-4 drop-shadow-lg animate-slide-up-fade animate-delay-300">
            Pehchaan - The Artisan Empowerment Platform
          </div>
          <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto mb-10 leading-relaxed drop-shadow-md animate-slide-up-fade animate-delay-400">
            Connect with authentic Indian artisans and discover unique handcrafted treasures from every corner of India
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up-fade animate-delay-500">
            <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300 group">
              <span className="group-hover:animate-wiggle inline-block">{t('exploreMarketplace')}</span>
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-white/30 backdrop-blur-sm group"
              onClick={() => setShowArtisanModal(true)}
            >
              <span className="group-hover:animate-wiggle inline-block">{t('joinAsArtisan')}</span>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/90 animate-slide-up-fade animate-delay-600">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="w-2 h-2 bg-green-400 rounded-full group-hover:animate-pulse"></div>
              <span className="font-semibold group-hover:text-green-300 transition-colors">1000+ Artisans</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="w-2 h-2 bg-yellow-400 rounded-full group-hover:animate-pulse"></div>
              <span className="font-semibold group-hover:text-yellow-300 transition-colors">Verified Quality</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:animate-pulse"></div>
              <span className="font-semibold group-hover:text-blue-300 transition-colors">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="w-2 h-2 bg-orange-400 rounded-full group-hover:animate-pulse"></div>
              <span className="font-semibold group-hover:text-orange-300 transition-colors">Authentic Crafts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:to-red-900/20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-500 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              🎯 Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of artisans who have transformed their lives through Pehchaan
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">👥</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform duration-300">
                {stats?.totalArtisans || '2,500+'}
              </div>
              <div className="text-gray-600 font-semibold">Active Artisans</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">🛍️</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-purple-600 mb-2 group-hover:scale-105 transition-transform duration-300">
                {stats?.totalProducts || '15,000+'}
              </div>
              <div className="text-gray-600 font-semibold">Handcrafted Products</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">📦</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-green-600 mb-2 group-hover:scale-105 transition-transform duration-300">
                {stats?.totalOrders || '50,000+'}
              </div>
              <div className="text-gray-600 font-semibold">Orders Completed</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">🗺️</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-orange-600 mb-2 group-hover:scale-105 transition-transform duration-300">
                {stats?.regions || '28+'}
              </div>
              <div className="text-gray-600 font-semibold">Indian States</div>
            </div>
          </div>
        </div>
      </section>

      {/* Indian Craft Categories */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('traditionalCrafts')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the rich diversity of Indian handicrafts from different states and regions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16">
            {[
              { name: 'Kashmiri Shawls', icon: '🧣', region: 'J&K' },
              { name: 'Rajasthani Pottery', icon: '🏺', region: 'Rajasthan' },
              { name: 'Bengali Textiles', icon: '👘', region: 'West Bengal' },
              { name: 'Tamil Jewelry', icon: '💎', region: 'Tamil Nadu' },
              { name: 'Gujarati Embroidery', icon: '🧵', region: 'Gujarat' },
              { name: 'Kerala Woodwork', icon: '🪵', region: 'Kerala' },
            ].map((craft, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
                <div className="text-4xl mb-3">{craft.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{craft.name}</h3>
                <p className="text-xs text-muted-foreground">{craft.region}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Explorer */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20">
        <div className="container mx-auto px-4">
          <RegionalSelector />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full mb-6">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">Trending Now</span>
            </div>
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Handpicked Artisan Treasures
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collection of authentic handcrafted items from master artisans across India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/marketplace">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Explore Full Collection
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Artisan Success Stories */}
      <section className="py-20 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet our talented artisans and discover their incredible journeys
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Priya Sharma",
                craft: "Kashmiri Shawl Artisan",
                location: "Srinagar, J&K",
                story: "From struggling to sell locally to reaching customers across India",
                earnings: "₹2.5L+ monthly",
                image: "🧣",
                quote: "Pehchaan gave me a platform to showcase my family's 3-generation craft tradition"
              },
              {
                name: "Rajesh Kumar",
                craft: "Rajasthani Pottery Master",
                location: "Jaipur, Rajasthan", 
                story: "Transformed his small workshop into a thriving business",
                earnings: "₹1.8L+ monthly",
                image: "🏺",
                quote: "Now I can support my entire family through my craft"
              },
              {
                name: "Lakshmi Devi",
                craft: "Bengali Textile Artist",
                location: "Kolkata, West Bengal",
                story: "From local markets to international recognition",
                earnings: "₹3.2L+ monthly", 
                image: "👘",
                quote: "My handwoven sarees now reach customers worldwide"
              }
            ].map((artisan, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <div className="text-6xl mb-4">{artisan.image}</div>
                <h3 className="text-xl font-bold mb-2">{artisan.name}</h3>
                <p className="text-orange-600 font-semibold mb-2">{artisan.craft}</p>
                <p className="text-sm text-muted-foreground mb-3">{artisan.location}</p>
                <p className="text-sm mb-4 italic">"{artisan.quote}"</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600 font-semibold">{artisan.earnings}</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Success Story
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Pehchaan?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to preserving traditional craftsmanship while empowering artisans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Authentic Craftsmanship</h3>
              <p className="text-muted-foreground">
                Every product is handcrafted by verified artisans using traditional techniques passed down through generations.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Fair Trade</h3>
              <p className="text-muted-foreground">
                We ensure artisans receive fair compensation for their work, supporting their families and communities.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cultural Heritage</h3>
              <p className="text-muted-foreground">
                Help preserve India's rich cultural heritage by supporting traditional art forms and techniques.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Craft Process Showcase */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Behind the Craft</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the traditional techniques and passion that goes into every handcrafted piece
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Material Selection",
                description: "Carefully chosen natural materials from local sources",
                icon: "🌿",
                color: "from-green-500 to-emerald-500"
              },
              {
                step: "2", 
                title: "Traditional Techniques",
                description: "Time-honored methods passed down through generations",
                icon: "✋",
                color: "from-orange-500 to-red-500"
              },
              {
                step: "3",
                title: "Skilled Craftsmanship", 
                description: "Expert artisans working with precision and care",
                icon: "🎨",
                color: "from-blue-500 to-purple-500"
              },
              {
                step: "4",
                title: "Quality Finish",
                description: "Final touches ensuring perfection in every detail",
                icon: "✨",
                color: "from-yellow-500 to-orange-500"
              }
            ].map((process, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
                <div className={`w-16 h-16 bg-gradient-to-r ${process.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{process.icon}</span>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">{process.step}</div>
                <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                <p className="text-sm text-muted-foreground">{process.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Collection Banner */}
      <section className="py-16 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-bold mb-4">Festival Collection 2024</h2>
          <p className="text-xl text-orange-100 mb-6 max-w-2xl mx-auto">
            Celebrate with authentic handcrafted treasures for Diwali, Christmas, and New Year
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge className="bg-white/20 text-white px-4 py-2 hover:bg-white/30 transition-colors duration-300">Diwali Special</Badge>
            <Badge className="bg-white/20 text-white px-4 py-2 hover:bg-white/30 transition-colors duration-300">Christmas Collection</Badge>
            <Badge className="bg-white/20 text-white px-4 py-2 hover:bg-white/30 transition-colors duration-300">New Year Gifts</Badge>
            <Badge className="bg-white/20 text-white px-4 py-2 hover:bg-white/30 transition-colors duration-300">Wedding Collection</Badge>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Whether you're an artisan looking to showcase your work or a buyer seeking authentic handcrafted products, Pehchaan is here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Browse Products
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => setShowArtisanModal(true)}
            >
              {t('becomeArtisan')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 via-gray-800 to-gray-900 text-white py-12 relative overflow-hidden">
        {/* Traditional Indian border pattern */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-red-500 to-gray-700"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <span className="text-2xl">🏺</span>
                </div>
                <div>
                  <div className="font-bold text-xl">पहचान</div>
                  <div className="text-sm text-orange-300">Pehchaan - Artisan Platform</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Empowering artisans and preserving India's rich cultural heritage through authentic handcrafted products.
              </p>
              <div className="flex space-x-2">
                <Badge className="bg-orange-500 text-white">Made in India</Badge>
                <Badge className="bg-green-500 text-white">Eco-Friendly</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
                <li><Link href="/community" className="hover:text-white">Community</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Craft Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/textiles" className="hover:text-orange-300">🧵 Textiles & Embroidery</Link></li>
                <li><Link href="/pottery" className="hover:text-orange-300">🏺 Pottery & Ceramics</Link></li>
                <li><Link href="/jewelry" className="hover:text-orange-300">💎 Jewelry & Metalwork</Link></li>
                <li><Link href="/woodwork" className="hover:text-orange-300">🪵 Woodwork & Carving</Link></li>
                <li><Link href="/paintings" className="hover:text-orange-300">🎨 Paintings & Art</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Regional Specialties</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/kashmir" className="hover:text-orange-300">🧣 Kashmiri Shawls</Link></li>
                <li><Link href="/rajasthan" className="hover:text-orange-300">🏺 Rajasthani Pottery</Link></li>
                <li><Link href="/bengal" className="hover:text-orange-300">👘 Bengali Textiles</Link></li>
                <li><Link href="/tamil" className="hover:text-orange-300">💎 Tamil Jewelry</Link></li>
                <li><Link href="/gujarat" className="hover:text-orange-300">🧵 Gujarati Embroidery</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-400">
                  <span className="text-orange-500">📞</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <span className="text-orange-500">✉️</span>
                  <span>support@pehchaan.in</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <span className="text-orange-500">📍</span>
                  <span>Mumbai, Maharashtra</span>
                </div>
                <div className="flex space-x-3 mt-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 cursor-pointer">
                    <span className="text-sm">f</span>
                  </div>
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 cursor-pointer">
                    <span className="text-sm">t</span>
                  </div>
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-700 cursor-pointer">
                    <span className="text-sm">i</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pehchaan. All rights reserved. Made with ❤️ for Indian artisans.</p>
          </div>
        </div>
      </footer>

      {/* Artisan Onboarding Modal */}
      <ArtisanOnboardingModal 
        isOpen={showArtisanModal} 
        onClose={() => setShowArtisanModal(false)} 
      />
    </div>
  );
}
