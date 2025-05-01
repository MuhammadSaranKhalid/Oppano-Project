"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface OrganizationSwitcherProps {
  organizations: any[]
  activeOrg: string | null
  setActiveOrg: (orgId: string) => void
  isLoading: boolean
}

export function OrganizationSwitcher({ organizations, activeOrg, setActiveOrg, isLoading }: OrganizationSwitcherProps) {
  const router = useRouter()

  // Handle organization change
  const handleOrgChange = (orgId: string) => {
    setActiveOrg(orgId)
    // You could store the active org in localStorage or a global state here
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />
  }

  return (
    <div className="flex flex-col space-y-2">
      <Select value={activeOrg || ""} onValueChange={handleOrgChange} disabled={organizations.length === 0}>
        <SelectTrigger>
          <SelectValue placeholder="Select organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org) => (
            <SelectItem key={org.organizationId} value={org.organizationId}>
              {org.organization.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.push("/dashboard/organizations/create")}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        New Organization
      </Button>
    </div>
  )
}
