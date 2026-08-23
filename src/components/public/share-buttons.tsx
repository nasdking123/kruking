'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, QrCode } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { QRCodeModal } from '@/components/public/qr-code-modal';

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const toast = useToast();

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('คัดลอกลิงก์สำเร็จ', 'คัดลอก URL ลงคลิปบอร์ดแล้ว');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleOpenQr = () => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      setIsQrOpen(true);
    }
  };

  const handleShareFacebook = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        '_blank'
      );
    }
  };

  const handleShareLine = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`,
        '_blank'
      );
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
        '_blank'
      );
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
          <Share2 className="w-3.5 h-3.5" />
          <span>แชร์:</span>
        </span>

        {/* Copy link button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          title="คัดลอกลิงก์"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">คัดลอกแล้ว</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>คัดลอกลิงก์</span>
            </>
          )}
        </button>

        {/* QR Code button */}
        <button
          type="button"
          onClick={handleOpenQr}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          title="สร้าง QR Code"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Code</span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={handleShareFacebook}
          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          title="แชร์ไปยัง Facebook"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </button>

        {/* LINE */}
        <button
          type="button"
          onClick={handleShareLine}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          title="แชร์ไปยัง LINE"
        >
          <span>LINE</span>
        </button>

        {/* X / Twitter */}
        <button
          type="button"
          onClick={handleShareTwitter}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          title="แชร์ไปยัง X (Twitter)"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>X</span>
        </button>
      </div>

      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        title={title}
        url={currentUrl}
      />
    </>
  );
}
