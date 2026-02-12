'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { createClient } from '@/lib/supabase/client';

export const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, loading } = useAuthStore();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/gallery', label: 'Галерея' },
    { href: '/pricing', label: 'Цены' },
    ...(user ? [{ href: '/dashboard', label: 'Личный кабинет' }] : []),
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl shadow-2xl"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 217, 230, 0.7) 0%, rgba(189, 191, 242, 0.6) 50%, rgba(166, 130, 230, 0.5) 100%)',
        boxShadow: '0 8px 32px rgba(166, 130, 230, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold"
            >
              <span 
                className="bg-gradient-to-r from-[#8B5CF6] via-[#A682E6] to-[#C9A9E9] bg-clip-text text-transparent"
                style={{
                  WebkitTextStroke: '0.5px rgba(107, 70, 193, 0.5)',
                  paintOrder: 'stroke fill',
                  filter: 'drop-shadow(0 2px 10px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 30px rgba(166, 130, 230, 0.5)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2))',
                }}
              >
                ArtStudio
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className={`relative text-lg font-semibold transition-colors ${
                    pathname === link.href
                      ? 'text-[#1a0a2e]'
                      : 'text-[#2D1B4E] hover:text-[#1a0a2e]'
                  }`}
                  style={{
                    textShadow: pathname === link.href 
                      ? '0 2px 8px rgba(255, 255, 255, 0.8), 0 0 20px rgba(166, 130, 230, 0.5)'
                      : '0 1px 4px rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#A682E6] via-[#FFD9E6] to-[#A682E6] rounded-full shadow-lg shadow-[#A682E6]/50"
                    />
                  )}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 border-2 border-[#A682E6] border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {profile?.full_name || 'Профиль'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Войти
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Регистрация
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#A682E6]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className={`block py-2 text-lg ${
                    pathname === link.href
                      ? 'text-[#A682E6] font-semibold'
                      : 'text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-8 h-8 border-2 border-[#A682E6] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    {profile?.full_name || 'Профиль'}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="w-full">
                    Войти
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm" className="w-full">
                    Регистрация
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Animated liquid border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#FFD9E6] via-[#A682E6] to-[#BDBFF2]"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#BDBFF2] via-[#FFD9E6] to-[#A682E6]"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
      {/* Liquid wave effect */}
      <svg className="absolute bottom-0 left-0 right-0 w-full h-8 -mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <motion.path
          fill="url(#wave-gradient)"
          d="M0,50 C240,80 480,20 720,50 C960,80 1200,20 1440,50 L1440,100 L0,100 Z"
          animate={{
            d: [
              "M0,50 C240,80 480,20 720,50 C960,80 1200,20 1440,50 L1440,100 L0,100 Z",
              "M0,50 C240,20 480,80 720,50 C960,20 1200,80 1440,50 L1440,100 L0,100 Z",
              "M0,50 C240,80 480,20 720,50 C960,80 1200,20 1440,50 L1440,100 L0,100 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 217, 230, 0.6)" />
            <stop offset="50%" stopColor="rgba(189, 191, 242, 0.5)" />
            <stop offset="100%" stopColor="rgba(166, 130, 230, 0.4)" />
          </linearGradient>
        </defs>
      </svg>
    </motion.nav>
  );
};
