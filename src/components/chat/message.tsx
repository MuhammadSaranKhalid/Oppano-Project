"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Reply,
  MoreVertical,
  Copy,
  Forward,
  Pin,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Message as MessageType } from "@/interfaces";
import { MessageType as MessageTypeEnum } from "@/interfaces";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageProps {
  message: MessageType;
  isFirstInGroup: boolean;
  isCurrentUser?: boolean;
  onReplyClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export function Message({
  message,
  isFirstInGroup,
  isCurrentUser,
  onReplyClick,
  onEditClick,
  onDeleteClick,
}: MessageProps) {
  const [showActions, setShowActions] = useState(false);

  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formattedTime = formatMessageTime(message.created_at);

  // Format message date for the date divider
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Check if this is a system message
  const isSystemMessage = message.message_type === MessageTypeEnum.SYSTEM;

  if (isSystemMessage) {
    return (
      <div className="flex justify-center py-3">
        <div className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-600 shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  // Render message content with mentions highlighted
  const renderMessageContent = (content = "") => {
    // Replace @mentions with styled spans
    return content.replace(/@(\w+)/g, (match, username) => {
      return `<span class="text-[#005fff] font-medium">@${username}</span>`;
    });
  };

  // Quick reaction options
  const quickReactions = [
    { emoji: "❤️", name: "heart" },
    { emoji: "👍", name: "thumbs up" },
    { emoji: "😊", name: "smile" },
    { emoji: "🎉", name: "celebrate" },
    { emoji: "🙏", name: "thank you" },
  ];

  return (
    <>
      {/* Date divider - would be conditionally rendered based on date changes */}
      {isFirstInGroup && message.id.includes("first") && (
        <div className="flex items-center justify-center my-6">
          <div className="bg-gray-200 h-px flex-grow max-w-[100px]"></div>
          <span className="px-4 text-xs font-medium text-gray-500">
            {formatMessageDate(message.created_at)}
          </span>
          <div className="bg-gray-200 h-px flex-grow max-w-[100px]"></div>
        </div>
      )}

      <div
        className={cn("group relative", isFirstInGroup ? "mt-6" : "mt-1")}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {isFirstInGroup && (
          <div className="flex items-center mb-1.5">
            <Avatar
              className={cn(
                "h-8 w-8 mr-2",
                isCurrentUser && "order-last ml-2 mr-0"
              )}
            >
              <AvatarImage
                src={
                  message.sender?.profile_picture ||
                  "/placeholder.svg?height=32&width=32&query=user avatar"
                }
                alt={message.sender?.username || "User"}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                {message.sender?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "flex items-center",
                isCurrentUser && "flex-row-reverse ml-auto"
              )}
            >
              <span className="font-medium text-sm mr-2 text-gray-800">
                {isCurrentUser
                  ? "You"
                  : message.sender?.username || "Unknown User"}
              </span>
              <span className="text-xs text-gray-500">{formattedTime}</span>
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex relative",
            !isFirstInGroup && "pl-10",
            isCurrentUser && "justify-end",
            !isFirstInGroup && isCurrentUser && "pl-0 pr-10"
          )}
        >
          <div className={cn("max-w-[85%]", isCurrentUser && "order-last")}>
            {/* Quoted message if any */}
            {message.parent_message_id && (
              <div
                className={cn(
                  "mb-1.5 border-l-2 pl-2 text-sm text-gray-600 rounded bg-gray-50 py-1.5 px-2",
                  isCurrentUser ? "border-blue-300" : "border-gray-300"
                )}
              >
                <div className="font-medium text-xs text-gray-500 mb-0.5">
                  {/* {message.parent_message ? (
                    <>
                      Replying to{" "}
                      <span className="font-semibold">
                        {message.parent_message.sender_id === message.sender_id
                          ? "yourself"
                          : message.parent_message.sender?.username ||
                            "Unknown User"}
                      </span>
                    </>
                  ) : (
                    "Replying to a message"
                  )} */}
                  <div className="font-medium text-xs text-gray-500 mb-0.5">
                    {message.parent_message_id ? (
                      <>
                        Replying to{" "}
                        <span className="font-semibold">
                          {message.parent_message_id === message.sender_id
                            ? "yourself"
                            : "Unknown User"}{" "}
                          {/* You can replace with actual sender if available */}
                        </span>
                      </>
                    ) : (
                      "Replying to a message"
                    )}
                  </div>
                </div>
                {/* <div className="line-clamp-1">
                  {message.parent_message
                    ? message.parent_message.content
                    : "Original message not available"}
                </div> */}
              </div>
            )}

            {/* Message content */}
            <div
              className={cn(
                "rounded-2xl px-4 py-2.5 shadow-sm",
                isCurrentUser
                  ? "bg-[#005fff] text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              )}
            >
              {message.message_type === MessageTypeEnum.FILE &&
              message.attachments &&
              message.attachments.length > 0 ? (
                <div className="flex items-center gap-3 rounded-md bg-white/10 p-3 border border-white/20 hover:bg-white/20 transition-colors">
                  <div
                    className={cn(
                      "rounded-full p-2.5",
                      isCurrentUser ? "bg-blue-400/30" : "bg-orange-100"
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={
                        isCurrentUser ? "text-white" : "text-orange-500"
                      }
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p
                      className={cn(
                        "truncate text-sm font-medium",
                        isCurrentUser ? "text-white" : ""
                      )}
                    >
                      {message.attachments[0].file?.name || "File"}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isCurrentUser ? "text-blue-100" : "text-gray-500"
                      )}
                    >
                      {message.attachments[0].file?.size
                        ? `${(message.attachments[0].file.size / 1024).toFixed(
                            1
                          )} KB`
                        : "Unknown size"}
                    </p>
                  </div>
                  <a
                    href={message.attachments[0].file?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "ml-2 text-sm font-medium",
                      isCurrentUser
                        ? "text-blue-100 hover:text-white"
                        : "text-orange-500 hover:text-orange-600"
                    )}
                  >
                    Download
                  </a>
                </div>
              ) : message.message_type === MessageTypeEnum.IMAGE &&
                message.attachments &&
                message.attachments.length > 0 ? (
                <div>
                  <img
                    src={
                      message.attachments[0].file?.url ||
                      "/placeholder.svg?height=300&width=400&query=image"
                    }
                    alt={message.attachments[0].caption || "Image"}
                    className="rounded-md max-w-full max-h-[300px] object-cover"
                  />
                  {message.content && (
                    <div
                      className="mt-2 whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{
                        __html: renderMessageContent(message.content),
                      }}
                    />
                  )}
                </div>
              ) : (
                <div
                  className="whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{
                    __html: renderMessageContent(message.content),
                  }}
                />
              )}
            </div>

            {/* Delivery status for current user's messages */}
            {isCurrentUser && (
              <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                {message.status === "READ" ? (
                  <span className="flex items-center justify-end gap-1">
                    Read
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 8.25L10.2 15.75L7.5 12.75"
                        stroke="#4CAF50"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 8.25L14.7 15.75L12 12.75"
                        stroke="#4CAF50"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : message.status === "DELIVERED" ? (
                  <span className="flex items-center justify-end gap-1">
                    Delivered
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 8.25L10.2 15.75L7.5 12.75"
                        stroke="#9E9E9E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="flex items-center justify-end gap-1">
                    Sent
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="7"
                        stroke="#9E9E9E"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 8V12L14 14"
                        stroke="#9E9E9E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </div>
            )}

            {/* Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div
                className={cn(
                  "flex mt-1",
                  isCurrentUser ? "justify-end" : "justify-start"
                )}
              >
                <div className="flex items-center bg-white rounded-full shadow-sm border border-gray-100 px-2 py-0.5">
                  {message.reactions.slice(0, 3).map((reaction, index) => (
                    <div key={`${reaction.emoji}-${index}`} className="px-1">
                      {reaction.emoji}
                    </div>
                  ))}
                  {message.reactions.length > 3 && (
                    <span className="text-xs text-gray-500 ml-1">
                      +{message.reactions.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Message actions */}
          {showActions && (
            <div
              className={cn(
                "absolute top-0 flex items-center space-x-1 bg-white rounded-full shadow-md border border-gray-100 p-0.5",
                isCurrentUser ? "-left-2" : "-right-2"
              )}
            >
              <TooltipProvider>
                {/* Quick reactions */}
                {quickReactions.map((reaction) => (
                  <Tooltip key={reaction.name}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-gray-100"
                      >
                        <span className="text-sm">{reaction.emoji}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{reaction.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {/* Reply button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-gray-100"
                      onClick={onReplyClick}
                    >
                      <Reply className="h-3.5 w-3.5 text-gray-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Reply</p>
                  </TooltipContent>
                </Tooltip>

                {/* More actions */}
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                  </Tooltip>

                  <DropdownMenuContent
                    align={isCurrentUser ? "start" : "end"}
                    className="w-48"
                  >
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() =>
                        navigator.clipboard.writeText(message.content || "")
                      }
                    >
                      <Copy className="h-4 w-4" /> Copy text
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Forward className="h-4 w-4" /> Forward message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Pin className="h-4 w-4" /> Pin to conversation
                    </DropdownMenuItem>
                    {isCurrentUser && (
                      <>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={onEditClick}
                        >
                          <Pencil className="h-4 w-4" /> Edit message
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-red-500"
                          onClick={onDeleteClick}
                        >
                          <Trash2 className="h-4 w-4" /> Delete message
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
