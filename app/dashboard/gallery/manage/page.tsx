'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function GalleryManagePage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageTitle, setImageTitle] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const fetchImages = async () => {
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && mounted) {
        setImages(data);
      }
      if (mounted) {
        setLoading(false);
      }
    };

    fetchImages();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const fetchImages = async () => {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setImages(data);
    }
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }
      
      // Проверка размера файла (максимум 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер: 10MB');
        return;
      }

      setSelectedFile(file);
      setShowUploadModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !imageTitle.trim()) return;

    // Валидация длины названия
    if (imageTitle.length > 100) {
      alert('Название слишком длинное (максимум 100 символов)');
      return;
    }

    // Проверка размера файла (максимум 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 10MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('gallery_items')
        .insert([{ 
          image_url: publicUrl,
          title: imageTitle,
          created_by: (await supabase.auth.getUser()).data.user?.id || ''
        }]);

      if (dbError) throw dbError;

      await fetchImages();
      setShowUploadModal(false);
      setImageTitle('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Удалить это изображение из галереи?')) return;

    try {
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('gallery-images')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchImages();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Ошибка при удалении изображения');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Управление галереей
            </h1>
            <p className="text-gray-600">
              Добавляйте и удаляйте примеры работ
            </p>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="gallery-upload-input"
            />
            <label htmlFor="gallery-upload-input">
              <Button size="lg" disabled={uploading} as="span">
                <Upload className="w-5 h-5 mr-2" />
                Загрузить фото
              </Button>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#A682E6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <Card className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Галерея пуста
            </h3>
            <p className="text-gray-600 mb-4">
              Загрузите первое изображение
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id}>
                <Card className="relative group">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={image.image_url}
                      alt={image.title || "Gallery item"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(image.id, image.image_url)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Загрузить изображение</h3>
            
            {selectedFile && (
              <div className="mb-4 relative w-full" style={{ maxHeight: '400px' }}>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full h-auto max-h-[400px] object-contain rounded-xl bg-gray-50"
                />
              </div>
            )}

            <Input
              label="Название изображения"
              placeholder="Например: Портрет в стиле аниме"
              value={imageTitle}
              onChange={(e) => setImageTitle(e.target.value)}
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 -mt-2">{imageTitle.length}/100 символов</p>

            <div className="flex gap-2 mt-4">
              <Button 
                className="flex-1" 
                onClick={handleUpload}
                disabled={uploading || !imageTitle.trim()}
              >
                {uploading ? 'Загрузка...' : 'Загрузить'}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => {
                  setShowUploadModal(false);
                  setImageTitle('');
                  setSelectedFile(null);
                }}
              >
                Отмена
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
