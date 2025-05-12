"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NavMenu } from "./nav-menu";
import { ChannelList } from "./channel-list";
import { DirectMessageList } from "./direct-message-list";
import { PinnedChannels } from "./pinned-channels";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { CreateDirectMessageModal } from "@/components/modals/create-direct-message-modal";
import { UserProfile } from "./user-profile";

export type SidebarTab =
  | "messages"
  | "activity"
  | "drafts"
  | "more"
  | "time"
  | "files"
  | "settings";

export function AppSidebar() {
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [directMessagesOpen, setDirectMessagesOpen] = useState(true);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] =
    useState(false);
  const [isCreateDirectMessageModalOpen, setIsCreateDirectMessageModalOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const pathname = usePathname();
  // const { activeSection, setActiveSection, fetchCurrentUser } = useChatStore()

  // Debounce search query to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Determine active section based on pathname
  // useEffect(() => {
  //   if (pathname.startsWith("/dashboard/replies")) {
  //     // setActiveSection("replies")
  //   } else if (pathname.startsWith("/dashboard/activity")) {
  //     // setActiveSection("activity")
  //   } else if (pathname.startsWith("/dashboard/drafts")) {
  //     // setActiveSection("drafts")
  //   } else if (pathname.startsWith("/dashboard/time")) {
  //     // setActiveSection("time")
  //   } else if (pathname.startsWith("/dashboard/files")) {
  //     // setActiveSection("files")
  //   } else if (pathname.startsWith("/dashboard/settings")) {
  //     // setActiveSection("settings")
  //   } else if (pathname.startsWith("/dashboard/more")) {
  //     // setActiveSection("more")
  //   }
  // }, [pathname, setActiveSection])

  // useEffect(() => {
  //   fetchCurrentUser()
  // }, [fetchCurrentUser])

  // Hide the sidebar on mobile when navigating to time page
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && pathname.startsWith("/dashboard/time")) {
        document.body.classList.add("sidebar-collapsed");
      } else {
        document.body.classList.remove("sidebar-collapsed");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

  // Handle search clear
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex h-full w-[280px] flex-col border-r bg-white md:w-[280px] sidebar-container">
      {/* Search bar */}
      <div className="flex items-center gap-2 p-3 border-b">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 rounded-full border bg-gray-100 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-[#ff6a00]"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation menu */}
      <NavMenu />

      {/* Divider */}
      <div className="h-px bg-gray-200 mx-3 my-1"></div>

      {/* Content based on active section */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Channels - always visible */}
        <PinnedChannels searchQuery={debouncedSearchQuery} />

        {/* Channels section - always visible */}
        <Collapsible
          open={channelsOpen}
          onOpenChange={setChannelsOpen}
          className="mt-2"
        >
          <div className="flex items-center justify-between py-1 px-3">
            <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium">
              <ChevronDown
                className={`h-4 w-4 ${
                  channelsOpen ? "" : "-rotate-90"
                } transition-transform`}
              />
              <span>Loopz</span>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-sm text-white bg-[#ff6a00] hover:bg-[#ff8c40] transition-colors"
              onClick={() => setIsCreateChannelModalOpen(true)}
              aria-label="Create channel"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <CollapsibleContent className="transition-all duration-200 ease-in-out">
            <ChannelList searchQuery={debouncedSearchQuery} />
          </CollapsibleContent>
        </Collapsible>

        {/* Direct Messages section - always visible */}
        <Collapsible
          open={directMessagesOpen}
          onOpenChange={setDirectMessagesOpen}
          className="mt-4"
        >
          <div className="flex items-center justify-between py-1 px-3">
            <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium">
              <ChevronDown
                className={`h-4 w-4 ${
                  directMessagesOpen ? "" : "-rotate-90"
                } transition-transform`}
              />
              <span>Direct Messages</span>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-sm text-white bg-[#ff6a00] hover:bg-[#ff8c40] transition-colors"
              onClick={() => setIsCreateDirectMessageModalOpen(true)}
              aria-label="Create direct message"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <CollapsibleContent className="transition-all duration-200 ease-in-out">
            <DirectMessageList searchQuery={debouncedSearchQuery} />
          </CollapsibleContent>
        </Collapsible>

        {/* Divider between persistent sections and tab-specific content */}
        {/* {activeSection !== "replies" && <div className="h-px bg-gray-200 mx-3 my-3"></div>} */}

        {/* Tab-specific content
        {activeSection === "activity" ? (
          <div className="max-h-[calc(100%-280px)] overflow-y-auto">
            <SidebarActivity />
          </div>
        ) : activeSection === "drafts" ? (
          <div className="max-h-[calc(100%-280px)] overflow-y-auto">
            <SidebarDrafts />
          </div>
        ) : activeSection === "more" || activeSection === "settings" ? (
          <div className="max-h-[calc(100%-280px)] overflow-y-auto">
            <SidebarMore />
          </div>
        ) : null} */}
      </div>

      {/* User profile */}
      <div className="mt-auto border-t p-3">
        <UserProfile />
      </div>

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
      />

      {/* Create Direct Message Modal */}
      <CreateDirectMessageModal
        isOpen={isCreateDirectMessageModalOpen}
        onClose={() => setIsCreateDirectMessageModalOpen(false)}
      />
    </div>
  );
}
