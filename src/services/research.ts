import { getWorks, type WorkWithRelations } from './works';

export async function getResearch(options?: {
  search?: string;
  limit?: number;
}): Promise<WorkWithRelations[]> {
  return await getWorks({
    type: 'research',
    search: options?.search,
    limit: options?.limit,
  });
}
