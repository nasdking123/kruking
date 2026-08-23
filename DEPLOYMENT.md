# คู่มือการติดตั้งและ Deploy สู่ระบบจริง (Production Deployment Guide)
# แพลตฟอร์ม "ห้องสื่อครูคิง" (Education Platform + CMS)

---

## 1. ข้อมูลภาพรวมระบบ (System Architecture)
- **Framework:** Next.js 16 (App Router + Turbopack)
- **Language:** TypeScript 5+ (Strict Mode)
- **Styling:** Tailwind CSS 4, Custom Thai Typography (`Prompt`, `Sarabun`)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **Storage:** Supabase Storage (`works-files`, `works-images`, `downloads-files`, `avatars`)
- **Icons & UI:** Lucide React, Custom SVG Icons, Accessible Rich UI Components

---

## 2. ตัวแปรสภาพแวดล้อม (Environment Variables)

สร้างไฟล์ `.env.local` สำหรับ Development และตั้งค่าใน Vercel / Production Server ดังนี้:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Platform Base URL
NEXT_PUBLIC_SITE_URL=https://kruking.com
```

---

## 3. ขั้นตอนการตั้งค่า Supabase Database

1. สร้างโปรเจกต์ใหม่บน [Supabase Dashboard](https://supabase.com)
2. ไปที่เมนู **SQL Editor**
3. คัดลอกเนื้อหาจากไฟล์ `supabase/migrations/20260823000000_initial_schema.sql` และคลิก **Run** เพื่อสร้างตารางทั้งหมด 38+ ตาราง พร้อมระบบความปลอดภัย RLS
4. ไปที่เมนู **Storage** -> สร้าง Buckets ดังต่อไปนี้ (ตั้งค่าเป็น Public):
   - `works-files` (สำหรับเก็บไฟล์ Word, PDF, PPTX, ZIP)
   - `works-images` (สำหรับรูปภาพหน้าปกและภาพกิจกรรม)
   - `downloads-files` (สำหรับไฟล์ศูนย์ดาวน์โหลด)
   - `avatars` (สำหรับรูปโปรไฟล์)

---

## 4. ขั้นตอนการ Deploy ขึ้น Vercel (แนะนำ)

1. เชื่อมต่อ Git Repository (GitHub / GitLab) เข้ากับ [Vercel](https://vercel.com)
2. เลือก Framework Preset: **Next.js**
3. กำหนด Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. คลิก **Deploy** — Vercel จะทำการ Build และ Deploy ระบบขึ้น Production โดยอัตโนมัติ

---

## 5. คำสั่งที่สำคัญสำหรับผู้ดูแลระบบ (Useful Scripts)

```bash
# ตรวจสอบโค้ดและมาตรฐาน ESLint (0 errors)
npm run lint

# ทดสอบและสร้าง Production Build
npm run build

# รันเซิร์ฟเวอร์ Production ในเครื่อง
npm run start

# รันเซิร์ฟเวอร์ Development สำหรับพัฒนาต่อ
npm run dev
```

---

## 6. สรุปโครงสร้างโมดูลที่พร้อมใช้งาน (Production Features)

| โมดูล | เส้นทาง (Route) | คำอธิบาย |
| :--- | :--- | :--- |
| **หน้าแรก (Dynamic Homepage)** | `/` | 8 ส่วนเนื้อหาปรับแต่งได้ผ่าน CMS |
| **ระบบสืบค้นข้อมูล (Search)** | `/search` | ค้นหาข้อมูลแบบ Real-time ข้ามทุกโมดูล |
| **แผนการจัดการเรียนรู้** | `/lesson-plans` | คลังแผนการสอน 5E ตามมาตรฐาน ว 4.2 |
| **โชว์เคสการสอน** | `/teaching` | การจัดการเรียนรู้ Active Learning |
| **งานวิจัยในชั้นเรียน** | `/research` | คลังงานวิจัย CAR และรายงานฉบับเต็ม |
| **นวัตกรรมการศึกษา** | `/innovation` | สื่อ สิ่งประดิษฐ์ และโมเดลการสอน |
| **รางวัลและผลงาน** | `/awards` | แกลเลอรี่เกียรติบัตรและผลงานดีเด่น |
| **ภาพกิจกรรม** | `/activities` | อัลบั้มภาพกิจกรรม ค่าย และการอบรม |
| **บทความวิชาการ** | `/articles` | บทความ ทิปส์การสอน และ AI สำหรับครู |
| **สื่อการสอน** | `/resources` | คลังสื่อ สไลด์ วิดีโอ และแคนวา |
| **ใบงานและแบบฝึกหัด** | `/worksheets` | ดาวน์โหลดใบงานนักเรียนและเฉลยครู |
| **เกมการศึกษา** | `/games` | บอร์ดเกม เกมดิจิทัล และ Unplugged |
| **ห้องเรียนออนไลน์** | `/classroom` | ห้องเรียนออนไลน์, รหัส Join Code, วิดีโอ |
| **ระบบทำข้อสอบ** | `/quiz` | แบบทดสอบออนไลน์ จับเวลา ตรวจและเฉลย |
| **ศูนย์ดาวน์โหลด** | `/downloads` | คลังไฟล์เทมเพลต สไลด์ บัตรคำ และเอกสาร ว.PA |
| **ผู้ช่วย AI สำหรับครู** | `/ai` | AI Generator 4 เครื่องมือ และคลังพร้อมต์ |
| **ระบบจัดการหลังบ้าน (CMS)** | `/admin/*` | จัดการโมดูล, เมนู, หน้าเว็บ, แดชบอร์ดสถิติ |
