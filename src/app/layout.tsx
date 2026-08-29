import type { Metadata } from 'next';
import { Prompt, Sarabun } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
import { RealtimeContentRefresh } from '@/components/common/realtime-content-refresh';

const prompt = Prompt({
  weight: ['400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sarabun = Sarabun({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ห้องสื่อครูคิง | ศูนย์รวมสื่อการเรียนรู้ นวัตกรรม และห้องเรียนออนไลน์',
    template: '%s | ห้องสื่อครูคิง',
  },
  description: 'แหล่งรวมสื่อการสอน ใบงาน เกมการเรียนรู้ แผนการจัดการเรียนรู้ นวัตกรรม งานวิจัย ห้องเรียนออนไลน์ และเครื่องมือ AI สำหรับครู โดยครูคิง',
  keywords: [
    'ห้องสื่อครูคิง',
    'สื่อการสอน',
    'ใบงาน',
    'เกมการเรียนรู้',
    'แผนการสอน',
    'วิทยาการคำนวณ',
    'Active Learning',
    'AI สำหรับครู',
    'ว.PA',
  ],
  authors: [{ name: 'ครูคิง' }],
  creator: 'ครูคิง',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: '/',
    siteName: 'ห้องสื่อครูคิง',
    title: 'ห้องสื่อครูคิง | Education Platform + CMS',
    description: 'แหล่งรวมสื่อการเรียนรู้ ผลงาน นวัตกรรม และประสบการณ์การสอน',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ห้องสื่อครูคิง | Education Platform + CMS',
    description: 'แหล่งรวมสื่อการเรียนรู้ ผลงาน นวัตกรรม และประสบการณ์การสอน',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'ห้องสื่อครูคิง',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kruking.com',
    description: 'ศูนย์รวมสื่อการเรียนรู้วิทยาการคำนวณ นวัตกรรม และห้องเรียนออนไลน์',
    founder: {
      '@type': 'Person',
      name: 'ครูคิง',
      jobTitle: 'ครูผู้สอนกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
    },
  };

  return (
    <html lang="th" suppressHydrationWarning className={`${prompt.variable} ${sarabun.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-colors duration-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-xs font-bold"
        >
          ข้ามไปยังเนื้อหาหลัก (Skip to content)
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="kruking_theme_mode"
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            <RealtimeContentRefresh />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
