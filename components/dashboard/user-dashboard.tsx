'use client';

import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Plus, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const statusConfig = {
  pending: { label: 'Ожидает', icon: Clock, color: 'text-yellow-600' },
  accepted: { label: 'Принят', icon: CheckCircle, color: 'text-green-600' },
  rejected: { label: 'Отклонен', icon: XCircle, color: 'text-red-600' },
  discussing: { label: 'Обсуждение', icon: Clock, color: 'text-blue-600' },
  payment_pending: { label: 'Ожидает оплаты', icon: Clock, color: 'text-orange-600' },
  in_progress: { label: 'В работе', icon: Clock, color: 'text-purple-600' },
  completed: { label: 'Завершен', icon: CheckCircle, color: 'text-green-600' },
  cancelled: { label: 'Отменен', icon: XCircle, color: 'text-gray-600' },
};

export const UserDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && mounted) {
        setOrders(data);
      }
      if (mounted) {
        setLoading(false);
      }
    };

    fetchOrders();

    if (!user?.id) return;

    const channel = supabase
      .channel('user-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
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
  }, [user, supabase]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Мои заказы
            </h1>
            <p className="text-gray-600">
              Управляйте своими заказами и отслеживайте их статус
            </p>
          </div>
          <Link href="/dashboard/orders/new">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Новый заказ
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
                <p className="text-2xl font-bold text-gray-800">
                  {orders.length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD9E6] to-[#BDBFF2] rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">В работе</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter((o) => ['discussing', 'payment_pending', 'in_progress'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#A682E6] to-[#FFD9E6] rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Завершено</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter((o) => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#BDBFF2] to-[#A682E6] rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ожидают</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter((o) => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>
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
              У вас пока нет заказов
            </h3>
            <p className="text-gray-600 mb-6">
              Создайте свой первый заказ прямо сейчас!
            </p>
            <Link href="/dashboard/orders/new">
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                Создать заказ
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
              return (
                <div key={order.id}>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Card hover className="cursor-pointer">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <StatusIcon
                              className={`w-6 h-6 mt-1 ${statusConfig[order.status as keyof typeof statusConfig].color}`}
                            />
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                {order.title}
                              </h3>
                              <p className="text-gray-600 line-clamp-2">
                                {order.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium ${statusConfig[order.status as keyof typeof statusConfig].color} bg-current/10`}
                          >
                            {statusConfig[order.status as keyof typeof statusConfig].label}
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
