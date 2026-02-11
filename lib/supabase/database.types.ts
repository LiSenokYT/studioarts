export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'user' | 'artist' | 'admin'
export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'discussing' | 'payment_pending' | 'in_progress' | 'completed' | 'cancelled'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          is_banned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          thumbnail_url: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          thumbnail_url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          thumbnail_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string
          artist_id: string | null
          title: string
          description: string
          reference_images: string[]
          status: OrderStatus
          rejection_reason: string | null
          price: number | null
          payment_screenshot_url: string | null
          payment_rejection_reason: string | null
          final_work_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          artist_id?: string | null
          title: string
          description: string
          reference_images?: string[]
          status?: OrderStatus
          rejection_reason?: string | null
          price?: number | null
          payment_screenshot_url?: string | null
          payment_rejection_reason?: string | null
          final_work_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          artist_id?: string | null
          title?: string
          description?: string
          reference_images?: string[]
          status?: OrderStatus
          rejection_reason?: string | null
          price?: number | null
          payment_screenshot_url?: string | null
          payment_rejection_reason?: string | null
          final_work_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          order_id: string
          sender_id: string
          content: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          sender_id: string
          content: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          sender_id?: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      testimonials: {
        Row: {
          id: string
          user_id: string
          content: string
          rating: number
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          rating: number
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          rating?: number
          is_approved?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
