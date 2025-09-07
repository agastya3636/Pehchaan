'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Video } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  category: z.string().min(1, 'Please select a category'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  tags: z.string(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductUploadModal({ isOpen, onClose }: ProductUploadModalProps) {
  const [uploadStep, setUploadStep] = useState<'details' | 'media' | 'review'>('details');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const watchedCategory = watch('category');

  const categories = ['Textiles', 'Pottery', 'Woodwork', 'Metalwork', 'Leatherwork', 'Jewelry'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Convert files to base64 for now (in production, upload to cloud storage)
      const images = await Promise.all(
        selectedFiles.map(file => 
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
        )
      );

      const productData = {
        name: data.name,
        description: data.description,
        shortDescription: data.description.substring(0, 100),
        price: data.price,
        originalPrice: data.price * 1.2, // 20% markup
        category: data.category,
        subcategory: data.category,
        tags: data.tags.split(',').map(tag => tag.trim()),
        images: images.map((url, index) => ({
          url,
          alt: `${data.name} - Image ${index + 1}`,
          isPrimary: index === 0,
          order: index
        })),
        primaryImage: images[0] || '',
        specifications: {
          material: ['Handcrafted'],
          color: ['Multi-color'],
          technique: ['Traditional'],
          careInstructions: 'Handle with care',
          ageGroup: 'all'
        },
        inventory: {
          quantity: data.stock,
          lowStockThreshold: 5,
          trackInventory: true
        },
        shipping: {
          weight: 500,
          dimensions: { length: 20, width: 20, height: 10 },
          isFragile: false,
          requiresSpecialHandling: false,
          estimatedDeliveryDays: { min: 3, max: 7 }
        },
        status: 'active',
        isFeatured: false,
        isNew: true,
        isHandmade: true,
        isEcoFriendly: true,
        isFairTrade: true,
        region: {
          state: 'Maharashtra',
          city: 'Mumbai',
          pincode: '400001'
        }
      };

      await api.createProduct(productData);
      
      onClose();
      reset();
      setSelectedFiles([]);
      setUploadStep('details');
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (uploadStep === 'details') setUploadStep('media');
    else if (uploadStep === 'media') setUploadStep('review');
  };

  const prevStep = () => {
    if (uploadStep === 'review') setUploadStep('media');
    else if (uploadStep === 'media') setUploadStep('details');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Share your craft with the world. Add details about your handmade product.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {uploadStep === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Handwoven Silk Saree"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setValue('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your product, its materials, and crafting process..."
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="2500"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    placeholder="10"
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-600">{errors.stock.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="handmade, traditional, wedding, silk"
                />
              </div>
            </div>
          )}

          {uploadStep === 'media' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Product Images & Videos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Click to upload or drag and drop
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, MP4 up to 10MB each
                        </span>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <Card key={index} className="relative">
                        <CardContent className="p-2">
                          <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            ) : (
                              <Video className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <p className="text-xs mt-1 truncate">{file.name}</p>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => removeFile(index)}
                          >
                            ×
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {uploadStep === 'review' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review Your Product</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Product Details</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Review all information before publishing
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div><strong>Files:</strong> {selectedFiles.length} selected</div>
                        <div><strong>Category:</strong> {watchedCategory}</div>
                        <div><strong>Status:</strong> Ready to publish</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step Navigation */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={uploadStep === 'details'}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              <div className={`w-2 h-2 rounded-full ${uploadStep === 'details' ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`w-2 h-2 rounded-full ${uploadStep === 'media' ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`w-2 h-2 rounded-full ${uploadStep === 'review' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
            {uploadStep === 'review' ? (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Product'}
              </Button>
            ) : (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}