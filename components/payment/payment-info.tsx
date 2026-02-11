'use client';

import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Copy, CreditCard, Smartphone, Building2, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface PaymentInfoProps {
  amount: number;
}

export const PaymentInfo = ({ amount }: PaymentInfoProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  // ВАЖНО: Замените эти данные на реальные реквизиты художницы
  const paymentData = {
    cardNumber: '2202 2000 0000 0000', // Номер карты
    cardHolder: 'ANNA IVANOVA', // Имя держателя карты
    phone: '+7 (900) 123-45-67', // Номер телефона для СБП
    telegram: '@anna_art', // Telegram для подтверждения
    sberLink: `https://online.sberbank.ru/CSAFront/index.do#/pay/phone?phone=79001234567&amount=${amount}`,
    tinkoffLink: `https://www.tinkoff.ru/rm/ivanova.anna1/zakazart${amount}`,
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Сумма */}
      <Card className="text-center bg-gradient-to-br from-[#A682E6]/10 to-[#FFD9E6]/10">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Сумма к оплате
        </h3>
        <p className="text-5xl font-bold bg-gradient-to-r from-[#A682E6] to-[#FFD9E6] bg-clip-text text-transparent">
          {amount} ₽
        </p>
      </Card>

      {/* Способы оплаты */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Выберите способ оплаты:
        </h3>

        {/* Перевод по номеру карты */}
        <Card hover>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A682E6] to-[#BDBFF2] rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Перевод по номеру карты
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                  <div>
                    <p className="text-sm text-gray-600">Номер карты</p>
                    <p className="font-mono font-semibold text-gray-800">
                      {paymentData.cardNumber}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(paymentData.cardNumber.replace(/\s/g, ''), 'card')}
                  >
                    {copied === 'card' ? '✓' : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-600">Получатель</p>
                  <p className="font-semibold text-gray-800">
                    {paymentData.cardHolder}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* СБП */}
        <Card hover>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD9E6] to-[#BDBFF2] rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Система быстрых платежей (СБП)
              </h4>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-sm text-gray-600">Номер телефона</p>
                  <p className="font-mono font-semibold text-gray-800">
                    {paymentData.phone}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(paymentData.phone.replace(/\D/g, ''), 'phone')}
                >
                  {copied === 'phone' ? '✓' : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Сбербанк Онлайн */}
        <Card hover>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A682E6] to-[#FFD9E6] rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Сбербанк Онлайн
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Быстрый перевод через приложение Сбербанк
              </p>
              <a
                href={paymentData.sberLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" className="w-full">
                  Открыть Сбербанк Онлайн
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* Тинькофф */}
        <Card hover>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#BDBFF2] to-[#A682E6] rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Тинькофф
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Быстрый перевод через приложение Тинькофф
              </p>
              <a
                href={paymentData.tinkoffLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" className="w-full">
                  Открыть Тинькофф
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* Инструкция */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">
              После оплаты:
            </h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Сделайте скриншот подтверждения оплаты</li>
              <li>Загрузите скриншот ниже</li>
              <li>Дождитесь подтверждения от художницы</li>
              <li>После подтверждения работа начнется</li>
            </ol>
            <p className="text-sm text-blue-700 mt-3">
              💬 Вопросы? Напишите в Telegram:{' '}
              <a
                href={`https://t.me/${paymentData.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                {paymentData.telegram}
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
