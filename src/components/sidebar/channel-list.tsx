
"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Hash, Lock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getConversations, togglePinConversation } from "@/lib/supabase";
import { type Conversation, ConversationType } from "@/types";
import { ChannelContextMenu } from "./channel-context-menu";

interface ChannelListProps {
  searchQuery?: string;
}

export function ChannelList({ searchQuery = "" }: ChannelListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    channelId: string | null;
    anchorRect: DOMRect | null;
  }>({
    isOpen: false,
    channelId: null,
    anchorRect: null,
  });

  // Keep track of button refs
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Extract conversationId from pathname if it exists
  const pathConversationId = pathname.match(/\/replies\/([^/]+)/)?.[1];

  useEffect(() => {
    if (pathConversationId) {
      setSelectedConversationId(pathConversationId);
    }
  }, [pathConversationId]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const allConversations = await getConversations();
        setConversations(allConversations);
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter channels based on search query and exclude pinned channels
  const channels = conversations
    .filter((c) => c.type === ConversationType.CHANNEL)
    .filter((c) => !c.is_pinned) // Exclude pinned channels
    .filter(
      (c) =>
        searchQuery === "" ||
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSelectChannel = (channelId: string) => {
    setSelectedConversationId(channelId);
    router.push(`/dashboard/replies/${channelId}`);
  };

  const handleContextMenu = (e: React.MouseEvent, channelId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const buttonElement = buttonRefs.current.get(channelId);

    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();

      setContextMenu({
        isOpen: true,
        channelId,
        anchorRect: rect,
      });
    }
  };

  const closeContextMenu = () => {
    setContextMenu({
      isOpen: false,
      channelId: null,
      anchorRect: null,
    });
  };

  // Save button ref
  const setButtonRef = (
    channelId: string,
    element: HTMLButtonElement | null
  ) => {
    if (element) {
      buttonRefs.current.set(channelId, element);
    } else {
      buttonRefs.current.delete(channelId);
    }
  };

  const handlePinChannel = async (channelId: string, isPinned: boolean) => {
    try {
      await togglePinConversation(channelId, isPinned);

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === channelId ? { ...conv, is_pinned: isPinned } : conv
        )
      );
    } catch (error) {
      console.error("Error toggling pin status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner size="md" />
      </div>
    );
  }

  if (channels.length === 0 && searchQuery) {
    return (
      <div className="px-3 py-4 text-center text-sm text-gray-500">
        No channels matching "{searchQuery}"
      </div>
    );
  }

  if (
    channels.length === 0 &&
    conversations.filter((c) => c.type === ConversationType.CHANNEL).length ===
      0
  ) {
    return (
      <div className="px-3 py-4 text-center text-sm text-gray-500">
        No channels available. Create one with the + button.
      </div>
    );
  }

  if (
    channels.length === 0 &&
    conversations.filter(
      (c) => c.type === ConversationType.CHANNEL && c.is_pinned
    ).length > 0
  ) {
    return (
      <div className="px-3 py-4 text-center text-sm text-gray-500">
        All channels are pinned above.
      </div>
    );
  }

  return (
    <div className="pl-6 pr-3">
      {channels.map((channel) => {
        const hasUnread = channel.unread_count && channel.unread_count > 0;
        const isPrivate = channel.title?.includes("team") || false;

        return (
          <div key={channel.id} className="relative group">
            <button
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                channel.id === selectedConversationId
                  ? "bg-[#fff9e5] text-[#ff6a00] font-medium"
                  : "text-gray-700 hover:bg-gray-100",
                hasUnread && "font-medium"
              )}
              onClick={() => handleSelectChannel(channel.id)}
              data-channel-item="true"
              data-channel-id={channel.id}
              tabIndex={0}
              role="button"
              aria-label={`Channel ${channel.title}`}
            >
              <div className="flex h-4 w-4 items-center justify-center text-gray-500">
                {isPrivate ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <Hash className="h-3 w-3" />
                )}
              </div>
              <span className="truncate flex-1">{channel.title}</span>

              {hasUnread && (
                <Badge
                  variant="default"
                  className="bg-[#ff6a00] hover:bg-[#ff6a00] text-white text-xs"
                >
                  {channel.unread_count}
                </Badge>
              )}

              <button
                ref={(el) => setButtonRef(channel.id, el)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
                onClick={(e) => handleContextMenu(e, channel.id)}
                aria-label="Channel options"
              >
                <MoreHorizontal className="h-3 w-3 text-gray-500" />
              </button>
            </button>

            {contextMenu.isOpen && contextMenu.channelId === channel.id && (
              <ChannelContextMenu
                channel={channel}
                isOpen={contextMenu.isOpen}
                onClose={closeContextMenu}
                // onPinChange={handlePinChannel}
                anchorRect={contextMenu.anchorRect}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
