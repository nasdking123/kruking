'use client';

import React, { useState } from 'react';
import { Mail, Phone, Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function ContactPage() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    toast.success('ส่งข้อความสำเร็จ', 'ขอบคุณสำหรับข้อความของคุณครู/ผู้ปกครอง จะติดต่อกลับโดยเร็วที่สุดครับ');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          ติดต่อสอบถาม (Contact Us)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          มีข้อสงสัยเกี่ยวกับสื่อการสอน ขอไฟล์ต้นฉบับ หรือสนใจอบรมเชิงปฏิบัติการ ติดต่อได้เลยครับ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Contact Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-blue-600 text-white shadow-lg space-y-6">
            <div>
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block">
                ช่องทางการติดต่อโดยตรง
              </span>
              <h2 className="text-xl font-bold mt-1">ห้องสื่อครูคิง</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-blue-200">อีเมลติดต่อ</span>
                  <span className="font-semibold text-sm">kruking.teaching@gmail.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-blue-200">เบอร์โทรศัพท์</span>
                  <span className="font-semibold text-sm">081-234-5678</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-blue-200">เวลาทำการตอบข้อความ</span>
                  <span className="font-semibold text-sm">จันทร์ - ศุกร์ (08:30 - 17:00 น.)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              บริการและเรื่องที่ให้คำปรึกษา
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>ขอคำแนะนำแผนการสอน 5E & ว.PA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>การจัดกิจกรรม Unplugged Coding</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>วิทยากรบรรยายการใช้ AI สำหรับครู</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right 7 Cols: Contact Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>ส่งข้อความถึงครูคิง</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">กรอกข้อมูลด้านล่างแล้วเราจะติดต่อกลับโดยเร็ว</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ชื่อ-นามสกุลของคุณ *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น ครูสมชาย ใจดี"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">อีเมลของคุณ *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.ac.th"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">หัวข้อที่ต้องการติดต่อ</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="เช่น ขอไฟล์ต้นฉบับใบงาน ป.4"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">ข้อความรายละเอียด *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>ส่งข้อความ</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
