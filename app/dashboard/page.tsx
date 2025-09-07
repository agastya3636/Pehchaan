'use client';

import { useAppStore } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { ArtisanDashboard } from '@/components/dashboard/ArtisanDashboard';
import { BuyerDashboard } from '@/components/dashboard/BuyerDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <LogIn className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-500 mb-4">Please log in to access your dashboard</p>
              <Button className="w-full">Login</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {user?.role === 'artisan' ? <ArtisanDashboard /> : <BuyerDashboard />}
      </div>
    </div>
  );
}