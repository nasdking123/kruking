'use client';

import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export function QRCodeModal({ isOpen, onClose, title, url }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    url
  )}&margin=10`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('คัดลอกลิงก์สำเร็จ', 'คัดลอก URL เรียบร้อยแล้ว');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="QR Code สำหรับแชร์และพิมพ์"
      description={title}
    >
      <div className="space-y-6 text-center">
        {/* QR Code Container */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 inline-block shadow-md mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt={`QR Code for ${title}`}
            className="w-48 h-48 mx-auto rounded-xl"
          />
          <span className="text-[11px] text-slate-400 font-semibold block mt-3">
            สแกนเพื่อเข้าถึงสื่อการสอนและใบงาน
          </span>
        </div>

        {/* URL Box */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 break-all text-left flex items-center justify-between gap-2">
          <span className="truncate">{url}</span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer"
            title="คัดลอกลิงก์"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <a
            href={qrImageUrl}
            download={`qrcode-${title}.png`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด QR Code</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </Modal>
  );
}
