import type { StudentAnalyticsItem } from './student';

/**
 * Exports student gradebook and analytics to CSV (UTF-8 with BOM for Excel)
 */
export function exportStudentsToExcel(students: StudentAnalyticsItem[], filenamePrefix = 'kruking_gradebook') {
  if (!students || students.length === 0) {
    alert('ไม่มีข้อมูลนักเรียนสำหรับส่งออก');
    return;
  }

  const headers = [
    'ลำดับ',
    'ชื่อ - นามสกุล',
    'ชื่อผู้ใช้ (Username)',
    'ระดับชั้น',
    'ห้อง',
    'เลขที่',
    'โรงเรียน',
    'จำนวนห้องเรียนที่สมัคร',
    'บทเรียนที่เรียนจบ (บท)',
    'คะแนนสอบเฉลี่ย (%)',
    'จำนวนชุดข้อสอบที่ทำ',
    'วันที่ลงทะเบียน'
  ];

  const rows = students.map((std, index) => {
    const username = std.email?.replace('@student.kruking.ac.th', '') || '-';
    const createdAt = std.created_at ? new Date(std.created_at).toLocaleDateString('th-TH') : '-';
    
    return [
      index + 1,
      `"${(std.full_name || '').replace(/"/g, '""')}"`,
      `"${username}"`,
      `"${std.grade_level || '-'}"`,
      `"${std.classroom_name || '-'}"`,
      `"${std.student_number || '-'}"`,
      `"${(std.school || 'โรงเรียนวัดบางโฉลงใน').replace(/"/g, '""')}"`,
      std.enrollments?.length || 0,
      std.completed_lessons_count || 0,
      `${std.average_score || 0}%`,
      std.attempts?.length || 0,
      `"${createdAt}"`
    ];
  });

  // Construct CSV content with UTF-8 BOM (\uFEFF)
  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
