'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PaymentInfo } from '@/components/payment/payment-info';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';
import {
  ArrowLeft,
  Send,
  Download,
  CheckCircle,
  XCircle,
  DollarSign,
  Upload,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Image from 'next/image';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [paymentRejectionReason, setPaymentRejectionReason] = useState('');
  const [price, setPrice] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [finalWorkFile, setFinalWorkFile] = useState<File | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showPaymentRejectModal, setShowPaymentRejectModal] = useState(false);
  const [messageImage, setMessageImage] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const supabase = createClient();
  
  const orderId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    let mounted = true;

    const fetchOrder = async () => {
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          user:user_id (
            full_name,
            email
          ),
          artist:artist_id (
            full_name,
            email
          )
        `)
        .eq('id', orderId)
        .single();

      if (data && mounted) {
        setOrder(data);
      }
      if (mounted) {
        setLoading(false);
      }
    };

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            full_name,
            email
          )
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (data && mounted) {
        setMessages(data);
      }
    };

    fetchOrder();
    fetchMessages();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`,
        },
        () => {
          if (mounted) fetchMessages();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        () => {
          if (mounted) fetchOrder();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [orderId, user, router, supabase]);

  const sendMessage = useCallback(async () => {
    if ((!newMessage.trim() && !messageImage) || !user?.id) return;

    // Защита от спама - минимум 1 секунда между сообщениями
    const now = Date.now();
    const lastMessageTime = localStorage.getItem('lastMessageTime');
    if (lastMessageTime && now - parseInt(lastMessageTime) < 1000) {
      alert('Подождите немного перед отправкой следующего сообщения');
      return;
    }

    // Ограничение длины сообщения
    if (newMessage.length > 1000) {
      alert('Сообщение слишком длинное (максимум 1000 символов)');
      return;
    }

    setSending(true);
    try {
      let imageUrl = null;

      if (messageImage) {
        // Проверка размера файла (максимум 5MB)
        if (messageImage.size > 5 * 1024 * 1024) {
          alert('Файл слишком большой. Максимальный размер: 5MB');
          setSending(false);
          return;
        }

        const fileExt = messageImage.name.split('.').pop();
        const fileName = `${orderId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('order-images')
          .upload(fileName, messageImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('order-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      await supabase.from('messages').insert({
        order_id: orderId,
        sender_id: user.id,
        content: newMessage.trim() || '📷 Изображение',
        image_url: imageUrl,
      });

      setNewMessage('');
      setMessageImage(null);
      localStorage.setItem('lastMessageTime', now.toString());
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка отправки сообщения');
    } finally {
      setSending(false);
    }
  }, [newMessage, messageImage, user?.id, orderId, supabase]);

  const handleAcceptOrder = async () => {
    await supabase
      .from('orders')
      .update({
        status: 'discussing',
        artist_id: user?.id,
      })
      .eq('id', orderId);
  };

  const handleRejectOrder = async () => {
    await supabase
      .from('orders')
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason,
      })
      .eq('id', orderId);

    setShowRejectModal(false);
  };

  const handleSetPrice = async () => {
    await supabase
      .from('orders')
      .update({
        status: 'payment_pending',
        price: parseFloat(price),
      })
      .eq('id', orderId);

    setShowPriceModal(false);
  };

  const handleUploadPaymentScreenshot = async () => {
    if (!paymentScreenshot) return;

    setUploading(true);
    try {
      const fileExt = paymentScreenshot.name.split('.').pop();
      const fileName = `${orderId}/payment.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('order-images')
        .upload(fileName, paymentScreenshot, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('order-images')
        .getPublicUrl(fileName);

      await supabase
        .from('orders')
        .update({
          payment_screenshot_url: publicUrl,
        })
        .eq('id', orderId);

      setPaymentScreenshot(null);
    } catch (error) {
      console.error('Error uploading payment screenshot:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmPayment = async () => {
    await supabase
      .from('orders')
      .update({
        status: 'in_progress',
      })
      .eq('id', orderId);
  };

  const handleRejectPayment = async () => {
    await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_rejection_reason: paymentRejectionReason,
      })
      .eq('id', orderId);

    setShowPaymentRejectModal(false);
  };

  const handleCompleteOrder = async () => {
    if (!finalWorkFile) return;

    try {
      const fileExt = finalWorkFile.name.split('.').pop();
      const fileName = `${orderId}/final.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('final-works')
        .upload(fileName, finalWorkFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('final-works')
        .getPublicUrl(fileName);

      await supabase
        .from('orders')
        .update({
          status: 'completed',
          final_work_url: publicUrl,
        })
        .eq('id', orderId);

      setShowCompleteModal(false);
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  if (loading || !order) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#A682E6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const canChat = useMemo(() => ['discussing', 'payment_pending', 'in_progress'].includes(order?.status || ''), [order?.status]);
  const isArtistOrAdmin = useMemo(() => profile?.role === 'artist' || profile?.role === 'admin', [profile?.role]);
  const isCancelled = useMemo(() => order?.status === 'cancelled', [order?.status]);
  const isCompleted = useMemo(() => order?.status === 'completed', [order?.status]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {order.title}
              </h2>

              <div className="space-y-4">
                {isArtistOrAdmin && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Клиент</p>
                    <p className="text-gray-800 font-medium">{order.user?.full_name || 'Без имени'}</p>
                    <p className="text-sm text-gray-600">{order.user?.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Статус</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isCancelled 
                      ? 'bg-red-100 text-red-600'
                      : 'bg-[#A682E6]/10 text-[#A682E6]'
                  }`}>
                    {(() => {
                      const statusMap: Record<string, string> = {
                        'pending': 'Ожидает принятия',
                        'discussing': 'Обсуждение',
                        'payment_pending': 'Ожидает оплаты',
                        'in_progress': 'В работе',
                        'completed': 'Завершен',
                        'rejected': 'Отклонен',
                        'cancelled': 'Отменен'
                      };
                      return statusMap[order.status] || order.status;
                    })()}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Описание</p>
                  <p className="text-gray-800">{order.description}</p>
                </div>

                {order.price && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Цена</p>
                    <p className="text-2xl font-bold text-[#A682E6]">
                      {order.price} ₽
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">Создан</p>
                  <p className="text-gray-800">
                    {format(new Date(order.created_at), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                  </p>
                </div>

                {order.reference_images && order.reference_images.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Референсы</p>
                    <div className="grid grid-cols-2 gap-2">
                      {order.reference_images.map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                          <Image 
                            src={img} 
                            alt={`Reference ${idx + 1}`} 
                            fill 
                            sizes="(max-width: 768px) 50vw, 200px"
                            className="object-cover" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.final_work_url && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Готовая работа</p>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={async () => {
                        try {
                          const response = await fetch(order.final_work_url);
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `final-work-${orderId}.${blob.type.split('/')[1]}`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (error) {
                          console.error('Download error:', error);
                        }
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Скачать работу
                    </Button>
                  </div>
                )}

                {order.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-sm text-red-600 font-medium mb-1">Причина отказа:</p>
                    <p className="text-red-800">{order.rejection_reason}</p>
                  </div>
                )}

                {order.payment_rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-sm text-red-600 font-medium mb-1">Причина отмены:</p>
                    <p className="text-red-800">{order.payment_rejection_reason}</p>
                  </div>
                )}
              </div>

              {/* Artist Actions */}
              {isArtistOrAdmin && !isCancelled && (
                <div className="mt-6 space-y-2">
                  {order.status === 'pending' && (
                    <>
                      <Button className="w-full" onClick={handleAcceptOrder}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Принять заказ
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowRejectModal(true)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Отклонить
                      </Button>
                    </>
                  )}

                  {order.status === 'discussing' && (
                    <Button className="w-full" onClick={() => setShowPriceModal(true)}>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Выставить цену
                    </Button>
                  )}

                  {order.status === 'payment_pending' && order.payment_screenshot_url && (
                    <>
                      <Button className="w-full" onClick={handleConfirmPayment}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Подтвердить оплату
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowPaymentRejectModal(true)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Отклонить оплату
                      </Button>
                    </>
                  )}

                  {order.status === 'in_progress' && (
                    <Button className="w-full" onClick={() => setShowCompleteModal(true)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Завершить заказ
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Section */}
            {order.status === 'payment_pending' && !isArtistOrAdmin && (
              <Card>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Оплата заказа</h3>
                
                <PaymentInfo amount={order.price} />

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Загрузите скриншот оплаты:
                  </h4>
                  
                  {order.payment_screenshot_url ? (
                    <div className="space-y-3">
                      <div className="relative w-full h-64 rounded-xl overflow-hidden">
                        <Image
                          src={order.payment_screenshot_url}
                          alt="Payment screenshot"
                          fill
                          sizes="(max-width: 768px) 100vw, 600px"
                          className="object-contain bg-gray-50"
                        />
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <p className="text-sm text-blue-800">
                          Скриншот загружен. Ожидайте подтверждения от художницы.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                          className="hidden"
                          id="payment-screenshot-upload"
                        />
                        <label
                          htmlFor="payment-screenshot-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-600">
                            {paymentScreenshot ? paymentScreenshot.name : 'Загрузите скриншот оплаты'}
                          </p>
                        </label>
                      </div>
                      {paymentScreenshot && (
                        <Button
                          className="w-full"
                          onClick={handleUploadPaymentScreenshot}
                          disabled={uploading}
                        >
                          {uploading ? 'Загрузка...' : 'Отправить скриншот'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Payment Screenshot for Artist */}
            {order.status === 'payment_pending' && isArtistOrAdmin && order.payment_screenshot_url && (
              <Card>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Скриншот оплаты от клиента
                </h3>
                <div className="relative w-full h-96 rounded-xl overflow-hidden">
                  <Image
                    src={order.payment_screenshot_url}
                    alt="Payment screenshot"
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-contain bg-gray-50"
                  />
                </div>
              </Card>
            )}

            {/* Chat */}
            {!isCancelled && !isCompleted && (
              <Card className="h-[600px] flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Чат</h3>

                {!canChat ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <p>Чат будет доступен после принятия заказа</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.map((msg) => {
                        const isOwn = msg.sender_id === user?.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                isOwn
                                  ? 'bg-gradient-to-r from-[#A682E6] to-[#BDBFF2] text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="text-sm font-medium mb-1">
                                {msg.sender?.full_name || msg.sender?.email}
                              </p>
                              <p>{msg.content}</p>
                              {msg.image_url && (
                                <div 
                                  className="mt-2 relative w-48 h-48 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setSelectedImage(msg.image_url)}
                                >
                                  <Image 
                                    src={msg.image_url} 
                                    alt="Message attachment" 
                                    fill 
                                    sizes="192px"
                                    className="object-cover" 
                                  />
                                </div>
                              )}
                              <p className="text-xs mt-1 opacity-70">
                                {format(new Date(msg.created_at), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      {messageImage && (
                        <div className="relative inline-block">
                          <img
                            src={URL.createObjectURL(messageImage)}
                            alt="Preview"
                            className="h-20 rounded-lg"
                          />
                          <button
                            onClick={() => setMessageImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setMessageImage(e.target.files?.[0] || null)}
                          className="hidden"
                          id="message-image-upload"
                        />
                        <label htmlFor="message-image-upload">
                          <Button variant="outline" size="sm" as="span">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </label>
                        <Input
                          placeholder="Введите сообщение..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                          maxLength={1000}
                        />
                        <Button onClick={sendMessage} disabled={sending || (!newMessage.trim() && !messageImage)}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      {newMessage.length > 900 && (
                        <p className="text-xs text-orange-600 mt-1">
                          {newMessage.length}/1000 символов
                        </p>
                      )}
                    </div>
                  </>
                )}
              </Card>
            )}

            {isCompleted && (
              <Card className="h-[600px] flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Чат</h3>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                            isOwn
                              ? 'bg-gradient-to-r from-[#A682E6] to-[#BDBFF2] text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">
                            {msg.sender?.full_name || msg.sender?.email}
                          </p>
                          <p>{msg.content}</p>
                          {msg.image_url && (
                            <div 
                              className="mt-2 relative w-48 h-48 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedImage(msg.image_url)}
                            >
                              <Image 
                                src={msg.image_url} 
                                alt="Message attachment" 
                                fill 
                                sizes="192px"
                                className="object-cover" 
                              />
                            </div>
                          )}
                          <p className="text-xs mt-1 opacity-70">
                            {format(new Date(msg.created_at), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                  <p className="text-sm text-blue-800">
                    Заказ завершен. Чат доступен только для просмотра.
                  </p>
                </div>
              </Card>
            )}

            {isCancelled && (
              <Card className="bg-red-50 border-red-200">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <h3 className="text-xl font-bold text-red-900 mb-1">
                      Заказ отменен
                    </h3>
                    <p className="text-red-700">
                      Чат и дальнейшие действия недоступны
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Отклонить заказ</h3>
            <Textarea
              label="Причина отказа"
              placeholder="Укажите причину..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" onClick={handleRejectOrder}>
                Отклонить
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowRejectModal(false)}>
                Отмена
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showPriceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Выставить цену</h3>
            <Input
              type="number"
              label="Цена (₽)"
              placeholder="5000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" onClick={handleSetPrice}>
                Выставить
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowPriceModal(false)}>
                Отмена
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showPaymentRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Отклонить оплату</h3>
            <Textarea
              label="Причина отклонения"
              placeholder="Укажите причину (например: неверная сумма, не тот получатель)..."
              value={paymentRejectionReason}
              onChange={(e) => setPaymentRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 my-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Заказ будет отменен и чат станет недоступен
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleRejectPayment}>
                Отклонить оплату
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowPaymentRejectModal(false)}>
                Отмена
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Завершить заказ</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFinalWorkFile(e.target.files?.[0] || null)}
                className="hidden"
                id="final-work-upload"
              />
              <label htmlFor="final-work-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-600">
                  {finalWorkFile ? finalWorkFile.name : 'Загрузите готовую работу'}
                </p>
              </label>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" onClick={handleCompleteOrder} disabled={!finalWorkFile}>
                Завершить
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowCompleteModal(false)}>
                Отмена
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl z-10"
            >
              ×
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Full size"
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
