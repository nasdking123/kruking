import { getWorks, type WorkWithRelations } from './works';

export async function getLessonPlans(options?: {
  gradeLevel?: string;
  search?: string;
  limit?: number;
}): Promise<WorkWithRelations[]> {
  return await getWorks({
    type: 'lesson_plan',
    gradeLevel: options?.gradeLevel,
    search: options?.search,
    limit: options?.limit,
  });
}
