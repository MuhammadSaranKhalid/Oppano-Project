// // "use client";
// // import { TimeTrackingDashboard } from "@components/time/time-tracking-dashboard";
// // import { getCurrentUser, User } from "@lib/supabase";
// // import { useEffect, useState } from "react";

// // export default function TimePage() {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     const loadUser = async () => {
// //       try {
// //         const userData = await getCurrentUser();

// //         if (!userData) {
// //           // toast({
// //           //   title: "Authentication required",
// //           //   description: "Please sign in to access the dashboard.",
// //           //   variant: "destructive",
// //           // });
// //           return;
// //         }

// //         setUser(userData as any);
// //       } catch (error) {
// //         console.error("Error loading user:", error);
// //         // toast({
// //         //   title: "Error",
// //         //   description: "Failed to load user data.",
// //         //   variant: "destructive",
// //         // });
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     loadUser();
// //   }, []);

// //   return (
// //     <div className="flex h-full flex-col">
// //       <div className="border-b p-4">
// //         <h2 className="text-lg font-medium">Dashboard</h2>
// //         <p className="text-sm text-muted-foreground">
// //           Employees overall work activity shown here
// //         </p>
// //       </div>
// //       <div className="flex-1 overflow-y-auto p-4">
// //         <TimeTrackingDashboard user={user} />
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { TimeTrackingDashboard } from "@/components/time/time-tracking-dashboard";
// import { TimeTrackingAdminDashboard } from "@/components/admin/time-tracking-admin-dashboard";
// import { getCurrentUser, type User } from "@/lib/supabase";
// import { supabaseBrowserClient as supabase } from "@utils/supabase/client";
// import { useEffect, useState } from "react";
// import { Spinner } from "@/components/ui/spinner";

// export default function TimePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const userData = await getCurrentUser();

//         if (!userData) {
//           // toast({
//           //   title: "Authentication required",
//           //   description: "Please sign in to access the dashboard.",
//           //   variant: "destructive",
//           // });
//           return;
//         }

//         setUser(userData as any);

//         // Check if user is an admin
//         const { data: orgUser, error: orgError } = await supabase
//           .from("organization_users")
//           .select("role")
//           .eq("user_id", userData.id)
//           .single();

//         if (orgError) {
//           console.error("Error fetching organization user:", orgError);
//           setIsAdmin(false);
//         } else {
//           setIsAdmin(orgUser.role === "ADMIN" || orgUser.role === "OWNER");
//         }
//       } catch (error) {
//         console.error("Error loading user:", error);
//         // toast({
//         //   title: "Error",
//         //   description: "Failed to load user data.",
//         //   variant: "destructive",
//         // });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex h-full flex-col">
//         <div className="border-b p-4">
//           <h2 className="text-lg font-medium">Dashboard</h2>
//           <p className="text-sm text-muted-foreground">
//             Loading time tracking dashboard...
//           </p>
//         </div>
//         <div className="flex-1 overflow-y-auto p-4 flex justify-center items-center">
//           <Spinner size="lg" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-full flex-col">
//       <div className="border-b p-4">
//         <h2 className="text-lg font-medium">Dashboard</h2>
//         <p className="text-sm text-muted-foreground">
//           {isAdmin
//             ? "Employees overall work activity shown here"
//             : "Track your work time and activity"}
//         </p>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4">
//         {isAdmin && user ? (
//           <TimeTrackingAdminDashboard currentUser={user} />
//         ) : (
//           <TimeTrackingDashboard user={user} />
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { TimeTrackingDashboard } from "@/components/time/time-tracking-dashboard";
import { TimeTrackingAdminDashboard } from "@/components/admin/time-tracking-admin-dashboard";
import { getCurrentUser, type User } from "@/lib/supabase";
import { supabaseBrowserClient as supabase } from "@utils/supabase/client";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function TimePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();

        if (!userData) {
          // toast({
          //   title: "Authentication required",
          //   description: "Please sign in to access the dashboard.",
          //   variant: "destructive",
          // });
          setIsLoading(false);
          return;
        }

        setUser(userData as any);

        // Check if user is an admin
        const { data: orgUser, error: orgError } = await supabase
          .from("organization_users")
          .select("role, organization_id")
          .eq("user_id", userData.id)
          .single();

        if (orgError) {
          console.error("Error fetching organization user:", orgError);
          setIsAdmin(false);
        } else {
          setIsAdmin(orgUser.role === "ADMIN" || orgUser.role === "OWNER");
          setOrganizationId(orgUser.organization_id);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to load user data.",
        //   variant: "destructive",
        // });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b p-4">
          <h2 className="text-lg font-medium">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Loading time tracking dashboard...
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? "Employees overall work activity shown here"
            : "Track your work time and activity"}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isAdmin && user && organizationId ? (
          <TimeTrackingAdminDashboard
            currentUser={user}
            organizationId={organizationId}
          />
        ) : (
          <TimeTrackingDashboard user={user} />
        )}
      </div>
    </div>
  );
}
