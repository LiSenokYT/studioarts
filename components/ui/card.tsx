'use client';

import { cn } from '@/lib/utils/cn';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'backdrop-blur-xl rounded-3xl p-6 shadow-2xl transition-all duration-300',
          'bg-gradient-to-br from-[#FFD9E6]/60 via-[#BDBFF2]/50 to-[#A682E6]/40',
          'border-2 border-white/60',
          hover && 'hover:shadow-[0_20px_80px_rgba(166,130,230,0.5)] hover:from-[#FFD9E6]/70 hover:via-[#BDBFF2]/60 hover:to-[#A682E6]/50 hover:border-white/80',
          className
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 217, 230, 0.6) 0%, rgba(189, 191, 242, 0.5) 50%, rgba(166, 130, 230, 0.4) 100%)',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
