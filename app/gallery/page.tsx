'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setItems(data);
      }
      setLoading(false);
    };

    fetchGallery();
  }, [supabase]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#A682E6]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#A682E6] to-[#FFD9E6] bg-clip-text text-transparent">
          Галерея работ
        </h1>
        <p className="text-xl text-gray-600">
          Примеры наших художественных произведений
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">
            Галерея пока пуста. Скоро здесь появятся работы!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="cursor-pointer"
            >
              <Card className="overflow-hidden p-0">
                <div className="relative aspect-square bg-gradient-to-br from-[#A682E6]/10 to-[#FFD9E6]/10">
                  <Image
                    src={item.thumbnail_url || item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Modal for full image */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-[#A682E6]/10 to-[#FFD9E6]/10">
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedItem.title}
                </h2>
                {selectedItem.description && (
                  <p className="text-gray-600">{selectedItem.description}</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
