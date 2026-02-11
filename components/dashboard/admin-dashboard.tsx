'use client';

import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { Users, Package, Image as ImageIcon, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    gallery: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const [usersData, ordersData, galleryData, testimonialsData] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('orders').select('*', { count: 'exact' }),
        supabase.from('gallery_items').select('*', { count: 'exact' }),
        supabase.from('testimonials').select('*', { count: 'exact' }),
      ]);

      setStats({
        users: usersData.count || 0,
        orders: ordersData.count || 0,
        gallery: galleryData.count || 0,
        testimonials: testimonialsData.count || 0,
      });

      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Панель администратора
        </h1>
        <p className="text-gray-600 mb-8">
          Полное управление системой
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#A682E6] to-[#BDBFF2] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Пользователи</p>
                <p className="text-2xl font-bold text-gray-800">{stats.users}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD9E6] to-[#BDBFF2] rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Заказы</p>
                <p className="text-2xl font-bold text-gray-800">{stats.orders}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#A682E6] to-[#FFD9E6] rounded-xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Галерея</p>
                <p className="text-2xl font-bold text-gray-800">{stats.gallery}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#BDBFF2] to-[#A682E6] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Отзывы</p>
                <p className="text-2xl font-bold text-gray-800">{stats.testimonials}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/admin/users">
            <Card hover className="cursor-pointer text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-[#A682E6]" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Управление пользователями
              </h3>
              <p className="text-gray-600">
                Просмотр, блокировка и удаление пользователей
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/orders">
            <Card hover className="cursor-pointer text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-[#A682E6]" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Все заказы
              </h3>
              <p className="text-gray-600">
                Просмотр и управление всеми заказами
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/gallery/manage">
            <Card hover className="cursor-pointer text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-[#A682E6]" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Управление галереей
              </h3>
              <p className="text-gray-600">
                Добавление и удаление работ из галереи
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};
