import React from 'react';
import { PublicHeader } from '@/components/public/header';
import { PublicFooter } from '@/components/public/footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <PublicHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 w-full outline-none">{children}</main>
      <PublicFooter />
    </div>
  );
}
