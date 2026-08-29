import React from 'react';
import type { Metadata } from 'next';
import { getWorks } from '@/services/works';
import { ResourceLibrary } from '@/components/public/resource-library';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'คลังสื่อและนวัตกรรมการเรียนรู้ | ห้องสื่อครูคิง',
  description: 'ศูนย์รวมสื่อการสอน สไลด์บรรยาย Infographic ใบงาน แผน 5E และสื่อดิจิทัล Active Learning ดาวน์โหลดฟรี',
};

export default async function ResourcesPage() {
  const allWorks = await getWorks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ResourceLibrary initialWorks={allWorks} />
    </div>
  );
}
