'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { Package, Clock, CheckCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const statusConfig = {
  pending: { label: 'Новые', icon: Clock, color: 'text-yellow-600' },
  accepted: { label: 'Принят', icon: CheckCircle, color: 'text-green-600' },
  discussing: { label: 'Обсуждение', icon: Clock, color: 'text-blue-600' },
  payment_pending: { label: 'Ожидает оплаты', icon: DollarSign, color: 'text-orange-600' },
  in_progress: { label: 'В работе', icon: Clock, color: 'text-purple-600' },
  completed: { label: 'Завершен', icon: CheckCircle, color: 'text-green-600' },
};

export const ArtistDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter as any);
      }

      const { data } = await query;

      if (data && mounted) {
        setOrders(data);
      }
      if (mounted) {
        setLoading(false);
      }
    };

    fetchOrders();

    const channel = supabase
      .channel('artist-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          if (mounted) fetchOrders();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [filter, supabase]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    inProgress: orders.filter((o) => ['discussing', 'payment_pending', 'in_progress'].includes(o.status)).length,
    completed: orders.filter((o) => o.status === 'completed').length,
  }), [orders]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Панель художника
            </h1>
            <p className="text-gray-600">
              Управляйте заказами и галереей
            </p>
          </div>
          <Link href="/dashboard/gallery/manage">
            <Button size="lg">
              Управление галереей
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#A682E6] to-[#BDBFF2] rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего заказов</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD9E6] to-[#BDBFF2] rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Новые</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#A682E6] to-[#FFD9E6] rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">В работе</p>
                <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#BDBFF2] to-[#A682E6] rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Завершено</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'Все' },
            { value: 'pending', label: 'Новые' },
            { value: 'discussing', label: 'Обсуждение' },
            { value: 'in_progress', label: 'В работе' },
            { value: 'completed', label: 'Завершенные' },
          ].map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#A682E6] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Нет заказов
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'Пока нет заказов' : 'Нет заказов с этим статусом'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
              return (
                <div key={order.id}>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Card hover className="cursor-pointer">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <StatusIcon
                              className={`w-6 h-6 mt-1 ${statusConfig[order.status as keyof typeof statusConfig]?.color || 'text-gray-600'}`}
                            />
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                {order.title}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">
                                Клиент: {order.profiles?.full_name || order.profiles?.email}
                              </p>
                              <p className="text-gray-600 line-clamp-2">
                                {order.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium ${statusConfig[order.status as keyof typeof statusConfig]?.color || 'text-gray-600'} bg-current/10`}
                          >
                            {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(order.created_at), 'dd MMMM yyyy', { locale: ru })}
                          </span>
                          {order.price && (
                            <span className="text-lg font-bold text-[#A682E6]">
                              {order.price} ₽
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
