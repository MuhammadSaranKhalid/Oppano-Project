// import { redirect } from "next/navigation"
// // import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
// import { cookies } from "next/headers"

// export default async function Home() {
//   // Create a Supabase client for server-side authentication check
//   // const supabase = createServerComponentClient({ cookies })

//   // Check if user is authenticated
//   // const {
//   //   data: { session },
//   // } = await supabase.auth.getSession()

//   // If not authenticated, redirect to login page
//   // if (!session) {
//   //   redirect("/auth/login")
//   // }

//   // If authenticated, redirect to dashboard
//   // redirect("/dashboard")
// }

// import { StatusUpdateToast } from "@/components/chat/status-update-toast"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Chat App</h1>
      <p className="text-xl text-center max-w-2xl">
        Navigate through the sidebar to access channels, direct messages, and other features.
      </p>
      {/* <StatusUpdateToast /> */}
    </main>
  )
}