export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      chats: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          settings: Json
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          settings?: Json
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          settings?: Json
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      issue_comments: {
        Row: {
          body: string
          created_at: string
          deleted_at: string | null
          id: string
          is_admin_reply: boolean
          issue_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_admin_reply?: boolean
          issue_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_admin_reply?: boolean
          issue_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_upvotes: {
        Row: {
          created_at: string
          issue_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          issue_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          issue_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_upvotes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_pinned: boolean
          label: string | null
          status: string
          title: string
          updated_at: string
          upvotes: number
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean
          label?: string | null
          status?: string
          title: string
          updated_at?: string
          upvotes?: number
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean
          label?: string | null
          status?: string
          title?: string
          updated_at?: string
          upvotes?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jina_pool: {
        Row: {
          global_token_cap: number
          id: number
          tokens_consumed: number
          updated_at: string
          user_daily_limit: number
        }
        Insert: {
          global_token_cap?: number
          id?: number
          tokens_consumed?: number
          updated_at?: string
          user_daily_limit?: number
        }
        Update: {
          global_token_cap?: number
          id?: number
          tokens_consumed?: number
          updated_at?: string
          user_daily_limit?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string
          archived_at: string | null
          body: string | null
          comment_id: string | null
          created_at: string
          id: string
          issue_id: string
          read: boolean
          read_at: string | null
          recipient_id: string
          resource_id: string | null
          resource_type: string | null
          seen_at: string | null
          title: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          actor_id: string
          archived_at?: string | null
          body?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          issue_id: string
          read?: boolean
          read_at?: string | null
          recipient_id: string
          resource_id?: string | null
          resource_type?: string | null
          seen_at?: string | null
          title?: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          actor_id?: string
          archived_at?: string | null
          body?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          issue_id?: string
          read?: boolean
          read_at?: string | null
          recipient_id?: string
          resource_id?: string | null
          resource_type?: string | null
          seen_at?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "issue_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      openrouter_daily_pool: {
        Row: {
          cost_today_usd: number
          daily_limit: number
          id: number
          requests_today: number
          reset_date: string
        }
        Insert: {
          cost_today_usd?: number
          daily_limit?: number
          id?: number
          requests_today?: number
          reset_date?: string
        }
        Update: {
          cost_today_usd?: number
          daily_limit?: number
          id?: number
          requests_today?: number
          reset_date?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cost_reset_date: string
          created_at: string | null
          daily_cost_usd: number
          display_name: string | null
          handle: string
          id: string
          is_admin: boolean
          jina_searches_reset: string
          jina_searches_used: number
          language: string | null
          last_reset_date: string
          messages_limit: number
          messages_used: number
          preferences: Json | null
          reset_interval: string
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string
          subscription_tier: string
          total_cost: number
          total_tokens_used: number
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cost_reset_date?: string
          created_at?: string | null
          daily_cost_usd?: number
          display_name?: string | null
          handle: string
          id: string
          is_admin?: boolean
          jina_searches_reset?: string
          jina_searches_used?: number
          language?: string | null
          last_reset_date?: string
          messages_limit?: number
          messages_used?: number
          preferences?: Json | null
          reset_interval?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          subscription_tier?: string
          total_cost?: number
          total_tokens_used?: number
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cost_reset_date?: string
          created_at?: string | null
          daily_cost_usd?: number
          display_name?: string | null
          handle?: string
          id?: string
          is_admin?: boolean
          jina_searches_reset?: string
          jina_searches_used?: number
          language?: string | null
          last_reset_date?: string
          messages_limit?: number
          messages_used?: number
          preferences?: Json | null
          reset_interval?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          subscription_tier?: string
          total_cost?: number
          total_tokens_used?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      session_memory: {
        Row: {
          category: string
          created_at: string | null
          extracted_at: number
          id: string
          memory_key: string
          memory_value: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          extracted_at: number
          id?: string
          memory_key: string
          memory_value: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          extracted_at?: number
          id?: string
          memory_key?: string
          memory_value?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      archive_old_notifications: { Args: never; Returns: undefined }
      check_and_increment_jina_usage: {
        Args: { p_tokens?: number; p_user_id: string }
        Returns: {
          allowed: boolean
          reason: string
          searches_remaining: number
        }[]
      }
      check_and_increment_openrouter_quota: {
        Args: { p_tier: string; p_user_id: string }
        Returns: {
          allowed: boolean
          reason: string
        }[]
      }
      get_notifications: {
        Args: { p_limit?: number; p_offset?: number; p_user_id: string }
        Returns: {
          actor_avatar_url: string
          actor_handle: string
          actor_id: string
          body: string
          comment_id: string
          created_at: string
          id: string
          is_read: boolean
          issue_id: string
          resource_id: string
          resource_type: string
          title: string
          type: string
        }[]
      }
      get_unread_notification_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_user_usage: {
        Args: { p_user_id: string }
        Returns: {
          can_send: boolean
          daily_cost_budget_usd: number
          daily_cost_usd: number
          last_reset_date: string
          messages_limit: number
          messages_remaining: number
          messages_used: number
          reset_interval: string
          subscription_tier: string
          usage_percentage: number
        }[]
      }
      increment_token_usage: {
        Args: { p_cost?: number; p_tokens?: number; p_user_id: string }
        Returns: undefined
      }
      increment_user_usage: {
        Args: { p_amount?: number; p_user_id: string }
        Returns: {
          can_send: boolean
          messages_limit: number
          messages_remaining: number
          messages_used: number
          usage_percentage: number
        }[]
      }
      mark_notifications_read: {
        Args: { p_notification_ids?: string[]; p_user_id: string }
        Returns: undefined
      }
      mark_notifications_seen: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      search_users: {
        Args: {
          requesting_user_id: string
          result_limit?: number
          result_offset?: number
          search_term: string
        }
        Returns: {
          avatar_url: string
          display_name: string
          handle: string
          id: string
          relevance: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      blog_post_status: "draft" | "published"
      issue_label: "bug" | "feature" | "question" | "docs"
      issue_status: "open" | "in_progress" | "closed"
      notification_type: "mention" | "comment" | "status_change"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      blog_post_status: ["draft", "published"],
      issue_label: ["bug", "feature", "question", "docs"],
      issue_status: ["open", "in_progress", "closed"],
      notification_type: ["mention", "comment", "status_change"],
    },
  },
} as const
