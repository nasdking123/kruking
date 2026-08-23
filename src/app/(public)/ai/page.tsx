'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  Gamepad2, 
  GraduationCap, 
  Copy, 
  Check, 
  Download, 
  Loader2, 
  Library
} from 'lucide-react';
import { TEACHER_PROMPTS, simulateAIGenerate } from '@/services/ai';
import { useToast } from '@/components/ui/toast';

type ActiveTab = 'generators' | 'prompts';
type ToolType = 'lesson' | 'quiz' | 'activity' | 'research';

const TOOLS: { id: ToolType; name: string; desc: string; icon: React.ReactNode; defaultTopic: string }[] = [
  {
    id: 'lesson',
    name: 'ตัวช่วยร่างแผนการสอน 5E',
    desc: 'สร้างแผนการจัดการเรียนรู้ 5 ขั้นตอนตามมาตรฐาน ว 4.2',
    icon: <BookOpen className="w-5 h-5 text-blue-500" />,
    defaultTopic: 'การคิดเชิงคำนวณ 4 เสาหลัก',
  },
  {
    id: 'quiz',
    name: 'ตัวช่วยออกข้อสอบและเฉลย',
    desc: 'สร้างข้อสอบปรนัย 4 ตัวเลือก พร้อมเฉลยละเอียดรายข้อ',
    icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
    defaultTopic: 'การเขียนโปรแกรมด้วย Scratch เบื้องต้น',
  },
  {
    id: 'activity',
    name: 'ตัวช่วยออกแบบ Active Learning',
    desc: 'ไอเดียกิจกรรม Unplugged และเกมเสริมทักษะในชั้นเรียน',
    icon: <Gamepad2 className="w-5 h-5 text-purple-500" />,
    defaultTopic: 'การทำงานแบบวนซ้ำ (Loops & Algorithms)',
  },
  {
    id: 'research',
    name: 'ตัวช่วยวางโครงร่างวิจัย CAR',
    desc: 'วางโครงร่างงานวิจัยในชั้นเรียน 5 บทและสถิติทดสอบ',
    icon: <GraduationCap className="w-5 h-5 text-amber-500" />,
    defaultTopic: 'การแก้ปัญหาการคิดเชิงตรรกะด้วยบอร์ดเกม',
  },
];

const GRADE_OPTIONS = [
  'ประถมศึกษาปีที่ 1 - 3',
  'ประถมศึกษาปีที่ 4',
  'ประถมศึกษาปีที่ 5',
  'ประถมศึกษาปีที่ 6',
  'มัธยมศึกษาปีที่ 1 - 3',
  'มัธยมศึกษาตอนปลาย',
];

export default function AITeacherPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generators');
  const [selectedTool, setSelectedTool] = useState<ToolType>('lesson');
  const [topic, setTopic] = useState('การคิดเชิงคำนวณ 4 เสาหลัก');
  const [gradeLevel, setGradeLevel] = useState('ประถมศึกษาปีที่ 4');
  const [details, setDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleToolSelect = (toolId: ToolType) => {
    setSelectedTool(toolId);
    const target = TOOLS.find((t) => t.id === toolId);
    if (target) {
      setTopic(target.defaultTopic);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGeneratedResult('');

    // Simulate AI response delay
    setTimeout(async () => {
      const result = await simulateAIGenerate({
        toolType: selectedTool,
        topic,
        gradeLevel,
        details,
      });
      setGeneratedResult(result);
      setIsGenerating(false);
      toast.success('สร้างเนื้อหาสำเร็จ', 'AI สร้างเอกสารการสอนของคุณเรียบร้อยแล้ว');
    }, 1000);
  };

  const handleCopyText = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('คัดลอกสำเร็จ', 'คัดลอกข้อความลงใน Clipboard แล้ว');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!generatedResult) return;
    const blob = new Blob([generatedResult], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kruking-ai-${selectedTool}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('ดาวน์โหลดสำเร็จ', 'บันทึกไฟล์ Markdown เรียบร้อย');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-violet-700 via-indigo-800 to-slate-950 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
          <Bot className="w-3.5 h-3.5" />
          <span>Kru King AI Assistant for Educators</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          ผู้ช่วย AI อัจฉริยะสำหรับครู
        </h1>
        <p className="text-sm sm:text-base text-violet-100 max-w-2xl leading-relaxed font-normal">
          เพิ่มพลังการสอนด้วยเครื่องมือ Generative AI ออกแบบแผนการสอน 5E, สร้างข้อสอบพร้อมเฉลย, ออกแบบกิจกรรม Active Learning และคลังพร้อมต์สำหรับครูไทย
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('generators')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'generators'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>เครื่องมือ AI สร้างเนื้อหา (AI Generators)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('prompts')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'prompts'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Library className="w-4 h-4" />
          <span>คลังพร้อมต์สำหรับครู (Teacher Prompt Library)</span>
        </button>
      </div>

      {/* Tab 1: AI Generators */}
      {activeTab === 'generators' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Tool Selector & Inputs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tool Selector Cards */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                เลือกเครื่องมือ AI ที่ต้องการใช้งาน:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TOOLS.map((tool) => {
                  const isSelected = selectedTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleToolSelect(tool.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit">
                        {tool.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {tool.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {tool.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  หัวข้อบทเรียน / สาระการเรียนรู้ *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="เช่น การคิดเชิงคำนวณ, วงจรอิเล็กทรอนิกส์, การเขียนโปรแกรม..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  ระดับชั้นผู้เรียน
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {GRADE_OPTIONS.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  รายละเอียดเพิ่มเติม (อุปกรณ์ / จุดเน้น)
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="เช่น เน้นกิจกรรม Unplugged, ใช้สื่อ Micro:bit, บูรณาการสิ่งแวดล้อม..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI กำลังประมวลผลและเรียบเรียงเนื้อหา...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>สร้างเนื้อหาด้วย AI ทันที</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: AI Output Viewer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md min-h-[520px] flex flex-col justify-between">
              <div>
                {/* Output Header */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      ผลลัพธ์การสร้างเนื้อหา (AI Generated Content)
                    </h3>
                  </div>

                  {generatedResult && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyText(generatedResult)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadMarkdown}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>.MD</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Output Content */}
                {isGenerating ? (
                  <div className="py-24 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      กำลังประมวลผลข้อมูลตามหลักสูตรแกนกลางฯ 2551 (ฉบับปรับปรุง 2560)...
                    </p>
                  </div>
                ) : generatedResult ? (
                  <article className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-3 pt-4">
                    {generatedResult.split('\n\n').map((para, idx) => {
                      if (para.startsWith('# ')) {
                        return <h1 key={idx} className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-4 mb-2">{para.replace('# ', '')}</h1>;
                      }
                      if (para.startsWith('## ')) {
                        return <h2 key={idx} className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">{para.replace('## ', '')}</h2>;
                      }
                      if (para.startsWith('### ')) {
                        return <h3 key={idx} className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1">{para.replace('### ', '')}</h3>;
                      }
                      if (para.startsWith('- ')) {
                        return (
                          <ul key={idx} className="list-disc pl-5 space-y-1">
                            {para.split('\n').map((li, lIdx) => (
                              <li key={lIdx}>{li.replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={idx} className="text-slate-700 dark:text-slate-300">{para}</p>;
                    })}
                  </article>
                ) : (
                  <div className="py-24 text-center space-y-3 text-slate-400">
                    <Bot className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                    <p className="text-xs">
                      กรอกหัวข้อบทเรียนและกดปุ่ม <span className="font-bold text-blue-600">&quot;สร้างเนื้อหาด้วย AI&quot;</span> เพื่อเริ่มต้น
                    </p>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                * ข้อมูลที่สร้างขึ้นโดย AI เป็นร่างแนวทาง คุณครูสามารถปรับแต่งแก้ไขให้สอดคล้องกับบริบทห้องเรียนจริงของท่าน
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Teacher Prompt Library */}
      {activeTab === 'prompts' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              คลังพร้อมต์สำเร็จรูปสำหรับครู (Teacher Prompts)
            </h2>
            <p className="text-xs text-slate-500">
              คัดลอกพร้อมต์เหล่านี้ไปใช้งานใน ChatGPT, Claude หรือ Gemini ได้ทันที
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEACHER_PROMPTS.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
                    {item.prompt}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    พร้อมนำไปปรับใช้
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(item.prompt)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอกพร้อมต์</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
