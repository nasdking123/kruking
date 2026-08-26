import { createClient } from '@/lib/supabase/client';

export interface InAppNotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

// 1. Get User Notifications
export async function getUserNotifications(userId: string): Promise<InAppNotificationItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((n) => ({
    id: n.id,
    userId: n.user_id,
    title: n.title,
    message: n.message,
    type: n.type,
    link: n.link,
    isRead: n.is_read,
    createdAt: n.created_at,
  }));
}

// 2. Get Unread Notifications Count
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  return count || 0;
}
