import React from 'react';
import Image from 'next/image';
import { ThemeToggle } from '@/app/components/ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="container mx-auto max-w-7xl h-20 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br rounded-xl flex items-center justify-center shadow-lg">
            <Image src="https://a.espncdn.com/i/teamlogos/nba/500/lal.png" alt="Lakers Logo" width={48} height={48} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Lakers AI Dashboard
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};