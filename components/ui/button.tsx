'use client';

import { cn } from '@/lib/utils/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'span';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', as = 'button', children, ...props }, ref) => {
    const baseStyles = 'relative overflow-hidden rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 active:scale-95';
    
    const variants = {
      primary: 'bg-gradient-to-r from-[#A682E6] via-[#C9A9E9] to-[#BDBFF2] text-white shadow-xl shadow-[#A682E6]/40 border-2 border-white/40 hover:shadow-2xl hover:shadow-[#A682E6]/60 hover:border-white/60',
      secondary: 'bg-gradient-to-br from-[#FFD9E6] via-[#FFC9E0] to-[#FFB6D9] text-[#1a0a2e] shadow-xl shadow-[#FFD9E6]/40 border-2 border-white/50 hover:shadow-2xl hover:shadow-[#FFD9E6]/60 hover:border-white/70 font-bold',
      outline: 'border-2 border-[#6B46C1] text-[#1a0a2e] bg-white/60 backdrop-blur-md hover:bg-[#6B46C1] hover:text-white shadow-lg hover:shadow-xl',
      ghost: 'text-[#1a0a2e] hover:bg-white/40 backdrop-blur-sm font-semibold',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const Component = as;

    return (
      <Component
        ref={as === 'button' ? ref : undefined}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={{
          textShadow: variant === 'primary' || variant === 'secondary' ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none',
        }}
        {...(as === 'button' ? props : {})}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = 'Button';
