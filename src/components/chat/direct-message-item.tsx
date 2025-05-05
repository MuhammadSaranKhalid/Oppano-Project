import { useRouter, usePathname } from "next/navigation";
import { useChatStore } from "@/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { UserStatus } from "@/types";

interface DirectMessageItemProps {
  name: string;
  conversationId: string;
  isYou?: boolean;
  isActive?: boolean;
  latestMessage?: any;
  unreadCount?: number;
  onClick: (id: string) => void;
}

export function DirectMessageItem({
  name,
  conversationId,
  isYou = false,
  isActive = false,
  latestMessage,
  unreadCount = 0,
  onClick,
}: DirectMessageItemProps) {
  const router = useRouter();

  const handleClick = () => {
    onClick(conversationId);
  };

  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors relative",
        isActive
          ? "bg-[#fff9e5] text-[#ff6a00] font-medium"
          : "text-gray-700 hover:bg-gray-100",
        unreadCount > 0 && "font-medium"
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col items-start overflow-hidden">
        <span className="truncate w-full text-left">
          {name}
        </span>
        {latestMessage && (
          <span
            className={cn(
              "text-xs truncate w-full text-left",
              isActive ? "text-[#ff6a00]/80" : "text-gray-500"
            )}
          >
            {latestMessage.content}
          </span>
        )}
      </div>

      {unreadCount > 0 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6a00] px-1.5 text-xs font-medium text-white">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
