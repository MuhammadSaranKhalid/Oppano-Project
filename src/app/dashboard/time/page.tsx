"use client";
import { TimeTrackingDashboard } from "@components/time/time-tracking-dashboard";
import { getCurrentUser, User } from "@lib/supabase";
import { useEffect, useState } from "react";

export default function TimePage() {
  const [user, setUser] = useState<User | null>(null);
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
          return;
        }

        setUser(userData as any);
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

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Employees overall work activity shown here
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <TimeTrackingDashboard user={user} />
      </div>
    </div>
  );
}
