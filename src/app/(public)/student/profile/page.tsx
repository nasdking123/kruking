'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Save, 
  Sparkles, 
  Loader2
} from 'lucide-react';
import { StudentNavBar } from '@/components/public/student-nav-bar';
import { getStudentProfile } from '@/services/student-learning';
import { updateStudentProfileAction } from '@/actions/student-learning-actions';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

// Default avatars
const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=King1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Student2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ScratchCat',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CodingHero',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Scholar6',
];

export default function StudentProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [gradeLevel, setGradeLevel] = useState('ประถมศึกษาปีที่ 6');
  const [classroom, setClassroom] = useState('ห้อง 1');
  const [studentNumber, setStudentNumber] = useState('1');
  const [schoolName, setSchoolName] = useState('โรงเรียนวัดบางโฉลงใน');
  const [bio, setBio] = useState('');

  useEffect(() => {
    let ignore = false;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!ignore) {
        if (!user) {
          router.push('/student/login?redirectTo=/student/profile');
          return;
        }
        setUserId(user.id);
        getStudentProfile(user.id).then((prof) => {
          if (prof && !ignore) {
            setFullName(prof.fullName);
            setNickname(prof.nickname || '');
            setAvatarUrl(prof.avatarUrl || PRESET_AVATARS[0]);
            setGradeLevel(prof.gradeLevel || 'ประถมศึกษาปีที่ 6');
            setClassroom(prof.classroom || 'ห้อง 1');
            setStudentNumber(prof.studentNumber || '1');
            setSchoolName(prof.schoolName || 'โรงเรียนวัดบางโฉลงใน');
            setBio(prof.bio || '');
          }
          setLoading(false);
        });
      }
    });

    return () => {
      ignore = true;
    };
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    const res = await updateStudentProfileAction({
      fullName,
      nickname,
      avatarUrl,
      gradeLevel,
      classroom,
      studentNumber,
      schoolName,
      bio,
    });
    setSaving(false);

    if (res.success) {
      toast.success('บันทึกโปรไฟล์สำเร็จ!', 'ข้อมูลส่วนตัวของคุณได้รับการอัปเดตเรียบร้อยแล้ว');
    } else {
      toast.error('เกิดข้อผิดพลาด', res.error || 'ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-xs text-slate-500 font-bold">กำลังโหลดโปรไฟล์นักเรียน...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16">
      <StudentNavBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <User className="w-7 h-7 text-blue-600" />
              <span>โปรไฟล์และการตั้งค่าผู้เรียน (Student Profile)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              แก้ไขข้อมูลส่วนตัว ชื่อเล่น รูปโปรไฟล์ และคำแนะนำตัวสำหรับแสดงบนกระดาน Leaderboard
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar Preview & Live Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md text-center space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                ภาพตัวอย่างโปรไฟล์ (Live Preview)
              </span>

              <div className="relative w-28 h-28 mx-auto rounded-3xl overflow-hidden bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-500 shadow-md flex items-center justify-center">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Student Avatar"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-blue-400" />
                )}
              </div>

              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {fullName || 'ชื่อ-นามสกุล'}
                </h3>
                {nickname && (
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">
                    (&quot;{nickname}&quot;)
                  </span>
                )}
                <span className="text-xs text-slate-500 block mt-1">
                  {gradeLevel} • {classroom} • เลขที่ {studentNumber}
                </span>
                <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 block mt-0.5">
                  {schoolName}
                </span>
              </div>

              {bio && (
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 italic">
                  &ldquo;{bio}&rdquo;
                </p>
              )}
            </div>

            {/* Quick Avatar Presets */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                เลือกรูปการ์ตูนสำเร็จรูป (Preset Avatars)
              </span>
              <div className="flex items-center justify-center gap-2">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === url ? 'border-blue-600 scale-110 shadow-sm' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={url} alt={`Preset ${i}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Editable Fields */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-5">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>ข้อมูลประจำตัวผู้เรียน</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ชื่อ - นามสกุล *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ชื่อเล่น (Nickname)
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="เช่น น้องคิง, น้องมายด์"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ระดับชั้น
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="ประถมศึกษาปีที่ 3">ประถมศึกษาปีที่ 3</option>
                    <option value="ประถมศึกษาปีที่ 4">ประถมศึกษาปีที่ 4</option>
                    <option value="ประถมศึกษาปีที่ 5">ประถมศึกษาปีที่ 5</option>
                    <option value="ประถมศึกษาปีที่ 6">ประถมศึกษาปีที่ 6</option>
                    <option value="มัธยมศึกษา">มัธยมศึกษา</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      ห้อง
                    </label>
                    <input
                      type="text"
                      value={classroom}
                      onChange={(e) => setClassroom(e.target.value)}
                      placeholder="เช่น ห้อง 1"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      เลขที่
                    </label>
                    <input
                      type="text"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      placeholder="เช่น 1"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    โรงเรียน
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    URL รูปโปรไฟล์ (Image URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... หรือ URL รูปภาพ"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    คำแนะนำตัวสั้นๆ (Bio / คติประจำใจ)
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="เช่น ชอบการเขียนโปรแกรม Scratch และอยากสร้างเกมเพื่อการศึกษา..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>บันทึกการเปลี่ยนแปลง</span>
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
