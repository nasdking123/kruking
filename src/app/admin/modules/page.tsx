'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Info
} from 'lucide-react';
import { getModules, toggleModuleStatus } from '@/services/modules';
import type { ModuleDefinition } from '@/types';
import { Toggle } from '@/components/ui/toggle';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function AdminModulesPage() {
  const [modules, setModules] = useState<ModuleDefinition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleDefinition | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
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

  const openConfig = (mod: ModuleDefinition) => {
    setSelectedModule(mod);
    setIsConfigModalOpen(true);
  };

  const filtered = modules.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCount = modules.filter((m) => m.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Layers className="w-4 h-4" />
            <span>Core CMS Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            จัดการโมดูลระบบ (Module Registry)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            เปิดหรือปิดโมดูลระบบเพื่อควบคุมการแสดงผลบนหน้าบ้านและเมนูนำทางโดยไม่ต้องแก้ไขโค้ด
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300">
            เปิดใช้งานอยู่ {activeCount} จาก {modules.length} โมดูล
          </div>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
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
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Modules Table / Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((mod) => (
            <div
              key={mod.key}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                  mod.enabled
                    ? 'bg-blue-600 dark:bg-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-slate-400 dark:bg-slate-700'
                }`}>
                  <Layers className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {mod.name}
                    </h3>
                    <code className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {mod.key}
                    </code>
                    <span className="text-[10px] text-slate-400 font-mono">v{mod.version}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {mod.description || 'ไม่มีคำอธิบาย'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                <div className="flex items-center gap-2">
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
                  <Toggle
                    checked={mod.enabled}
                    onChange={(checked) => handleToggle(mod.key, checked)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => openConfig(mod)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="ตั้งค่าโมดูล"
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module Config Modal */}
      {selectedModule && (
        <Modal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          title={`ตั้งค่าโมดูล: ${selectedModule.name}`}
          description={`กำหนดค่าตัวเลือกและการแสดงผลสำหรับโมดูล ${selectedModule.key}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="text-slate-500">Key: <span className="text-slate-900 dark:text-white font-bold">{selectedModule.key}</span></div>
              <div className="text-slate-500">Version: <span className="text-slate-900 dark:text-white">{selectedModule.version}</span></div>
              <div className="text-slate-500">Status: <span className={selectedModule.enabled ? 'text-emerald-500 font-bold' : 'text-slate-400'}>{selectedModule.enabled ? 'Enabled' : 'Disabled'}</span></div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                JSON Configuration
              </label>
              <textarea
                rows={5}
                defaultValue={JSON.stringify(selectedModule.config, null, 2)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success('บันทึกการตั้งค่าโมดูลเรียบร้อย');
                  setIsConfigModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
