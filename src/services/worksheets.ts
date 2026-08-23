import { getWorks, type WorkWithRelations } from './works';

export async function getWorksheets(options?: {
  gradeLevel?: string;
  search?: string;
  limit?: number;
}): Promise<WorkWithRelations[]> {
  return await getWorks({
    type: 'worksheet',
    gradeLevel: options?.gradeLevel,
    search: options?.search,
    limit: options?.limit,
  });
}
