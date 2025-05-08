import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId
    const supabase = createRouteHandlerClient({ cookies })

    try {
        const { data, error } = await supabase
            .from("messages")
            .select(`
        *,
        sender:users(*),
        reactions(*),
        attachments:message_attachments(*),
        parent_message:messages!messages_parent_message_id_fkey(
          id,
          content,
          sender_id,
          sender:users(*)
        )
      `)
            .eq("id", messageId)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data })
    } catch (error) {
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    }
}
