"use client"

// import { useSupabase } from "@/providers/supabase-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { supabaseBrowserClient } from "@utils/supabase/client"

export function Header() {
  // const { supabase, session } = useSupabase()
  const router = useRouter()

  // Handle user logout
  const handleLogout = async () => {
    await supabaseBrowserClient.auth.signOut()
    router.push("/auth/login")
  }

  // Get user initials for avatar fallback
  // const getUserInitials = () => {
  //   // if (!session?.user?.email) return "U"

  //   const email = session.user.email
  //   const parts = email.split("@")[0].split(".")

  //   if (parts.length >= 2) {
  //     return (parts[0][0] + parts[1][0]).toUpperCase()
  //   }

  //   return email.substring(0, 2).toUpperCase()
  // }

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 justify-between">
        <div>
          <h1 className="text-xl font-semibold">Chat Application</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <ModeToggle />

          {/* User menu */}
          {/* {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.user_metadata?.avatar_url || "/placeholder.svg"} alt="User" />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.user_metadata?.username || session.user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )} */}
        </div>
      </div>
    </header>
  )
}
