// "use client";

// import { useChatStore } from "@/store/chat-store";
// import { useChatApi } from "@/hooks/use-chat-api";
// import type { Reaction } from "@/interfaces";
// import { cn } from "@/lib/utils";

// interface MessageReactionsProps {
//   messageId: string;
//   reactions: Reaction[];
// }

// export function MessageReactions({
//   messageId,
//   reactions,
// }: MessageReactionsProps) {
//   const { currentUser } = useChatStore();
//   const { reactToMessage, removeReactionFromMessage } = useChatApi();

//   // Group reactions by emoji
//   const groupedReactions = reactions.reduce((acc, reaction) => {
//     if (!acc[reaction.emoji]) {
//       acc[reaction.emoji] = {
//         emoji: reaction.emoji,
//         count: 0,
//         userIds: [],
//         reactionIds: [],
//       };
//     }

//     acc[reaction.emoji].count++;
//     acc[reaction.emoji].userIds.push(reaction.user_id);
//     acc[reaction.emoji].reactionIds.push(reaction.id);

//     return acc;
//   }, {} as Record<string, { emoji: string; count: number; userIds: string[]; reactionIds: string[] }>);

//   const handleReactionClick = async (
//     emoji: string,
//     userIds: string[],
//     reactionIds: string[]
//   ) => {
//     if (!currentUser) return;

//     const currentUserId = currentUser.id;
//     const hasReacted = userIds.includes(currentUserId);

//     if (hasReacted) {
//       // Find the reaction ID for the current user
//       const userReactionId = reactionIds[userIds.indexOf(currentUserId)];
//       if (userReactionId) {
//         await removeReactionFromMessage(messageId, userReactionId);
//       }
//     } else {
//       await reactToMessage(messageId, emoji);
//     }
//   };

//   return (
//     <div className="flex mt-1 space-x-1 flex-wrap">
//       {Object.values(groupedReactions).map((reaction) => (
//         <button
//           key={`${messageId}-reaction-${reaction.emoji}`}
//           className={cn(
//             "flex items-center rounded-full px-2 py-1 text-xs transition-colors",
//             reaction.userIds.includes(currentUser?.id || "")
//               ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
//               : "bg-gray-100 hover:bg-gray-200"
//           )}
//           onClick={() =>
//             handleReactionClick(
//               reaction.emoji,
//               reaction.userIds,
//               reaction.reactionIds
//             )
//           }
//           title={reaction.userIds.join(", ")}
//         >
//           <span className="mr-1">{reaction.emoji}</span>
//           <span>{reaction.count}</span>
//         </button>
//       ))}
//     </div>
//   );
// }


"use client"

import { useChatStore } from "@/store/chat-store"
import { useChatApi } from "@/hooks/use-chat-api"
import type { Reaction } from "@/interfaces"
import { cn } from "@/lib/utils"

interface MessageReactionsProps {
  messageId: string
  reactions: Reaction[]
}

export function MessageReactions({ messageId, reactions }: MessageReactionsProps) {
  const { currentUser } = useChatStore()
  const { reactToMessage, removeReactionFromMessage } = useChatApi()

  // Group reactions by emoji
  const groupedReactions = reactions.reduce(
    (acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = {
          emoji: reaction.emoji,
          count: 0,
          userIds: [],
          reactionIds: [],
        }
      }

      acc[reaction.emoji].count++
      acc[reaction.emoji].userIds.push(reaction.user_id)
      acc[reaction.emoji].reactionIds.push(reaction.id)

      return acc
    },
    {} as Record<string, { emoji: string; count: number; userIds: string[]; reactionIds: string[] }>,
  )

  const handleReactionClick = async (emoji: string, userIds: string[], reactionIds: string[]) => {
    if (!currentUser) return

    const currentUserId = currentUser.id
    const hasReacted = userIds.includes(currentUserId)

    if (hasReacted) {
      // Find the reaction ID for the current user
      const userReactionIndex = userIds.indexOf(currentUserId)
      if (userReactionIndex !== -1) {
        const userReactionId = reactionIds[userReactionIndex]
        await removeReactionFromMessage(messageId, userReactionId)
      }
    } else {
      await reactToMessage(messageId, emoji)
    }
  }

  return (
    <div className="flex mt-1 space-x-1 flex-wrap">
      {Object.values(groupedReactions).map((reaction) => (
        <button
          key={`${messageId}-reaction-${reaction.emoji}`}
          className={cn(
            "flex items-center rounded-full px-2 py-1 text-xs transition-colors",
            reaction.userIds.includes(currentUser?.id || "")
              ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
              : "bg-gray-100 hover:bg-gray-200",
          )}
          onClick={() => handleReactionClick(reaction.emoji, reaction.userIds, reaction.reactionIds)}
          title={reaction.userIds.join(", ")}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </button>
      ))}
    </div>
  )
}
