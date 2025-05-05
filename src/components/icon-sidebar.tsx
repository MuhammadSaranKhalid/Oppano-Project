"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  MessageSquareReply,
  Activity,
  Clock,
  Folder,
  MoreVertical,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatStore } from "@/store/chat-store";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard/replies", section: "replies" },
  { icon: Clock, label: "Time", path: "/dashboard/time", section: "time" },
  { icon: Folder, label: "Files", path: "/dashboard/files", section: "files" },
  // {
  //   icon: MessageSquareReply,
  //   label: "Replies",
  //   path: "/dashboard/replies",
  //   section: "replies",
  // },
  // { icon: Activity, label: "Activity", path: "/dashboard/activity", section: "activity" },
];

const bottomNavItems = [
  {
    icon: Settings,
    label: "Settings",
    path: "/dashboard/settings",
    section: "settings",
  },
  {
    icon: MoreVertical,
    label: "More",
    path: "/dashboard/more",
    section: "more",
  },
];

export function IconSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setActiveSection } = useChatStore();

  // Determine active section based on pathname
  const getActiveSection = (path: string) => {
    if (path.startsWith("/dashboard/replies")) return "replies";
    if (path.startsWith("/dashboard/activity")) return "activity";
    if (path.startsWith("/dashboard/time")) return "time";
    if (path.startsWith("/dashboard/drafts")) return "drafts";
    if (path.startsWith("/dashboard/files")) return "files";
    if (path.startsWith("/dashboard/settings")) return "settings";
    if (path.startsWith("/dashboard/more")) return "more";
    return "replies"; // Default
  };

  const activeSection = getActiveSection(pathname);

  const handleNavigation = useCallback(
    (path: string, section: string) => {
      router.push(path);
      setActiveSection(section);
    },
    [router, setActiveSection]
  );

  return (
    <div className="flex h-full w-16 flex-col items-center border-r bg-white py-6 z-10 shadow-sm">
      <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ff8c40] shadow-md hover:shadow-lg transition-all duration-200">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8L12 16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12L16 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <TooltipProvider delayDuration={300}>
        <div className="flex flex-col items-center gap-7">
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                    activeSection === item.section
                      ? "bg-[#fff9e5] text-[#ff6a00] shadow-sm"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  )}
                  onClick={() => handleNavigation(item.path, item.section)}
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={10}
                className="bg-gray-800 text-white border-gray-800"
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="mt-auto flex flex-col items-center gap-7 mb-6">
          {bottomNavItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                    activeSection === item.section
                      ? "bg-[#fff9e5] text-[#ff6a00] shadow-sm"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  )}
                  onClick={() => handleNavigation(item.path, item.section)}
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={10}
                className="bg-gray-800 text-white border-gray-800"
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
