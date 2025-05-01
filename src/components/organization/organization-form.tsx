"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNotification } from "@/providers/notification-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useCreate, useUpdate } from "@refinedev/core"

// Define the form schema using zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type OrganizationFormProps = {
  initialData?: any
  isEditing?: boolean
}

/**
 * OrganizationForm component
 * Form for creating or editing an organization
 */
export function OrganizationForm({ initialData, isEditing = false }: OrganizationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const notification = useNotification()
  const router = useRouter()

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      logoUrl: initialData?.logoUrl || "",
    },
  })

  // Get Refine mutations for create and update
  const { mutate: createMutation } = useCreate()
  const { mutate: updateMutation } = useUpdate()

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      if (isEditing && initialData?.id) {
        // Update existing organization
        updateMutation(
          {
            resource: "organizations",
            id: initialData.id,
            values,
          },
          {
            onSuccess: () => {
              notification.success("Organization updated successfully")
              router.push("/dashboard/organizations")
            },
            onError: (error) => {
              notification.error("Failed to update organization")
              console.error(error)
            },
          },
        )
      } else {
        // Create new organization
        createMutation(
          {
            resource: "organizations",
            values,
          },
          {
            onSuccess: () => {
              notification.success("Organization created successfully")
              router.push("/dashboard/organizations")
            },
            onError: (error) => {
              notification.error("Failed to create organization")
              console.error(error)
            },
          },
        )
      }
    } catch (error) {
      notification.error("An error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Organization" : "Create Organization"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update your organization's information"
            : "Create a new organization to manage conversations and users"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organization name" {...field} />
                  </FormControl>
                  <FormDescription>This is the name that will be displayed for your organization.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description for your organization"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide a brief description of your organization.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormDescription>Enter a URL for your organization's logo (optional).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/organizations")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
