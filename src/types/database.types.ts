export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          author: string
          author_avatar: string | null
          body: string
          converted_lang: string
          created_at: string
          description: string | null
          doc_id: string
          id: string
          original_lang: string
          original_url: string
          published_at: string | null
          title: string
          user: string
        }
        Insert: {
          author: string
          author_avatar?: string | null
          body: string
          converted_lang: string
          created_at?: string
          description?: string | null
          doc_id: string
          id?: string
          original_lang: string
          original_url: string
          published_at?: string | null
          title: string
          user: string
        }
        Update: {
          author?: string
          author_avatar?: string | null
          body?: string
          converted_lang?: string
          created_at?: string
          description?: string | null
          doc_id?: string
          id?: string
          original_lang?: string
          original_url?: string
          published_at?: string | null
          title?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_user_fkey"
            columns: ["user"]
            isOneToOne: true
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar: string | null
          email: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar?: string | null
          email: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar?: string | null
          email?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          call_id: string | null
          call_link: string | null
          context: string
          conversation_id: string | null
          created_at: string
          description: string
          duration: number | null
          id: string
          notes: string | null
          personal_id: string
          replica_id: string
          scheduled_time: string | null
          status: string
          title: string
          tutor: string
          tutor_image: string
          tutor_personality: string
          url: string | null
          user_id: string
        }
        Insert: {
          call_id?: string | null
          call_link?: string | null
          context: string
          conversation_id?: string | null
          created_at?: string
          description?: string
          duration?: number | null
          id?: string
          notes?: string | null
          personal_id: string
          replica_id: string
          scheduled_time?: string | null
          status: string
          title: string
          tutor: string
          tutor_image: string
          tutor_personality?: string
          url?: string | null
          user_id: string
        }
        Update: {
          call_id?: string | null
          call_link?: string | null
          context?: string
          conversation_id?: string | null
          created_at?: string
          description?: string
          duration?: number | null
          id?: string
          notes?: string | null
          personal_id?: string
          replica_id?: string
          scheduled_time?: string | null
          status?: string
          title?: string
          tutor?: string
          tutor_image?: string
          tutor_personality?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_session_stats: {
        Args: { p_user_id: string }
        Returns: {
          user_id: string
          total_sessions: number
          scheduled_sessions: number
          ended_sessions: number
          total_duration: number
        }[]
      }
      get_user_sessions_chart_data: {
        Args: { user_id_param: string; year_param?: number }
        Returns: {
          month: string
          sessions: number
          month_number: number
        }[]
      }
      get_user_sessions_summary: {
        Args: { user_id_param: string; year_param?: number }
        Returns: {
          total_sessions: number
          current_month_sessions: number
          previous_month_sessions: number
          percentage_change: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
