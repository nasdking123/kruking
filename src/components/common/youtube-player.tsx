'use client';

import React from 'react';
import { getYouTubeEmbedUrl, getYouTubeId } from '@/lib/youtube';
import { AlertCircle } from 'lucide-react';

interface YouTubePlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export function YouTubePlayer({ url, title = 'บทเรียนวิดีโอ YouTube', className = '' }: YouTubePlayerProps) {
  const embedUrl = getYouTubeEmbedUrl(url);
  const videoId = getYouTubeId(url);

  if (!videoId || !embedUrl) {
    return (
      <div className={`p-8 rounded-3xl bg-slate-900 text-slate-400 flex flex-col items-center justify-center gap-2 border border-slate-800 ${className}`}>
        <AlertCircle className="w-8 h-8 text-amber-500" />
        <span className="text-xs font-semibold">ไม่พบวิดีโอ หรือรูปแบบลิงก์ YouTube ไม่ถูกต้อง</span>
        <span className="text-[10px] text-slate-500 font-mono">{url}</span>
      </div>
    );
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-video group ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0 absolute inset-0"
      />
    </div>
  );
}
