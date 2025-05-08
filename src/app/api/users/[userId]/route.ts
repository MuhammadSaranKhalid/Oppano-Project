import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const userId = params.userId
    const supabase = createRouteHandlerClient({ cookies })

    try {
        const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data })
    } catch (error) {
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    }
}
