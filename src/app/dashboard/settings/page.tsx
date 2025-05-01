import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Settings</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center justify-center h-64 px-4 py-6 text-center text-muted-foreground">
          <Settings className="h-12 w-12 mb-4 text-muted-foreground/50" />
          <h3 className="text-sm font-medium mb-2">Settings & Preferences</h3>
          <p className="text-xs">Customize your chat experience and account settings</p>
        </div>
      </div>
    </div>
  )
}
