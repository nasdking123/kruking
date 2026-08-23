'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedGrade: string;
  onGradeChange: (val: string) => void;
  grades?: string[];
  placeholder?: string;
}

const defaultGrades = [
  'ทุกระดับชั้น',
  'ประถมศึกษาปีที่ 1',
  'ประถมศึกษาปีที่ 2',
  'ประถมศึกษาปีที่ 3',
  'ประถมศึกษาปีที่ 4',
  'ประถมศึกษาปีที่ 5',
  'ประถมศึกษาปีที่ 6',
  'มัธยมศึกษา',
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedGrade,
  onGradeChange,
  grades = defaultGrades,
  placeholder = 'ค้นหาสื่อ, ใบงาน หรือหัวข้อบทเรียน...',
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grade Selector */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
        >
          {grades.map((grade) => (
            <option key={grade} value={grade === 'ทุกระดับชั้น' ? '' : grade} className="dark:bg-slate-900">
              {grade}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
