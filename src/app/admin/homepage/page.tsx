'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  MoveUp, 
  MoveDown, 
  Edit3, 
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { getHomepageSections, toggleSectionStatus, updateSection, type HomepageSectionRow } from '@/services/homepage';
import { Toggle } from '@/components/ui/toggle';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function AdminHomepageBuilderPage() {
  const [sections, setSections] = useState<HomepageSectionRow[]>([]);
  const [editingSection, setEditingSection] = useState<HomepageSectionRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let ignore = false;
    getHomepageSections().then((data) => {
      if (!ignore) {
        setSections(data);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleToggle = async (section_key: string, is_enabled: boolean) => {
    setSections((prev) =>
      prev.map((s) => (s.section_key === section_key ? { ...s, is_enabled } : s))
    );
    await toggleSectionStatus(section_key, is_enabled);
    toast.success(
      is_enabled ? 'เปิดแสดง Section แล้ว' : 'ซ่อน Section แล้ว',
      `Section "${section_key}" ถูกปรับสถานะเป็น ${is_enabled ? 'แสดง' : 'ซ่อน'}`
    );
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // re-assign sort_order
    const updated = newSections.map((s, idx) => ({ ...s, sort_order: idx + 1 }));
    setSections(updated);
    toast.info('ปรับลำดับเรียบร้อย', 'จัดลำดับการแสดงผลหน้าแรกใหม่แล้ว');
  };

  const handleOpenEdit = (sec: HomepageSectionRow) => {
    setEditingSection({ ...sec });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    await updateSection(editingSection.section_key, {
      title: editingSection.title,
      subtitle: editingSection.subtitle,
    });

    setSections((prev) =>
      prev.map((s) => (s.section_key === editingSection.section_key ? editingSection : s))
    );
    setIsModalOpen(false);
    toast.success('บันทึกการแก้ไข Section สำเร็จ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Globe className="w-4 h-4" />
            <span>Homepage Section Builder</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            จัดหน้าแรก (Dynamic Homepage Builder)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            เปิด/ปิด สลับลำดับ และปรับแก้ข้อความของแต่ละ Section บนหน้าแรกได้โดยตรง
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>ดูหน้าแรกจริง</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Sections Reorderable List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {sections.map((sec, index) => (
          <div
            key={sec.section_key}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shrink-0 text-xs">
                {index + 1}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {sec.title}
                  </h3>
                  <code className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {sec.section_key}
                  </code>
                </div>
                {sec.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {sec.subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSection(index, 'up')}
                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300"
                  title="เลื่อนขึ้น"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => moveSection(index, 'down')}
                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 text-slate-600 dark:text-slate-300"
                  title="เลื่อนลง"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <Toggle
                size="sm"
                checked={sec.is_enabled}
                onChange={(checked) => handleToggle(sec.section_key, checked)}
              />

              <button
                type="button"
                onClick={() => handleOpenEdit(sec)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="แก้ไขหัวข้อและข้อความ"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`แก้ไข Section: ${editingSection.section_key}`}
          description="ปรับปรุงหัวข้อและคำอธิบายย่อยของส่วนนี้"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-900 dark:text-white">
                หัวข้อหลัก (Title) *
              </label>
              <input
                type="text"
                required
                value={editingSection.title}
                onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                คำอธิบายย่อย (Subtitle)
              </label>
              <textarea
                rows={3}
                value={editingSection.subtitle || ''}
                onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
