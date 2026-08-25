'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  FolderOpen, 
  FileText, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  Check, 
  ExternalLink
} from 'lucide-react';
import { getWorks, getCategories, type WorkRow, type CategoryRow } from '@/services/works';
import { getQuizzes, type QuizWithQuestions } from '@/services/quiz';
import { useToast } from '@/components/ui/toast';

interface SubjectItem {
  id: string;
  name: string;
  grade: string;
  icon: string;
  slug: string;
}

const DEFAULT_SUBJECTS: SubjectItem[] = [
  { id: 'subj-history-p6', name: 'ประวัติศาสตร์', grade: 'ประถมศึกษาปีที่ 6', icon: '📜', slug: 'history-p6' },
  { id: 'subj-history-p3', name: 'ประวัติศาสตร์', grade: 'ประถมศึกษาปีที่ 3', icon: '🏺', slug: 'history-p3' },
  { id: 'subj-anticorrupt-p6', name: 'หลักสูตรต้านทุจริตศึกษา', grade: 'ประถมศึกษาปีที่ 6', icon: '🛡️', slug: 'anti-corruption-p6' },
  { id: 'subj-cs', name: 'วิทยาการคำนวณ', grade: 'ประถมศึกษาปีที่ 4 - 6', icon: '💻', slug: 'cs' },
];

interface LearningUnit {
  id: string;
  subjectSlug: string;
  unitNumber: number;
  title: string;
  description: string;
}

const INITIAL_UNITS: LearningUnit[] = [
  // ประวัติศาสตร์ ป.6
  {
    id: 'unit-hist-p6-1',
    subjectSlug: 'history-p6',
    unitNumber: 1,
    title: 'หน่วยที่ 1: การศึกษาประวัติศาสตร์และพัฒนาการอาณาจักรรัตนโกสินทร์',
    description: 'การสถาปนากรุงรัตนโกสินทร์ ลำดับเหตุการณ์สำคัญ และพระมหากษัตริย์ในราชวงศ์จักรี',
  },
  {
    id: 'unit-hist-p6-2',
    subjectSlug: 'history-p6',
    unitNumber: 2,
    title: 'หน่วยที่ 2: มรดกภูมิปัญญา วัฒนธรรม และบุคคลสำคัญของชาติ',
    description: 'ผลงานบุคคลสำคัญที่มีส่วนสร้างสรรค์ชาติไทย และศิลปวัฒนธรรมอันทรงคุณค่า',
  },

  // ประวัติศาสตร์ ป.3
  {
    id: 'unit-hist-p3-1',
    subjectSlug: 'history-p3',
    unitNumber: 1,
    title: 'หน่วยที่ 1: พระมหากษัตริย์ผู้สถาปนาอาณาจักรไทยและบุคคลสำคัญ',
    description: 'พระราชประวัติและวีรกรรมของสมเด็จพระเจ้าตากสินมหาราชและบรรพบุรุษไทย',
  },
  {
    id: 'unit-hist-p3-2',
    subjectSlug: 'history-p3',
    unitNumber: 2,
    title: 'หน่วยที่ 2: ร่องรอยอดีต แหล่งโบราณคดี และวัฒนธรรมชุมชน',
    description: 'การสืบค้นประวัติความเป็นมาและขนบธรรมเนียมประเพณีในท้องถิ่น',
  },

  // ต้านทุจริต ป.6
  {
    id: 'unit-anti-p6-1',
    subjectSlug: 'anti-corruption-p6',
    unitNumber: 1,
    title: 'หน่วยที่ 1: การคิดแยกแยะระหว่างผลประโยชน์ส่วนตนและส่วนรวม',
    description: 'การวิเคราะห์ผลประโยชน์ทับซ้อน (Conflict of Interest) และความละอายต่อการทุจริต',
  },
  {
    id: 'unit-anti-p6-2',
    subjectSlug: 'anti-corruption-p6',
    unitNumber: 2,
    title: 'หน่วยที่ 2: STRONG จิตพอเพียงต้านทุจริตและพลเมืองสุจริต',
    description: 'การนำหลักปรัชญาเศรษฐกิจพอเพียงและความโปร่งใสมาใช้ในการดำเนินชีวิต',
  },

  // วิทยาการคำนวณ
  {
    id: 'unit-cs-1',
    subjectSlug: 'cs',
    unitNumber: 1,
    title: 'หน่วยที่ 1: การคิดเชิงคำนวณและขั้นตอนวิธี (Computational Thinking)',
    description: 'Decomposition, Pattern Recognition, Abstraction และ Algorithm Design',
  },
  {
    id: 'unit-cs-2',
    subjectSlug: 'cs',
    unitNumber: 2,
    title: 'หน่วยที่ 2: การเขียนโปรแกรมแบบบล็อกและ Scratch',
    description: 'การใช้เหตุผลเชิงตรรกะ ตัวแปร เงื่อนไข และการตรวจหาข้อผิดพลาด (Debugging)',
  },
];

export default function AdminCurriculumPage() {
  const toast = useToast();
  const [subjects, setSubjects] = useState<SubjectItem[]>(DEFAULT_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem>(DEFAULT_SUBJECTS[0]);
  const [units, setUnits] = useState<LearningUnit[]>(INITIAL_UNITS);
  
  // Data from Supabase
  const [works, setWorks] = useState<WorkRow[]>([]);
  const [quizzes, setQuizzes] = useState<QuizWithQuestions[]>([]);
  const [, setCategories] = useState<CategoryRow[]>([]);

  // Modals & New Unit Form
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitDesc, setNewUnitDesc] = useState('');
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // New Subject Form
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjGrade, setNewSubjGrade] = useState('');

  useEffect(() => {
    async function loadData() {
      const [w, q, c] = await Promise.all([
        getWorks(),
        getQuizzes(),
        getCategories(),
      ]);
      setWorks(w);
      setQuizzes(q);
      setCategories(c);
    }
    loadData();
  }, []);

  // Filter Units for Selected Subject
  const currentUnits = units.filter((u) => u.subjectSlug === selectedSubject.slug);

  // Filter Content according to subject safely
  const currentSubjectWorks = works.filter((w) => {
    const sName = selectedSubject.name.toLowerCase();
    const wSubj = (w.subject || '').toLowerCase();
    const wTitle = (w.title || '').toLowerCase();
    const wGrade = (w.grade_level || '').toLowerCase();

    const matchesSubj = wSubj.includes(sName) ||
      wTitle.includes(sName) ||
      (selectedSubject.slug === 'history-p6' && wGrade.includes('6') && wSubj.includes('ประวัติ')) ||
      (selectedSubject.slug === 'history-p3' && wGrade.includes('3') && wSubj.includes('ประวัติ')) ||
      (selectedSubject.slug === 'anti-corruption-p6' && (wSubj.includes('ทุจริต') || wTitle.includes('ทุจริต'))) ||
      (selectedSubject.slug === 'cs' && (wSubj.includes('คำนวณ') || wTitle.includes('scratch') || wTitle.includes('โปรแกรม')));
    return matchesSubj;
  });

  const currentSubjectQuizzes = quizzes.filter((q) => {
    const sName = selectedSubject.name.toLowerCase();
    const qSubj = (q.subject || '').toLowerCase();
    return qSubj.includes(sName) ||
      (selectedSubject.slug === 'cs' && qSubj.includes('คำนวณ'));
  });

  // Handler: Add New Unit
  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitTitle.trim()) return;

    const newUnit: LearningUnit = {
      id: `unit-${Date.now()}`,
      subjectSlug: selectedSubject.slug,
      unitNumber: currentUnits.length + 1,
      title: newUnitTitle.trim(),
      description: newUnitDesc.trim(),
    };

    setUnits([...units, newUnit]);
    setNewUnitTitle('');
    setNewUnitDesc('');
    setShowAddUnit(false);
    toast.success('เพิ่มหน่วยการเรียนรู้สำเร็จ', `เพิ่ม "${newUnit.title}" ในวิชา ${selectedSubject.name}`);
  };

  // Handler: Save Edit Unit
  const handleSaveEditUnit = (unitId: string) => {
    setUnits(units.map((u) => u.id === unitId ? { ...u, title: editTitle, description: editDesc } : u));
    setEditingUnitId(null);
    toast.success('อัปเดตชื่อหน่วยสำเร็จ', 'บันทึกการแก้ไขเรียบร้อย');
  };

  // Handler: Delete Unit
  const handleDeleteUnit = (unitId: string, unitTitle: string) => {
    if (confirm(`คุณต้องการลบ "${unitTitle}" ใช่หรือไม่?`)) {
      setUnits(units.filter((u) => u.id !== unitId));
      toast.success('ลบหน่วยสำเร็จ', `ลบ "${unitTitle}" เรียบร้อย`);
    }
  };

  // Handler: Add New Subject
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;

    const slug = newSubjName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
      .replace(/[\s_-]+/g, '-') || `subj-${Date.now()}`;

    const newSubj: SubjectItem = {
      id: `subj-${Date.now()}`,
      name: newSubjName.trim(),
      grade: newSubjGrade.trim() || 'ทุกระดับชั้น',
      icon: '📚',
      slug,
    };

    setSubjects([...subjects, newSubj]);
    setSelectedSubject(newSubj);
    setNewSubjName('');
    setNewSubjGrade('');
    setShowAddSubject(false);
    toast.success('เพิ่มวิชาใหม่สำเร็จ', `พร้อมจัดการหน่วยการเรียนรู้สำหรับวิชา ${newSubj.name}`);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-blue-600" />
            <span>จัดการรายวิชา & หน่วยการเรียนรู้ (Subjects & Units)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            จำแนกหลักสูตรตามแต่ละวิชา กำหนดชื่อหน่วยการสอน และแยกประเภทสื่อการสอน ใบงาน แผนการสอน และข้อสอบอย่างเป็นระบบ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/works/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มเนื้อหาใหม่</span>
          </Link>
          <Link
            href="/admin/quizzes/new"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            <span>+ สร้างข้อสอบ</span>
          </Link>
        </div>
      </div>

      {/* 2. Subject Selector Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            เลือกวิชาที่ต้องการจัดการ (Select Subject)
          </label>
          <button
            type="button"
            onClick={() => setShowAddSubject(!showAddSubject)}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {showAddSubject ? 'ยกเลิก' : '+ เพิ่มรายวิชาใหม่'}
          </button>
        </div>

        {/* Add Subject Inline Form */}
        {showAddSubject && (
          <form onSubmit={handleCreateSubject} className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-wrap items-center gap-3">
            <input
              type="text"
              required
              value={newSubjName}
              onChange={(e) => setNewSubjName(e.target.value)}
              placeholder="ชื่อวิชา เช่น สังคมศึกษา, ภาษาไทย..."
              className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newSubjGrade}
              onChange={(e) => setNewSubjGrade(e.target.value)}
              placeholder="ระดับชั้น เช่น ประถมศึกษาปีที่ 5"
              className="w-48 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              บันทึกวิชา
            </button>
          </form>
        )}

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {subjects.map((subj) => {
            const isSelected = selectedSubject.id === subj.id;
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-base">{subj.icon}</span>
                <div className="text-left">
                  <div className="font-bold">{subj.name}</div>
                  <div className={`text-[10px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {subj.grade}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Subject Summary & Units Action Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold backdrop-blur-xs">
            <span>{selectedSubject.icon}</span>
            <span>{selectedSubject.name} — {selectedSubject.grade}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            โครงสร้างหลักสูตรและหน่วยการเรียนรู้
          </h2>
          <p className="text-xs text-slate-300">
            มีทั้งหมด {currentUnits.length} หน่วยการเรียนรู้ • {currentSubjectWorks.length} สื่อ/ใบงาน/แผน • {currentSubjectQuizzes.length} ชุดข้อสอบ
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddUnit(!showAddUnit)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ เพิ่มหน่วยการเรียนรู้ใหม่</span>
        </button>
      </div>

      {/* 4. Add Unit Modal/Drawer */}
      {showAddUnit && (
        <form onSubmit={handleCreateUnit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>สร้างหน่วยการเรียนรู้ใหม่สำหรับวิชา {selectedSubject.name}</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddUnit(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ปิด
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              ชื่อหน่วยการเรียนรู้ (Unit Title) *
            </label>
            <input
              type="text"
              required
              value={newUnitTitle}
              onChange={(e) => setNewUnitTitle(e.target.value)}
              placeholder={`เช่น หน่วยที่ ${currentUnits.length + 1}: การสืบค้นประวัติศาสตร์ท้องถิ่น`}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              คำอธิบายสาระสำคัญ / ตัวชี้วัดของหน่วย
            </label>
            <input
              type="text"
              value={newUnitDesc}
              onChange={(e) => setNewUnitDesc(e.target.value)}
              placeholder="สรุปเนื้อหาสำคัญหรือผลการเรียนรู้ที่คาดหวังในหน่วยนี้..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddUnit(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              บันทึกหน่วยการสอน
            </button>
          </div>
        </form>
      )}

      {/* 5. Units & Categorized Media List */}
      <div className="space-y-6">
        {currentUnits.map((unit) => {
          const isEditing = editingUnitId === unit.id;

          // Filter content matching this unit or general for subject
          const unitPlans = currentSubjectWorks.filter((w) => w.type === 'lesson_plan');
          const unitWorksheets = currentSubjectWorks.filter((w) => w.type === 'worksheet');
          const unitResources = currentSubjectWorks.filter((w) => w.type === 'resource' || w.type === 'game');
          const unitQuizzes = currentSubjectQuizzes;

          return (
            <div
              key={unit.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden"
            >
              {/* Unit Card Header */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm font-bold rounded-lg border border-blue-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-3 py-1 text-xs rounded-lg border border-slate-300 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{unit.title}</span>
                      </h3>
                      {unit.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {unit.description}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => handleSaveEditUnit(unit.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>เสร็จสิ้น</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUnitId(unit.id);
                        setEditTitle(unit.title);
                        setEditDesc(unit.description);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                      title="แก้ไขชื่อหน่วย"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteUnit(unit.id, unit.title)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="ลบหน่วยนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Categorized Columns in Unit */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. สื่อการสอน (Resources) */}
                <div className="space-y-3 p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                      <FolderOpen className="w-4 h-4 text-blue-600" />
                      <span>สื่อการสอน & สไลด์ ({unitResources.length})</span>
                    </span>
                    <Link
                      href="/admin/works/new"
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      + เพิ่ม
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {unitResources.length === 0 ? (
                      <p className="text-[11px] text-slate-400 py-3 text-center">ยังไม่มีสื่อการสอน</p>
                    ) : (
                      unitResources.map((item) => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between group">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                            {item.title}
                          </span>
                          <Link href={`/resources/${item.slug}`} target="_blank" className="text-slate-400 hover:text-blue-600">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. ใบงาน & แบบฝึกหัด (Worksheets) */}
                <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>ใบงาน & แบบฝึกหัด ({unitWorksheets.length})</span>
                    </span>
                    <Link
                      href="/admin/works/new"
                      className="text-[10px] font-bold text-emerald-600 hover:underline"
                    >
                      + เพิ่ม
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {unitWorksheets.length === 0 ? (
                      <p className="text-[11px] text-slate-400 py-3 text-center">ยังไม่มีใบงาน</p>
                    ) : (
                      unitWorksheets.map((item) => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between group">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                            {item.title}
                          </span>
                          <Link href={`/worksheets/${item.slug}`} target="_blank" className="text-slate-400 hover:text-emerald-600">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. แผนการสอน 5E (Lesson Plans) */}
                <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>แผนการสอน 5E ({unitPlans.length})</span>
                    </span>
                    <Link
                      href="/admin/works/new"
                      className="text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                      + เพิ่ม
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {unitPlans.length === 0 ? (
                      <p className="text-[11px] text-slate-400 py-3 text-center">ยังไม่มีแผนการสอน</p>
                    ) : (
                      unitPlans.map((item) => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between group">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                            {item.title}
                          </span>
                          <Link href={`/lesson-plans/${item.slug}`} target="_blank" className="text-slate-400 hover:text-indigo-600">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. ข้อสอบ & แบบทดสอบ (Quizzes) */}
                <div className="space-y-3 p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-purple-600" />
                      <span>ข้อสอบ & แบบทดสอบ ({unitQuizzes.length})</span>
                    </span>
                    <Link
                      href="/admin/quizzes/new"
                      className="text-[10px] font-bold text-purple-600 hover:underline"
                    >
                      + สร้าง
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {unitQuizzes.length === 0 ? (
                      <p className="text-[11px] text-slate-400 py-3 text-center">ยังไม่มีแบบทดสอบ</p>
                    ) : (
                      unitQuizzes.map((quiz) => (
                        <div key={quiz.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between group">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                            {quiz.title}
                          </span>
                          <Link href={`/quiz/${quiz.slug || quiz.id}`} target="_blank" className="text-slate-400 hover:text-purple-600">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
