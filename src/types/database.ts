export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'guest';

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          name: UserRole;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: UserRole;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: UserRole;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          bio: string | null;
          school: string | null;
          position: string | null;
          phone: string | null;
          social_links: Json;
          is_active: boolean;
          grade_level?: string | null;
          classroom?: string | null;
          student_number?: string | null;
          school_name?: string | null;
          nickname?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: UserRole;
          avatar_url?: string | null;
          bio?: string | null;
          school?: string | null;
          position?: string | null;
          phone?: string | null;
          social_links?: Json;
          is_active?: boolean;
          grade_level?: string | null;
          classroom?: string | null;
          student_number?: string | null;
          school_name?: string | null;
          nickname?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          bio?: string | null;
          school?: string | null;
          position?: string | null;
          phone?: string | null;
          social_links?: Json;
          is_active?: boolean;
          grade_level?: string | null;
          classroom?: string | null;
          student_number?: string | null;
          school_name?: string | null;
          nickname?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          key: string;
          name: string;
          description: string | null;
          icon: string;
          version: string;
          enabled: boolean;
          sort_order: number;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          name: string;
          description?: string | null;
          icon?: string;
          version?: string;
          enabled?: boolean;
          sort_order?: number;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          name?: string;
          description?: string | null;
          icon?: string;
          version?: string;
          enabled?: boolean;
          sort_order?: number;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      menus: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          url: string;
          icon: string | null;
          parent_id: string | null;
          sort_order: number;
          target: string;
          type: 'page' | 'module' | 'category' | 'external_link' | 'custom';
          module_key: string | null;
          permission: string;
          is_active: boolean;
          open_new_tab: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          url: string;
          icon?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          target?: string;
          type?: 'page' | 'module' | 'category' | 'external_link' | 'custom';
          module_key?: string | null;
          permission?: string;
          is_active?: boolean;
          open_new_tab?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string | null;
          url?: string;
          icon?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          target?: string;
          type?: 'page' | 'module' | 'category' | 'external_link' | 'custom';
          module_key?: string | null;
          permission?: string;
          is_active?: boolean;
          open_new_tab?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image: string | null;
          template: string;
          status: 'draft' | 'published' | 'archived';
          visibility: 'public' | 'unlisted' | 'private';
          seo_title: string | null;
          seo_description: string | null;
          og_image: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          template?: string;
          status?: 'draft' | 'published' | 'archived';
          visibility?: 'public' | 'unlisted' | 'private';
          seo_title?: string | null;
          seo_description?: string | null;
          og_image?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          template?: string;
          status?: 'draft' | 'published' | 'archived';
          visibility?: 'public' | 'unlisted' | 'private';
          seo_title?: string | null;
          seo_description?: string | null;
          og_image?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          title: string;
          subtitle: string | null;
          is_enabled: boolean;
          sort_order: number;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title: string;
          subtitle?: string | null;
          is_enabled?: boolean;
          sort_order?: number;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title?: string;
          subtitle?: string | null;
          is_enabled?: boolean;
          sort_order?: number;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          module_key: string | null;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          module_key?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          module_key?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      works: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          content: string | null;
          type: string;
          category_id: string | null;
          cover_image: string | null;
          author_id: string | null;
          grade_level: string | null;
          subject: string | null;
          featured: boolean;
          visibility: 'public' | 'unlisted' | 'private';
          published: boolean;
          published_at: string | null;
          view_count: number;
          download_count: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          content?: string | null;
          type: string;
          category_id?: string | null;
          cover_image?: string | null;
          author_id?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          featured?: boolean;
          visibility?: 'public' | 'unlisted' | 'private';
          published?: boolean;
          published_at?: string | null;
          view_count?: number;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          content?: string | null;
          type?: string;
          category_id?: string | null;
          cover_image?: string | null;
          author_id?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          featured?: boolean;
          visibility?: 'public' | 'unlisted' | 'private';
          published?: boolean;
          published_at?: string | null;
          view_count?: number;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          work_id: string;
          file_url: string | null;
          preview_url: string | null;
          external_link: string | null;
          resource_type: string;
          file_size: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          work_id: string;
          file_url?: string | null;
          preview_url?: string | null;
          external_link?: string | null;
          resource_type?: string;
          file_size?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          work_id?: string;
          file_url?: string | null;
          preview_url?: string | null;
          external_link?: string | null;
          resource_type?: string;
          file_size?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      worksheets: {
        Row: {
          id: string;
          work_id: string;
          pdf_url: string | null;
          answer_key_url: string | null;
          preview_url: string | null;
          file_size: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          work_id: string;
          pdf_url?: string | null;
          answer_key_url?: string | null;
          preview_url?: string | null;
          file_size?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          work_id?: string;
          pdf_url?: string | null;
          answer_key_url?: string | null;
          preview_url?: string | null;
          file_size?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      classrooms: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_image: string | null;
          grade_level: string | null;
          subject: string | null;
          teacher_id: string | null;
          status: 'active' | 'archived';
          visibility: 'public' | 'private';
          join_code: string | null;
          is_public?: boolean | null;
          course_type?: 'public' | 'enrolled' | null;
          estimated_hours?: number | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_image?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          teacher_id?: string | null;
          status?: 'active' | 'archived';
          visibility?: 'public' | 'private';
          join_code?: string | null;
          is_public?: boolean | null;
          course_type?: 'public' | 'enrolled' | null;
          estimated_hours?: number | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          cover_image?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          teacher_id?: string | null;
          status?: 'active' | 'archived';
          visibility?: 'public' | 'private';
          join_code?: string | null;
          is_public?: boolean | null;
          course_type?: 'public' | 'enrolled' | null;
          estimated_hours?: number | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          work_id: string | null;
          classroom_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          grade_level: string | null;
          subject: string | null;
          time_limit: number;
          attempt_limit: number;
          shuffle_questions: boolean;
          shuffle_choices: boolean;
          published: boolean;
          visibility: 'public' | 'private';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          work_id?: string | null;
          classroom_id?: string | null;
          title: string;
          slug: string;
          description?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          time_limit?: number;
          attempt_limit?: number;
          shuffle_questions?: boolean;
          shuffle_choices?: boolean;
          published?: boolean;
          visibility?: 'public' | 'private';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          work_id?: string | null;
          classroom_id?: string | null;
          title?: string;
          slug?: string;
          description?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          time_limit?: number;
          attempt_limit?: number;
          published?: boolean;
          visibility?: 'public' | 'private';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          classroom_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          classroom_id?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          classroom_id?: string | null;
          title: string;
          description: string | null;
          content: string | null;
          video_url: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          classroom_id?: string | null;
          title: string;
          description?: string | null;
          content?: string | null;
          video_url?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          classroom_id?: string | null;
          title?: string;
          description?: string | null;
          content?: string | null;
          video_url?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question: string;
          explanation: string | null;
          points: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question: string;
          explanation?: string | null;
          points?: number;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          question?: string;
          explanation?: string | null;
          points?: number;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      quiz_choices: {
        Row: {
          id: string;
          question_id: string;
          choice_text: string;
          is_correct: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          question_id: string;
          choice_text: string;
          is_correct: boolean;
          sort_order?: number;
        };
        Update: {
          id?: string;
          question_id?: string;
          choice_text?: string;
          is_correct?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          id: string;
          quiz_id: string;
          user_id: string | null;
          guest_name: string | null;
          score: number;
          total_score: number;
          percentage: number;
          correct_count: number;
          incorrect_count: number;
          time_spent_seconds: number;
          attempt_number: number;
          started_at: string;
          submitted_at: string | null;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          user_id?: string | null;
          guest_name?: string | null;
          score?: number;
          total_score?: number;
          percentage?: number;
          correct_count?: number;
          incorrect_count?: number;
          time_spent_seconds?: number;
          attempt_number?: number;
          started_at?: string;
          submitted_at?: string | null;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          user_id?: string | null;
          guest_name?: string | null;
          score?: number;
          total_score?: number;
          percentage?: number;
          correct_count?: number;
          incorrect_count?: number;
          time_spent_seconds?: number;
          attempt_number?: number;
          started_at?: string;
          submitted_at?: string | null;
        };
        Relationships: [];
      };
      downloads: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          file_path: string;
          file_url: string;
          preview_url: string | null;
          file_size: number;
          file_type: string;
          category_id: string | null;
          grade_level: string | null;
          subject: string | null;
          year: string | null;
          download_count: number;
          visibility: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          file_path: string;
          file_url: string;
          preview_url?: string | null;
          file_size?: number;
          file_type: string;
          category_id?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          year?: string | null;
          download_count?: number;
          visibility?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          file_path?: string;
          file_url?: string;
          preview_url?: string | null;
          file_size?: number;
          file_type?: string;
          category_id?: string | null;
          grade_level?: string | null;
          subject?: string | null;
          year?: string | null;
          download_count?: number;
          visibility?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_tools: {
        Row: {
          id: string;
          key: string;
          name: string;
          description: string | null;
          icon: string;
          is_enabled: boolean;
          system_prompt: string | null;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          name: string;
          description?: string | null;
          icon?: string;
          is_enabled?: boolean;
          system_prompt?: string | null;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          name?: string;
          description?: string | null;
          icon?: string;
          is_enabled?: boolean;
          system_prompt?: string | null;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      classroom_members: {
        Row: {
          id: string;
          classroom_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          classroom_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
        };
        Relationships: [];
      };
      views: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          user_id: string | null;
          action?: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id: string;
          user_id?: string | null;
          action?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          entity_type?: string;
          entity_id?: string;
          user_id?: string | null;
          action?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      assignment_submissions: {
        Row: {
          id: string;
          lesson_id: string;
          classroom_id: string | null;
          user_id: string;
          student_name: string;
          submission_type: 'link' | 'image' | 'text';
          content_url: string | null;
          notes: string | null;
          score: number | null;
          max_score: number;
          status: 'pending' | 'passed' | 'graded' | 'needs_revision';
          teacher_feedback: string | null;
          submitted_at: string;
          graded_at: string | null;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          classroom_id?: string | null;
          user_id: string;
          student_name: string;
          submission_type?: 'link' | 'image' | 'text';
          content_url?: string | null;
          notes?: string | null;
          score?: number | null;
          max_score?: number;
          status?: 'pending' | 'passed' | 'graded' | 'needs_revision';
          teacher_feedback?: string | null;
          submitted_at?: string;
          graded_at?: string | null;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          classroom_id?: string | null;
          user_id?: string;
          student_name?: string;
          submission_type?: 'link' | 'image' | 'text';
          content_url?: string | null;
          notes?: string | null;
          score?: number | null;
          max_score?: number;
          status?: 'pending' | 'passed' | 'graded' | 'needs_revision';
          teacher_feedback?: string | null;
          is_in_portfolio?: boolean;
          submitted_at?: string;
          graded_at?: string | null;
        };
        Relationships: [];
      };
      schools: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          logo_url: string | null;
          province: string | null;
          status: 'active' | 'inactive';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string | null;
          logo_url?: string | null;
          province?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string | null;
          logo_url?: string | null;
          province?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
        };
        Relationships: [];
      };
      student_groups: {
        Row: {
          id: string;
          name: string;
          school_id: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          school_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          school_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      assignments: {
        Row: {
          id: string;
          lesson_id: string | null;
          classroom_id: string | null;
          title: string;
          instructions: string;
          max_score: number;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id?: string | null;
          classroom_id?: string | null;
          title: string;
          instructions: string;
          max_score?: number;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string | null;
          classroom_id?: string | null;
          title?: string;
          instructions?: string;
          max_score?: number;
          due_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      student_certificates: {
        Row: {
          id: string;
          user_id: string;
          student_name: string;
          title: string;
          issuer: string;
          issue_date: string;
          image_url: string | null;
          competition_level: string | null;
          award_tier: string | null;
          status: 'pending' | 'approved' | 'rejected';
          reject_reason: string | null;
          approved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          student_name: string;
          title: string;
          issuer?: string;
          issue_date?: string;
          image_url?: string | null;
          competition_level?: string | null;
          award_tier?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          reject_reason?: string | null;
          approved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          student_name?: string;
          title?: string;
          issuer?: string;
          issue_date?: string;
          image_url?: string | null;
          competition_level?: string | null;
          award_tier?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          reject_reason?: string | null;
          approved_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      point_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          point_type: 'learning' | 'bonus' | 'assignment' | 'quiz' | 'competition' | 'award' | 'adjustment';
          source_id: string | null;
          description: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          point_type?: 'learning' | 'bonus' | 'assignment' | 'quiz' | 'competition' | 'award' | 'adjustment';
          source_id?: string | null;
          description: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          point_type?: 'learning' | 'bonus' | 'assignment' | 'quiz' | 'competition' | 'award' | 'adjustment';
          source_id?: string | null;
          description?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      student_awards: {
        Row: {
          id: string;
          user_id: string;
          student_name: string;
          award_name: string;
          award_type: 'winner' | 'runner_up' | 'outstanding' | 'top_score' | 'consistent' | 'gold' | 'silver' | 'bronze';
          description: string | null;
          badge_icon: string | null;
          issue_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          student_name: string;
          award_name: string;
          award_type?: 'winner' | 'runner_up' | 'outstanding' | 'top_score' | 'consistent' | 'gold' | 'silver' | 'bronze';
          description?: string | null;
          badge_icon?: string | null;
          issue_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          student_name?: string;
          award_name?: string;
          award_type?: 'winner' | 'runner_up' | 'outstanding' | 'top_score' | 'consistent' | 'gold' | 'silver' | 'bronze';
          description?: string | null;
          badge_icon?: string | null;
          issue_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      competitions: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          subject: string;
          grade_level: string | null;
          school_id: string | null;
          points_reward: number;
          status: 'draft' | 'active' | 'completed';
          start_date: string | null;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          subject?: string;
          grade_level?: string | null;
          school_id?: string | null;
          points_reward?: number;
          status?: 'draft' | 'active' | 'completed';
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          subject?: string;
          grade_level?: string | null;
          school_id?: string | null;
          points_reward?: number;
          status?: 'draft' | 'active' | 'completed';
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      competition_results: {
        Row: {
          id: string;
          competition_id: string;
          user_id: string;
          rank: number;
          score: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          competition_id: string;
          user_id: string;
          rank?: number;
          score?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          competition_id?: string;
          user_id?: string;
          rank?: number;
          score?: number;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      course_enrollments: {
        Row: {
          id: string;
          user_id: string;
          classroom_id: string;
          status: 'active' | 'completed' | 'dropped';
          progress_percentage: number;
          enrolled_at: string;
          completed_at: string | null;
          last_accessed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          classroom_id: string;
          status?: 'active' | 'completed' | 'dropped';
          progress_percentage?: number;
          enrolled_at?: string;
          completed_at?: string | null;
          last_accessed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          classroom_id?: string;
          status?: 'active' | 'completed' | 'dropped';
          progress_percentage?: number;
          enrolled_at?: string;
          completed_at?: string | null;
          last_accessed_at?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          classroom_id: string;
          lesson_id: string;
          is_completed: boolean;
          completed_at: string | null;
          time_spent_seconds: number;
          last_position_seconds: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          classroom_id: string;
          lesson_id: string;
          is_completed?: boolean;
          completed_at?: string | null;
          time_spent_seconds?: number;
          last_position_seconds?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          classroom_id?: string;
          lesson_id?: string;
          is_completed?: boolean;
          completed_at?: string | null;
          time_spent_seconds?: number;
          last_position_seconds?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      module_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
