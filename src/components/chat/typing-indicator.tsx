// "use client";

// import type { User } from "@/interfaces";

// interface TypingIndicatorProps {
//   conversationId: string;
//   typingUsers: User[];
// }

// export function TypingIndicator({
//   conversationId,
//   typingUsers,
// }: TypingIndicatorProps) {
//   if (!typingUsers || typingUsers.length === 0) return null;

//   let typingText = "";
//   if (typingUsers.length === 1) {
//     typingText = `${typingUsers[0].username} is typing...`;
//   } else if (typingUsers.length === 2) {
//     typingText = `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`;
//   } else {
//     typingText = `${typingUsers[0].username} and ${
//       typingUsers.length - 1
//     } others are typing...`;
//   }

//   return (
//     <div className="flex items-center p-2">
//       <div className="flex space-x-1 mr-2">
//         <div className="h-2 w-2 rounded-full bg-[#ff6a00] animate-bounce [animation-delay:-0.3s]"></div>
//         <div className="h-2 w-2 rounded-full bg-[#ff6a00] animate-bounce [animation-delay:-0.15s]"></div>
//         <div className="h-2 w-2 rounded-full bg-[#ff6a00] animate-bounce"></div>
//       </div>
//       <span className="text-sm text-gray-500">{typingText}</span>
//     </div>
//   );
// }


"use client"

import type { User } from "@/interfaces"

interface TypingIndicatorProps {
  conversationId: string
  typingUsers: User[]
}

export function TypingIndicator({ conversationId, typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null

  // Format the typing message
  const formatTypingMessage = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].username} is typing...`
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`
    } else {
      return `${typingUsers[0].username} and ${typingUsers.length - 1} others are typing...`
    }
  }

  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm pl-10">
      <div className="flex space-x-1">
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
      <span className="text-xs">{formatTypingMessage()}</span>
    </div>
  )
}
