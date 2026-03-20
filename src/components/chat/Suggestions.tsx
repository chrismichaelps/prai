'use client';

/** @UI.Chat.Suggestions */

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestionsProps {
  actions: readonly string[];
  onSelect: (action: string) => void;
}

export const Suggestions: React.FC<SuggestionsProps> = ({ actions, onSelect }) => {
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <div className="flex items-center space-x-2 text-primary/60 group">
        <Sparkles className="w-4 h-4 group-hover:animate-spin-slow transition-transform" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
          Sugerencias de tu panaAI
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onSelect(action)}
            className={cn(
              'flex items-center justify-between text-left px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/70',
              'hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] transition-all duration-300 group shadow-sm active:scale-95'
            )}
          >
            <span className="text-sm font-medium">{action}</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1" />
          </button>
        ))}
      </div>
    </div>
  );
};
