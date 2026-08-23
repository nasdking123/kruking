'use client';

import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ChevronRight
} from 'lucide-react';
import { getFlatMenus, saveMenu, deleteMenu } from '@/services/menus';
import type { MenuItem } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Partial<MenuItem> | null>(null);
  const toast = useToast();

  const loadMenus = async () => {
    const data = await getFlatMenus();
    setMenus(data);
  };

  useEffect(() => {
    let ignore = false;
    getFlatMenus().then((data) => {
      if (!ignore) {
        setMenus(data);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenAdd = (parentId: string | null = null) => {
    setEditingMenu({
      title: '',
      slug: '',
      url: '/',
      icon: 'Link',
      parent_id: parentId,
      sort_order: menus.length + 1,
      type: 'custom',
      is_active: true,
      open_new_tab: false,
      permission: 'guest',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenu || !editingMenu.title || !editingMenu.url) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน', 'จำเป็นต้องระบุชื่อเมนูและ URL');
      return;
    }

    await saveMenu(editingMenu);
    setIsModalOpen(false);
    toast.success('บันทึกเมนูสำเร็จ', `เมนู "${editingMenu.title}" ได้รับการอัปเดตเรียบร้อย`);
    loadMenus();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเมนู "${title}"?`)) {
      await deleteMenu(id);
      toast.success('ลบเมนูเรียบร้อย', `เมนู "${title}" ถูกลบออกจากระบบ`);
      loadMenus();
    }
  };

  const handleToggleActive = async (menu: MenuItem) => {
    const updated = { ...menu, is_active: !menu.is_active };
    setMenus((prev) => prev.map((m) => (m.id === menu.id ? updated : m)));
    await saveMenu(updated);
    toast.success(
      updated.is_active ? 'เปิดแสดงเมนูแล้ว' : 'ซ่อนเมนูแล้ว',
      `สถานะของเมนู ${menu.title} เปลี่ยนเป็น ${updated.is_active ? 'แสดง' : 'ซ่อน'}`
    );
  };

  const rootMenus = menus.filter((m) => !m.parent_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <MenuIcon className="w-4 h-4" />
            <span>Navigation Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            จัดการเมนูนำทาง (Dynamic Menu Builder)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            เพิ่ม แก้ไข ลบ จัดลำดับ และสร้างเมนูย่อย (Submenu) ได้อย่างอิสระโดยไม่ต้องแก้ไขโค้ด
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAdd(null)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มเมนูหลักใหม่</span>
        </button>
      </div>

      {/* Menu Tree List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {rootMenus.map((root, index) => {
          const children = menus.filter((m) => m.parent_id === root.id);
          return (
            <div key={root.id} className="p-4 sm:p-5 space-y-3">
              {/* Root Item */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-xs">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {root.title}
                      </span>
                      <code className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {root.url}
                      </code>
                      <Badge variant={root.type === 'module' ? 'primary' : 'outline'}>
                        {root.type}
                      </Badge>
                      {root.open_new_tab && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <ExternalLink className="w-3 h-3" />
                          <span>New tab</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Toggle
                    size="sm"
                    checked={root.is_active}
                    onChange={() => handleToggleActive(root)}
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenAdd(root.id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1"
                    title="เพิ่มเมนูย่อย"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden md:inline text-[11px]">เพิ่มเมนูย่อย</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(root)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="แก้ไข"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(root.id, root.title)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 transition-colors"
                    title="ลบ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Submenus if any */}
              {children.length > 0 && (
                <div className="pl-6 sm:pl-11 pt-1 space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-4">
                  {children.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {sub.title}
                        </span>
                        <code className="text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                          {sub.url}
                        </code>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Toggle
                          size="sm"
                          checked={sub.is_active}
                          onChange={() => handleToggleActive(sub)}
                        />
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sub)}
                          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sub.id, sub.title)}
                          className="p-1 rounded-lg text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Menu Modal (Add / Edit) */}
      {isModalOpen && editingMenu && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMenu.id ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
          description="กรอกข้อมูลและระบุปลายทางของเมนูนำทาง"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                ชื่อเมนู (Menu Title) *
              </label>
              <input
                type="text"
                required
                value={editingMenu.title || ''}
                onChange={(e) => setEditingMenu({ ...editingMenu, title: e.target.value })}
                placeholder="เช่น สื่อการสอน, ห้องเรียนออนไลน์..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  ประเภทเมนู (Type)
                </label>
                <select
                  value={editingMenu.type || 'custom'}
                  onChange={(e) => setEditingMenu({ ...editingMenu, type: e.target.value as MenuItem['type'] })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="module">โมดูล (Module)</option>
                  <option value="page">หน้าเว็บ (Page)</option>
                  <option value="category">หมวดหมู่ (Category)</option>
                  <option value="external_link">ลิงก์ภายนอก (External)</option>
                  <option value="custom">กำหนดเอง (Custom URL)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  เมนูแม่ (Parent Menu)
                </label>
                <select
                  value={editingMenu.parent_id || ''}
                  onChange={(e) => setEditingMenu({ ...editingMenu, parent_id: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">(ไม่มี - เป็นเมนูหลัก)</option>
                  {rootMenus
                    .filter((m) => m.id !== editingMenu.id)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                URL / เส้นทางลิงก์ *
              </label>
              <input
                type="text"
                required
                value={editingMenu.url || ''}
                onChange={(e) => setEditingMenu({ ...editingMenu, url: e.target.value })}
                placeholder="เช่น /resources, /classroom, https://..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Toggle
                label="เปิดแท็บใหม่ (Open in new tab)"
                checked={editingMenu.open_new_tab || false}
                onChange={(checked) => setEditingMenu({ ...editingMenu, open_new_tab: checked })}
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
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
                บันทึกเมนู
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
