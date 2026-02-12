'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Translate common Supabase errors to Russian
        const errorMessages: Record<string, string> = {
          'Invalid login credentials': 'Неверный email или пароль',
          'Email not confirmed': 'Email не подтвержден. Проверьте вашу почту',
          'User not found': 'Пользователь не найден',
          'Invalid email or password': 'Неверный email или пароль',
        };
        throw new Error(errorMessages[error.message] || error.message);
      }

      if (data.user) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#A682E6] to-[#FFD9E6] rounded-2xl flex items-center justify-center">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Вход</h1>
            <p className="text-gray-600">Войдите в свой аккаунт</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Пароль"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    !
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 mb-1">Ошибка входа</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Нет аккаунта?{' '}
              <Link
                href="/auth/register"
                className="text-[#A682E6] hover:underline font-semibold"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
