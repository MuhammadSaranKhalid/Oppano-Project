"use client"

import { useState, useEffect } from "react"
import { useList } from "@refinedev/core"
import { useNotification } from "@/providers/notification-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Plus, Edit, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * OrganizationList component
 * Displays a list of organizations with options to create, edit, and delete
 */
export function OrganizationList() {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const notification = useNotification()
  const router = useRouter()

  // Fetch organizations using Refine's useList hook
  const {
    data,
    isLoading: listLoading,
    isError,
  } = useList({
    resource: "organizations",
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })

  // Update local state when data changes
  useEffect(() => {
    if (data?.data) {
      setOrganizations(data.data)
      setIsLoading(false)
    }
  }, [data])

  // Handle organization deletion
  const handleDelete = async (id: string) => {
    try {
      // Use Refine's delete mutation
      const response = await fetch(`/api/organizations/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete organization")
      }

      // Update the local state
      setOrganizations(organizations.filter((org) => org.id !== id))
      notification.success("Organization deleted successfully")
    } catch (error) {
      notification.error("Failed to delete organization")
      console.error(error)
    }
  }

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
        <p className="text-red-500">Error loading organizations</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Organizations</h2>
        <Button onClick={() => router.push("/dashboard/organizations/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Organization
        </Button>
      </div>

      {organizations.length === 0 ? (
        <div className="flex justify-center items-center h-64 border rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No organizations found</p>
            <Button onClick={() => router.push("/dashboard/organizations/create")}>
              <Plus className="mr-2 h-4 w-4" /> Create Organization
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((organization) => (
            <Card key={organization.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{organization.name}</CardTitle>
                <CardDescription>Created on {formatDate(organization.createdAt)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {organization.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/organizations/edit/${organization.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(organization.id)}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
