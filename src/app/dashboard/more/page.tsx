import { SidebarMore } from "@/components/sidebar/sidebar-more"

export default function MorePage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">More Options</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SidebarMore />
      </div>
    </div>
  )
}
