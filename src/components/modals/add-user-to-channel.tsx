// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Check, Search, UserPlus } from "lucide-react";
// import { useChatApi } from "@/hooks/use-chat-api";
// import { useToast } from "@/hooks/use-toast";
// import { Spinner } from "@/components/ui/spinner";
// import type { User } from "@/interfaces";

// interface AddUserToChannelModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   channelId: string;
//   channelName: string;
// }

// export function AddUserToChannelModal({
//   isOpen,
//   onClose,
//   channelId,
//   channelName,
// }: AddUserToChannelModalProps) {
//   const { fetchUsers, addUserToChannel } = useChatApi();
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch users when the modal opens
//   useEffect(() => {
//     if (isOpen) {
//       const loadUsers = async () => {
//         setIsLoading(true);
//         try {
//           const fetchedUsers = await fetchUsers();
//           setUsers(fetchedUsers);
//           setFilteredUsers(fetchedUsers);
//         } catch (error) {
//           console.error("Error fetching users:", error);
//           toast({
//             title: "Error",
//             description: "Failed to load users. Please try again.",
//             variant: "destructive",
//           });
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       loadUsers();
//     }
//   }, [isOpen, fetchUsers, toast]);

//   // Filter users based on search query
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setFilteredUsers(users);
//     } else {
//       const query = searchQuery.toLowerCase();
//       const filtered = users.filter(
//         (user) =>
//           user.username.toLowerCase().includes(query) ||
//           user.email?.toLowerCase().includes(query)
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [searchQuery, users]);

//   const handleAddUser = async () => {
//     if (!selectedUser) return;

//     setIsSubmitting(true);

//     try {
//       const success = await addUserToChannel(channelId, selectedUser.id);

//       if (success) {
//         toast({
//           title: "User added",
//           description: `${selectedUser.username} has been added to #${channelName}`,
//         });
//         onClose();
//       } else {
//         throw new Error("Failed to add user");
//       }
//     } catch (error) {
//       console.error("Error adding user:", error);
//       toast({
//         title: "Error",
//         description: "Failed to add user to the channel. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSelectUser = (user: User) => {
//     setSelectedUser(user === selectedUser ? null : user);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Add User to #{channelName}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="search-users">Search users</Label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
//               <Input
//                 id="search-users"
//                 placeholder="Search by username or email"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9"
//               />
//             </div>
//           </div>

//           <div className="border rounded-md overflow-hidden">
//             <div className="max-h-[300px] overflow-y-auto">
//               {isLoading ? (
//                 <div className="flex items-center justify-center p-6">
//                   <Spinner size="md" />
//                 </div>
//               ) : filteredUsers.length === 0 ? (
//                 <div className="p-6 text-center text-gray-500">
//                   No users found
//                 </div>
//               ) : (
//                 <ul className="divide-y">
//                   {filteredUsers.map((user) => (
//                     <li
//                       key={user.id}
//                       className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${
//                         selectedUser?.id === user.id ? "bg-gray-50" : ""
//                       }`}
//                       onClick={() => handleSelectUser(user)}
//                     >
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-8 w-8">
//                           {user.profile_picture ? (
//                             <AvatarImage
//                               src={user.profile_picture || "/placeholder.svg"}
//                               alt={user.username}
//                             />
//                           ) : (
//                             <AvatarFallback>
//                               {user.username.substring(0, 2).toUpperCase()}
//                             </AvatarFallback>
//                           )}
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">{user.username}</p>
//                           {user.email && (
//                             <p className="text-xs text-gray-500">
//                               {user.email}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       {selectedUser?.id === user.id && (
//                         <Check className="h-5 w-5 text-green-500" />
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             type="button"
//             variant="outline"
//             onClick={onClose}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="button"
//             onClick={handleAddUser}
//             disabled={!selectedUser || isSubmitting}
//             className="gap-2"
//           >
//             {isSubmitting ? (
//               <>
//                 <Spinner size="sm" />
//                 Adding...
//               </>
//             ) : (
//               <>
//                 <UserPlus className="h-4 w-4" />
//                 Add User
//               </>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, Search, UserPlus } from "lucide-react";
import { useChatApi } from "@/hooks/use-chat-api";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@/interfaces";

interface AddUserToChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
}

export function AddUserToChannelModal({
  isOpen,
  onClose,
  channelId,
  channelName,
}: AddUserToChannelModalProps) {
  const { fetchUsersNotInChannel, addUserToChannel } = useChatApi();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users when the modal opens
  useEffect(() => {
    if (isOpen) {
      const loadUsers = async () => {
        setIsLoading(true);
        try {
          const fetchedUsers = await fetchUsersNotInChannel(channelId);
          setUsers(fetchedUsers);
          setFilteredUsers(fetchedUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
          toast({
            title: "Error",
            description: "Failed to load users. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      loadUsers();
    }
  }, [isOpen, channelId, fetchUsersNotInChannel, toast]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleAddUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);

    try {
      const success = await addUserToChannel(channelId, selectedUser.id);

      if (success) {
        toast({
          title: "User added",
          description: `${selectedUser.username} has been added to #${channelName}`,
        });
        onClose();
      } else {
        throw new Error("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user to the channel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user === selectedUser ? null : user);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add User to #{channelName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search-users">Search users</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="search-users"
                placeholder="Search by username or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-6">
                  <Spinner size="md" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No users found
                </div>
              ) : (
                <ul className="divide-y">
                  {filteredUsers.map((user) => (
                    <li
                      key={user.id}
                      className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedUser?.id === user.id ? "bg-gray-50" : ""
                      }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {user.profile_picture ? (
                            <AvatarImage
                              src={user.profile_picture || "/placeholder.svg"}
                              alt={user.username}
                            />
                          ) : (
                            <AvatarFallback>
                              {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          {user.email && (
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedUser?.id === user.id && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddUser}
            disabled={!selectedUser || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Add User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
