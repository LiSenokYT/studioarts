'use client';

import { cn } from '@/lib/utils/cn';
import { TextareaHTMLAttributes, forwardRef, useState } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, name, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <div>
          <textarea
            ref={ref}
            id={textareaId}
            name={name || textareaId}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 resize-none',
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

Textarea.displayName = 'Textarea';
