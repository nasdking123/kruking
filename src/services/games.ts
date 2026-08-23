import { getWorks, type WorkWithRelations } from './works';

export async function getGames(options?: {
  gradeLevel?: string;
  search?: string;
  limit?: number;
}): Promise<WorkWithRelations[]> {
  return await getWorks({
    type: 'game',
    gradeLevel: options?.gradeLevel,
    search: options?.search,
    limit: options?.limit,
  });
}
