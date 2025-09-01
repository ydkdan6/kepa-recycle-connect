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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_summary: {
        Row: {
          active_users: number | null
          co2_saved_kg: number | null
          completed_requests: number | null
          created_at: string
          date: string
          id: string
          total_requests: number | null
          total_weight_kg: number | null
        }
        Insert: {
          active_users?: number | null
          co2_saved_kg?: number | null
          completed_requests?: number | null
          created_at?: string
          date: string
          id?: string
          total_requests?: number | null
          total_weight_kg?: number | null
        }
        Update: {
          active_users?: number | null
          co2_saved_kg?: number | null
          completed_requests?: number | null
          created_at?: string
          date?: string
          id?: string
          total_requests?: number | null
          total_weight_kg?: number | null
        }
        Relationships: []
      }
      campaign_participants: {
        Row: {
          campaign_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_participants_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          created_by: string
          description: string
          end_date: string
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string | null
          max_participants: number | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          data: Json | null
          id: string
          message: string
          read: boolean | null
          sent_at: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          sent_at?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          sent_at?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pickup_requests: {
        Row: {
          assigned_staff_id: string | null
          assigned_vehicle: string | null
          completed_date: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          notes: string | null
          photo_url: string | null
          pickup_address: string
          pickup_latitude: number | null
          pickup_longitude: number | null
          preferred_date: string | null
          quantity_kg: number
          scheduled_date: string | null
          status: Database["public"]["Enums"]["pickup_status"]
          updated_at: string
          user_id: string | null
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Insert: {
          assigned_staff_id?: string | null
          assigned_vehicle?: string | null
          completed_date?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          photo_url?: string | null
          pickup_address: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          preferred_date?: string | null
          quantity_kg: number
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["pickup_status"]
          updated_at?: string
          user_id?: string | null
          waste_type: Database["public"]["Enums"]["waste_type"]
        }
        Update: {
          assigned_staff_id?: string | null
          assigned_vehicle?: string | null
          completed_date?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          photo_url?: string | null
          pickup_address?: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          preferred_date?: string | null
          quantity_kg?: number
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["pickup_status"]
          updated_at?: string
          user_id?: string | null
          waste_type?: Database["public"]["Enums"]["waste_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          full_name: string
          id: string
          latitude: number | null
          longitude: number | null
          notification_preferences: Json | null
          phone: string | null
          points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notification_preferences?: Json | null
          phone?: string | null
          points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notification_preferences?: Json | null
          phone?: string | null
          points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "field_staff" | "resident"
      pickup_status:
        | "requested"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "delayed"
      waste_type:
        | "plastic"
        | "paper"
        | "organic"
        | "electronics"
        | "glass"
        | "metal"
        | "mixed"
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
      app_role: ["admin", "field_staff", "resident"],
      pickup_status: [
        "requested",
        "scheduled",
        "in_progress",
        "completed",
        "delayed",
      ],
      waste_type: [
        "plastic",
        "paper",
        "organic",
        "electronics",
        "glass",
        "metal",
        "mixed",
      ],
    },
  },
} as const
