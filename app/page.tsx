'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Palette, Clock, Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';

const features = [
  {
    icon: Palette,
    title: 'Уникальный стиль',
    description: 'Каждая работа создается с душой и вниманием к деталям',
  },
  {
    icon: Clock,
    title: 'Быстрое выполнение',
    description: 'Соблюдаем сроки и держим вас в курсе процесса',
  },
  {
    icon: Heart,
    title: 'Индивидуальный подход',
    description: 'Учитываем все ваши пожелания и предпочтения',
  },
  {
    icon: Sparkles,
    title: 'Высокое качество',
    description: 'Используем профессиональные материалы и техники',
  },
];

export default function Home() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const { user, loading } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (data) {
        setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, [supabase]);

  return (
    <div className="container mx-auto px-4 py-12 pb-0">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center text-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-6xl md:text-8xl font-bold mb-6"
              style={{
                color: '#1a0a2e',
                WebkitTextStroke: '2px rgba(255, 255, 255, 0.9)',
                paintOrder: 'stroke fill',
                textShadow: `
                  0 0 30px rgba(255, 255, 255, 1),
                  0 0 60px rgba(255, 255, 255, 0.8),
                  0 4px 20px rgba(0, 0, 0, 0.3),
                  0 0 80px rgba(166, 130, 230, 0.5)
                `,
              }}
            >
              Искусство, созданное для вас
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 font-bold px-8 py-4 rounded-3xl backdrop-blur-lg inline-block border-2"
            style={{
              color: '#1a0a2e',
              background: 'linear-gradient(135deg, rgba(255, 217, 230, 0.85) 0%, rgba(189, 191, 242, 0.75) 50%, rgba(166, 130, 230, 0.65) 100%)',
              textShadow: '0 2px 8px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(166, 130, 230, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Превратите ваши идеи в уникальные художественные произведения
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/gallery">
              <Button size="lg">
                <Palette className="w-5 h-5 mr-2" />
                Посмотреть галерею
              </Button>
            </Link>
            <Link href={loading ? "#" : (user ? "/dashboard/orders/new" : "/auth/register")}>
              <Button variant="secondary" size="lg" disabled={loading}>
                <Sparkles className="w-5 h-5 mr-2" />
                Заказать работу
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#1a0a2e]"
          style={{ textShadow: '0 2px 8px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 255, 255, 0.6)' }}
        >
          Почему выбирают нас
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={index % 2 === 0 ? 'md:justify-self-end' : 'md:justify-self-start'}
            >
              <Card className="text-left h-full max-w-md" hover={true}>
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#A682E6] to-[#FFD9E6] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#A682E6]/50">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-[#1a0a2e]" style={{ textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)' }}>
                      {feature.title}
                    </h3>
                    <p className="text-[#2D1B4E] font-medium" style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#1a0a2e]"
            style={{ textShadow: '0 2px 8px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 255, 255, 0.6)' }}
          >
            Отзывы клиентов
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={index % 3 === 1 ? 'lg:mt-8' : index % 3 === 2 ? 'lg:-mt-4' : ''}
              >
                <Card>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 fill-[#FFD9E6] text-[#A682E6] drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-[#1a0a2e] mb-4 italic font-semibold text-lg" style={{ textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)' }}>
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A682E6] to-[#FFD9E6] flex items-center justify-center text-white font-bold text-lg shadow-2xl shadow-[#A682E6]/50">
                      {testimonial.profiles?.full_name?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a0a2e]" style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}>
                        {testimonial.profiles?.full_name || 'Анонимный'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative overflow-hidden">
              {/* Decorative animated blobs */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#A682E6]/20 to-[#FFD9E6]/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, -30, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-[#BDBFF2]/20 to-[#A682E6]/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.4, 1],
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Text content */}
                <div className="text-left space-y-6">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Sparkles className="w-16 h-16 text-[#A682E6] mb-4" style={{ filter: 'drop-shadow(0 4px 12px rgba(166, 130, 230, 0.6))' }} />
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-5xl font-bold text-[#1a0a2e]" style={{ textShadow: '0 2px 8px rgba(255, 255, 255, 0.8)' }}>
                    Готовы начать своё творческое путешествие?
                  </h2>
                  
                  <p className="text-lg text-[#2D1B4E] font-semibold" style={{ textShadow: '0 1px 4px rgba(255, 255, 255, 0.6)' }}>
                    Зарегистрируйтесь прямо сейчас и получите возможность заказать уникальную работу от профессионального художника
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href={loading ? "#" : (user ? "/dashboard/orders/new" : "/auth/register")}>
                      <Button size="lg" disabled={loading}>
                        <Sparkles className="w-5 h-5" />
                        Начать сейчас
                      </Button>
                    </Link>
                    <Link href="/gallery">
                      <Button variant="secondary" size="lg">
                        <Palette className="w-5 h-5" />
                        Посмотреть работы
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Right side - Decorative illustration */}
                <div className="relative h-64 md:h-80 hidden md:block">
                  <motion.div
                    className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-[#A682E6]/30 to-[#FFD9E6]/30 rounded-3xl"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <motion.div
                    className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-[#BDBFF2]/30 to-[#A682E6]/30 rounded-full"
                    animate={{
                      y: [0, -30, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    className="absolute bottom-1/4 left-1/2 w-20 h-20 border-4 border-[#FFD9E6]/40"
                    style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                    animate={{
                      rotate: [0, -360],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <motion.div
                    className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-[#FFD9E6]/40 to-[#BDBFF2]/40 rounded-2xl"
                    animate={{
                      rotate: [0, 180, 360],
                      x: [0, 20, 0],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Lava Lamp Effect at bottom of page */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[250px] overflow-hidden pointer-events-none">
        {/* Darker base for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#6B46C1]/20 via-transparent to-transparent" />
        <svg className="absolute bottom-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250" preserveAspectRatio="none" style={{ display: 'block' }}>
          {/* Large lava blobs with more saturated colors */}
          <ellipse
            cx="200"
            cy="250"
            rx="150"
            ry="120"
            fill="url(#lava-blob-1)"
            fillOpacity="0.8"
            filter="blur(60px)"
          >
            <animate attributeName="cx" values="200;280;200" dur="12s" repeatCount="indefinite" />
            <animate attributeName="cy" values="250;200;250" dur="12s" repeatCount="indefinite" />
            <animate attributeName="rx" values="150;180;150" dur="12s" repeatCount="indefinite" />
            <animate attributeName="ry" values="120;150;120" dur="12s" repeatCount="indefinite" />
          </ellipse>
          <ellipse
            cx="500"
            cy="280"
            rx="180"
            ry="140"
            fill="url(#lava-blob-2)"
            fillOpacity="0.75"
            filter="blur(60px)"
          >
            <animate attributeName="cx" values="500;420;500" dur="15s" repeatCount="indefinite" />
            <animate attributeName="cy" values="280;240;280" dur="15s" repeatCount="indefinite" />
            <animate attributeName="rx" values="180;210;180" dur="15s" repeatCount="indefinite" />
            <animate attributeName="ry" values="140;170;140" dur="15s" repeatCount="indefinite" />
          </ellipse>
          <ellipse
            cx="850"
            cy="260"
            rx="160"
            ry="130"
            fill="url(#lava-blob-3)"
            fillOpacity="0.78"
            filter="blur(60px)"
          >
            <animate attributeName="cx" values="850;920;850" dur="14s" repeatCount="indefinite" />
            <animate attributeName="cy" values="260;220;260" dur="14s" repeatCount="indefinite" />
            <animate attributeName="rx" values="160;190;160" dur="14s" repeatCount="indefinite" />
            <animate attributeName="ry" values="130;160;130" dur="14s" repeatCount="indefinite" />
          </ellipse>
          <ellipse
            cx="1150"
            cy="270"
            rx="170"
            ry="135"
            fill="url(#lava-blob-4)"
            fillOpacity="0.76"
            filter="blur(60px)"
          >
            <animate attributeName="cx" values="1150;1080;1150" dur="13s" repeatCount="indefinite" />
            <animate attributeName="cy" values="270;230;270" dur="13s" repeatCount="indefinite" />
            <animate attributeName="rx" values="170;200;170" dur="13s" repeatCount="indefinite" />
            <animate attributeName="ry" values="135;165;135" dur="13s" repeatCount="indefinite" />
          </ellipse>
          
          {/* Medium lava blobs */}
          <ellipse
            cx="350"
            cy="300"
            rx="120"
            ry="95"
            fill="url(#lava-blob-5)"
            fillOpacity="0.7"
            filter="blur(50px)"
          >
            <animate attributeName="cx" values="350;400;350" dur="10s" repeatCount="indefinite" />
            <animate attributeName="cy" values="300;260;300" dur="10s" repeatCount="indefinite" />
            <animate attributeName="rx" values="120;145;120" dur="10s" repeatCount="indefinite" />
            <animate attributeName="ry" values="95;120;95" dur="10s" repeatCount="indefinite" />
          </ellipse>
          <ellipse
            cx="700"
            cy="290"
            rx="130"
            ry="100"
            fill="url(#lava-blob-6)"
            fillOpacity="0.72"
            filter="blur(50px)"
          >
            <animate attributeName="cx" values="700;650;700" dur="11s" repeatCount="indefinite" />
            <animate attributeName="cy" values="290;250;290" dur="11s" repeatCount="indefinite" />
            <animate attributeName="rx" values="130;155;130" dur="11s" repeatCount="indefinite" />
            <animate attributeName="ry" values="100;125;100" dur="11s" repeatCount="indefinite" />
          </ellipse>
          <ellipse
            cx="1000"
            cy="310"
            rx="115"
            ry="90"
            fill="url(#lava-blob-1)"
            fillOpacity="0.68"
            filter="blur(50px)"
          >
            <animate attributeName="cx" values="1000;1050;1000" dur="9s" repeatCount="indefinite" />
            <animate attributeName="cy" values="310;270;310" dur="9s" repeatCount="indefinite" />
            <animate attributeName="rx" values="115;140;115" dur="9s" repeatCount="indefinite" />
            <animate attributeName="ry" values="90;115;90" dur="9s" repeatCount="indefinite" />
          </ellipse>
          
          {/* Small lava blobs */}
          <ellipse
            cx="150"
            cy="320"
            rx="80"
            ry="65"
            fill="url(#lava-blob-2)"
            fillOpacity="0.65"
            filter="blur(40px)"
          >
            <animate attributeName="cx" values="150;180;150" dur="8s" repeatCount="indefinite" />
            <animate attributeName="cy" values="320;290;320" dur="8s" repeatCount="indefinite" />
            <animate attributeName="rx" values="80;100;80" dur="8s" repeatCount="indefinite" />
            <animate attributeName="ry" values="65;85;65" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse
            cx="600"
            cy="330"
            rx="85"
            ry="70"
            fill="url(#lava-blob-3)"
            fillOpacity="0.67"
            filter="blur(40px)"
          >
            <animate attributeName="cx" values="600;570;600" dur="7s" repeatCount="indefinite" />
            <animate attributeName="cy" values="330;300;330" dur="7s" repeatCount="indefinite" />
            <animate attributeName="rx" values="85;105;85" dur="7s" repeatCount="indefinite" />
            <animate attributeName="ry" values="70;90;70" dur="7s" repeatCount="indefinite" />
          </ellipse>
          <ellipse
            cx="1300"
            cy="315"
            rx="90"
            ry="73"
            fill="url(#lava-blob-4)"
            fillOpacity="0.69"
            filter="blur(40px)"
          >
            <animate attributeName="cx" values="1300;1260;1300" dur="8.5s" repeatCount="indefinite" />
            <animate attributeName="cy" values="315;280;315" dur="8.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="90;110;90" dur="8.5s" repeatCount="indefinite" />
            <animate attributeName="ry" values="73;93;73" dur="8.5s" repeatCount="indefinite" />
          </ellipse>
          
          <defs>
            <radialGradient id="lava-blob-1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
              <stop offset="100%" stopColor="#A682E6" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="lava-blob-2">
              <stop offset="0%" stopColor="#FF69B4" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFD9E6" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="lava-blob-3">
              <stop offset="0%" stopColor="#9D7FEA" stopOpacity="1" />
              <stop offset="100%" stopColor="#BDBFF2" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="lava-blob-4">
              <stop offset="0%" stopColor="#D946EF" stopOpacity="1" />
              <stop offset="100%" stopColor="#E0BBE4" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="lava-blob-5">
              <stop offset="0%" stopColor="#FF85C0" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFC9E0" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="lava-blob-6">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="1" />
              <stop offset="100%" stopColor="#A682E6" stopOpacity="0.2" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mb-12 pt-6 pb-6 backdrop-blur-lg bg-white/10 border-t-2 border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-[#1a0a2e] font-bold text-lg" style={{ textShadow: '0 2px 6px rgba(255, 255, 255, 0.9)' }}>
                ArtStudio
              </p>
              <p className="text-[#2D1B4E] font-semibold" style={{ textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)' }}>
                Искусство, созданное для вас
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-[#1a0a2e] font-semibold" style={{ textShadow: '0 1px 4px rgba(255, 255, 255, 0.8)' }}>
                © 2026 ArtStudio. Все права защищены.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link href="/gallery" className="text-[#2D1B4E] hover:text-[#1a0a2e] font-semibold transition-colors" style={{ textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)' }}>
                Галерея
              </Link>
              <Link href={loading ? "#" : (user ? "/dashboard/orders/new" : "/auth/register")} className="text-[#2D1B4E] hover:text-[#1a0a2e] font-semibold transition-colors" style={{ textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)' }}>
                {loading ? "..." : (user ? "Заказать" : "Регистрация")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
