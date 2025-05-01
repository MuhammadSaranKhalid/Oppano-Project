// "use client"

// import type React from "react"
// import { Card, SimpleGrid, Button } from "@mantine/core"

// interface EmojiPickerProps {
//   onSelect: (emoji: string) => void
// }

// export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
//   // Common emojis
//   const emojis = [
//     "😀",
//     "😃",
//     "😄",
//     "😁",
//     "😆",
//     "😅",
//     "😂",
//     "🤣",
//     "😊",
//     "😇",
//     "🙂",
//     "🙃",
//     "😉",
//     "😌",
//     "😍",
//     "🥰",
//     "😘",
//     "😗",
//     "😙",
//     "😚",
//     "😋",
//     "😛",
//     "😜",
//     "😝",
//     "🤪",
//     "🤨",
//     "🧐",
//     "🤓",
//     "😎",
//     "🥸",
//     "👍",
//     "👎",
//     "❤️",
//     "🔥",
//     "✨",
//     "🎉",
//     "👏",
//     "🙏",
//     "💯",
//     "💪",
//   ]

//   return (
//     <Card shadow="md" p="sm" withBorder>
//       <SimpleGrid cols={8}>
//         {emojis.map((emoji, index) => (
//           <Button key={index} variant="subtle" p={0} onClick={() => onSelect(emoji)}>
//             {emoji}
//           </Button>
//         ))}
//       </SimpleGrid>
//     </Card>
//   )
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Props for the EmojiPicker component
 */
interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

/**
 * EmojiPicker Component
 *
 * This component displays a grid of emoji buttons that users can select.
 * Refactored from Mantine to use Shadcn UI components.
 */
export const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  // Common emojis
  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😜",
    "😝",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🥸",
    "👍",
    "👎",
    "❤️",
    "🔥",
    "✨",
    "🎉",
    "👏",
    "🙏",
    "💯",
    "💪",
  ];

  return (
    <Card className="p-3 shadow-md border">
      <div className="grid grid-cols-8 gap-1">
        {emojis.map((emoji, index) => (
          <Button
            key={index}
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </Button>
        ))}
      </div>
    </Card>
  );
};
