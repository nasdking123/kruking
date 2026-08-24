import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Sparkles, 
  Mail, 
  Code, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'เกี่ยวกับครูคิง (About Kru King) | ครูผู้สอนวิทยาการคำนวณและเทคโนโลยี',
  description: 'ประวัติ ผลงาน นวัตกรรมการศึกษา Active Learning และประสบการณ์การจัดการเรียนรู้วิทยาการคำนวณของครูคิง',
};

export default function AboutPage() {
  const highlights = [
    { title: 'กลุ่มสาระการเรียนรู้', desc: 'วิทยาศาสตร์และเทคโนโลยี (วิทยาการคำนวณ)' },
    { title: 'ประสบการณ์การสอน', desc: 'มากกว่า 8 ปี ในระดับประถมศึกษาและมัธยมศึกษา' },
    { title: 'ความเชี่ยวชาญ', desc: 'Active Learning 5E, Unplugged Coding, AI for Teachers' },
    { title: 'งานวิจัยและนวัตกรรม', desc: 'วิจัยในชั้นเรียน (CAR) และบอร์ดเกมเสริมทักษะตรรกะ' },
  ];

  const skills = [
    'การจัดการเรียนรู้ Active Learning 5E',
    'การสอน Coding & Scratch ขั้นสูง',
    'Unplugged Coding & บอร์ดเกมการศึกษา',
    'การประยุกต์ใช้ AI ในการสร้างสื่อและแผนการสอน',
    'การออกแบบสื่อการสอนดิจิทัล & แคนวา (Canva)',
    'การทำผลงานวิทยฐานะ ว.PA',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* 1. Hero Profile Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Avatar / Portrait */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop"
                alt="ครูคิง ครูผู้สอนวิทยาการคำนวณ"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Intro Text */}
          <div className="md:col-span-8 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ครูผู้สอนกลุ่มสาระวิทยาศาสตร์และเทคโนโลยี</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              ยินดีต้อนรับสู่ห้องสื่อ ครูคิง
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              ครูผู้มุ่งมั่นพัฒนาการศึกษาสมัยใหม่ มุ่งเน้นการจัดกิจกรรมการเรียนรู้แบบ <strong>Active Learning</strong> พัฒนาทักษะการคิดเชิงคำนวณ (Computational Thinking) และถ่ายทอดองค์ความรู้ด้านเทคโนโลยีดิจิทัลสู่ผู้เรียนในศตวรรษที่ 21
            </p>

            {/* Quick Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>ติดต่อสอบถาม</span>
              </Link>
              <Link
                href="/portfolio"
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>ชมผลงานและรางวัล</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Key Profile Information Cards */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <span>ข้อมูลทั่วไปและประวัติการสอน</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlights.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-bold text-blue-600 block">{item.title}</span>
              <p className="text-sm font-semibold text-slate-800">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Teaching Philosophy & Vision */}
      <section className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>วิสัยทัศน์และการจัดการเรียนรู้ (Vision & Teaching Philosophy)</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold leading-snug">
          &ldquo;การเรียนรู้ที่ดี เกิดจากการลงมือปฏิบัติจริง และมีความสุขในการแก้ปัญหา&rdquo;
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          เชื่อมั่นว่าการเรียนรู้ด้านโค้ดดิ้งและวิทยาการคำนวณ ไม่ได้จำกัดอยู่เพียงแค่หน้าจอคอมพิวเตอร์ แต่เป็นกระบวนการฝึกฝนทักษะการคิดอย่างเป็นระบบผ่านกิจกรรม Unplugged การเล่นเกม และการสร้างสรรค์ผลงาน เพื่อให้เด็กทุกคนสามารถนำทักษะไปต่อยอดในชีวิตจริงได้อย่างยั่งยืน
        </p>
      </section>

      {/* 4. Skills & Expertise */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-600" />
          <span>ความเชี่ยวชาญและทักษะเฉพาะทาง</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((skill, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-800">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Contact CTA */}
      <section className="p-8 rounded-3xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">สนใจแลกเปลี่ยนเรียนรู้ หรือขอคำปรึกษาด้านสื่อการสอน?</h3>
          <p className="text-xs text-slate-600">ยินดีแบ่งปันและร่วมพัฒนาการศึกษาไทยไปด้วยกันครับ</p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>ไปที่หน้าติดต่อสอบถาม</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
