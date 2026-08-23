export * from './database';

export type ContentType =
  | 'teaching'
  | 'resource'
  | 'worksheet'
  | 'game'
  | 'lesson_plan'
  | 'research'
  | 'innovation'
  | 'award'
  | 'activity'
  | 'video'
  | 'article';

export interface SiteSettings {
  site_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  contact_email: string;
  contact_phone: string;
  school_name: string;
  social_links: {
    facebook?: string;
    youtube?: string;
    line?: string;
    tiktok?: string;
    twitter?: string;
  };
  footer_text: string;
}

export interface MenuItem {
  id: string;
  title: string;
  slug?: string | null;
  url: string;
  icon?: string | null;
  parent_id?: string | null;
  sort_order: number;
  target?: string;
  type: 'page' | 'module' | 'category' | 'external_link' | 'custom';
  module_key?: string | null;
  permission?: string;
  is_active: boolean;
  open_new_tab: boolean;
  children?: MenuItem[];
}

export interface ModuleDefinition {
  id: string;
  key: string;
  name: string;
  description: string | null;
  icon: string;
  version: string;
  enabled: boolean;
  sort_order: number;
  config: Record<string, unknown>;
}

export interface AIProviderInterface {
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  generateLessonPlan(input: { grade: string; subject: string; topic: string; duration: string; objectives: string; style?: string }): Promise<string>;
  generateWorksheet(input: { grade: string; subject: string; topic: string; questionsCount: number; difficulty: string }): Promise<string>;
  generateQuiz(input: { grade: string; subject: string; topic: string; questionsCount: number; optionsCount: number }): Promise<string>;
  summarize(text: string): Promise<string>;
  generateActivity(input: { topic: string; grade: string; duration: string }): Promise<string>;
}
