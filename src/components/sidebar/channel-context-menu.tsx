// "use client"

// import { useRef, useEffect, useState } from "react"
// import { Pin, PinOff, Bell, BellOff, Trash, Edit, AlertCircle } from "lucide-react"
// import { useChatStore } from "@/store/chat-store"
// import { useToast } from "@/components/ui/use-toast"
// import type { Conversation } from "@/types"

// interface ChannelContextMenuProps {
//   channel: Conversation
//   isOpen: boolean
//   onClose: () => void
//   anchorRect: DOMRect | null
// }

// export function ChannelContextMenu({ channel, isOpen, onClose, anchorRect }: ChannelContextMenuProps) {
//   const menuRef = useRef<HTMLDivElement>(null)
//   const { pinChannel, unpinChannel } = useChatStore()
//   const { toast } = useToast()
//   const [position, setPosition] = useState({
//     top: 0,
//     left: 0,
//     placement: "bottom" as "bottom" | "top" | "left" | "right",
//   })
//   const [isMuted, setIsMuted] = useState(false)

//   // Calculate optimal position when menu opens or anchor position changes
//   useEffect(() => {
//     if (isOpen && anchorRect && menuRef.current) {
//       const menuRect = menuRef.current.getBoundingClientRect()
//       const viewportHeight = window.innerHeight
//       const viewportWidth = window.innerWidth

//       // Default position (right of the button)
//       let newPosition = {
//         top: anchorRect.top,
//         left: anchorRect.right + 8, // 8px offset from button
//         placement: "right" as "bottom" | "top" | "left" | "right",
//       }

//       // Check if menu would go off the right edge
//       if (anchorRect.right + menuRect.width + 8 > viewportWidth) {
//         // Position to the left of the button
//         newPosition = {
//           top: anchorRect.top,
//           left: anchorRect.left - menuRect.width - 8,
//           placement: "left" as "bottom" | "top" | "left" | "right",
//         }
//       }

//       // If menu would go off the bottom edge, adjust vertical position
//       if (newPosition.top + menuRect.height > viewportHeight) {
//         newPosition.top = Math.max(8, viewportHeight - menuRect.height - 8)
//       }

//       // If menu would go off the top edge, adjust vertical position
//       if (newPosition.top < 8) {
//         newPosition.top = 8
//       }

//       setPosition(newPosition)
//     }
//   }, [isOpen, anchorRect])

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         onClose()
//       }
//     }

//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose()
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//       document.addEventListener("keydown", handleEscape)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//       document.removeEventListener("keydown", handleEscape)
//     }
//   }, [isOpen, onClose])

//   if (!isOpen) return null

//   const handlePin = () => {
//     if (channel.isPinned) {
//       unpinChannel(channel.id)
//       toast({
//         title: "Channel unpinned",
//         description: `${channel.title} has been removed from pinned channels`,
//         duration: 3000,
//       })
//     } else {
//       pinChannel(channel.id)
//       toast({
//         title: "Channel pinned",
//         description: `${channel.title} has been added to pinned channels`,
//         duration: 3000,
//       })
//     }
//     onClose()
//   }

//   const handleMuteToggle = () => {
//     setIsMuted(!isMuted)
//     toast({
//       title: isMuted ? "Notifications enabled" : "Notifications muted",
//       description: isMuted
//         ? `You will now receive notifications for ${channel.title}`
//         : `You will no longer receive notifications for ${channel.title}`,
//       duration: 3000,
//     })
//     onClose()
//   }

//   const handleEditChannel = () => {
//     toast({
//       title: "Edit channel",
//       description: "Channel editing functionality coming soon",
//       duration: 3000,
//     })
//     onClose()
//   }

//   const handleLeaveChannel = () => {
//     toast({
//       title: "Leave channel",
//       description: "Are you sure you want to leave this channel?",
//       variant: "destructive",
//       action: (
//         <div className="flex gap-2 mt-2">
//           <button
//             onClick={() => {
//               toast({
//                 title: "Channel left",
//                 description: `You have left ${channel.title}`,
//                 duration: 3000,
//               })
//             }}
//             className="px-3 py-1 bg-red-500 text-white rounded-md text-xs"
//           >
//             Confirm
//           </button>
//         </div>
//       ),
//       duration: 5000,
//     })
//     onClose()
//   }

//   return (
//     <div
//       ref={menuRef}
//       className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-48"
//       style={{
//         top: `${position.top}px`,
//         left: `${position.left}px`,
//       }}
//       role="menu"
//     >
//       <button
//         className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100"
//         onClick={handlePin}
//         role="menuitem"
//       >
//         {channel.isPinned ? (
//           <>
//             <PinOff className="h-4 w-4" />
//             <span>Unpin channel</span>
//           </>
//         ) : (
//           <>
//             <Pin className="h-4 w-4" />
//             <span>Pin channel</span>
//           </>
//         )}
//       </button>
//       <button
//         className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100"
//         onClick={handleMuteToggle}
//         role="menuitem"
//       >
//         {isMuted ? (
//           <>
//             <Bell className="h-4 w-4" />
//             <span>Enable notifications</span>
//           </>
//         ) : (
//           <>
//             <BellOff className="h-4 w-4" />
//             <span>Mute notifications</span>
//           </>
//         )}
//       </button>
//       <div className="h-px bg-gray-200 my-1" role="separator"></div>
//       <button
//         className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100"
//         onClick={handleEditChannel}
//         role="menuitem"
//       >
//         <Edit className="h-4 w-4" />
//         <span>Edit channel</span>
//       </button>
//       <button
//         className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left text-red-500 hover:bg-gray-100"
//         onClick={handleLeaveChannel}
//         role="menuitem"
//       >
//         <Trash className="h-4 w-4" />
//         <span>Leave channel</span>
//       </button>
//       <div className="h-px bg-gray-200 my-1" role="separator"></div>
//       <button
//         className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100"
//         onClick={() => {
//           toast({
//             title: "Channel information",
//             description: `Channel ID: ${channel.id}\nCreated: ${new Date(
//               channel.createdAt,
//             ).toLocaleDateString()}\nMembers: 24`,
//             duration: 5000,
//           })
//           onClose()
//         }}
//         role="menuitem"
//       >
//         <AlertCircle className="h-4 w-4" />
//         <span>Channel info</span>
//       </button>
//     </div>
//   )
// }

"use client";

import { useRef, useEffect, useState } from "react";
import {
  Pin,
  PinOff,
  Bell,
  BellOff,
  Trash,
  Edit,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Conversation } from "@/types";

interface ChannelContextMenuProps {
  channel: any;
  isOpen: boolean;
  onClose: () => void;
  // onPinChange: (channelId: string, isPinned: boolean) => void;
  anchorRect: DOMRect | null;
}

export function ChannelContextMenu({
  channel,
  isOpen,
  onClose,
  // onPinChange,
  anchorRect,
}: ChannelContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    placement: "bottom" as "bottom" | "top" | "left" | "right",
  });
  const [isMuted, setIsMuted] = useState(
    channel.participants.some((p) => p.notification_muted)
  );

  // Calculate optimal position when menu opens or anchor position changes
  useEffect(() => {
    if (isOpen && anchorRect && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Default position (right of the button)
      let newPosition = {
        top: anchorRect.top,
        left: anchorRect.right + 8, // 8px offset from button
        placement: "right" as "bottom" | "top" | "left" | "right",
      };

      // Check if menu would go off the right edge
      if (anchorRect.right + menuRect.width + 8 > viewportWidth) {
        // Position to the left of the button
        newPosition = {
          top: anchorRect.top,
          left: anchorRect.left - menuRect.width - 8,
          placement: "left" as "bottom" | "top" | "left" | "right",
        };
      }

      // If menu would go off the bottom edge, adjust vertical position
      if (newPosition.top + menuRect.height > viewportHeight) {
        newPosition.top = Math.max(8, viewportHeight - menuRect.height - 8);
      }

      // If menu would go off the top edge, adjust vertical position
      if (newPosition.top < 8) {
        newPosition.top = 8;
      }

      setPosition(newPosition);
    }
  }, [isOpen, anchorRect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePin = () => {
    // onPinChange(channel.id, !channel.is_pinned);
    onClose();
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Notifications enabled" : "Notifications muted",
      description: isMuted
        ? `You will now receive notifications for ${channel.title}`
        : `You will no longer receive notifications for ${channel.title}`,
      duration: 3000,
    });
    onClose();
  };

  const handleEditChannel = () => {
    toast({
      title: "Edit channel",
      description: "Channel editing functionality coming soon",
      duration: 3000,
    });
    onClose();
  };

  const handleLeaveChannel = () => {
    toast({
      title: "Leave channel",
      description: "Are you sure you want to leave this channel?",
      variant: "destructive",
      action: (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast({
                title: "Channel left",
                description: `You have left ${channel.title}`,
                duration: 3000,
              });
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-md text-xs"
          >
            Confirm
          </button>
        </div>
      ),
      duration: 5000,
    });
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-48"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="menu"
    >
      <button
        className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100"
        onClick={handlePin}
        role="menuitem"
      >
        {channel.is_pinned ? (
          <>
            <PinOff className="h-4 w-4" />
            <span>Unpin channel</span>
          </>
        ) : (
          <>
            <Pin className="h-4 w-4" />
            <span>Pin channel</span>
          </>
        )}
      </button>
      <button
        className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100"
        onClick={handleMuteToggle}
        role="menuitem"
      >
        {isMuted ? (
          <>
            <Bell className="h-4 w-4" />
            <span>Enable notifications</span>
          </>
        ) : (
          <>
            <BellOff className="h-4 w-4" />
            <span>Mute notifications</span>
          </>
        )}
      </button>
      <div className="h-px bg-gray-200 my-1" role="separator"></div>
      <button
        className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100"
        onClick={handleEditChannel}
        role="menuitem"
      >
        <Edit className="h-4 w-4" />
        <span>Edit channel</span>
      </button>
      <button
        className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left text-red-500 hover:bg-gray-100"
        onClick={handleLeaveChannel}
        role="menuitem"
      >
        <Trash className="h-4 w-4" />
        <span>Leave channel</span>
      </button>
      <div className="h-px bg-gray-200 my-1" role="separator"></div>
      <button
        className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100"
        onClick={() => {
          toast({
            title: "Channel information",
            description: `Channel ID: ${channel.id}\nCreated: ${new Date(
              channel.created_at
            ).toLocaleDateString()}\nMembers: ${channel.participants.length}`,
            duration: 5000,
          });
          onClose();
        }}
        role="menuitem"
      >
        <AlertCircle className="h-4 w-4" />
        <span>Channel info</span>
      </button>
    </div>
  );
}
