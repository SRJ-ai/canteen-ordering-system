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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      allergens: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          id: string
          new_data: Json | null
          old_data: Json | null
          performed_at: string | null
          performed_by: string | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          performed_at?: string | null
          performed_by?: string | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          performed_at?: string | null
          performed_by?: string | null
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      canteen_users: {
        Row: {
          canteen_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          canteen_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          canteen_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canteen_users_canteen_id_fkey"
            columns: ["canteen_id"]
            isOneToOne: false
            referencedRelation: "canteens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canteen_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      canteens: {
        Row: {
          created_at: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canteens_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string | null
          created_at: string | null
          id: string
          menu_item_id: string | null
          notes: string | null
          quantity: number
          updated_at: string | null
        }
        Insert: {
          cart_id?: string | null
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          notes?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          cart_id?: string | null
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          notes?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string | null
          id: string
          session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "table_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          canteen_id: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          canteen_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          canteen_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_canteen_id_fkey"
            columns: ["canteen_id"]
            isOneToOne: false
            referencedRelation: "canteens"
            referencedColumns: ["id"]
          },
        ]
      }
      kitchen_orders: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          station_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          station_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          station_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kitchen_orders_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "kitchen_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      kitchen_stations: {
        Row: {
          canteen_id: string | null
          id: string
          name: string
        }
        Insert: {
          canteen_id?: string | null
          id?: string
          name: string
        }
        Update: {
          canteen_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_stations_canteen_id_fkey"
            columns: ["canteen_id"]
            isOneToOne: false
            referencedRelation: "canteens"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_addon_options: {
        Row: {
          addon_id: string | null
          id: string
          name: string
          price_adjustment: number | null
        }
        Insert: {
          addon_id?: string | null
          id?: string
          name: string
          price_adjustment?: number | null
        }
        Update: {
          addon_id?: string | null
          id?: string
          name?: string
          price_adjustment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_addon_options_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "menu_item_addons"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_addons: {
        Row: {
          id: string
          is_multiple: boolean | null
          is_required: boolean | null
          menu_item_id: string | null
          name: string
        }
        Insert: {
          id?: string
          is_multiple?: boolean | null
          is_required?: boolean | null
          menu_item_id?: string | null
          name: string
        }
        Update: {
          id?: string
          is_multiple?: boolean | null
          is_required?: boolean | null
          menu_item_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_addons_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_allergens: {
        Row: {
          allergen_id: string | null
          id: string
          menu_item_id: string | null
        }
        Insert: {
          allergen_id?: string | null
          id?: string
          menu_item_id?: string | null
        }
        Update: {
          allergen_id?: string | null
          id?: string
          menu_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_allergens_allergen_id_fkey"
            columns: ["allergen_id"]
            isOneToOne: false
            referencedRelation: "allergens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_allergens_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_availability: {
        Row: {
          day_of_week: number | null
          end_time: string | null
          id: string
          menu_item_id: string | null
          start_time: string | null
        }
        Insert: {
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          menu_item_id?: string | null
          start_time?: string | null
        }
        Update: {
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          menu_item_id?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_availability_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_images: {
        Row: {
          id: string
          image_url: string
          menu_item_id: string | null
        }
        Insert: {
          id?: string
          image_url: string
          menu_item_id?: string | null
        }
        Update: {
          id?: string
          image_url?: string
          menu_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_images_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_variants: {
        Row: {
          created_at: string | null
          id: string
          menu_item_id: string | null
          name: string
          price_override: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          name: string
          price_override?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          name?: string
          price_override?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_variants_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_available: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          email_enabled: boolean | null
          id: string
          push_enabled: boolean | null
          sms_enabled: boolean | null
          user_id: string | null
        }
        Insert: {
          email_enabled?: boolean | null
          id?: string
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          user_id?: string | null
        }
        Update: {
          email_enabled?: boolean | null
          id?: string
          push_enabled?: boolean | null
          sms_enabled?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_addons: {
        Row: {
          addon_option_id: string | null
          id: string
          order_item_id: string | null
          price_adjustment: number | null
        }
        Insert: {
          addon_option_id?: string | null
          id?: string
          order_item_id?: string | null
          price_adjustment?: number | null
        }
        Update: {
          addon_option_id?: string | null
          id?: string
          order_item_id?: string | null
          price_adjustment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_addons_addon_option_id_fkey"
            columns: ["addon_option_id"]
            isOneToOne: false
            referencedRelation: "menu_item_addon_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_addons_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          menu_item_id: string | null
          order_id: string | null
          quantity: number
          subtotal: number
          unit_price: number
        }
        Insert: {
          id?: string
          menu_item_id?: string | null
          order_id?: string | null
          quantity: number
          subtotal: number
          unit_price: number
        }
        Update: {
          id?: string
          menu_item_id?: string | null
          order_id?: string | null
          quantity?: number
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_notes: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          note: string
          order_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          note: string
          order_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          note?: string
          order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          order_id: string | null
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          order_id?: string | null
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          canteen_id: string | null
          created_at: string | null
          id: string
          order_number: string | null
          session_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          canteen_id?: string | null
          created_at?: string | null
          id?: string
          order_number?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          canteen_id?: string | null
          created_at?: string | null
          id?: string
          order_number?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_canteen_id_fkey"
            columns: ["canteen_id"]
            isOneToOne: false
            referencedRelation: "canteens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "table_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          created_at: string | null
          gateway_response: Json | null
          id: string
          payment_id: string | null
          transaction_reference: string | null
        }
        Insert: {
          created_at?: string | null
          gateway_response?: Json | null
          id?: string
          payment_id?: string | null
          transaction_reference?: string | null
        }
        Update: {
          created_at?: string | null
          gateway_response?: Json | null
          id?: string
          payment_id?: string | null
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_id: string | null
          reason: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_id?: string | null
          reason?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_id?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          name: Database["public"]["Enums"]["user_role_enum"]
        }
        Insert: {
          id?: string
          name: Database["public"]["Enums"]["user_role_enum"]
        }
        Update: {
          id?: string
          name?: Database["public"]["Enums"]["user_role_enum"]
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      table_qr_events: {
        Row: {
          id: string
          scanned_at: string | null
          table_id: string | null
        }
        Insert: {
          id?: string
          scanned_at?: string | null
          table_id?: string | null
        }
        Update: {
          id?: string
          scanned_at?: string | null
          table_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_qr_events_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      table_sessions: {
        Row: {
          ended_at: string | null
          id: string
          is_active: boolean | null
          started_at: string | null
          table_id: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          started_at?: string | null
          table_id?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          started_at?: string | null
          table_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_sessions_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          canteen_id: string | null
          created_at: string | null
          id: string
          qr_code: string | null
          table_number: string
          updated_at: string | null
        }
        Insert: {
          canteen_id?: string | null
          created_at?: string | null
          id?: string
          qr_code?: string | null
          table_number: string
          updated_at?: string | null
        }
        Update: {
          canteen_id?: string | null
          created_at?: string | null
          id?: string
          qr_code?: string | null
          table_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tables_canteen_id_fkey"
            columns: ["canteen_id"]
            isOneToOne: false
            referencedRelation: "canteens"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      order_status:
        | "PENDING"
        | "CONFIRMED"
        | "ACCEPTED"
        | "PREPARING"
        | "READY"
        | "COMPLETED"
        | "CANCELLED"
      payment_status:
        | "CREATED"
        | "PENDING"
        | "AUTHORIZED"
        | "PAID"
        | "FAILED"
        | "CANCELLED"
        | "REFUNDED"
        | "PARTIALLY_REFUNDED"
      user_role_enum:
        | "SUPER_ADMIN"
        | "ADMIN"
        | "KITCHEN_STAFF"
        | "CASHIER"
        | "CUSTOMER"
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
      order_status: [
        "PENDING",
        "CONFIRMED",
        "ACCEPTED",
        "PREPARING",
        "READY",
        "COMPLETED",
        "CANCELLED",
      ],
      payment_status: [
        "CREATED",
        "PENDING",
        "AUTHORIZED",
        "PAID",
        "FAILED",
        "CANCELLED",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
      ],
      user_role_enum: [
        "SUPER_ADMIN",
        "ADMIN",
        "KITCHEN_STAFF",
        "CASHIER",
        "CUSTOMER",
      ],
    },
  },
} as const
