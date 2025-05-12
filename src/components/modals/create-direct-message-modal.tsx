// "use client"

// import { useState, useEffect } from "react"
// import { Search, X } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { useChatStore } from "@/store/chat-store"
// import { Spinner } from "@/components/ui/spinner"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"

// interface CreateDirectMessageModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// export function CreateDirectMessageModal({ isOpen, onClose }: CreateDirectMessageModalProps) {
//   // const { createDirectMessage, fetchUsers } = useChatStore()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [users, setUsers] = useState<any[]>([])
//   const [filteredUsers, setFilteredUsers] = useState<any[]>([])
//   const [selectedUsers, setSelectedUsers] = useState<any[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Fetch users when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setIsLoading(true)
//       // fetchUsers()
//       //   .then((fetchedUsers) => {
//       //     setUsers(fetchedUsers)
//       //     setFilteredUsers(fetchedUsers)
//       //   })
//       //   .finally(() => {
//       //     setIsLoading(false)
//       //   })
//     } else {
//       // Reset state when modal closes
//       setSearchQuery("")
//       setSelectedUsers([])
//     }
//   }, [isOpen
//     // , fetchUsers
//   ])

//   // Filter users based on search query
//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredUsers(users)
//     } else {
//       const query = searchQuery.toLowerCase()
//       const filtered = users.filter((user) => user.username.toLowerCase().includes(query))
//       setFilteredUsers(filtered)
//     }
//   }, [searchQuery, users])

//   const handleSelectUser = (user: any) => {
//     // Check if user is already selected
//     if (selectedUsers.some((u) => u.id === user.id)) {
//       return
//     }

//     // Add user to selected users
//     setSelectedUsers([...selectedUsers, user])

//     // Clear search query
//     setSearchQuery("")
//   }

//   const handleRemoveUser = (userId: string) => {
//     setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
//   }

//   const handleStartConversation = async () => {
//     if (selectedUsers.length === 0) return

//     setIsSubmitting(true)

//     try {
//       // await createDirectMessage(selectedUsers)
//       onClose()
//     } catch (error) {
//       console.error("Failed to create direct message:", error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>New message</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           {/* Selected users */}
//           <div className="flex flex-wrap gap-2 min-h-8">
//             {selectedUsers.map((user) => (
//               <Badge key={user.id} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
//                 <span>{user.username}</span>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-4 w-4 rounded-full"
//                   onClick={() => handleRemoveUser(user.id)}
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </Badge>
//             ))}
//           </div>

//           {/* Search input */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             <Input
//               placeholder="Search users..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>

//           {/* User list */}
//           <ScrollArea className="h-[300px] pr-4">
//             {isLoading ? (
//               <div className="flex items-center justify-center h-full">
//                 <Spinner size={"md"} />
//               </div>
//             ) : filteredUsers.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">No users found</div>
//             ) : (
//               <div className="space-y-1">
//                 {filteredUsers.map((user) => (
//                   <button
//                     key={user.id}
//                     className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors"
//                     onClick={() => handleSelectUser(user)}
//                   >
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage
//                         src={user.avatar || `/placeholder.svg?height=32&width=32&query=${user.username.charAt(0)}`}
//                       />
//                       <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col items-start">
//                       <span className="text-sm font-medium">{user.username}</span>
//                       {user.status && <span className="text-xs text-gray-500">{user.status}</span>}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </ScrollArea>

//           {/* Action buttons */}
//           <div className="flex justify-end gap-2 pt-2">
//             <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
//               Cancel
//             </Button>
//             <Button onClick={handleStartConversation} disabled={selectedUsers.length === 0 || isSubmitting}>
//               {isSubmitting ? <Spinner size={"md"} className="mr-2" /> : null}
//               {selectedUsers.length > 1 ? "Create Group" : "Start Conversation"}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useChatApi } from "@/hooks/use-chat-api";
import type { User } from "@/interfaces";

interface CreateDirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDirectMessageModal({
  isOpen,
  onClose,
}: CreateDirectMessageModalProps) {
  const { fetchUsers, createDirectMessage } = useChatApi();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchUsers()
        .then((fetchedUsers) => {
          if (fetchedUsers) {
            setUsers(fetchedUsers);
            setFilteredUsers(fetchedUsers);
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          toast({
            title: "Error",
            description: "Failed to load users. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Reset state when modal closes
      setSearchQuery("");
      setSelectedUsers([]);
    }
  }, [isOpen, fetchUsers, toast]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleSelectUser = (user: User) => {
    // Check if user is already selected
    if (selectedUsers.some((u) => u.id === user.id)) {
      return;
    }

    // Add user to selected users
    setSelectedUsers([...selectedUsers, user]);

    // Clear search query
    setSearchQuery("");
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleStartConversation = async () => {
    if (selectedUsers.length === 0) return;

    setIsSubmitting(true);

    try {
      const newConversation = await createDirectMessage(selectedUsers);

      if (newConversation) {
        toast({
          title:
            selectedUsers.length > 1 ? "Group created" : "Conversation started",
          description:
            selectedUsers.length > 1
              ? `Group with ${selectedUsers
                  .map((u) => u.username)
                  .join(", ")} created.`
              : `Conversation with ${selectedUsers[0].username} started.`,
        });
        onClose();
      } else {
        throw new Error("Failed to create conversation");
      }
    } catch (error) {
      console.error("Failed to create direct message:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected users */}
          <div className="flex flex-wrap gap-2 min-h-8">
            {selectedUsers.map((user) => (
              <Badge
                key={user.id}
                variant="secondary"
                className="flex items-center gap-1 pl-2 pr-1 py-1"
              >
                <span>{user.username}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full"
                  onClick={() => handleRemoveUser(user.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* User list */}
          <ScrollArea className="h-[300px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="md" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          user.profile_picture ||
                          `/placeholder.svg?height=32&width=32&query=${user.username.charAt(
                            0
                          )}`
                        }
                      />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.username}
                      </span>
                      {user.status_message && (
                        <span className="text-xs text-gray-500">
                          {user.status_message}
                        </span>
                      )}
                    </div>
                    {user.status === "ONLINE" && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-green-500"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleStartConversation}
              disabled={selectedUsers.length === 0 || isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              {selectedUsers.length > 1 ? "Create Group" : "Start Conversation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
