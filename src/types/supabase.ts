export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            attachments: {
                Row: {
                    created_at: string | null
                    id: string
                    message_id: string | null
                    name: string | null
                    size: number | null
                    type: string | null
                    url: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    message_id?: string | null
                    name?: string | null
                    size?: number | null
                    type?: string | null
                    url?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    message_id?: string | null
                    name?: string | null
                    size?: number | null
                    type?: string | null
                    url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "attachments_message_id_fkey"
                        columns: ["message_id"]
                        referencedRelation: "messages"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contact_submissions: {
                Row: {
                    company: string | null
                    created_at: string | null
                    email: string
                    id: string
                    message: string
                    name: string
                    status: string | null
                    subject: string | null
                    updated_at: string | null
                }
                Insert: {
                    company?: string | null
                    created_at?: string | null
                    email: string
                    id?: string
                    message: string
                    name: string
                    status?: string | null
                    subject?: string | null
                    updated_at?: string | null
                }
                Update: {
                    company?: string | null
                    created_at?: string | null
                    email?: string
                    id?: string
                    message?: string
                    name?: string
                    status?: string | null
                    subject?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            conversation_participants: {
                Row: {
                    conversation_id: string | null
                    id: string
                    joined_at: string | null
                    role: string | null
                    user_id: string | null
                }
                Insert: {
                    conversation_id?: string | null
                    id?: string
                    joined_at?: string | null
                    role?: string | null
                    user_id?: string | null
                }
                Update: {
                    conversation_id?: string | null
                    id?: string
                    joined_at?: string | null
                    role?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "conversation_participants_conversation_id_fkey"
                        columns: ["conversation_id"]
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "conversation_participants_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            conversations: {
                Row: {
                    created_at: string | null
                    id: string
                    last_message_at: string | null
                    organization_id: string | null
                    title: string | null
                    type: Database["public"]["Enums"]["conversation_type"] | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    last_message_at?: string | null
                    organization_id?: string | null
                    title?: string | null
                    type?: Database["public"]["Enums"]["conversation_type"] | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    last_message_at?: string | null
                    organization_id?: string | null
                    title?: string | null
                    type?: Database["public"]["Enums"]["conversation_type"] | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "conversations_organization_id_fkey"
                        columns: ["organization_id"]
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            drafts: {
                Row: {
                    content: string | null
                    conversation_id: string | null
                    created_at: string | null
                    id: string
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    content?: string | null
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    content?: string | null
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "drafts_conversation_id_fkey"
                        columns: ["conversation_id"]
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "drafts_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            messages: {
                Row: {
                    content: string | null
                    conversation_id: string | null
                    created_at: string | null
                    id: string
                    is_edited: boolean | null
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    content?: string | null
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    is_edited?: boolean | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    content?: string | null
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    is_edited?: boolean | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_conversation_id_fkey"
                        columns: ["conversation_id"]
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            organization_users: {
                Row: {
                    id: string
                    joined_at: string | null
                    organization_id: string | null
                    role: string | null
                    user_id: string | null
                }
                Insert: {
                    id?: string
                    joined_at?: string | null
                    organization_id?: string | null
                    role?: string | null
                    user_id?: string | null
                }
                Update: {
                    id?: string
                    joined_at?: string | null
                    organization_id?: string | null
                    role?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "organization_users_organization_id_fkey"
                        columns: ["organization_id"]
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "organization_users_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            organizations: {
                Row: {
                    created_at: string | null
                    domain: string | null
                    id: string
                    logo_url: string | null
                    name: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    domain?: string | null
                    id?: string
                    logo_url?: string | null
                    name?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    domain?: string | null
                    id?: string
                    logo_url?: string | null
                    name?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            pinned_conversations: {
                Row: {
                    conversation_id: string | null
                    created_at: string | null
                    id: string
                    user_id: string | null
                }
                Insert: {
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    user_id?: string | null
                }
                Update: {
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "pinned_conversations_conversation_id_fkey"
                        columns: ["conversation_id"]
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "pinned_conversations_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    bio: string | null
                    company: string | null
                    created_at: string | null
                    full_name: string | null
                    id: string
                    job_title: string | null
                    phone: string | null
                    subscription_status: string | null
                    subscription_tier: string | null
                    updated_at: string | null
                    website: string | null
                }
                Insert: {
                    bio?: string | null
                    company?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id: string
                    job_title?: string | null
                    phone?: string | null
                    subscription_status?: string | null
                    subscription_tier?: string | null
                    updated_at?: string | null
                    website?: string | null
                }
                Update: {
                    bio?: string | null
                    company?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id?: string
                    job_title?: string | null
                    phone?: string | null
                    subscription_status?: string | null
                    subscription_tier?: string | null
                    updated_at?: string | null
                    website?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reactions: {
                Row: {
                    created_at: string | null
                    emoji: string | null
                    id: string
                    message_id: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    emoji?: string | null
                    id?: string
                    message_id?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    emoji?: string | null
                    id?: string
                    message_id?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "reactions_message_id_fkey"
                        columns: ["message_id"]
                        referencedRelation: "messages"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reactions_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            read_receipts: {
                Row: {
                    conversation_id: string | null
                    id: string
                    last_read_at: string | null
                    last_read_message_id: string | null
                    user_id: string | null
                }
                Insert: {
                    conversation_id?: string | null
                    id?: string
                    last_read_at?: string | null
                    last_read_message_id?: string | null
                    user_id?: string | null
                }
                Update: {
                    conversation_id?: string | null
                    id?: string
                    last_read_at?: string | null
                    last_read_message_id?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "read_receipts_conversation_id_fkey"
                        columns: ["conversation_id"]
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "read_receipts_last_read_message_id_fkey"
                        columns: ["last_read_message_id"]
                        referencedRelation: "messages"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "read_receipts_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            testimonials: {
                Row: {
                    author_avatar_url: string | null
                    author_company: string | null
                    author_name: string
                    author_role: string | null
                    content: string
                    created_at: string | null
                    id: string
                    is_featured: boolean | null
                    rating: number | null
                    updated_at: string | null
                }
                Insert: {
                    author_avatar_url?: string | null
                    author_company?: string | null
                    author_name: string
                    author_role?: string | null
                    content: string
                    created_at?: string | null
                    id?: string
                    is_featured?: boolean | null
                    rating?: number | null
                    updated_at?: string | null
                }
                Update: {
                    author_avatar_url?: string | null
                    author_company?: string | null
                    author_name?: string
                    author_role?: string | null
                    content?: string
                    created_at?: string | null
                    id?: string
                    is_featured?: boolean | null
                    rating?: number | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            user_settings: {
                Row: {
                    created_at: string | null
                    email_notifications: boolean | null
                    id: string
                    marketing_emails: boolean | null
                    theme: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    email_notifications?: boolean | null
                    id: string
                    marketing_emails?: boolean | null
                    theme?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    email_notifications?: boolean | null
                    id?: string
                    marketing_emails?: boolean | null
                    theme?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "user_settings_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string | null
                    id: string
                    last_active: string | null
                    status: string | null
                    status_message: string | null
                    updated_at: string | null
                    username: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    id: string
                    last_active?: string | null
                    status?: string | null
                    status_message?: string | null
                    updated_at?: string | null
                    username?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    last_active?: string | null
                    status?: string | null
                    status_message?: string | null
                    updated_at?: string | null
                    username?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "users_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
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
            conversation_type: "direct" | "group" | "channel"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
