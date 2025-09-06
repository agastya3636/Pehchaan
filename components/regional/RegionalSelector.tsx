'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Palette } from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/lib/store';

interface RegionalData {
  state: string;
  code: string;
  crafts: string[];
  artisans: number;
  specialties: string[];
  festivals: string[];
  colors: string[];
}

const regionalData: RegionalData[] = [
  {
    state: 'Rajasthan',
    code: 'RJ',
    crafts: ['Pottery', 'Textiles', 'Jewelry', 'Leather Work'],
    artisans: 250,
    specialties: ['Blue Pottery', 'Bandhani', 'Kundan Jewelry'],
    festivals: ['Pushkar Fair', 'Desert Festival'],
    colors: ['#FF6B35', '#F7931E', '#FFD23F']
  },
  {
    state: 'Gujarat',
    code: 'GJ',
    crafts: ['Embroidery', 'Woodwork', 'Metalwork', 'Textiles'],
    artisans: 180,
    specialties: ['Kutch Embroidery', 'Patola Silk', 'Wooden Toys'],
    festivals: ['Navratri', 'Kite Festival'],
    colors: ['#E53E3E', '#DD6B20', '#D69E2E']
  },
  {
    state: 'Kashmir',
    code: 'JK',
    crafts: ['Shawls', 'Carpets', 'Woodwork', 'Paper Mache'],
    artisans: 120,
    specialties: ['Pashmina Shawls', 'Kashmiri Carpets', 'Walnut Wood'],
    festivals: ['Tulip Festival', 'Shikara Festival'],
    colors: ['#3182CE', '#2B6CB0', '#2C5282']
  },
  {
    state: 'West Bengal',
    code: 'WB',
    crafts: ['Textiles', 'Pottery', 'Metalwork', 'Paintings'],
    artisans: 200,
    specialties: ['Kantha Embroidery', 'Terracotta', 'Dhokra Art'],
    festivals: ['Durga Puja', 'Kali Puja'],
    colors: ['#9F7AEA', '#805AD5', '#6B46C1']
  },
  {
    state: 'Tamil Nadu',
    code: 'TN',
    crafts: ['Bronze Work', 'Textiles', 'Woodwork', 'Stone Carving'],
    artisans: 160,
    specialties: ['Tanjore Paintings', 'Silk Sarees', 'Bronze Idols'],
    festivals: ['Pongal', 'Tamil New Year'],
    colors: ['#F56565', '#ED8936', '#ECC94B']
  },
  {
    state: 'Kerala',
    code: 'KL',
    crafts: ['Woodwork', 'Metalwork', 'Textiles', 'Coir Work'],
    artisans: 140,
    specialties: ['Rosewood Carving', 'Coir Products', 'Kasavu Sarees'],
    festivals: ['Onam', 'Vishu'],
    colors: ['#38A169', '#2F855A', '#276749']
  }
];

export function RegionalSelector() {
  const { language } = useAppStore();
  const { t } = useTranslation(language);
  const [selectedRegion, setSelectedRegion] = useState<RegionalData | null>(null);

  const handleRegionChange = (stateCode: string) => {
    const region = regionalData.find(r => r.code === stateCode);
    setSelectedRegion(region || null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t('exploreByRegion')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('discoverRegionalCrafts')}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Select onValueChange={handleRegionChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('selectYourRegion')} />
          </SelectTrigger>
          <SelectContent>
            {regionalData.map((region) => (
              <SelectItem key={region.code} value={region.code}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{region.state}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedRegion && (
        <Card className="animate-slide-up-fade border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                   style={{ background: `linear-gradient(135deg, ${selectedRegion.colors[0]}, ${selectedRegion.colors[1]})` }}>
                {selectedRegion.code}
              </div>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {selectedRegion.state}
              </h4>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{selectedRegion.artisans} Artisans</span>
                </div>
                <div className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  <span>{selectedRegion.crafts.length} Craft Types</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  {t('popularCrafts')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedRegion.crafts.map((craft, index) => (
                    <Badge 
                      key={craft} 
                      className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200 hover:from-orange-200 hover:to-red-200 transition-all duration-300 animate-bounce-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {craft}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-800 dark:text-white mb-2">
                  {t('specialties')}
                </h5>
                <div className="space-y-1">
                  {selectedRegion.specialties.map((specialty, index) => (
                    <div 
                      key={specialty}
                      className="text-sm text-gray-600 dark:text-gray-400 animate-slide-up-fade"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      • {specialty}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-800 dark:text-white mb-2">
                  {t('festivals')}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedRegion.festivals.map((festival, index) => (
                    <Badge 
                      key={festival}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-300 animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {festival}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
