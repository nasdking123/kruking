import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ห้องสื่อครูคิง | Education Platform + CMS',
    short_name: 'ห้องสื่อครูคิง',
    description: 'แหล่งรวมสื่อการเรียนรู้ แผนการสอน ใบงาน เกม นวัตกรรม งานวิจัย ห้องเรียนออนไลน์ และเครื่องมือ AI สำหรับครู',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
