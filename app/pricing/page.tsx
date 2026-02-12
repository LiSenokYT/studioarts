'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Palette, Sparkles } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#A682E6] to-[#FFD9E6] bg-clip-text text-transparent">
            Цены и условия камышек
          </h1>
          <p className="text-xl text-gray-600">
            Полная предоплата после скетча - сбор
          </p>
          <p className="text-lg text-gray-600">
            Дедлайн 2 недели-полтора месяца (зависит от масштабности заказа)
          </p>
        </div>

        {/* Обычная стилистика */}
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-8 h-8 text-[#A682E6]" />
            <h2 className="text-3xl font-bold text-gray-800">Обычная стилистика</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#FFD9E6]/30 to-[#BDBFF2]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Бюст</h3>
                <p className="text-4xl font-bold text-[#A682E6] mb-2">1400 ₽</p>
                <p className="text-gray-600">Портрет по плечи</p>
              </div>

              <div className="bg-gradient-to-br from-[#BDBFF2]/30 to-[#A682E6]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Халф</h3>
                <p className="text-4xl font-bold text-[#A682E6] mb-2">1900 ₽</p>
                <p className="text-gray-600">По пояс</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#A682E6]/30 to-[#FFD9E6]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Полнорост</h3>
                <p className="text-4xl font-bold text-[#A682E6] mb-2">2400 ₽</p>
                <p className="text-gray-600">В полный рост</p>
              </div>

              <div className="bg-gradient-to-br from-[#FFD9E6]/30 to-[#A682E6]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Фон</h3>
                <p className="text-4xl font-bold text-[#A682E6] mb-2">от 800 ₽</p>
                <p className="text-gray-600">В зависимости от сложности</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Чиби стилистика */}
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-[#FFD9E6]" />
            <h2 className="text-3xl font-bold text-gray-800">Чиби стилистика</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#FFD9E6]/30 to-[#BDBFF2]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Бюст</h3>
                <p className="text-4xl font-bold text-[#FFD9E6] mb-2">700 ₽</p>
                <p className="text-gray-600">Портрет по плечи</p>
              </div>

              <div className="bg-gradient-to-br from-[#BDBFF2]/30 to-[#A682E6]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Халф</h3>
                <p className="text-4xl font-bold text-[#FFD9E6] mb-2">1000 ₽</p>
                <p className="text-gray-600">По пояс</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#A682E6]/30 to-[#FFD9E6]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Полнорост</h3>
                <p className="text-4xl font-bold text-[#FFD9E6] mb-2">1300 ₽</p>
                <p className="text-gray-600">В полный рост</p>
              </div>

              <div className="bg-gradient-to-br from-[#FFD9E6]/30 to-[#A682E6]/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Фон</h3>
                <p className="text-4xl font-bold text-[#FFD9E6] mb-2">от 500 ₽</p>
                <p className="text-gray-600">В зависимости от сложности</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Дополнительная информация */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Дополнительная информация</h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-semibold text-red-800">Не рисую:</p>
              <p className="text-red-700">Сильно мускулистых людей, меха, слишком детальные заказы</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-semibold text-blue-800">Коммерческое использование:</p>
              <p className="text-blue-700">400 ₽</p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <p className="font-semibold text-purple-800">NSFW:</p>
              <p className="text-purple-700">400 ₽ (прон гуро и тд)</p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link href="/auth/register">
            <Button size="lg" className="text-xl px-12 py-6">
              <Sparkles className="w-6 h-6 mr-2" />
              Заказать работу
            </Button>
          </Link>
          <p className="text-gray-600 mt-4">
            Зарегистрируйтесь, чтобы оформить заказ
          </p>
        </div>
      </div>
    </div>
  );
}
