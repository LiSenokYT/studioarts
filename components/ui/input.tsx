'use client';

import { cn } from '@/lib/utils/cn';
import { InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, name, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <div>
          <input
            ref={ref}
            id={inputId}
            name={name || inputId}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-[#A682E6]/50',
              isFocused
                ? 'border-[#A682E6] bg-white shadow-lg shadow-[#A682E6]/10'
                : 'border-gray-200 bg-gray-50',
              error && 'border-red-400',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
