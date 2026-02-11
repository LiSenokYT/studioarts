'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { TextareaHTMLAttributes, forwardRef, useState } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </motion.label>
        )}
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <textarea
            ref={ref}
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
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
