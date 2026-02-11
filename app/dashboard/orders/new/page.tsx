'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Upload, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewOrderPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuthStore();
  const supabase = createClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Проверка количества файлов
      if (images.length + newFiles.length > 10) {
        alert('Максимум 10 изображений');
        return;
      }

      // Проверка каждого файла
      for (const file of newFiles) {
        if (!file.type.startsWith('image/')) {
          alert('Можно загружать только изображения');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert('Один из файлов слишком большой. Максимальный размер: 10MB');
          return;
        }
      }

      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user?.id) {
      setError('Необходимо войти в систему');
      return;
    }

    // Валидация длины названия
    if (title.length > 100) {
      setError('Название слишком длинное (максимум 100 символов)');
      return;
    }

    // Валидация длины описания
    if (description.length > 2000) {
      setError('Описание слишком длинное (максимум 2000 символов)');
      return;
    }

    // Ограничение количества изображений
    if (images.length > 10) {
      setError('Максимум 10 изображений');
      return;
    }
    
    setUploading(true);

    try {
      const imageUrls: string[] = [];

      for (const image of images) {
        // Проверка размера файла (максимум 10MB)
        if (image.size > 10 * 1024 * 1024) {
          throw new Error('Один из файлов слишком большой. Максимальный размер: 10MB');
        }

        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('order-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('order-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      const { error: insertError } = await supabase.from('orders').insert({
        user_id: user.id,
        title,
        description,
        reference_images: imageUrls,
      });

      if (insertError) throw insertError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ошибка создания заказа');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </Link>

        <Card className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Создать новый заказ
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Название заказа"
              placeholder="Например: Портрет в стиле аниме"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 -mt-4">{title.length}/100 символов</p>

            <Textarea
              label="Описание"
              placeholder="Опишите подробно, что вы хотите заказать..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              maxLength={2000}
              required
            />
            <p className="text-xs text-gray-500 -mt-4">{description.length}/2000 символов</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Референсные изображения (необязательно)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#A682E6] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    Нажмите для загрузки изображений
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    PNG, JPG до 10MB
                  </p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={uploading}
              >
                {uploading ? 'Создание...' : 'Создать заказ'}
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Отмена
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
