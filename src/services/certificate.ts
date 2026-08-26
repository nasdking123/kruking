export interface CertificateData {
  certificateNo: string;
  studentName: string;
  gradeLevel?: string;
  schoolName: string;
  title: string; // e.g. "ผ่านการทดสอบวัดผลสัมฤทธิ์ทางการเรียน วิชาวิทยาการคำนวณ"
  subtitle?: string;
  score?: number;
  totalScore?: number;
  percentage?: number;
  issueDate: string;
  teacherName: string;
  teacherTitle: string;
}

/**
 * Generate unique certificate code e.g. KCL-2026-XXXX
 */
export function generateCertificateCode(prefix = 'KCL'): string {
  const year = new Date().getFullYear() + 543; // BE year
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
}

/**
 * Format current date in Thai full format
 */
export function getThaiCertificateDate(date = new Date()): string {
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
