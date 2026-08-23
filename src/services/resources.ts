import { getWorks, type WorkWithRelations } from './works';

export async function getResources(options?: {
  gradeLevel?: string;
  search?: string;
  limit?: number;
}): Promise<WorkWithRelations[]> {
  return await getWorks({
    type: 'resource',
    gradeLevel: options?.gradeLevel,
    search: options?.search,
    limit: options?.limit,
  });
}
