import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getClassroomBySlug, getLessonById } from '@/services/classroom';
import { LessonInteractiveViewer } from '@/components/public/lesson-interactive-viewer';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const classroom = await getClassroomBySlug(slug);
  const lesson = await getLessonById(slug, lessonId);
  if (!classroom || !lesson) return { title: 'ไม่พบบทเรียน' };

  return {
    title: `${lesson.title} | ${classroom.title}`,
    description: lesson.description || undefined,
  };
}

export default async function LessonViewerPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const classroom = await getClassroomBySlug(slug);
  if (!classroom) notFound();

  const lesson = await getLessonById(slug, lessonId);
  if (!lesson) notFound();

  return <LessonInteractiveViewer classroom={classroom} lesson={lesson} />;
}
