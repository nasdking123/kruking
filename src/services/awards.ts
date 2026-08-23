import { getWorks, type WorkWithRelations } from './works';

export async function getAwards(options?: {
  search?: string;
  limit?: number;
}): Promise<WorkWithRelations[]> {
  return await getWorks({
    type: 'award',
    search: options?.search,
    limit: options?.limit,
  });
}
