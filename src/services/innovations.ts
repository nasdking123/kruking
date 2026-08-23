import { getWorks, type WorkWithRelations } from './works';

export async function getInnovations(options?: {
  search?: string;
  limit?: number;
}): Promise<WorkWithRelations[]> {
  return await getWorks({
    type: 'innovation',
    search: options?.search,
    limit: options?.limit,
  });
}
