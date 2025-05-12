// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Edit, Trash2 } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";
// import { useToast } from "@/components/ui/use-toast";
// import { formatDate } from "@/lib/utils";
// import { supabaseBrowserClient as supabase } from "@utils/supabase/client";
// import type { User } from "@/lib/supabase";

// interface TimeEntry {
//   id: string;
//   user: {
//     id: string;
//     username: string;
//     profile_picture?: string;
//     job_title?: string;
//   };
//   clock_in: string;
//   clock_out: string;
//   total_hours: number;
//   activity_percentage: number;
// }

// interface TimeTrackingAdminDashboardProps {
//   currentUser: User;
// }

// export function TimeTrackingAdminDashboard({
//   currentUser,
// }: TimeTrackingAdminDashboardProps) {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [organizationId, setOrganizationId] = useState<string | null>(null);

//   useEffect(() => {
//     const checkAdminStatus = async () => {
//       if (!currentUser?.id) {
//         router.push("/dashboard");
//         return;
//       }

//       try {
//         // Check if the user is an admin in their organization
//         const { data: orgUser, error: orgError } = await supabase
//           .from("organization_users")
//           .select("organization_id, role")
//           .eq("user_id", currentUser.id)
//           .single();

//         if (orgError) {
//           console.error("Error fetching organization user:", orgError);
//           toast({
//             title: "Error",
//             description: "Failed to verify admin status.",
//             variant: "destructive",
//           });
//           router.push("/dashboard");
//           return;
//         }

//         if (orgUser.role !== "ADMIN" && orgUser.role !== "OWNER") {
//           toast({
//             title: "Access Denied",
//             description: "You don't have permission to view this page.",
//             variant: "destructive",
//           });
//           router.push("/dashboard");
//           return;
//         }

//         setIsAdmin(true);
//         setOrganizationId(orgUser.organization_id);

//         // Fetch time entries for the organization
//         await fetchTimeEntries(orgUser.organization_id);
//       } catch (error) {
//         console.error("Error checking admin status:", error);
//         toast({
//           title: "Error",
//           description: "An unexpected error occurred.",
//           variant: "destructive",
//         });
//         router.push("/dashboard");
//       }
//     };

//     checkAdminStatus();
//   }, [currentUser, router, toast]);

//   const fetchTimeEntries = async (orgId: string) => {
//     setIsLoading(true);
//     try {
//       // Format date for query
//       const formattedDate = currentDate.toISOString().split("T")[0];

//       // Get all users in the organization
//       const { data: orgUsers, error: usersError } = await supabase
//         .from("organization_users")
//         .select(
//           `
//           user_id,
//           users:user_id(
//             id,
//             username,
//             profile_picture
//           )
//         `
//         )
//         .eq("organization_id", orgId);

//       if (usersError) {
//         throw usersError;
//       }

//       // Get time sessions for these users on the selected date
//       const userIds = orgUsers.map((ou) => ou.user_id);

//       const startOfDay = new Date(currentDate);
//       startOfDay.setHours(0, 0, 0, 0);

//       const endOfDay = new Date(currentDate);
//       endOfDay.setHours(23, 59, 59, 999);

//       const { data: sessions, error: sessionsError } = await supabase
//         .from("time_sessions")
//         .select(
//           `
//           id,
//           user_id,
//           start_time,
//           end_time,
//           duration_seconds,
//           total_break_time,
//           status
//         `
//         )
//         .in("user_id", userIds)
//         .gte("start_time", startOfDay.toISOString())
//         .lte("start_time", endOfDay.toISOString());

//       if (sessionsError) {
//         throw sessionsError;
//       }

//       // Get job titles from the first message each user sent (as a placeholder for actual job titles)
//       const { data: jobTitles, error: jobTitlesError } = await supabase
//         .from("messages")
//         .select("sender_id, content")
//         .in("sender_id", userIds)
//         .order("created_at", { ascending: true })
//         .limit(1);

//       // Process the data into the format we need
//       const processedEntries: TimeEntry[] = [];

//       for (const user of orgUsers) {
//         const userSessions =
//           sessions?.filter((s) => s.user_id === user.user_id) || [];

//         if (userSessions.length > 0) {
//           // Calculate total hours and activity
//           let totalSeconds = 0;
//           let totalBreakSeconds = 0;
//           let earliestClockIn = new Date(userSessions[0].start_time);
//           let latestClockOut = userSessions[0].end_time
//             ? new Date(userSessions[0].end_time)
//             : new Date();

//           userSessions.forEach((session) => {
//             totalSeconds += session.duration_seconds || 0;
//             totalBreakSeconds += session.total_break_time || 0;

//             const startTime = new Date(session.start_time);
//             if (startTime < earliestClockIn) {
//               earliestClockIn = startTime;
//             }

//             const endTime = session.end_time
//               ? new Date(session.end_time)
//               : new Date();
//             if (endTime > latestClockOut) {
//               latestClockOut = endTime;
//             }
//           });

//           // Calculate activity percentage (work time / total time)
//           const workSeconds = totalSeconds - totalBreakSeconds;
//           const activityPercentage =
//             totalSeconds > 0
//               ? Math.round((workSeconds / totalSeconds) * 100)
//               : 0;

//           // Find job title (placeholder)
//           const jobTitle =
//             jobTitles
//               ?.find((j) => j.sender_id === user.user_id)
//               ?.content.split(" ")[0] || "Employee";

//           processedEntries.push({
//             id: userSessions[0].id,
//             user: {
//               id: user.user_id,
//               username: user.users?.username,
//               profile_picture: user.users?.profile_picture,
//               job_title: jobTitle,
//             },
//             clock_in: earliestClockIn.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             clock_out: latestClockOut.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             total_hours: Math.round(workSeconds / 36) / 100, // Convert seconds to hours with 2 decimal places
//             activity_percentage: activityPercentage,
//           });
//         }
//       }

//       setTimeEntries(processedEntries);
//     } catch (error) {
//       console.error("Error fetching time entries:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load time tracking data.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDateChange = (offset: number) => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(newDate.getDate() + offset);
//     setCurrentDate(newDate);

//     if (organizationId) {
//       fetchTimeEntries(organizationId);
//     }
//   };

//   const handleEditEntry = (entryId: string) => {
//     toast({
//       title: "Edit Entry",
//       description: `Editing entry ${entryId}`,
//     });
//   };

//   const handleDeleteEntry = (entryId: string) => {
//     toast({
//       title: "Delete Entry",
//       description: `Deleting entry ${entryId}`,
//     });
//   };

//   if (!isAdmin) {
//     return null;
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h2 className="text-xl font-semibold">
//             Clock In / Clock Out Report of {formatDate(currentDate)}
//           </h2>
//           <p className="text-sm text-gray-500">
//             Managers/administrators have access to edit incorrect entries
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" onClick={() => handleDateChange(-1)}>
//             Previous Day
//           </Button>
//           <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
//             Today
//           </Button>
//           <Button variant="outline" onClick={() => handleDateChange(1)}>
//             Next Day
//           </Button>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <Spinner size="lg" />
//         </div>
//       ) : timeEntries.length === 0 ? (
//         <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
//           <div className="text-center">
//             <p className="text-lg font-medium text-gray-700">
//               No time entries for this date
//             </p>
//             <p className="text-sm text-gray-500">
//               Try selecting a different date or check if employees have clocked
//               in
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="border-b">
//                 <th className="py-3 px-4 text-left font-medium text-gray-700">
//                   Employee Name
//                 </th>
//                 <th className="py-3 px-4 text-left font-medium text-gray-700">
//                   Clock In Time
//                 </th>
//                 <th className="py-3 px-4 text-left font-medium text-gray-700">
//                   Clock Out Time
//                 </th>
//                 <th className="py-3 px-4 text-left font-medium text-gray-700">
//                   Total Hours Work
//                 </th>
//                 <th className="py-3 px-4 text-left font-medium text-gray-700">
//                   Total Activity
//                 </th>
//                 <th className="py-3 px-4 text-left font-medium text-gray-700">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {timeEntries.map((entry) => (
//                 <tr key={entry.id} className="border-b hover:bg-gray-50">
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage
//                           src={
//                             entry.user.profile_picture ||
//                             `/placeholder.svg?height=32&width=32&query=avatar ${entry.user.username.charAt(
//                               0
//                             )}`
//                           }
//                           alt={entry.user.username}
//                         />
//                         <AvatarFallback>
//                           {entry.user.username.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <div className="font-medium">{entry.user.username}</div>
//                         <div className="text-xs text-gray-500">
//                           {entry.user.job_title || "Employee"}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">{entry.clock_in}</td>
//                   <td className="py-3 px-4">{entry.clock_out}</td>
//                   <td className="py-3 px-4">{entry.total_hours} Hours</td>
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-16 bg-gray-200 rounded-full h-2">
//                         <div
//                           className={`h-2 rounded-full ${
//                             entry.activity_percentage >= 90
//                               ? "bg-green-500"
//                               : entry.activity_percentage >= 70
//                               ? "bg-blue-500"
//                               : entry.activity_percentage >= 50
//                               ? "bg-yellow-500"
//                               : "bg-red-500"
//                           }`}
//                           style={{ width: `${entry.activity_percentage}%` }}
//                         ></div>
//                       </div>
//                       <span>{entry.activity_percentage}%</span>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleEditEntry(entry.id)}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleDeleteEntry(entry.id)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { supabaseBrowserClient as supabase } from "@utils/supabase/client";
import type { User } from "@/lib/supabase";

interface TimeEntry {
  id: string;
  user: {
    id: string;
    username: string;
    profile_picture?: string;
    job_title?: string;
  };
  clock_in: string;
  clock_out: string;
  total_hours: number;
  activity_percentage: number;
}

interface TimeTrackingAdminDashboardProps {
  currentUser: User;
  organizationId: string;
}

export function TimeTrackingAdminDashboard({
  currentUser,
  organizationId,
}: TimeTrackingAdminDashboardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Memoize the fetchTimeEntries function to prevent it from being recreated on every render
  const fetchTimeEntries = useCallback(
    async (date: Date) => {
      setIsLoading(true);
      try {
        // Format date for query
        const formattedDate = date.toISOString().split("T")[0];

        // Get all users in the organization
        const { data: orgUsers, error: usersError } = await supabase
          .from("organization_users")
          .select(
            `
          user_id,
          users:user_id(
            id,
            username,
            profile_picture
          )
        `
          )
          .eq("organization_id", organizationId);

        if (usersError) {
          throw usersError;
        }

        // Get time sessions for these users on the selected date
        const userIds = orgUsers.map((ou) => ou.user_id);

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data: sessions, error: sessionsError } = await supabase
          .from("time_sessions")
          .select(
            `
          id,
          user_id,
          start_time,
          end_time,
          duration_seconds,
          total_break_time,
          status
        `
          )
          .in("user_id", userIds)
          .gte("start_time", startOfDay.toISOString())
          .lte("start_time", endOfDay.toISOString());

        if (sessionsError) {
          throw sessionsError;
        }

        // Get job titles from the first message each user sent (as a placeholder for actual job titles)
        const { data: jobTitles, error: jobTitlesError } = await supabase
          .from("messages")
          .select("sender_id, content")
          .in("sender_id", userIds)
          .order("created_at", { ascending: true })
          .limit(1);

        // Process the data into the format we need
        const processedEntries: TimeEntry[] = [];

        for (const user of orgUsers) {
          const userSessions =
            sessions?.filter((s) => s.user_id === user.user_id) || [];

          if (userSessions.length > 0) {
            // Calculate total hours and activity
            let totalSeconds = 0;
            let totalBreakSeconds = 0;
            let earliestClockIn = new Date(userSessions[0].start_time);
            let latestClockOut = userSessions[0].end_time
              ? new Date(userSessions[0].end_time)
              : new Date();

            userSessions.forEach((session) => {
              totalSeconds += session.duration_seconds || 0;
              totalBreakSeconds += session.total_break_time || 0;

              const startTime = new Date(session.start_time);
              if (startTime < earliestClockIn) {
                earliestClockIn = startTime;
              }

              const endTime = session.end_time
                ? new Date(session.end_time)
                : new Date();
              if (endTime > latestClockOut) {
                latestClockOut = endTime;
              }
            });

            // Calculate activity percentage (work time / total time)
            const workSeconds = totalSeconds - totalBreakSeconds;
            const activityPercentage =
              totalSeconds > 0
                ? Math.round((workSeconds / totalSeconds) * 100)
                : 0;

            // Find job title (placeholder)
            const jobTitle =
              jobTitles
                ?.find((j) => j.sender_id === user.user_id)
                ?.content.split(" ")[0] || "Employee";

            processedEntries.push({
              id: userSessions[0].id,
              user: {
                id: user.user_id,
                username: (user as any).users.username,
                profile_picture: (user as any).users.profile_picture,
                job_title: jobTitle,
              },
              clock_in: earliestClockIn.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              clock_out: latestClockOut.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              total_hours: Math.round(workSeconds / 36) / 100, // Convert seconds to hours with 2 decimal places
              activity_percentage: activityPercentage,
            });
          }
        }

        setTimeEntries(processedEntries);
      } catch (error) {
        console.error("Error fetching time entries:", error);
        toast({
          title: "Error",
          description: "Failed to load time tracking data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [organizationId]
  );

  // Load time entries when the component mounts or when the date changes
  useEffect(() => {
    fetchTimeEntries(currentDate);
  }, [currentDate, fetchTimeEntries]);

  const handleDateChange = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  const handleEditEntry = (entryId: string) => {
    toast({
      title: "Edit Entry",
      description: `Editing entry ${entryId}`,
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    toast({
      title: "Delete Entry",
      description: `Deleting entry ${entryId}`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            Clock In / Clock Out Report of {formatDate(currentDate)}
          </h2>
          <p className="text-sm text-gray-500">
            Managers/administrators have access to edit incorrect entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleDateChange(-1)}>
            Previous Day
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" onClick={() => handleDateChange(1)}>
            Next Day
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : timeEntries.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              No time entries for this date
            </p>
            <p className="text-sm text-gray-500">
              Try selecting a different date or check if employees have clocked
              in
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Employee Name
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Clock In Time
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Clock Out Time
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Total Hours Work
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Total Activity
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            entry.user.profile_picture ||
                            `/placeholder.svg?height=32&width=32&query=avatar ${
                              entry.user.username.charAt(0) ||
                              "/placeholder.svg"
                            }`
                          }
                          alt={entry.user.username}
                        />
                        <AvatarFallback>
                          {entry.user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{entry.user.username}</div>
                        <div className="text-xs text-gray-500">
                          {entry.user.job_title || "Employee"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{entry.clock_in}</td>
                  <td className="py-3 px-4">{entry.clock_out}</td>
                  <td className="py-3 px-4">{entry.total_hours} Hours</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            entry.activity_percentage >= 90
                              ? "bg-green-500"
                              : entry.activity_percentage >= 70
                              ? "bg-blue-500"
                              : entry.activity_percentage >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${entry.activity_percentage}%` }}
                        ></div>
                      </div>
                      <span>{entry.activity_percentage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditEntry(entry.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
