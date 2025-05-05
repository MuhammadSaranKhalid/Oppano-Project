"use client"

import { useState, useEffect } from "react"
import { useOne } from "@refinedev/core"
// import { useNotification } from "@/providers/notification-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { formatDate } from "@/lib/utils"
import { Mail, Phone, Calendar, Building, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type UserProfileProps = {
  userId: string
}

/**
 * UserProfile component
 * Displays detailed information about a user
 */
export function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  // const notification = useNotification()

  // Fetch user using Refine's useOne hook
  const {
    data,
    isLoading: oneLoading,
    isError,
  } = useOne({
    resource: "users",
    id: userId,
    meta: {
      select: "*, organizations:userOrganizations(organization(*))",
    },
  })

  // Fetch user's conversations
  const { data: conversationsData } = useOne({
    resource: "conversationParticipants",
    id: userId,
    meta: {
      select: "*, conversation(*)",
    },
  })

  // Update local state when data changes
  useEffect(() => {
    if (data?.data) {
      setUser(data.data)
      setIsLoading(false)
    }
  }, [data])

  // Show loading state
  if (isLoading || oneLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  // Show error state
  if (isError || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading user profile</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name || "Unnamed User"}</CardTitle>
              <CardDescription>
                <Badge variant={user.isActive ? "success" : "secondary"} className="mt-1">
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="mt-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Account Information</h3>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Joined on {formatDate(user.createdAt)}</span>
                  </div>
                  {user.lastActive && (
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Last active on {formatDate(user.lastActive)}</span>
                    </div>
                  )}
                </div>
              </div>
              {user.bio && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
                  <p className="text-sm">{user.bio}</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="organizations" className="mt-4">
              {user.organizations && user.organizations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.organizations.map((userOrg: any) => (
                    <Card key={userOrg.organization.id}>
                      <CardHeader className="pb-2">
                        <CardTitle>{userOrg.organization.name}</CardTitle>
                        <CardDescription>Joined on {formatDate(userOrg.createdAt)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm">
                          <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{userOrg.organization.description || "No description"}</span>
                        </div>
                        <div className="mt-2">
                          <Badge>{userOrg.role || "Member"}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">User is not a member of any organizations.</p>
              )}
            </TabsContent>
            <TabsContent value="conversations" className="mt-4">
              {conversationsData?.data?.conversation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conversationsData.data.conversation.map((conv: any) => (
                    <Card key={conv.id}>
                      <CardHeader className="pb-2">
                        <CardTitle>{conv.name}</CardTitle>
                        <CardDescription>Created on {formatDate(conv.createdAt)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm">
                          <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{conv.description || "No description"}</span>
                        </div>
                        <div className="mt-2">
                          <Badge>{conv.type}</Badge>
                          {conv.isPrivate && (
                            <Badge variant="outline" className="ml-2">
                              Private
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">User is not part of any conversations.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
