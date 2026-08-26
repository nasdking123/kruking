'use client';

import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Plus, 
  Trophy, 
  Coins, 
  Loader2, 
  Save
} from 'lucide-react';
import { 
  getCompetitions, 
  createCompetition, 
  type CompetitionItem 
} from '@/services/competitions';
import { recordCompetitionResultAction } from '@/actions/student-learning-actions';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

export default function AdminCompetitionsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState<CompetitionItem[]>([]);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [subject, setSubject] = useState('วิทยาการคำนวณ');
  const [gradeLevel, setGradeLevel] = useState('ประถมศึกษาปีที่ 6');
  const [pointsReward, setPointsReward] = useState(50);

  // Record Result Modal
  const [selectedComp, setSelectedComp] = useState<CompetitionItem | null>(null);
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [rankInput, setRankInput] = useState(1);
  const [scoreInput, setScoreInput] = useState(100);
  const [notesInput, setNotesInput] = useState('ผลงานสร้างสรรค์ยอดเยี่ยม ชนะเลิศอันดับ 1');
  const [recording, setRecording] = useState(false);

  const refreshData = async () => {
    const data = await getCompetitions();
    setCompetitions(data);

    // Fetch students list for awarding
    const supabase = createClient();
    const { data: stds } = await supabase.from('profiles').select('id, full_name').eq('role', 'student');
    if (stds) {
      setStudents(stds.map((s) => ({ id: s.id, name: s.full_name || 'นักเรียน' })));
      if (stds.length > 0) setSelectedStudentId(stds[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    getCompetitions().then((data) => {
      if (!ignore) {
        setCompetitions(data);
        const supabase = createClient();
        supabase.from('profiles').select('id, full_name').eq('role', 'student').then(({ data: stds }) => {
          if (!ignore && stds) {
            setStudents(stds.map((s) => ({ id: s.id, name: s.full_name || 'นักเรียน' })));
            if (stds.length > 0) setSelectedStudentId(stds[0].id);
          }
          if (!ignore) setLoading(false);
        });
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    const res = await createCompetition({
      title: title.trim(),
      description: desc.trim() || undefined,
      subject,
      gradeLevel,
      pointsReward,
    });
    setCreating(false);

    if (res.success) {
      toast.success('สร้างการแข่งขันสำเร็จ!', `สร้าง "${title}" เรียบร้อยแล้ว`);
      setShowCreateModal(false);
      setTitle('');
      setDesc('');
      await refreshData();
    } else {
      toast.error('เกิดข้อผิดพลาด', res.error || 'ไม่สามารถสร้างได้');
    }
  };

  const handleRecordResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComp || !selectedStudentId) return;

    setRecording(true);
    const res = await recordCompetitionResultAction({
      competitionId: selectedComp.id,
      userId: selectedStudentId,
      rank: rankInput,
      score: scoreInput,
      notes: notesInput,
      pointsReward: selectedComp.pointsReward,
      competitionTitle: selectedComp.title,
    });
    setRecording(false);

    if (res.success) {
      toast.success('บันทึกผลการแข่งขันสำเร็จ!', `มอบคะแนนโบนัส +${selectedComp.pointsReward} แต้มให้นักเรียนเรียบร้อย`);
      setSelectedComp(null);
      await refreshData();
    } else {
      toast.error('เกิดข้อผิดพลาด', res.error || 'ไม่สามารถบันทึกผลได้');
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Swords className="w-7 h-7 text-purple-600" />
            <span>จัดการการแข่งขันและประลองทักษะ (Competitions Manager)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            สร้างกิจกรรมการแข่งขัน บันทึกผลผู้ชนะ และมอบคะแนนโบนัสเข้าสู่บัญชีนักเรียนโดยอัตโนมัติ
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ สร้างการแข่งขันใหม่</span>
        </button>
      </div>

      {/* Modal: Create Competition */}
      {showCreateModal && (
        <form
          onSubmit={handleCreate}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-500 shadow-2xl space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-purple-600" />
              <span>สร้างรายการแข่งขันใหม่ (New Challenge)</span>
            </h3>
            <button type="button" onClick={() => setShowCreateModal(false)} className="text-xs text-slate-400">
              ยกเลิก
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ชื่อการแข่งขัน *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น การแข่งขันสร้างเกม Scratch พิชิตโจทย์ปัญหา ระดับชั้น ป.6"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                วิชา / หมวดสาระ *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
                <option value="ทุกระดับชั้น">ทุกระดับชั้น</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                คะแนนโบนัสรางวัล (Bonus Points Reward)
              </label>
              <input
                type="number"
                min={0}
                value={pointsReward}
                onChange={(e) => setPointsReward(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                รายละเอียดและกติกาการแข่งขัน
              </label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="ระบุข้อกำหนด กติกาการส่งผลงาน..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>บันทึกการแข่งขัน</span>
            </button>
          </div>
        </form>
      )}

      {/* Competitions Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="text-xs text-slate-500 font-bold">กำลังโหลดรายการการแข่งขัน...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-600 text-[10px] font-extrabold">
                    {comp.subject}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-600 text-[10px] font-extrabold flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    <span>+{comp.pointsReward} แต้ม</span>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {comp.title}
                </h3>

                {comp.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  {comp.gradeLevel || 'ทุกระดับชั้น'}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedComp(comp)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>บันทึกผลผู้ชนะ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Record Result */}
      {selectedComp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordResult}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>บันทึกผลการแข่งขัน: {selectedComp.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedComp(null)}
                className="text-xs text-slate-400"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                เลือกนักเรียนผู้ชนะ / ได้รับรางวัล *
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  อันดับที่ (Rank)
                </label>
                <select
                  value={rankInput}
                  onChange={(e) => setRankInput(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value={1}>🥇 อันดับที่ 1 (ชนะเลิศ)</option>
                  <option value={2}>🥈 อันดับที่ 2 (รองชนะเลิศอันดับ 1)</option>
                  <option value={3}>🥉 อันดับที่ 3 (รองชนะเลิศอันดับ 2)</option>
                  <option value={4}>🎖️ รางวัลชมเชย</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  คะแนนที่ได้
                </label>
                <input
                  type="number"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                บันทึกคำชมเชย / รายละเอียด
              </label>
              <input
                type="text"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedComp(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={recording}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                {recording ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>บันทึกผลและแจกแต้ม</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
