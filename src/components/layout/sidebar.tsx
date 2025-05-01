"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useList } from "@refinedev/core"
import { useSupabase } from "@/providers/supabase-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Home, Users, MessageSquare, FileText, Settings, PlusCircle, Building } from "lucide-react"
import { OrganizationSwitcher } from "@/components/organization/organization-switcher"

export function Sidebar() {
  const pathname = usePathname()
  const { session } = useSupabase()
  const [activeOrg, setActiveOrg] = useState<string | null>(null)

  // Fetch user's organizations using Refine's useList hook
  const { data: orgsData, isLoading: orgsLoading } = useList({
    resource: "OrganizationUser",
    filters: [
      {
        field: "userId",
        operator: "eq",
        value: session?.user?.id,
      },
    ],
    pagination: {
      mode: "off",
    },
    meta: {
      select: "*, organization:Organization(*)",
    },
  })

  // Set the active organization when data is loaded
  useEffect(() => {
    if (orgsData?.data && orgsData.data.length > 0) {
      // If no active org is set, use the first one
      if (!activeOrg) {
        setActiveOrg(orgsData.data[0].organizationId)
      }
    }
  }, [orgsData, activeOrg])

  // Navigation items
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Organizations",
      href: "/dashboard/organizations",
      icon: Building,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Conversations",
      href: "/dashboard/conversations",
      icon: MessageSquare,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: FileText,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="w-64 border-r bg-background h-screen flex flex-col">
      {/* Organization switcher */}
      <div className="p-4">
        <OrganizationSwitcher
          organizations={orgsData?.data || []}
          activeOrg={activeOrg}
          setActiveOrg={setActiveOrg}
          isLoading={orgsLoading}
        />
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Create new conversation button */}
        {activeOrg && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Conversations</h2>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href="/dashboard/conversations/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Conversation
              </Link>
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
