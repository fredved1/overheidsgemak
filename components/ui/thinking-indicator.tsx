'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ThinkingIndicatorProps {
  isThinking: boolean;
}

export function ThinkingIndicator({ isThinking }: ThinkingIndicatorProps) {
  if (!isThinking) return null;

  return (
    <div className="flex items-center space-x-2 text-gray-500 mt-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Aan het nadenken...</span>
    </div>
  );
}