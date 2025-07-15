export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          address: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          email: string | null
          employee_id: number
          employment_type: string | null
          id: string
          job: string | null
          name: string | null
          notes: string | null
          payrate: number | null
          phone: string | null
          position: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["employee_status"] | null
        }
        Insert: {
          address?: string | null
          email?: string | null
          employee_id?: number
          employment_type?: string | null
          id: string
          job?: string | null
          name?: string | null
          notes?: string | null
          payrate?: number | null
          phone?: string | null
          position?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["employee_status"] | null
        }
        Update: {
          address?: string | null
          email?: string | null
          employee_id?: number
          employment_type?: string | null
          id?: string
          job?: string | null
          name?: string | null
          notes?: string | null
          payrate?: number | null
          phone?: string | null
          position?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["employee_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_job_fkey"
            columns: ["job"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number | null
          created_at: string
          description: string | null
          id: number
          invoice_number: string | null
          supplier: string | null
        }
        Insert: {
          amount?: number | null
          created_at: string
          description?: string | null
          id?: number
          invoice_number?: string | null
          supplier?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: number
          invoice_number?: string | null
          supplier?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          budget: number | null
          created_at: string
          customer: string | null
          description: string | null
          id: string
          invoice_number: string | null
          invoice_status: string | null
          name: string
          quote_number: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          customer?: string | null
          description?: string | null
          id?: string
          invoice_number?: string | null
          invoice_status?: string | null
          name: string
          quote_number?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          customer?: string | null
          description?: string | null
          id?: string
          invoice_number?: string | null
          invoice_status?: string | null
          name?: string
          quote_number?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_customer_fkey"
            columns: ["customer"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheets: {
        Row: {
          approved: boolean
          date: string
          description: string | null
          employee_id: string | null
          end_time: string | null
          id: string
          is_locked: boolean | null
          job_site: string | null
          lunch_end_time: string | null
          lunch_start_time: string | null
          start_time: string | null
          total_hours: number | null
        }
        Insert: {
          approved?: boolean
          date: string
          description?: string | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          is_locked?: boolean | null
          job_site?: string | null
          lunch_end_time?: string | null
          lunch_start_time?: string | null
          start_time?: string | null
          total_hours?: number | null
        }
        Update: {
          approved?: boolean
          date?: string
          description?: string | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          is_locked?: boolean | null
          job_site?: string | null
          lunch_end_time?: string | null
          lunch_start_time?: string | null
          start_time?: string | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_employee_timesheets: {
        Args: { p_start_date?: string; p_end_date?: string }
        Returns: Json
      }
      get_employees_with_timesheets: {
        Args: {
          search_name?: string
          emp_status?: string
          page_limit?: number
          page_number?: number
          week_start_date?: string
        }
        Returns: Json
      }
    }
    Enums: {
      employee_status:
        | "ACTIVE"
        | "INACTIVE"
        | "ONLEAVE"
        | "TERMINATED"
        | "AWAITINGVERIFICATION"
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
      employee_status: [
        "ACTIVE",
        "INACTIVE",
        "ONLEAVE",
        "TERMINATED",
        "AWAITINGVERIFICATION",
      ],
    },
  },
} as const
