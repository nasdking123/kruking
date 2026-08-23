import { getWorks, type WorkWithRelations } from './works';

export async function getActivities(options?: {
  search?: string;
  limit?: number;
}): Promise<WorkWithRelations[]> {
  return await getWorks({
    type: 'activity',
    search: options?.search,
    limit: options?.limit,
  });
}
