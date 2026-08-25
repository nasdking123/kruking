'use client';

import React, { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <div 
        className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center text-slate-400"
        aria-hidden="true"
      >
        <Sun className="w-4 h-4 opacity-40 text-amber-500" />
      </div>
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : (theme || 'light');
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 shadow-xs'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
      }`}
      aria-label={isDark ? 'เปลี่ยนเป็นโหมดสว่าง (Light Mode)' : 'เปลี่ยนเป็นโหมดมืด (Dark Mode)'}
      title={isDark ? 'โหมดมืด (คลิกเพื่อเปลี่ยนเป็นโหมดสว่าง)' : 'โหมดสว่าง (คลิกเพื่อเปลี่ยนเป็นโหมดมืด)'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </button>
  );
}
