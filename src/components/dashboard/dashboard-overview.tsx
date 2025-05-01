"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useList } from "@refinedev/core"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Building } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { RecentConversations } from "@/components/conversation/recent-conversations"

interface DashboardOverviewProps {
  userId: string
}

export function DashboardOverview({ userId }: DashboardOverviewProps) {
  const [activeOrg, setActiveOrg] = useState<string | null>(null)

  // Fetch user's organizations
  const { data: orgsData, isLoading: orgsLoading } = useList({
    resource: "OrganizationUser",
    filters: [
      {
        field: "userId",
        operator: "eq",
        value: userId,
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
      setActiveOrg(orgsData.data[0].organizationId)
    }
  }, [orgsData])

  // Fetch conversations for the active organization
  const { data: conversationsData, isLoading: conversationsLoading } = useList({
    resource: "Conversation",
    filters: [
      {
        field: "organizationId",
        operator: "eq",
        value: activeOrg,
      },
      {
        field: "isArchived",
        operator: "eq",
        value: false,
      },
    ],
    pagination: {
      mode: "off",
    },
    meta: {
      select: "*",
    },
    queryOptions: {
      enabled: !!activeOrg,
    },
  })

  // Fetch users for the active organization
  const { data: usersData, isLoading: usersLoading } = useList({
    resource: "OrganizationUser",
    filters: [
      {
        field: "organizationId",
        operator: "eq",
        value: activeOrg,
      },
    ],
    pagination: {
      mode: "off",
    },
    meta: {
      select: "*, user:User(*)",
    },
    queryOptions: {
      enabled: !!activeOrg,
    },
  })

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Organizations"
          value={orgsData?.data?.length || 0}
          description="Total organizations"
          icon={<Building className="h-4 w-4" />}
          isLoading={orgsLoading}
        />
        <StatsCard
          title="Conversations"
          value={conversationsData?.data?.length || 0}
          description="Active conversations"
          icon={<MessageSquare className="h-4 w-4" />}
          isLoading={conversationsLoading || !activeOrg}
        />
        <StatsCard
          title="Team Members"
          value={usersData?.data?.length || 0}
          description="Active members"
          icon={<Users className="h-4 w-4" />}
          isLoading={usersLoading || !activeOrg}
        />
      </div>

      {/* Recent Activity */}
      <Tabs defaultValue="conversations" className="w-full">
        <TabsList>
          <TabsTrigger value="conversations">Recent Conversations</TabsTrigger>
          <TabsTrigger value="messages">Recent Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="conversations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Your most recent conversations across all organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentConversations userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="messages" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Your most recent messages across all conversations</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Recent messages component would go here */}
              <p>Recent messages will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  isLoading: boolean
}

function StatsCard({ title, value, description, icon, isLoading }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold">{value}</div>}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
