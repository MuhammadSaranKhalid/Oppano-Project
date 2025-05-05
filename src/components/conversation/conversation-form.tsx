"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
// import { useNotification } from "@/providers/notification-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { useCreate, useUpdate, useList } from "@refinedev/core"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Define the form schema using zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["CHANNEL", "DIRECT", "GROUP"]),
  organizationId: z.string().min(1, "Organization is required"),
  isPrivate: z.boolean().default(false),
  participants: z.array(z.string()).optional(),
})

type ConversationFormProps = {
  initialData?: any
  isEditing?: boolean
}

/**
 * ConversationForm component
 * Form for creating or editing a conversation
 */
export function ConversationForm({ initialData, isEditing = false }: ConversationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  // const notification = useNotification()
  const router = useRouter()

  // Fetch organizations for the dropdown
  const { data: orgData } = useList({
    resource: "organizations",
  })

  // Fetch users for participant selection
  const { data: userData } = useList({
    resource: "users",
  })

  // Update local state when data changes
  useEffect(() => {
    if (orgData?.data) {
      setOrganizations(orgData.data)
    }
    if (userData?.data) {
      setUsers(userData.data)
    }
  }, [orgData, userData])

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      type: initialData?.type || "CHANNEL",
      organizationId: initialData?.organizationId || "",
      isPrivate: initialData?.isPrivate || false,
      participants: initialData?.participants?.map((p: any) => p.userId) || [],
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
        // Update existing conversation
        updateMutation(
          {
            resource: "conversations",
            id: initialData.id,
            values,
          },
          {
            onSuccess: () => {
              // notification.success("Conversation updated successfully")
              router.push("/dashboard/conversations")
            },
            onError: (error) => {
              // notification.error("Failed to update conversation")
              console.error(error)
            },
          },
        )
      } else {
        // Create new conversation
        createMutation(
          {
            resource: "conversations",
            values,
          },
          {
            onSuccess: () => {
              // notification.success("Conversation created successfully")
              router.push("/dashboard/conversations")
            },
            onError: (error) => {
              // notification.error("Failed to create conversation")
              console.error(error)
            },
          },
        )
      }
    } catch (error) {
      // notification.error("An error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Watch the conversation type to conditionally show fields
  const conversationType = form.watch("type")

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Conversation" : "Create Conversation"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update your conversation's information" : "Create a new conversation for your organization"}
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
                  <FormLabel>Conversation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter conversation name" {...field} />
                  </FormControl>
                  <FormDescription>This is the name that will be displayed for your conversation.</FormDescription>
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
                      placeholder="Enter a description for your conversation"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide a brief description of this conversation.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Conversation Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="CHANNEL" />
                        </FormControl>
                        <FormLabel className="font-normal">Channel</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="DIRECT" />
                        </FormControl>
                        <FormLabel className="font-normal">Direct Message</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="GROUP" />
                        </FormControl>
                        <FormLabel className="font-normal">Group</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>Select the type of conversation you want to create.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the organization this conversation belongs to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {conversationType === "CHANNEL" && (
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Private Channel</FormLabel>
                      <FormDescription>
                        Make this channel private so it's only accessible to specific members.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {(conversationType === "DIRECT" || conversationType === "GROUP") && (
              <FormField
                control={form.control}
                name="participants"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Participants</FormLabel>
                      <FormDescription>Select the users who will participate in this conversation.</FormDescription>
                    </div>
                    {users.map((user) => (
                      <FormField
                        key={user.id}
                        control={form.control}
                        name="participants"
                        render={({ field }) => {
                          return (
                            <FormItem key={user.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(user.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, user.id])
                                      : field.onChange(field.value?.filter((value) => value !== user.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{user.name || user.email}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/conversations")}
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
