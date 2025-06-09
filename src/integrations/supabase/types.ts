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
      audio_library: {
        Row: {
          album: string | null
          artist: string | null
          created_at: string
          duration_seconds: number | null
          file_format: string | null
          file_path: string | null
          file_size_bytes: number | null
          id: string
          last_played_at: string | null
          metadata: Json | null
          play_count: number
          playlist_ids: string[] | null
          stream_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          album?: string | null
          artist?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_format?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          last_played_at?: string | null
          metadata?: Json | null
          play_count?: number
          playlist_ids?: string[] | null
          stream_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          album?: string | null
          artist?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_format?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          last_played_at?: string | null
          metadata?: Json | null
          play_count?: number
          playlist_ids?: string[] | null
          stream_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          created_at: string
          error_message: string | null
          execution_details: Json | null
          execution_status: string
          execution_time_ms: number | null
          id: string
          rule_id: string
          trigger_source: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          execution_details?: Json | null
          execution_status: string
          execution_time_ms?: number | null
          id?: string
          rule_id: string
          trigger_source: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          execution_details?: Json | null
          execution_status?: string
          execution_time_ms?: number | null
          id?: string
          rule_id?: string
          trigger_source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          description: string | null
          enabled: boolean
          execution_count: number
          id: string
          last_executed_at: string | null
          name: string
          triggers: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          execution_count?: number
          id?: string
          last_executed_at?: string | null
          name: string
          triggers?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          enabled?: boolean
          execution_count?: number
          id?: string
          last_executed_at?: string | null
          name?: string
          triggers?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      device_connections: {
        Row: {
          audio_profile: string | null
          auto_connect: boolean
          battery_level: number | null
          connection_count: number
          created_at: string
          device_class: string | null
          device_name: string
          device_type: string
          id: string
          is_trusted: boolean
          last_connected_at: string | null
          mac_address: string | null
          signal_strength: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_profile?: string | null
          auto_connect?: boolean
          battery_level?: number | null
          connection_count?: number
          created_at?: string
          device_class?: string | null
          device_name: string
          device_type: string
          id?: string
          is_trusted?: boolean
          last_connected_at?: string | null
          mac_address?: string | null
          signal_strength?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_profile?: string | null
          auto_connect?: boolean
          battery_level?: number | null
          connection_count?: number
          created_at?: string
          device_class?: string | null
          device_name?: string
          device_type?: string
          id?: string
          is_trusted?: boolean
          last_connected_at?: string | null
          mac_address?: string | null
          signal_strength?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_commands: {
        Row: {
          audio_duration_ms: number | null
          command_text: string
          confidence_score: number | null
          created_at: string
          execution_successful: boolean
          id: string
          intent_detected: string | null
          language_code: string
          processing_time_ms: number | null
          response_text: string | null
          user_id: string
        }
        Insert: {
          audio_duration_ms?: number | null
          command_text: string
          confidence_score?: number | null
          created_at?: string
          execution_successful?: boolean
          id?: string
          intent_detected?: string | null
          language_code?: string
          processing_time_ms?: number | null
          response_text?: string | null
          user_id: string
        }
        Update: {
          audio_duration_ms?: number | null
          command_text?: string
          confidence_score?: number | null
          created_at?: string
          execution_successful?: boolean
          id?: string
          intent_detected?: string | null
          language_code?: string
          processing_time_ms?: number | null
          response_text?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
