import { getWorks, type WorkWithRelations } from './works';

export async function getArticles(options?: {
  search?: string;
  limit?: number;
}): Promise<WorkWithRelations[]> {
  return await getWorks({
    type: 'article',
    search: options?.search,
    limit: options?.limit,
  });
}
