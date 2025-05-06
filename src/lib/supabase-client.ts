import { supabaseBrowserClient } from "@utils/supabase/client"

// Helper function to get the current user
export async function getCurrentUser() {
    const {
        data: { session },
    } = await supabaseBrowserClient.auth.getSession()
    return session?.user
}

// Helper function to get the current user's organization
export async function getCurrentUserOrganization() {
    const user = await getCurrentUser()

    if (!user) return null

    const { data, error } = await supabaseBrowserClient
        .from("organization_users")
        .select("organization_id, organizations(id, name, logo_url)")
        .eq("user_id", user.id)
        .single()

    if (error || !data) return null

    return {
        id: data.organization_id,
        ...data.organizations,
    }
}
