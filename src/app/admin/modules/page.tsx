'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Info,
  ExternalLink,
  ArrowUpRight,
  Edit,
  Save,
  Loader2
} from 'lucide-react';
import { 
  getModules, 
  toggleModuleStatus, 
  updateModuleDetails,
  getModuleAdminRoute, 
  getModulePublicRoute 
} from '@/services/modules';
import type { ModuleDefinition } from '@/types';
import { Toggle } from '@/components/ui/toggle';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function AdminModulesPage() {
  const [modules, setModules] = useState<ModuleDefinition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleDefinition | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editConfigJson, setEditConfigJson] = useState('{}');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function loadData() {
      const data = await getModules();
      setModules(data);
    }
    loadData();
  }, []);

  const handleToggle = async (key: string, enabled: boolean) => {
    setModules((prev) =>
      prev.map((m) => (m.key === key ? { ...m, enabled } : m))
    );
    await toggleModuleStatus(key, enabled);
    toast.success(
      enabled ? 'เปิดใช้งานโมดูลเรียบร้อย' : 'ปิดใช้งานโมดูลเรียบร้อย',
      `โมดูล ${key} ถูกปรับสถานะเป็น ${enabled ? 'เปิด' : 'ปิด'}`
    );
  };

  const openEditModal = (mod: ModuleDefinition) => {
    setSelectedModule(mod);
    setEditName(mod.name);
    setEditDescription(mod.description || '');
    setEditConfigJson(JSON.stringify(mod.config || {}, null, 2));
    setIsEditModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;

    setSaving(true);
    try {
      let parsedConfig = {};
      try {
        parsedConfig = JSON.parse(editConfigJson);
      } catch {
        toast.error('JSON ไม่ถูกต้อง', 'โปรดตรวจสอบรูปแบบ JSON ของการตั้งค่า');
        setSaving(false);
        return;
      }

      await updateModuleDetails({
        key: selectedModule.key,
        name: editName.trim(),
        description: editDescription.trim(),
        config: parsedConfig,
      });

      setModules((prev) =>
        prev.map((m) =>
          m.key === selectedModule.key
            ? { ...m, name: editName.trim(), description: editDescription.trim(), config: parsedConfig }
            : m
        )
      );

      toast.success('บันทึกข้อมูลโมดูลสำเร็จ', `อัปเดตโมดูล "${editName}" เรียบร้อยแล้ว`);
      setIsEditModalOpen(false);
    } catch {
      toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setSaving(false);
    }
  };

  const filtered = modules.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCount = modules.filter((m) => m.enabled).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Layers className="w-4 h-4" />
            <span>Core CMS & LMS Module Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            จัดการโมดูลระบบ (Module Registry)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            เปิด-ปิด, แก้ไขชื่อคำอธิบาย, และคลิกเข้าสู่หน้าจัดการของแต่ละโมดูลได้โดยตรง
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300">
            เปิดใช้งานอยู่ {activeCount} จาก {modules.length} โมดูล
          </div>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <strong>กฎความปลอดภัยของข้อมูล:</strong> เมื่อปิดการใช้งานโมดูล (Disable) ระบบจะซ่อนเมนูและเนื้อหาบนหน้าเว็บสาธารณะเท่านั้น แต่ข้อมูลทั้งหมดในฐานข้อมูลจะไม่ถูกลบ และสามารถเปิดกลับมาได้ตลอดเวลา
        </span>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อโมดูล หรือ คีย์..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Modules List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mod) => {
          const adminUrl = getModuleAdminRoute(mod.key);
          const publicUrl = getModulePublicRoute(mod.key);

          return (
            <div
              key={mod.key}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${
                    mod.enabled
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/20'
                      : 'bg-slate-400 dark:bg-slate-700'
                  }`}>
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {mod.name}
                      </h3>
                      <code className="px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {mod.key}
                      </code>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {mod.description || 'ไม่มีคำอธิบาย'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Toggle
                    checked={mod.enabled}
                    onChange={(checked) => handleToggle(mod.key, checked)}
                  />
                </div>
              </div>

              {/* Card Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1.5">
                  {mod.enabled ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>เปิดใช้งาน</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>ปิดใช้งาน</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(mod)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
                    title="แก้ไขข้อมูลโมดูล"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>แก้ไข</span>
                  </button>

                  <Link
                    href={publicUrl}
                    target="_blank"
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="ดูหน้าเว็บจริง"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={adminUrl}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 transition-colors"
                  >
                    <span>จัดการโมดูลนี้</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Edit Modal */}
      {selectedModule && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`แก้ไขโมดูล: ${selectedModule.name}`}
          description={`กำหนดชื่อ คำอธิบาย และการตั้งค่าของโมดูล ${selectedModule.key}`}
        >
          <form onSubmit={handleSaveModule} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                ชื่อโมดูลที่แสดง *
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                คำอธิบายโมดูล
              </label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                JSON Configuration
              </label>
              <textarea
                rows={4}
                value={editConfigJson}
                onChange={(e) => setEditConfigJson(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>บันทึกการแก้ไข</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
