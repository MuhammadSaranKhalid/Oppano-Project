"use client"

import { useState, useEffect } from "react"
import { useList } from "@refinedev/core"
import { useNotification } from "@/providers/notification-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Eye, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

/**
 * UserList component
 * Displays a list of users with options to view details
 */
export function UserList() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const notification = useNotification()
  const router = useRouter()

  // Fetch users using Refine's useList hook
  const {
    data,
    isLoading: listLoading,
    isError,
  } = useList({
    resource: "users",
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })

  // Update local state when data changes
  useEffect(() => {
    if (data?.data) {
      setUsers(data.data)
      setIsLoading(false)
    }
  }, [data])

  // Show loading state
  if (isLoading || listLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading users</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
      </div>

      {users.length === 0 ? (
        <div className="flex justify-center items-center h-64 border rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No users found</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user.name || "Unnamed User"}</CardTitle>
                    <CardDescription>Joined on {formatDate(user.createdAt)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
                  <div className="flex items-center text-sm">
                    <Badge variant={user.isActive ? "success" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/dashboard/users/show/${user.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> View Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
