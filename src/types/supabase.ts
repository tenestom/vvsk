export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: string
          created_at: string
          participant_name: string
          guardian1_name: string
          guardian1_phone: string
          guardian2_name: string | null
          guardian2_phone: string | null
          email: string
          selected_session: string
          total_price: number
          paid: boolean
          confirmation_sent: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          participant_name: string
          guardian1_name: string
          guardian1_phone: string
          guardian2_name?: string | null
          guardian2_phone?: string | null
          email: string
          selected_session: string
          total_price: number
          paid?: boolean
          confirmation_sent?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          participant_name?: string
          guardian1_name?: string
          guardian1_phone?: string
          guardian2_name?: string | null
          guardian2_phone?: string | null
          email?: string
          selected_session?: string
          total_price?: number
          paid?: boolean
          confirmation_sent?: boolean
        }
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
  }
}
