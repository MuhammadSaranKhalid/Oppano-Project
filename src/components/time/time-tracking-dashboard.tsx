// // // // // // "use client"

// // // // // // import { useState } from "react"
// // // // // // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// // // // // // import { Button } from "@/components/ui/button"
// // // // // // import { ChevronLeft, ChevronRight } from "lucide-react"
// // // // // // import { TimeMetricsCard } from "./time-metrics-card"
// // // // // // import { DailyHoursChart } from "./daily-hours-chart"
// // // // // // import { AppUsageChart } from "./app-usage-chart"
// // // // // // import { MonthCalendar } from "./month-calendar"

// // // // // // export function TimeTrackingDashboard() {
// // // // // //   const [currentMonth, setCurrentMonth] = useState("February 2024")

// // // // // //   return (
// // // // // //     <div className="space-y-6">
// // // // // //       {/* User Profile Section */}
// // // // // //       <div className="flex items-center justify-between">
// // // // // //         <div className="flex items-center gap-4">
// // // // // //           <Avatar className="h-16 w-16">
// // // // // //             <AvatarImage src="/abstract-geometric-shapes.png" alt="Cristal Parker" />
// // // // // //             <AvatarFallback>CP</AvatarFallback>
// // // // // //           </Avatar>
// // // // // //           <div>
// // // // // //             <h3 className="text-xl font-medium">Cristal Parker</h3>
// // // // // //             <div className="text-sm text-muted-foreground">
// // // // // //               <span>Graphics Designer</span>
// // // // // //               <span className="mx-2">•</span>
// // // // // //               <span>Starter</span>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //         <Button variant="outline" className="h-9">
// // // // // //           View Profile
// // // // // //         </Button>
// // // // // //       </div>

// // // // // //       {/* Metrics Cards */}
// // // // // //       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
// // // // // //         <TimeMetricsCard title="Total Hours Worked Today" value="002:25:33" valueSize="large" />
// // // // // //         <TimeMetricsCard title="Avg Activity Today" value="52%" valueSize="large" valueColor="text-[#ff6a00]" />
// // // // // //         <TimeMetricsCard title="Total Hrs Worked Past 7 Days" value="022:25:33" valueSize="large" />
// // // // // //         <TimeMetricsCard title="Avg Activity Past 7 Days" value="41%" valueSize="large" valueColor="text-[#ff6a00]" />
// // // // // //       </div>

// // // // // //       {/* Daily Hours Chart */}
// // // // // //       <div className="rounded-lg border bg-card p-6">
// // // // // //         <h3 className="mb-4 text-lg font-medium">Total Hours Worked Per Day</h3>
// // // // // //         <div className="h-64">
// // // // // //           <DailyHoursChart />
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* App Usage and Calendar */}
// // // // // //       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
// // // // // //         <div className="rounded-lg border bg-card p-6">
// // // // // //           <h3 className="mb-4 text-lg font-medium">Avg Daily Usage of Apps</h3>
// // // // // //           <div className="h-64">
// // // // // //             <AppUsageChart />
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         <div className="rounded-lg border bg-card p-6">
// // // // // //           <div className="mb-4 flex items-center justify-between">
// // // // // //             <h3 className="text-lg font-medium">{currentMonth}</h3>
// // // // // //             <div className="flex gap-2">
// // // // // //               <Button variant="outline" size="icon" className="h-8 w-8">
// // // // // //                 <ChevronLeft className="h-4 w-4" />
// // // // // //               </Button>
// // // // // //               <Button variant="outline" size="icon" className="h-8 w-8">
// // // // // //                 <ChevronRight className="h-4 w-4" />
// // // // // //               </Button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //           <MonthCalendar />
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // "use client";

// // // // // import { useState, useEffect, useRef, useCallback } from "react";
// // // // // import { useToast } from "@/components/ui/use-toast";

// // // // // import { Badge } from "@/components/ui/badge";
// // // // // import {
// // // // //   createTimeBreak,
// // // // //   createTimeSession,
// // // // //   endTimeBreak,
// // // // //   endTimeSession,
// // // // //   type User,
// // // // // } from "@/lib/supabase";
// // // // // import { supabaseBrowserClient } from "@utils/supabase/client";
// // // // // import {
// // // // //   calculateProgress,
// // // // //   formatDuration,
// // // // //   formatTime,
// // // // //   getCurrentDate,
// // // // //   getCurrentTime,
// // // // // } from "@lib/time-utils";
// // // // // import { StatusBadge } from "./status-badge";
// // // // // import { CircularTimer } from "./circular-time";
// // // // // import { TimeControls } from "./time-controls";
// // // // // import { BreakSummary } from "./break-summary";
// // // // // import { SessionHistoryDialog } from "./session-history-dialog";
// // // // // import { useGetIdentity } from "@refinedev/core";

// // // // // // Define types for our timer session
// // // // // interface TimerSession {
// // // // //   id: string;
// // // // //   startTime: string;
// // // // //   endTime: string | null;
// // // // //   duration: number; // in seconds
// // // // //   breaks: { start: string; end: string; duration: number }[];
// // // // //   status: "ACTIVE" | "COMPLETED" | "INTERRUPTED";
// // // // //   date: string;
// // // // // }

// // // // // // Define types for our timer state
// // // // // interface TimerState {
// // // // //   status: "idle" | "running" | "paused" | "break" | "stopped";
// // // // //   startTimestamp: number | null;
// // // // //   pausedAt: number | null;
// // // // //   totalElapsed: number; // in milliseconds
// // // // //   breakStartTime: number | null;
// // // // //   totalBreakTime: number; // in milliseconds
// // // // //   sessionId: string | null;
// // // // //   currentBreakId: string | null;
// // // // // }

// // // // // interface TimeTrackerProps {
// // // // //   user: User;
// // // // // }

// // // // // export function TimeTracker() {
// // // // //   const { toast } = useToast();
// // // // //   const { data } = useGetIdentity();

// // // // //   // Time tracking states
// // // // //   const [timerState, setTimerState] = useState<TimerState>({
// // // // //     status: "idle",
// // // // //     startTimestamp: null,
// // // // //     pausedAt: null,
// // // // //     totalElapsed: 0,
// // // // //     breakStartTime: null,
// // // // //     totalBreakTime: 0,
// // // // //     sessionId: null,
// // // // //     currentBreakId: null,
// // // // //   });
// // // // //   const [displayTime, setDisplayTime] = useState("00:00:00");
// // // // //   const [idleTime, setIdleTime] = useState(0); // in minutes
// // // // //   const [clockInTime, setClockInTime] = useState<string | null>(null);
// // // // //   const [clockOutTime, setClockOutTime] = useState<string | null>(null);
// // // // //   const [timerSessions, setTimerSessions] = useState<TimerSession[]>([]);
// // // // //   const [progress, setProgress] = useState(0);
// // // // //   const [currentBreaks, setCurrentBreaks] = useState<
// // // // //     { start: string; end: string | null; duration: number }[]
// // // // //   >([]);

// // // // //   // Refs
// // // // //   const timerRef = useRef<number | null>(null);
// // // // //   const idleTimerRef = useRef<number | null>(null);
// // // // //   const lastActivityRef = useRef<number>(Date.now());

// // // // //   // Load saved timer state and sessions from localStorage and database on component mount
// // // // //   useEffect(() => {
// // // // //     const loadTimerState = async () => {
// // // // //       try {
// // // // //         // First check localStorage for any saved state
// // // // //         const savedTimerState = localStorage.getItem("timerState");
// // // // //         const savedTimerSessions = localStorage.getItem("timerSessions");
// // // // //         const savedBreaks = localStorage.getItem("currentBreaks");

// // // // //         if (savedTimerState) {
// // // // //           const parsedState = JSON.parse(savedTimerState) as TimerState;

// // // // //           // If the timer was running or paused when the page was closed/refreshed
// // // // //           if (
// // // // //             parsedState.status === "running" ||
// // // // //             parsedState.status === "paused" ||
// // // // //             parsedState.status === "break"
// // // // //           ) {
// // // // //             // Calculate elapsed time since the page was closed
// // // // //             const now = Date.now();
// // // // //             const adjustedState = { ...parsedState };

// // // // //             if (
// // // // //               parsedState.status === "running" &&
// // // // //               parsedState.startTimestamp
// // // // //             ) {
// // // // //               // For running timers, add the time that passed while the page was closed
// // // // //               const timePassedSinceClose =
// // // // //                 now - parsedState.startTimestamp - parsedState.totalElapsed;
// // // // //               adjustedState.totalElapsed += timePassedSinceClose;

// // // // //               // Auto-pause the timer if it was running
// // // // //               adjustedState.status = "paused";
// // // // //               adjustedState.pausedAt = now;

// // // // //               toast({
// // // // //                 title: "Timer auto-paused",
// // // // //                 description:
// // // // //                   "Your timer was running when you left. It's now paused.",
// // // // //                 duration: 5000,
// // // // //               });
// // // // //             }

// // // // //             setTimerState(adjustedState);
// // // // //             updateDisplayTime(adjustedState.totalElapsed);
// // // // //             updateProgress(adjustedState.totalElapsed);

// // // // //             // If the timer was running, we need to restart it
// // // // //             if (parsedState.status === "running") {
// // // // //               startTimerInterval();
// // // // //             }
// // // // //           } else {
// // // // //             setTimerState(parsedState);
// // // // //             updateDisplayTime(parsedState.totalElapsed);
// // // // //             updateProgress(parsedState.totalElapsed);
// // // // //           }
// // // // //         }

// // // // //         if (savedTimerSessions) {
// // // // //           setTimerSessions(JSON.parse(savedTimerSessions));
// // // // //         }

// // // // //         if (savedBreaks) {
// // // // //           setCurrentBreaks(JSON.parse(savedBreaks));
// // // // //         }

// // // // //         // Now check the database for any active sessions
// // // // //         const { data: activeSessionData } = await supabaseBrowserClient
// // // // //           .from("time_sessions")
// // // // //           .select("*")
// // // // //           .eq("user_id", data?.user?.id)
// // // // //           .eq("status", "active")
// // // // //           .single();

// // // // //         if (activeSessionData && !timerState?.sessionId) {
// // // // //           // We have an active session in the database but not in local state
// // // // //           const startTime = new Date(activeSessionData.start_time).getTime();
// // // // //           const now = Date.now();
// // // // //           const elapsed = now - startTime;

// // // // //           // Check for any active breaks
// // // // //           const { data: activeBreakData } = await supabaseBrowserClient
// // // // //             .from("time_breaks")
// // // // //             .select("*")
// // // // //             .eq("session_id", activeSessionData.id)
// // // // //             .is("end_time", null)
// // // // //             .single();

// // // // //           if (activeBreakData) {
// // // // //             // We have an active break
// // // // //             const breakStartTime = new Date(
// // // // //               activeBreakData.start_time
// // // // //             ).getTime();

// // // // //             setTimerState({
// // // // //               status: "break",
// // // // //               startTimestamp: startTime,
// // // // //               pausedAt: null,
// // // // //               totalElapsed: elapsed,
// // // // //               breakStartTime: breakStartTime,
// // // // //               totalBreakTime: activeSessionData.total_break_time || 0,
// // // // //               sessionId: activeSessionData.id,
// // // // //               currentBreakId: activeBreakData.id,
// // // // //             });

// // // // //             // Load all breaks for this session
// // // // //             const { data: breaksData } = await supabaseBrowserClient
// // // // //               .from("time_breaks")
// // // // //               .select("*")
// // // // //               .eq("session_id", activeSessionData.id)
// // // // //               .order("start_time", { ascending: true });

// // // // //             if (breaksData) {
// // // // //               setCurrentBreaks(
// // // // //                 breaksData.map((b) => ({
// // // // //                   start: new Date(b.start_time).toLocaleTimeString("en-US", {
// // // // //                     hour: "numeric",
// // // // //                     minute: "2-digit",
// // // // //                     hour12: true,
// // // // //                   }),
// // // // //                   end: b.end_time
// // // // //                     ? new Date(b.end_time).toLocaleTimeString("en-US", {
// // // // //                         hour: "numeric",
// // // // //                         minute: "2-digit",
// // // // //                         hour12: true,
// // // // //                       })
// // // // //                     : null,
// // // // //                   duration: b.duration || 0,
// // // // //                 }))
// // // // //               );
// // // // //             }
// // // // //           } else {
// // // // //             // No active break, just an active session
// // // // //             setTimerState({
// // // // //               status: "running",
// // // // //               startTimestamp: startTime,
// // // // //               pausedAt: null,
// // // // //               totalElapsed: elapsed,
// // // // //               breakStartTime: null,
// // // // //               totalBreakTime: activeSessionData.total_break_time || 0,
// // // // //               sessionId: activeSessionData.id,
// // // // //               currentBreakId: null,
// // // // //             });

// // // // //             startTimerInterval();
// // // // //           }

// // // // //           setClockInTime(
// // // // //             new Date(activeSessionData.start_time).toLocaleTimeString("en-US", {
// // // // //               hour: "numeric",
// // // // //               minute: "2-digit",
// // // // //               hour12: true,
// // // // //             })
// // // // //           );

// // // // //           updateDisplayTime(elapsed);
// // // // //           updateProgress(elapsed);

// // // // //           toast({
// // // // //             title: "Active session restored",
// // // // //             description: "Your previous session has been restored.",
// // // // //             duration: 3000,
// // // // //           });
// // // // //         }

// // // // //         // Load recent sessions
// // // // //         const { data: sessionsData } = await supabaseBrowserClient
// // // // //           .from("time_sessions")
// // // // //           .select("*")
// // // // //           .eq("user_id", data?.user?.id)
// // // // //           .order("created_at", { ascending: false })
// // // // //           .limit(10);

// // // // //         if (sessionsData) {
// // // // //           const formattedSessions: TimerSession[] = await Promise.all(
// // // // //             sessionsData.map(async (session) => {
// // // // //               // Get breaks for this session
// // // // //               const { data: sessionBreaks } = await supabaseBrowserClient
// // // // //                 .from("time_breaks")
// // // // //                 .select("*")
// // // // //                 .eq("session_id", session.id)
// // // // //                 .order("start_time", { ascending: true });

// // // // //               return {
// // // // //                 id: session.id,
// // // // //                 startTime: new Date(session.start_time).toLocaleTimeString(
// // // // //                   "en-US",
// // // // //                   {
// // // // //                     hour: "numeric",
// // // // //                     minute: "2-digit",
// // // // //                     hour12: true,
// // // // //                   }
// // // // //                 ),
// // // // //                 endTime: session.end_time
// // // // //                   ? new Date(session.end_time).toLocaleTimeString("en-US", {
// // // // //                       hour: "numeric",
// // // // //                       minute: "2-digit",
// // // // //                       hour12: true,
// // // // //                     })
// // // // //                   : null,
// // // // //                 duration: session.duration || 0,
// // // // //                 breaks: sessionBreaks
// // // // //                   ? sessionBreaks.map((b) => ({
// // // // //                       start: new Date(b.start_time).toLocaleTimeString(
// // // // //                         "en-US",
// // // // //                         {
// // // // //                           hour: "numeric",
// // // // //                           minute: "2-digit",
// // // // //                           hour12: true,
// // // // //                         }
// // // // //                       ),
// // // // //                       end: new Date(b.end_time).toLocaleTimeString("en-US", {
// // // // //                         hour: "numeric",
// // // // //                         minute: "2-digit",
// // // // //                         hour12: true,
// // // // //                       }),
// // // // //                       duration: b.duration || 0,
// // // // //                     }))
// // // // //                   : [],
// // // // //                 status: session.status,
// // // // //                 date: new Date(session.created_at).toISOString().split("T")[0],
// // // // //               };
// // // // //             })
// // // // //           );

// // // // //           setTimerSessions(formattedSessions);
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error("Error loading timer state:", error);
// // // // //         toast({
// // // // //           title: "Error",
// // // // //           description: "Failed to load your time tracking data.",
// // // // //           variant: "destructive",
// // // // //           duration: 5000,
// // // // //         });
// // // // //       }
// // // // //     };

// // // // //     loadTimerState();

// // // // //     // Set up activity tracking for idle detection
// // // // //     const trackActivity = () => {
// // // // //       lastActivityRef.current = Date.now();
// // // // //     };

// // // // //     window.addEventListener("mousemove", trackActivity);
// // // // //     window.addEventListener("keydown", trackActivity);
// // // // //     window.addEventListener("click", trackActivity);

// // // // //     // Start idle timer
// // // // //     startIdleTimer();

// // // // //     // Set up beforeunload event to save timer state
// // // // //     const handleBeforeUnload = () => {
// // // // //       saveTimerState();
// // // // //     };

// // // // //     window.addEventListener("beforeunload", handleBeforeUnload);

// // // // //     return () => {
// // // // //       window.removeEventListener("mousemove", trackActivity);
// // // // //       window.removeEventListener("keydown", trackActivity);
// // // // //       window.removeEventListener("click", trackActivity);
// // // // //       window.removeEventListener("beforeunload", handleBeforeUnload);

// // // // //       if (timerRef.current) {
// // // // //         window.clearInterval(timerRef.current);
// // // // //       }

// // // // //       if (idleTimerRef.current) {
// // // // //         window.clearInterval(idleTimerRef.current);
// // // // //       }
// // // // //     };
// // // // //   }, [data?.user?.id, timerState?.sessionId]);

// // // // //   // Save timer state to localStorage whenever it changes
// // // // //   useEffect(() => {
// // // // //     saveTimerState();
// // // // //   }, [timerState]);

// // // // //   // Save timer sessions to localStorage whenever they change
// // // // //   useEffect(() => {
// // // // //     localStorage.setItem("timerSessions", JSON.stringify(timerSessions));
// // // // //   }, [timerSessions]);

// // // // //   // Save current breaks to localStorage whenever they change
// // // // //   useEffect(() => {
// // // // //     localStorage.setItem("currentBreaks", JSON.stringify(currentBreaks));
// // // // //   }, [currentBreaks]);

// // // // //   // Helper function to save timer state
// // // // //   const saveTimerState = () => {
// // // // //     localStorage.setItem("timerState", JSON.stringify(timerState));
// // // // //   };

// // // // //   // Helper function to update display time
// // // // //   const updateDisplayTime = (elapsed: number) => {
// // // // //     setDisplayTime(formatTime(elapsed));
// // // // //   };

// // // // //   // Helper function to update progress
// // // // //   const updateProgress = (elapsed: number) => {
// // // // //     setProgress(calculateProgress(elapsed));
// // // // //   };

// // // // //   // Start the timer interval
// // // // //   const startTimerInterval = useCallback(() => {
// // // // //     if (timerRef.current) {
// // // // //       window.clearInterval(timerRef.current);
// // // // //     }

// // // // //     timerRef.current = window.setInterval(() => {
// // // // //       setTimerState((prevState) => {
// // // // //         if (prevState.status !== "running" || !prevState.startTimestamp) {
// // // // //           return prevState;
// // // // //         }

// // // // //         const now = Date.now();
// // // // //         const newElapsed = now - prevState.startTimestamp;

// // // // //         updateDisplayTime(newElapsed);
// // // // //         updateProgress(newElapsed);

// // // // //         return {
// // // // //           ...prevState,
// // // // //           totalElapsed: newElapsed,
// // // // //         };
// // // // //       });
// // // // //     }, 100);
// // // // //   }, []);

// // // // //   // Start the idle timer
// // // // //   const startIdleTimer = () => {
// // // // //     if (idleTimerRef.current) {
// // // // //       window.clearInterval(idleTimerRef.current);
// // // // //     }

// // // // //     idleTimerRef.current = window.setInterval(() => {
// // // // //       const now = Date.now();
// // // // //       const idleTimeMs = now - lastActivityRef.current;
// // // // //       const idleTimeMinutes = Math.floor(idleTimeMs / 60000);

// // // // //       setIdleTime(idleTimeMinutes);

// // // // //       // Auto-pause the timer if user is idle for more than 5 minutes and timer is running
// // // // //       if (idleTimeMinutes >= 5 && timerState.status === "running") {
// // // // //         pauseTimer();
// // // // //         toast({
// // // // //           title: "Timer auto-paused",
// // // // //           description: "Your timer was paused due to inactivity.",
// // // // //           duration: 5000,
// // // // //         });
// // // // //       }
// // // // //     }, 60000); // Check every minute
// // // // //   };

// // // // //   // Start the timer
// // // // //   const startTimer = async () => {
// // // // //     const now = Date.now();
// // // // //     const currentTime = getCurrentTime();

// // // // //     try {
// // // // //       if (timerState.status === "idle" || timerState.status === "stopped") {
// // // // //         // Create a new session in the database
// // // // //         const newSession = await createTimeSession(data?.user?.id);

// // // // //         if (!newSession) {
// // // // //           throw new Error("Failed to create time session");
// // // // //         }

// // // // //         const sessionId = newSession.id;

// // // // //         setTimerState({
// // // // //           status: "running",
// // // // //           startTimestamp: now,
// // // // //           pausedAt: null,
// // // // //           totalElapsed: 0,
// // // // //           breakStartTime: null,
// // // // //           totalBreakTime: 0,
// // // // //           sessionId,
// // // // //           currentBreakId: null,
// // // // //         });

// // // // //         // Create a new active session for local state
// // // // //         const newLocalSession: TimerSession = {
// // // // //           id: sessionId,
// // // // //           startTime: currentTime,
// // // // //           endTime: null,
// // // // //           duration: 0,
// // // // //           breaks: [],
// // // // //           status: "ACTIVE",
// // // // //           date: getCurrentDate(),
// // // // //         };

// // // // //         setTimerSessions((prev) => [newLocalSession, ...prev]);
// // // // //         setCurrentBreaks([]);
// // // // //         setClockInTime(currentTime);
// // // // //         setClockOutTime(null);

// // // // //         startTimerInterval();

// // // // //         toast({
// // // // //           title: "Timer started",
// // // // //           description: `Clocked in at ${currentTime}`,
// // // // //           duration: 3000,
// // // // //         });
// // // // //       } else if (timerState.status === "paused" && timerState.pausedAt) {
// // // // //         // Resume the timer from pause
// // // // //         const pausedDuration = now - timerState.pausedAt;
// // // // //         const newStartTimestamp = now - timerState.totalElapsed;

// // // // //         setTimerState({
// // // // //           ...timerState,
// // // // //           status: "running",
// // // // //           startTimestamp: newStartTimestamp,
// // // // //           pausedAt: null,
// // // // //         });

// // // // //         startTimerInterval();

// // // // //         toast({
// // // // //           title: "Timer resumed",
// // // // //           description: `Paused for ${formatDuration(pausedDuration)}`,
// // // // //           duration: 3000,
// // // // //         });
// // // // //       } else if (
// // // // //         timerState.status === "break" &&
// // // // //         timerState.breakStartTime &&
// // // // //         timerState.currentBreakId
// // // // //       ) {
// // // // //         // Resume from break - end the break in the database
// // // // //         const breakDuration = now - timerState.breakStartTime;
// // // // //         const newStartTimestamp = now - timerState.totalElapsed;
// // // // //         const totalBreakTime = timerState.totalBreakTime + breakDuration;

// // // // //         // End the break in the database
// // // // //         await endTimeBreak(
// // // // //           timerState.currentBreakId,
// // // // //           Math.floor(breakDuration / 1000)
// // // // //         );

// // // // //         // Update the current break with end time
// // // // //         const updatedBreaks = [...currentBreaks];
// // // // //         const currentBreakIndex = updatedBreaks.findIndex(
// // // // //           (b) => b.end === null
// // // // //         );
// // // // //         if (currentBreakIndex !== -1) {
// // // // //           updatedBreaks[currentBreakIndex] = {
// // // // //             ...updatedBreaks[currentBreakIndex],
// // // // //             end: getCurrentTime(),
// // // // //             duration: Math.floor(breakDuration / 1000),
// // // // //           };
// // // // //         }

// // // // //         // Update the session with the break
// // // // //         if (timerState.sessionId) {
// // // // //           setTimerSessions((prev) =>
// // // // //             prev.map((session) => {
// // // // //               if (session.id === timerState.sessionId) {
// // // // //                 return {
// // // // //                   ...session,
// // // // //                   breaks: [
// // // // //                     ...session.breaks,
// // // // //                     {
// // // // //                       start:
// // // // //                         updatedBreaks[currentBreakIndex]?.start ||
// // // // //                         getCurrentTime(),
// // // // //                       end: getCurrentTime(),
// // // // //                       duration: Math.floor(breakDuration / 1000),
// // // // //                     },
// // // // //                   ],
// // // // //                 };
// // // // //               }
// // // // //               return session;
// // // // //             })
// // // // //           );

// // // // //           // Update total break time in the database
// // // // //           await supabaseBrowserClient
// // // // //             .from("time_sessions")
// // // // //             .update({ total_break_time: Math.floor(totalBreakTime / 1000) })
// // // // //             .eq("id", timerState.sessionId);
// // // // //         }

// // // // //         setCurrentBreaks(updatedBreaks);

// // // // //         setTimerState({
// // // // //           ...timerState,
// // // // //           status: "running",
// // // // //           startTimestamp: newStartTimestamp,
// // // // //           breakStartTime: null,
// // // // //           totalBreakTime,
// // // // //           currentBreakId: null,
// // // // //         });

// // // // //         startTimerInterval();

// // // // //         toast({
// // // // //           title: "Break ended",
// // // // //           description: `Break duration: ${formatDuration(breakDuration)}`,
// // // // //           duration: 3000,
// // // // //         });
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error("Error starting timer:", error);
// // // // //       toast({
// // // // //         title: "Error",
// // // // //         description: "Failed to start the timer. Please try again.",
// // // // //         variant: "destructive",
// // // // //         duration: 5000,
// // // // //       });
// // // // //     }
// // // // //   };

// // // // //   // Pause the timer
// // // // //   const pauseTimer = () => {
// // // // //     if (timerState.status === "running") {
// // // // //       const now = Date.now();

// // // // //       setTimerState({
// // // // //         ...timerState,
// // // // //         status: "paused",
// // // // //         pausedAt: now,
// // // // //       });

// // // // //       if (timerRef.current) {
// // // // //         window.clearInterval(timerRef.current);
// // // // //         timerRef.current = null;
// // // // //       }

// // // // //       toast({
// // // // //         title: "Timer paused",
// // // // //         description: "Timer is now paused. Click Resume to continue.",
// // // // //         duration: 3000,
// // // // //       });
// // // // //     }
// // // // //   };

// // // // //   // Take a break
// // // // //   const takeBreak = async () => {
// // // // //     if (timerState.status === "running" && timerState.sessionId) {
// // // // //       try {
// // // // //         const now = Date.now();
// // // // //         const currentTime = getCurrentTime();

// // // // //         // Create a break in the database
// // // // //         const newBreak = await createTimeBreak(timerState.sessionId);

// // // // //         if (!newBreak) {
// // // // //           throw new Error("Failed to create break");
// // // // //         }

// // // // //         // Add a new break to the current breaks
// // // // //         const newLocalBreak = {
// // // // //           start: currentTime,
// // // // //           end: null,
// // // // //           duration: 0,
// // // // //         };

// // // // //         setCurrentBreaks((prev) => [...prev, newLocalBreak]);

// // // // //         setTimerState({
// // // // //           ...timerState,
// // // // //           status: "break",
// // // // //           breakStartTime: now,
// // // // //           currentBreakId: newBreak.id,
// // // // //         });

// // // // //         if (timerRef.current) {
// // // // //           window.clearInterval(timerRef.current);
// // // // //           timerRef.current = null;
// // // // //         }

// // // // //         toast({
// // // // //           title: "Break started",
// // // // //           description: "Enjoy your break! Timer is paused.",
// // // // //           duration: 3000,
// // // // //         });
// // // // //       } catch (error) {
// // // // //         console.error("Error taking break:", error);
// // // // //         toast({
// // // // //           title: "Error",
// // // // //           description: "Failed to start break. Please try again.",
// // // // //           variant: "destructive",
// // // // //           duration: 5000,
// // // // //         });
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   // Stop the timer
// // // // //   const stopTimer = async () => {
// // // // //     if (
// // // // //       (timerState.status === "running" ||
// // // // //         timerState.status === "paused" ||
// // // // //         timerState.status === "break") &&
// // // // //       timerState.sessionId
// // // // //     ) {
// // // // //       try {
// // // // //         const now = Date.now();
// // // // //         const currentTime = getCurrentTime();

// // // // //         // Calculate final duration
// // // // //         const finalDuration = timerState.totalElapsed;
// // // // //         let finalBreakDuration = timerState.totalBreakTime;

// // // // //         if (
// // // // //           timerState.status === "break" &&
// // // // //           timerState.breakStartTime &&
// // // // //           timerState.currentBreakId
// // // // //         ) {
// // // // //           const breakDuration = now - timerState.breakStartTime;
// // // // //           finalBreakDuration += breakDuration;

// // // // //           // End the current break in the database
// // // // //           await endTimeBreak(
// // // // //             timerState.currentBreakId,
// // // // //             Math.floor(breakDuration / 1000)
// // // // //           );

// // // // //           // Update the current break with end time
// // // // //           const updatedBreaks = [...currentBreaks];
// // // // //           const currentBreakIndex = updatedBreaks.findIndex(
// // // // //             (b) => b.end === null
// // // // //           );
// // // // //           if (currentBreakIndex !== -1) {
// // // // //             updatedBreaks[currentBreakIndex] = {
// // // // //               ...updatedBreaks[currentBreakIndex],
// // // // //               end: currentTime,
// // // // //               duration: Math.floor(breakDuration / 1000),
// // // // //             };
// // // // //           }

// // // // //           setCurrentBreaks(updatedBreaks);
// // // // //         }

// // // // //         // End the session in the database
// // // // //         await endTimeSession(
// // // // //           timerState.sessionId,
// // // // //           Math.floor(finalDuration / 1000)
// // // // //         );

// // // // //         // Update total break time in the database
// // // // //         await supabaseBrowserClient
// // // // //           .from("time_sessions")
// // // // //           .update({ total_break_time: Math.floor(finalBreakDuration / 1000) })
// // // // //           .eq("id", timerState.sessionId);

// // // // //         // Save the session in local state
// // // // //         setTimerSessions((prev) =>
// // // // //           prev.map((session) => {
// // // // //             if (session.id === timerState.sessionId) {
// // // // //               return {
// // // // //                 ...session,
// // // // //                 endTime: currentTime,
// // // // //                 duration: Math.floor(finalDuration / 1000),
// // // // //                 breaks: session.breaks.concat(
// // // // //                   currentBreaks
// // // // //                     .filter((b) => b.end !== null)
// // // // //                     .map((b) => ({
// // // // //                       start: b.start,
// // // // //                       end: b.end || currentTime,
// // // // //                       duration: b.duration,
// // // // //                     }))
// // // // //                 ),
// // // // //                 status: "COMPLETED",
// // // // //               };
// // // // //             }
// // // // //             return session;
// // // // //           })
// // // // //         );

// // // // //         setTimerState({
// // // // //           status: "stopped",
// // // // //           startTimestamp: null,
// // // // //           pausedAt: null,
// // // // //           totalElapsed: finalDuration,
// // // // //           breakStartTime: null,
// // // // //           totalBreakTime: finalBreakDuration,
// // // // //           sessionId: null,
// // // // //           currentBreakId: null,
// // // // //         });

// // // // //         setClockOutTime(currentTime);

// // // // //         if (timerRef.current) {
// // // // //           window.clearInterval(timerRef.current);
// // // // //           timerRef.current = null;
// // // // //         }

// // // // //         toast({
// // // // //           title: "Checked out",
// // // // //           description: `Total work time: ${formatDuration(
// // // // //             finalDuration - finalBreakDuration
// // // // //           )}`,
// // // // //           duration: 3000,
// // // // //         });
// // // // //       } catch (error) {
// // // // //         console.error("Error stopping timer:", error);
// // // // //         toast({
// // // // //           title: "Error",
// // // // //           description: "Failed to stop the timer. Please try again.",
// // // // //           variant: "destructive",
// // // // //           duration: 5000,
// // // // //         });
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="bg-gray-50 rounded-lg p-6 mb-8">
// // // // //       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
// // // // //         <div className="flex flex-col items-center">
// // // // //           <div className="text-sm font-medium text-gray-500 mb-2">Status</div>
// // // // //           <StatusBadge status={timerState.status} />
// // // // //         </div>

// // // // //         <CircularTimer
// // // // //           time={displayTime}
// // // // //           progress={progress}
// // // // //           state={timerState.status}
// // // // //           pulseWhenRunning={timerState.status === "running"}
// // // // //         />

// // // // //         <div className="flex flex-col items-center">
// // // // //           <div className="text-sm font-medium text-gray-500 mb-2">Session</div>
// // // // //           <div className="flex flex-col items-center gap-1">
// // // // //             {clockInTime && (
// // // // //               <div className="text-sm">
// // // // //                 <span className="font-medium">In:</span> {clockInTime}
// // // // //               </div>
// // // // //             )}
// // // // //             {clockOutTime && (
// // // // //               <div className="text-sm">
// // // // //                 <span className="font-medium">Out:</span> {clockOutTime}
// // // // //               </div>
// // // // //             )}
// // // // //             {!clockInTime && !clockOutTime && (
// // // // //               <div className="text-sm text-gray-500">No active session</div>
// // // // //             )}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       <TimeControls
// // // // //         status={timerState.status}
// // // // //         onStart={startTimer}
// // // // //         onPause={pauseTimer}
// // // // //         onBreak={takeBreak}
// // // // //         onStop={stopTimer}
// // // // //       />

// // // // //       <BreakSummary breaks={currentBreaks} />

// // // // //       <div className="flex items-center justify-between mt-8">
// // // // //         <div className="flex items-center gap-4">
// // // // //           <div className="text-sm font-medium">Idle Time</div>
// // // // //           <Badge
// // // // //             className={
// // // // //               idleTime >= 5
// // // // //                 ? "bg-amber-100 text-amber-800"
// // // // //                 : "bg-gray-100 text-gray-800"
// // // // //             }
// // // // //           >
// // // // //             {idleTime.toString().padStart(2, "0")} min
// // // // //           </Badge>
// // // // //         </div>

// // // // //         <SessionHistoryDialog sessions={timerSessions} />
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // "use client"

// // // // import { useState, useEffect, useRef, useCallback } from "react"
// // // // import { useToast } from "@/components/ui/use-toast"
// // // // import { StatusBadge } from "./status-badge"
// // // // import { TimeControls } from "./time-controls"
// // // // import { BreakSummary } from "./break-summary"
// // // // import { SessionHistoryDialog } from "./session-history-dialog"
// // // // import { Badge } from "@/components/ui/badge"
// // // // import { formatTime, formatDuration, getCurrentTime, getCurrentDate, calculateProgress } from "@/lib/time-utils"
// // // // import { createTimeSession, endTimeSession, createTimeBreak, endTimeBreak } from "@/lib/supabase"
// // // // import type { User } from "@/lib/supabase"
// // // // import { CircularTimer } from "./circular-time"
// // // // import { supabaseBrowserClient as supabase} from "@utils/supabase/client"

// // // // // Define types for our timer session
// // // // interface TimerSession {
// // // //   id: string
// // // //   startTime: string
// // // //   endTime: string | null
// // // //   duration: number // in seconds
// // // //   breaks: { start: string; end: string; duration: number }[]
// // // //   status: "active" | "completed" | "interrupted"
// // // //   date: string
// // // // }

// // // // // Define types for our timer state
// // // // interface TimerState {
// // // //   status: "idle" | "running" | "paused" | "break" | "stopped"
// // // //   startTimestamp: number | null
// // // //   pausedAt: number | null
// // // //   totalElapsed: number // in milliseconds
// // // //   breakStartTime: number | null
// // // //   totalBreakTime: number // in milliseconds
// // // //   sessionId: string | null
// // // //   currentBreakId: string | null
// // // // }

// // // // interface TimeTrackerProps {
// // // //   user: User | null
// // // // }

// // // // export function TimeTracker({ user }: TimeTrackerProps) {
// // // //   const { toast } = useToast()
// // // //   const [isLoading, setIsLoading] = useState(true)

// // // //   // Time tracking states
// // // //   const [timerState, setTimerState] = useState<TimerState>({
// // // //     status: "idle",
// // // //     startTimestamp: null,
// // // //     pausedAt: null,
// // // //     totalElapsed: 0,
// // // //     breakStartTime: null,
// // // //     totalBreakTime: 0,
// // // //     sessionId: null,
// // // //     currentBreakId: null,
// // // //   })
// // // //   const [displayTime, setDisplayTime] = useState("00:00:00")
// // // //   const [idleTime, setIdleTime] = useState(0) // in minutes
// // // //   const [clockInTime, setClockInTime] = useState<string | null>(null)
// // // //   const [clockOutTime, setClockOutTime] = useState<string | null>(null)
// // // //   const [timerSessions, setTimerSessions] = useState<TimerSession[]>([])
// // // //   const [progress, setProgress] = useState(0)
// // // //   const [currentBreaks, setCurrentBreaks] = useState<{ start: string; end: string | null; duration: number }[]>([])

// // // //   // Refs
// // // //   const timerRef = useRef<number | null>(null)
// // // //   const idleTimerRef = useRef<number | null>(null)
// // // //   const lastActivityRef = useRef<number>(Date.now())

// // // //   // Load saved timer state and sessions from localStorage and database on component mount
// // // //   useEffect(() => {
// // // //     // Skip if user is null
// // // //     if (!user) {
// // // //       setIsLoading(false)
// // // //       return
// // // //     }

// // // //     const loadTimerState = async () => {
// // // //       try {
// // // //         // First check localStorage for any saved state
// // // //         const savedTimerState = localStorage.getItem("timerState")
// // // //         const savedTimerSessions = localStorage.getItem("timerSessions")
// // // //         const savedBreaks = localStorage.getItem("currentBreaks")

// // // //         if (savedTimerState) {
// // // //           const parsedState = JSON.parse(savedTimerState) as TimerState

// // // //           // If the timer was running or paused when the page was closed/refreshed
// // // //           if (parsedState.status === "running" || parsedState.status === "paused" || parsedState.status === "break") {
// // // //             // Calculate elapsed time since the page was closed
// // // //             const now = Date.now()
// // // //             const adjustedState = { ...parsedState }

// // // //             if (parsedState.status === "running" && parsedState.startTimestamp) {
// // // //               // For running timers, add the time that passed while the page was closed
// // // //               const timePassedSinceClose = now - parsedState.startTimestamp - parsedState.totalElapsed
// // // //               adjustedState.totalElapsed += timePassedSinceClose

// // // //               // Auto-pause the timer if it was running
// // // //               adjustedState.status = "paused"
// // // //               adjustedState.pausedAt = now

// // // //               toast({
// // // //                 title: "Timer auto-paused",
// // // //                 description: "Your timer was running when you left. It's now paused.",
// // // //                 duration: 5000,
// // // //               })
// // // //             }

// // // //             setTimerState(adjustedState)
// // // //             updateDisplayTime(adjustedState.totalElapsed)
// // // //             updateProgress(adjustedState.totalElapsed)

// // // //             // If the timer was running, we need to restart it
// // // //             if (parsedState.status === "running") {
// // // //               startTimerInterval()
// // // //             }
// // // //           } else {
// // // //             setTimerState(parsedState)
// // // //             updateDisplayTime(parsedState.totalElapsed)
// // // //             updateProgress(parsedState.totalElapsed)
// // // //           }
// // // //         }

// // // //         if (savedTimerSessions) {
// // // //           setTimerSessions(JSON.parse(savedTimerSessions))
// // // //         }

// // // //         if (savedBreaks) {
// // // //           setCurrentBreaks(JSON.parse(savedBreaks))
// // // //         }

// // // //         // Now check the database for any active sessions
// // // //         const { data: activeSessionData } = await supabase
// // // //           .from("time_sessions")
// // // //           .select("*")
// // // //           .eq("user_id", user.id)
// // // //           .eq("status", "ACTIVE")
// // // //           .single()

// // // //         if (activeSessionData && !timerState?.sessionId) {
// // // //           // We have an active session in the database but not in local state
// // // //           const startTime = new Date(activeSessionData.start_time).getTime()
// // // //           const now = Date.now()
// // // //           const elapsed = now - startTime

// // // //           // Check for any active breaks
// // // //           const { data: activeBreakData } = await supabase
// // // //             .from("time_breaks")
// // // //             .select("*")
// // // //             .eq("session_id", activeSessionData.id)
// // // //             .is("end_time", null)
// // // //             .single()

// // // //           if (activeBreakData) {
// // // //             // We have an active break
// // // //             const breakStartTime = new Date(activeBreakData.start_time).getTime()

// // // //             setTimerState({
// // // //               status: "break",
// // // //               startTimestamp: startTime,
// // // //               pausedAt: null,
// // // //               totalElapsed: elapsed,
// // // //               breakStartTime: breakStartTime,
// // // //               totalBreakTime: activeSessionData.total_break_time || 0,
// // // //               sessionId: activeSessionData.id,
// // // //               currentBreakId: activeBreakData.id,
// // // //             })

// // // //             // Load all breaks for this session
// // // //             const { data: breaksData } = await supabase
// // // //               .from("time_breaks")
// // // //               .select("*")
// // // //               .eq("session_id", activeSessionData.id)
// // // //               .order("start_time", { ascending: true })

// // // //             if (breaksData) {
// // // //               setCurrentBreaks(
// // // //                 breaksData.map((b) => ({
// // // //                   start: new Date(b.start_time).toLocaleTimeString("en-US", {
// // // //                     hour: "numeric",
// // // //                     minute: "2-digit",
// // // //                     hour12: true,
// // // //                   }),
// // // //                   end: b.end_time
// // // //                     ? new Date(b.end_time).toLocaleTimeString("en-US", {
// // // //                         hour: "numeric",
// // // //                         minute: "2-digit",
// // // //                         hour12: true,
// // // //                       })
// // // //                     : null,
// // // //                   duration: b.duration || 0,
// // // //                 })),
// // // //               )
// // // //             }
// // // //           } else {
// // // //             // No active break, just an active session
// // // //             setTimerState({
// // // //               status: "running",
// // // //               startTimestamp: startTime,
// // // //               pausedAt: null,
// // // //               totalElapsed: elapsed,
// // // //               breakStartTime: null,
// // // //               totalBreakTime: activeSessionData.total_break_time || 0,
// // // //               sessionId: activeSessionData.id,
// // // //               currentBreakId: null,
// // // //             })

// // // //             startTimerInterval()
// // // //           }

// // // //           setClockInTime(
// // // //             new Date(activeSessionData.start_time).toLocaleTimeString("en-US", {
// // // //               hour: "numeric",
// // // //               minute: "2-digit",
// // // //               hour12: true,
// // // //             }),
// // // //           )

// // // //           updateDisplayTime(elapsed)
// // // //           updateProgress(elapsed)

// // // //           toast({
// // // //             title: "Active session restored",
// // // //             description: "Your previous session has been restored.",
// // // //             duration: 3000,
// // // //           })
// // // //         }

// // // //         // Load recent sessions
// // // //         const { data: sessionsData } = await supabase
// // // //           .from("time_sessions")
// // // //           .select("*")
// // // //           .eq("user_id", user.id)
// // // //           .order("created_at", { ascending: false })
// // // //           .limit(10)

// // // //         if (sessionsData) {
// // // //           const formattedSessions: TimerSession[] = await Promise.all(
// // // //             sessionsData.map(async (session) => {
// // // //               // Get breaks for this session
// // // //               const { data: sessionBreaks } = await supabase
// // // //                 .from("time_breaks")
// // // //                 .select("*")
// // // //                 .eq("session_id", session.id)
// // // //                 .order("start_time", { ascending: true })

// // // //               return {
// // // //                 id: session.id,
// // // //                 startTime: new Date(session.start_time).toLocaleTimeString("en-US", {
// // // //                   hour: "numeric",
// // // //                   minute: "2-digit",
// // // //                   hour12: true,
// // // //                 }),
// // // //                 endTime: session.end_time
// // // //                   ? new Date(session.end_time).toLocaleTimeString("en-US", {
// // // //                       hour: "numeric",
// // // //                       minute: "2-digit",
// // // //                       hour12: true,
// // // //                     })
// // // //                   : null,
// // // //                 duration: session.duration || 0,
// // // //                 breaks: sessionBreaks
// // // //                   ? sessionBreaks.map((b) => ({
// // // //                       start: new Date(b.start_time).toLocaleTimeString("en-US", {
// // // //                         hour: "numeric",
// // // //                         minute: "2-digit",
// // // //                         hour12: true,
// // // //                       }),
// // // //                       end: new Date(b.end_time).toLocaleTimeString("en-US", {
// // // //                         hour: "numeric",
// // // //                         minute: "2-digit",
// // // //                         hour12: true,
// // // //                       }),
// // // //                       duration: b.duration || 0,
// // // //                     }))
// // // //                   : [],
// // // //                 status: session.status as "active" | "completed" | "interrupted",
// // // //                 date: new Date(session.created_at).toISOString().split("T")[0],
// // // //               }
// // // //             }),
// // // //           )

// // // //           setTimerSessions(formattedSessions)
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error loading timer state:", error)
// // // //         toast({
// // // //           title: "Error",
// // // //           description: "Failed to load your time tracking data.",
// // // //           variant: "destructive",
// // // //           duration: 5000,
// // // //         })
// // // //       } finally {
// // // //         setIsLoading(false)
// // // //       }
// // // //     }

// // // //     loadTimerState()

// // // //     // Set up activity tracking for idle detection
// // // //     const trackActivity = () => {
// // // //       lastActivityRef.current = Date.now()
// // // //     }

// // // //     window.addEventListener("mousemove", trackActivity)
// // // //     window.addEventListener("keydown", trackActivity)
// // // //     window.addEventListener("click", trackActivity)

// // // //     // Start idle timer
// // // //     startIdleTimer()

// // // //     // Set up beforeunload event to save timer state
// // // //     const handleBeforeUnload = () => {
// // // //       saveTimerState()
// // // //     }

// // // //     window.addEventListener("beforeunload", handleBeforeUnload)

// // // //     return () => {
// // // //       window.removeEventListener("mousemove", trackActivity)
// // // //       window.removeEventListener("keydown", trackActivity)
// // // //       window.removeEventListener("click", trackActivity)
// // // //       window.removeEventListener("beforeunload", handleBeforeUnload)

// // // //       if (timerRef.current) {
// // // //         window.clearInterval(timerRef.current)
// // // //       }

// // // //       if (idleTimerRef.current) {
// // // //         window.clearInterval(idleTimerRef.current)
// // // //       }
// // // //     }
// // // //   }, [user])

// // // //   // Save timer state to localStorage whenever it changes
// // // //   useEffect(() => {
// // // //     saveTimerState()
// // // //   }, [timerState])

// // // //   // Save timer sessions to localStorage whenever they change
// // // //   useEffect(() => {
// // // //     localStorage.setItem("timerSessions", JSON.stringify(timerSessions))
// // // //   }, [timerSessions])

// // // //   // Save current breaks to localStorage whenever they change
// // // //   useEffect(() => {
// // // //     localStorage.setItem("currentBreaks", JSON.stringify(currentBreaks))
// // // //   }, [currentBreaks])

// // // //   // Helper function to save timer state
// // // //   const saveTimerState = () => {
// // // //     localStorage.setItem("timerState", JSON.stringify(timerState))
// // // //   }

// // // //   // Helper function to update display time
// // // //   const updateDisplayTime = (elapsed: number) => {
// // // //     setDisplayTime(formatTime(elapsed))
// // // //   }

// // // //   // Helper function to update progress
// // // //   const updateProgress = (elapsed: number) => {
// // // //     setProgress(calculateProgress(elapsed))
// // // //   }

// // // //   // Start the timer interval
// // // //   const startTimerInterval = useCallback(() => {
// // // //     if (timerRef.current) {
// // // //       window.clearInterval(timerRef.current)
// // // //     }

// // // //     timerRef.current = window.setInterval(() => {
// // // //       setTimerState((prevState) => {
// // // //         if (prevState.status !== "running" || !prevState.startTimestamp) {
// // // //           return prevState
// // // //         }

// // // //         const now = Date.now()
// // // //         const newElapsed = now - prevState.startTimestamp

// // // //         updateDisplayTime(newElapsed)
// // // //         updateProgress(newElapsed)

// // // //         return {
// // // //           ...prevState,
// // // //           totalElapsed: newElapsed,
// // // //         }
// // // //       })
// // // //     }, 100)
// // // //   }, [])

// // // //   // Start the idle timer
// // // //   const startIdleTimer = () => {
// // // //     if (idleTimerRef.current) {
// // // //       window.clearInterval(idleTimerRef.current)
// // // //     }

// // // //     idleTimerRef.current = window.setInterval(() => {
// // // //       const now = Date.now()
// // // //       const idleTimeMs = now - lastActivityRef.current
// // // //       const idleTimeMinutes = Math.floor(idleTimeMs / 60000)

// // // //       setIdleTime(idleTimeMinutes)

// // // //       // Auto-pause the timer if user is idle for more than 5 minutes and timer is running
// // // //       if (idleTimeMinutes >= 5 && timerState.status === "running") {
// // // //         pauseTimer()
// // // //         toast({
// // // //           title: "Timer auto-paused",
// // // //           description: "Your timer was paused due to inactivity.",
// // // //           duration: 5000,
// // // //         })
// // // //       }
// // // //     }, 60000) // Check every minute
// // // //   }

// // // //   // Start the timer
// // // //   const startTimer = async () => {
// // // //     // Check if user is available
// // // //     if (!user) {
// // // //       toast({
// // // //         title: "Authentication required",
// // // //         description: "Please sign in to track your time.",
// // // //         variant: "destructive",
// // // //       })
// // // //       return
// // // //     }

// // // //     const now = Date.now()
// // // //     const currentTime = getCurrentTime()

// // // //     try {
// // // //       if (timerState.status === "idle" || timerState.status === "stopped") {
// // // //         // Create a new session in the database
// // // //         const newSession = await createTimeSession(user.id)

// // // //         if (!newSession) {
// // // //           throw new Error("Failed to create time session")
// // // //         }

// // // //         const sessionId = newSession.id

// // // //         setTimerState({
// // // //           status: "running",
// // // //           startTimestamp: now,
// // // //           pausedAt: null,
// // // //           totalElapsed: 0,
// // // //           breakStartTime: null,
// // // //           totalBreakTime: 0,
// // // //           sessionId,
// // // //           currentBreakId: null,
// // // //         })

// // // //         // Create a new active session for local state
// // // //         const newLocalSession: TimerSession = {
// // // //           id: sessionId,
// // // //           startTime: currentTime,
// // // //           endTime: null,
// // // //           duration: 0,
// // // //           breaks: [],
// // // //           status: "active",
// // // //           date: getCurrentDate(),
// // // //         }

// // // //         setTimerSessions((prev) => [newLocalSession, ...prev])
// // // //         setCurrentBreaks([])
// // // //         setClockInTime(currentTime)
// // // //         setClockOutTime(null)

// // // //         startTimerInterval()

// // // //         toast({
// // // //           title: "Timer started",
// // // //           description: `Clocked in at ${currentTime}`,
// // // //           duration: 3000,
// // // //         })
// // // //       } else if (timerState.status === "paused" && timerState.pausedAt) {
// // // //         // Resume the timer from pause
// // // //         const pausedDuration = now - timerState.pausedAt
// // // //         const newStartTimestamp = now - timerState.totalElapsed

// // // //         setTimerState({
// // // //           ...timerState,
// // // //           status: "running",
// // // //           startTimestamp: newStartTimestamp,
// // // //           pausedAt: null,
// // // //         })

// // // //         startTimerInterval()

// // // //         toast({
// // // //           title: "Timer resumed",
// // // //           description: `Paused for ${formatDuration(pausedDuration)}`,
// // // //           duration: 3000,
// // // //         })
// // // //       } else if (timerState.status === "break" && timerState.breakStartTime && timerState.currentBreakId) {
// // // //         // Resume from break - end the break in the database
// // // //         const breakDuration = now - timerState.breakStartTime
// // // //         const newStartTimestamp = now - timerState.totalElapsed
// // // //         const totalBreakTime = timerState.totalBreakTime + breakDuration

// // // //         // End the break in the database
// // // //         await endTimeBreak(timerState.currentBreakId, Math.floor(breakDuration / 1000))

// // // //         // Update the current break with end time
// // // //         const updatedBreaks = [...currentBreaks]
// // // //         const currentBreakIndex = updatedBreaks.findIndex((b) => b.end === null)
// // // //         if (currentBreakIndex !== -1) {
// // // //           updatedBreaks[currentBreakIndex] = {
// // // //             ...updatedBreaks[currentBreakIndex],
// // // //             end: getCurrentTime(),
// // // //             duration: Math.floor(breakDuration / 1000),
// // // //           }
// // // //         }

// // // //         // Update the session with the break
// // // //         if (timerState.sessionId) {
// // // //           setTimerSessions((prev) =>
// // // //             prev.map((session) => {
// // // //               if (session.id === timerState.sessionId) {
// // // //                 return {
// // // //                   ...session,
// // // //                   breaks: [
// // // //                     ...session.breaks,
// // // //                     {
// // // //                       start: updatedBreaks[currentBreakIndex]?.start || getCurrentTime(),
// // // //                       end: getCurrentTime(),
// // // //                       duration: Math.floor(breakDuration / 1000),
// // // //                     },
// // // //                   ],
// // // //                 }
// // // //               }
// // // //               return session
// // // //             }),
// // // //           )

// // // //           // Update total break time in the database
// // // //           await supabase
// // // //             .from("time_sessions")
// // // //             .update({ total_break_time: Math.floor(totalBreakTime / 1000) })
// // // //             .eq("id", timerState.sessionId)
// // // //         }

// // // //         setCurrentBreaks(updatedBreaks)

// // // //         setTimerState({
// // // //           ...timerState,
// // // //           status: "running",
// // // //           startTimestamp: newStartTimestamp,
// // // //           breakStartTime: null,
// // // //           totalBreakTime,
// // // //           currentBreakId: null,
// // // //         })

// // // //         startTimerInterval()

// // // //         toast({
// // // //           title: "Break ended",
// // // //           description: `Break duration: ${formatDuration(breakDuration)}`,
// // // //           duration: 3000,
// // // //         })
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error starting timer:", error)
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Failed to start the timer. Please try again.",
// // // //         variant: "destructive",
// // // //         duration: 5000,
// // // //       })
// // // //     }
// // // //   }

// // // //   // Pause the timer
// // // //   const pauseTimer = () => {
// // // //     if (timerState.status === "running") {
// // // //       const now = Date.now()

// // // //       setTimerState({
// // // //         ...timerState,
// // // //         status: "paused",
// // // //         pausedAt: now,
// // // //       })

// // // //       if (timerRef.current) {
// // // //         window.clearInterval(timerRef.current)
// // // //         timerRef.current = null
// // // //       }

// // // //       toast({
// // // //         title: "Timer paused",
// // // //         description: "Timer is now paused. Click Resume to continue.",
// // // //         duration: 3000,
// // // //       })
// // // //     }
// // // //   }

// // // //   // Take a break
// // // //   const takeBreak = async () => {
// // // //     // Check if user is available
// // // //     if (!user) {
// // // //       toast({
// // // //         title: "Authentication required",
// // // //         description: "Please sign in to track your time.",
// // // //         variant: "destructive",
// // // //       })
// // // //       return
// // // //     }

// // // //     if (timerState.status === "running" && timerState.sessionId) {
// // // //       try {
// // // //         const now = Date.now()
// // // //         const currentTime = getCurrentTime()

// // // //         // Create a break in the database
// // // //         const newBreak = await createTimeBreak(timerState.sessionId)

// // // //         if (!newBreak) {
// // // //           throw new Error("Failed to create break")
// // // //         }

// // // //         // Add a new break to the current breaks
// // // //         const newLocalBreak = {
// // // //           start: currentTime,
// // // //           end: null,
// // // //           duration: 0,
// // // //         }

// // // //         setCurrentBreaks((prev) => [...prev, newLocalBreak])

// // // //         setTimerState({
// // // //           ...timerState,
// // // //           status: "break",
// // // //           breakStartTime: now,
// // // //           currentBreakId: newBreak.id,
// // // //         })

// // // //         if (timerRef.current) {
// // // //           window.clearInterval(timerRef.current)
// // // //           timerRef.current = null
// // // //         }

// // // //         toast({
// // // //           title: "Break started",
// // // //           description: "Enjoy your break! Timer is paused.",
// // // //           duration: 3000,
// // // //         })
// // // //       } catch (error) {
// // // //         console.error("Error taking break:", error)
// // // //         toast({
// // // //           title: "Error",
// // // //           description: "Failed to start break. Please try again.",
// // // //           variant: "destructive",
// // // //           duration: 5000,
// // // //         })
// // // //       }
// // // //     }
// // // //   }

// // // //   // Stop the timer
// // // //   const stopTimer = async () => {
// // // //     // Check if user is available
// // // //     if (!user) {
// // // //       toast({
// // // //         title: "Authentication required",
// // // //         description: "Please sign in to track your time.",
// // // //         variant: "destructive",
// // // //       })
// // // //       return
// // // //     }

// // // //     if (
// // // //       (timerState.status === "running" || timerState.status === "paused" || timerState.status === "break") &&
// // // //       timerState.sessionId
// // // //     ) {
// // // //       try {
// // // //         const now = Date.now()
// // // //         const currentTime = getCurrentTime()

// // // //         // Calculate final duration
// // // //         const finalDuration = timerState.totalElapsed
// // // //         let finalBreakDuration = timerState.totalBreakTime

// // // //         if (timerState.status === "break" && timerState.breakStartTime && timerState.currentBreakId) {
// // // //           const breakDuration = now - timerState.breakStartTime
// // // //           finalBreakDuration += breakDuration

// // // //           // End the current break in the database
// // // //           await endTimeBreak(timerState.currentBreakId, Math.floor(breakDuration / 1000))

// // // //           // Update the current break with end time
// // // //           const updatedBreaks = [...currentBreaks]
// // // //           const currentBreakIndex = updatedBreaks.findIndex((b) => b.end === null)
// // // //           if (currentBreakIndex !== -1) {
// // // //             updatedBreaks[currentBreakIndex] = {
// // // //               ...updatedBreaks[currentBreakIndex],
// // // //               end: currentTime,
// // // //               duration: Math.floor(breakDuration / 1000),
// // // //             }
// // // //           }

// // // //           setCurrentBreaks(updatedBreaks)
// // // //         }

// // // //         // End the session in the database
// // // //         await endTimeSession(timerState.sessionId, Math.floor(finalDuration / 1000))

// // // //         // Update total break time in the database
// // // //         await supabase
// // // //           .from("time_sessions")
// // // //           .update({ total_break_time: Math.floor(finalBreakDuration / 1000) })
// // // //           .eq("id", timerState.sessionId)

// // // //         // Save the session in local state
// // // //         setTimerSessions((prev) =>
// // // //           prev.map((session) => {
// // // //             if (session.id === timerState.sessionId) {
// // // //               return {
// // // //                 ...session,
// // // //                 endTime: currentTime,
// // // //                 duration: Math.floor(finalDuration / 1000),
// // // //                 breaks: session.breaks.concat(
// // // //                   currentBreaks
// // // //                     .filter((b) => b.end !== null)
// // // //                     .map((b) => ({
// // // //                       start: b.start,
// // // //                       end: b.end || currentTime,
// // // //                       duration: b.duration,
// // // //                     })),
// // // //                 ),
// // // //                 status: "completed",
// // // //               }
// // // //             }
// // // //             return session
// // // //           }),
// // // //         )

// // // //         setTimerState({
// // // //           status: "stopped",
// // // //           startTimestamp: null,
// // // //           pausedAt: null,
// // // //           totalElapsed: finalDuration,
// // // //           breakStartTime: null,
// // // //           totalBreakTime: finalBreakDuration,
// // // //           sessionId: null,
// // // //           currentBreakId: null,
// // // //         })

// // // //         setClockOutTime(currentTime)

// // // //         if (timerRef.current) {
// // // //           window.clearInterval(timerRef.current)
// // // //           timerRef.current = null
// // // //         }

// // // //         toast({
// // // //           title: "Checked out",
// // // //           description: `Total work time: ${formatDuration(finalDuration - finalBreakDuration)}`,
// // // //           duration: 3000,
// // // //         })
// // // //       } catch (error) {
// // // //         console.error("Error stopping timer:", error)
// // // //         toast({
// // // //           title: "Error",
// // // //           description: "Failed to stop the timer. Please try again.",
// // // //           variant: "destructive",
// // // //           duration: 5000,
// // // //         })
// // // //       }
// // // //     }
// // // //   }

// // // //   // If user is not available, show a message
// // // //   if (!user) {
// // // //     return (
// // // //       <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
// // // //         <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
// // // //         <p className="text-gray-500 mb-4">Please sign in to use the time tracking features.</p>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   // Show loading state
// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className="bg-gray-50 rounded-lg p-6 mb-8 flex justify-center items-center min-h-[300px]">
// // // //         <div className="flex flex-col items-center gap-2">
// // // //           <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
// // // //           <p className="text-sm text-gray-500">Loading time tracking data...</p>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div className="bg-gray-50 rounded-lg p-6 mb-8">
// // // //       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
// // // //         <div className="flex flex-col items-center">
// // // //           <div className="text-sm font-medium text-gray-500 mb-2">Status</div>
// // // //           <StatusBadge status={timerState.status} />
// // // //         </div>

// // // //         <CircularTimer
// // // //           time={displayTime}
// // // //           progress={progress}
// // // //           state={timerState.status}
// // // //           pulseWhenRunning={timerState.status === "running"}
// // // //         />

// // // //         <div className="flex flex-col items-center">
// // // //           <div className="text-sm font-medium text-gray-500 mb-2">Session</div>
// // // //           <div className="flex flex-col items-center gap-1">
// // // //             {clockInTime && (
// // // //               <div className="text-sm">
// // // //                 <span className="font-medium">In:</span> {clockInTime}
// // // //               </div>
// // // //             )}
// // // //             {clockOutTime && (
// // // //               <div className="text-sm">
// // // //                 <span className="font-medium">Out:</span> {clockOutTime}
// // // //               </div>
// // // //             )}
// // // //             {!clockInTime && !clockOutTime && <div className="text-sm text-gray-500">No active session</div>}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <TimeControls
// // // //         status={timerState.status}
// // // //         onStart={startTimer}
// // // //         onPause={pauseTimer}
// // // //         onBreak={takeBreak}
// // // //         onStop={stopTimer}
// // // //       />

// // // //       <BreakSummary breaks={currentBreaks} />

// // // //       <div className="flex items-center justify-between mt-8">
// // // //         <div className="flex items-center gap-4">
// // // //           <div className="text-sm font-medium">Idle Time</div>
// // // //           <Badge className={idleTime >= 5 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"}>
// // // //             {idleTime.toString().padStart(2, "0")} min
// // // //           </Badge>
// // // //         </div>

// // // //         <SessionHistoryDialog sessions={timerSessions} />
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // "use client";

// // // import { useState, useEffect, useRef, useCallback } from "react";
// // // import { useToast } from "@/components/ui/use-toast";
// // // import { StatusBadge } from "./status-badge";
// // // import { TimeControls } from "./time-controls";
// // // import { BreakSummary } from "./break-summary";
// // // import { SessionHistoryDialog } from "./session-history-dialog";
// // // import { Badge } from "@/components/ui/badge";
// // // import {
// // //   formatTime,
// // //   formatDuration,
// // //   getCurrentTime,
// // //   getCurrentDate,
// // //   calculateProgress,
// // // } from "@/lib/time-utils";
// // // import {
// // //   createTimeSession,
// // //   endTimeSession,
// // //   createTimeBreak,
// // //   endTimeBreak,
// // // } from "@/lib/supabase";
// // // import { supabaseBrowserClient as supabase } from "@utils/supabase/client";
// // // import type { User } from "@/lib/supabase";
// // // import { CircularTimer } from "./circular-time";

// // // // Define types for our timer session
// // // interface TimerSession {
// // //   id: string;
// // //   startTime: string;
// // //   endTime: string | null;
// // //   duration: number; // in seconds
// // //   breaks: { start: string; end: string; duration: number }[];
// // //   status: "active" | "completed" | "interrupted";
// // //   date: string;
// // // }

// // // // Define types for our timer state
// // // interface TimerState {
// // //   status: "idle" | "running" | "paused" | "break" | "stopped";
// // //   startTimestamp: number | null;
// // //   pausedAt: number | null;
// // //   totalElapsed: number; // in milliseconds
// // //   breakStartTime: number | null;
// // //   totalBreakTime: number; // in milliseconds
// // //   sessionId: string | null;
// // //   currentBreakId: string | null;
// // // }

// // // interface TimeTrackerProps {
// // //   user: User | null;
// // // }

// // // export function TimeTracker({ user }: TimeTrackerProps) {
// // //   const { toast } = useToast();
// // //   const [isLoading, setIsLoading] = useState(true);

// // //   // Time tracking states
// // //   const [timerState, setTimerState] = useState<TimerState>({
// // //     status: "idle",
// // //     startTimestamp: null,
// // //     pausedAt: null,
// // //     totalElapsed: 0,
// // //     breakStartTime: null,
// // //     totalBreakTime: 0,
// // //     sessionId: null,
// // //     currentBreakId: null,
// // //   });
// // //   const [displayTime, setDisplayTime] = useState("00:00:00");
// // //   const [idleTime, setIdleTime] = useState(0); // in minutes
// // //   const [clockInTime, setClockInTime] = useState<string | null>(null);
// // //   const [clockOutTime, setClockOutTime] = useState<string | null>(null);
// // //   const [timerSessions, setTimerSessions] = useState<TimerSession[]>([]);
// // //   const [progress, setProgress] = useState(0);
// // //   const [currentBreaks, setCurrentBreaks] = useState<
// // //     { start: string; end: string | null; duration: number }[]
// // //   >([]);

// // //   // Refs
// // //   const timerRef = useRef<number | null>(null);
// // //   const idleTimerRef = useRef<number | null>(null);
// // //   const lastActivityRef = useRef<number>(Date.now());

// // //   // Load saved timer state and sessions from localStorage and database on component mount
// // //   useEffect(() => {
// // //     // Skip if user is null
// // //     if (!user) {
// // //       setIsLoading(false);
// // //       return;
// // //     }

// // //     const loadTimerState = async () => {
// // //       try {
// // //         // First check localStorage for any saved state
// // //         const savedTimerState = localStorage.getItem("timerState");
// // //         const savedTimerSessions = localStorage.getItem("timerSessions");
// // //         const savedBreaks = localStorage.getItem("currentBreaks");

// // //         if (savedTimerState) {
// // //           const parsedState = JSON.parse(savedTimerState) as TimerState;

// // //           // If the timer was running or paused when the page was closed/refreshed
// // //           if (
// // //             parsedState.status === "running" ||
// // //             parsedState.status === "paused" ||
// // //             parsedState.status === "break"
// // //           ) {
// // //             // Calculate elapsed time since the page was closed
// // //             const now = Date.now();
// // //             const adjustedState = { ...parsedState };

// // //             if (
// // //               parsedState.status === "running" &&
// // //               parsedState.startTimestamp
// // //             ) {
// // //               // For running timers, add the time that passed while the page was closed
// // //               const timePassedSinceClose =
// // //                 now - parsedState.startTimestamp - parsedState.totalElapsed;
// // //               adjustedState.totalElapsed += timePassedSinceClose;

// // //               // Auto-pause the timer if it was running
// // //               adjustedState.status = "paused";
// // //               adjustedState.pausedAt = now;

// // //               toast({
// // //                 title: "Timer auto-paused",
// // //                 description:
// // //                   "Your timer was running when you left. It's now paused.",
// // //                 duration: 5000,
// // //               });
// // //             }

// // //             setTimerState(adjustedState);
// // //             updateDisplayTime(adjustedState.totalElapsed);
// // //             updateProgress(adjustedState.totalElapsed);

// // //             // If the timer was running, we need to restart it
// // //             if (parsedState.status === "running") {
// // //               startTimerInterval();
// // //             }
// // //           } else {
// // //             setTimerState(parsedState);
// // //             updateDisplayTime(parsedState.totalElapsed);
// // //             updateProgress(parsedState.totalElapsed);
// // //           }
// // //         }

// // //         if (savedTimerSessions) {
// // //           setTimerSessions(JSON.parse(savedTimerSessions));
// // //         }

// // //         if (savedBreaks) {
// // //           setCurrentBreaks(JSON.parse(savedBreaks));
// // //         }

// // //         // Now check the database for any active sessions
// // //         const { data: activeSessionData } = await supabase
// // //           .from("time_sessions")
// // //           .select("*")
// // //           .eq("user_id", user.id)
// // //           .eq("status", "ACTIVE")
// // //           .single();

// // //         if (activeSessionData && !timerState?.sessionId) {
// // //           // We have an active session in the database but not in local state
// // //           const startTime = new Date(activeSessionData.start_time).getTime();
// // //           const now = Date.now();
// // //           const elapsed = now - startTime;

// // //           // Check for any active breaks
// // //           const { data: activeBreakData } = await supabase
// // //             .from("time_breaks")
// // //             .select("*")
// // //             .eq("session_id", activeSessionData.id)
// // //             .is("end_time", null)
// // //             .single();

// // //           if (activeBreakData) {
// // //             // We have an active break
// // //             const breakStartTime = new Date(
// // //               activeBreakData.start_time
// // //             ).getTime();

// // //             setTimerState({
// // //               status: "break",
// // //               startTimestamp: startTime,
// // //               pausedAt: null,
// // //               totalElapsed: elapsed,
// // //               breakStartTime: breakStartTime,
// // //               totalBreakTime: activeSessionData.total_break_time || 0,
// // //               sessionId: activeSessionData.id,
// // //               currentBreakId: activeBreakData.id,
// // //             });

// // //             // Load all breaks for this session
// // //             const { data: breaksData } = await supabase
// // //               .from("time_breaks")
// // //               .select("*")
// // //               .eq("session_id", activeSessionData.id)
// // //               .order("start_time", { ascending: true });

// // //             if (breaksData) {
// // //               setCurrentBreaks(
// // //                 breaksData.map((b) => ({
// // //                   start: new Date(b.start_time).toLocaleTimeString("en-US", {
// // //                     hour: "numeric",
// // //                     minute: "2-digit",
// // //                     hour12: true,
// // //                   }),
// // //                   end: b.end_time
// // //                     ? new Date(b.end_time).toLocaleTimeString("en-US", {
// // //                         hour: "numeric",
// // //                         minute: "2-digit",
// // //                         hour12: true,
// // //                       })
// // //                     : null,
// // //                   duration: b.duration || 0,
// // //                 }))
// // //               );
// // //             }
// // //           } else {
// // //             // No active break, just an active session
// // //             setTimerState({
// // //               status: "running",
// // //               startTimestamp: startTime,
// // //               pausedAt: null,
// // //               totalElapsed: elapsed,
// // //               breakStartTime: null,
// // //               totalBreakTime: activeSessionData.total_break_time || 0,
// // //               sessionId: activeSessionData.id,
// // //               currentBreakId: null,
// // //             });

// // //             startTimerInterval();
// // //           }

// // //           setClockInTime(
// // //             new Date(activeSessionData.start_time).toLocaleTimeString("en-US", {
// // //               hour: "numeric",
// // //               minute: "2-digit",
// // //               hour12: true,
// // //             })
// // //           );

// // //           updateDisplayTime(elapsed);
// // //           updateProgress(elapsed);

// // //           toast({
// // //             title: "Active session restored",
// // //             description: "Your previous session has been restored.",
// // //             duration: 3000,
// // //           });
// // //         }

// // //         // Load recent sessions
// // //         const { data: sessionsData } = await supabase
// // //           .from("time_sessions")
// // //           .select("*")
// // //           .eq("user_id", user.id)
// // //           .order("created_at", { ascending: false })
// // //           .limit(10);

// // //         if (sessionsData) {
// // //           const formattedSessions: TimerSession[] = await Promise.all(
// // //             sessionsData.map(async (session) => {
// // //               // Get breaks for this session
// // //               const { data: sessionBreaks } = await supabase
// // //                 .from("time_breaks")
// // //                 .select("*")
// // //                 .eq("session_id", session.id)
// // //                 .order("start_time", { ascending: true });

// // //               return {
// // //                 id: session.id,
// // //                 startTime: new Date(session.start_time).toLocaleTimeString(
// // //                   "en-US",
// // //                   {
// // //                     hour: "numeric",
// // //                     minute: "2-digit",
// // //                     hour12: true,
// // //                   }
// // //                 ),
// // //                 endTime: session.end_time
// // //                   ? new Date(session.end_time).toLocaleTimeString("en-US", {
// // //                       hour: "numeric",
// // //                       minute: "2-digit",
// // //                       hour12: true,
// // //                     })
// // //                   : null,
// // //                 duration: session.duration || 0,
// // //                 breaks: sessionBreaks
// // //                   ? sessionBreaks.map((b) => ({
// // //                       start: new Date(b.start_time).toLocaleTimeString(
// // //                         "en-US",
// // //                         {
// // //                           hour: "numeric",
// // //                           minute: "2-digit",
// // //                           hour12: true,
// // //                         }
// // //                       ),
// // //                       end: new Date(b.end_time).toLocaleTimeString("en-US", {
// // //                         hour: "numeric",
// // //                         minute: "2-digit",
// // //                         hour12: true,
// // //                       }),
// // //                       duration: b.duration || 0,
// // //                     }))
// // //                   : [],
// // //                 status: session.status as
// // //                   | "active"
// // //                   | "completed"
// // //                   | "interrupted",
// // //                 date: new Date(session.created_at).toISOString().split("T")[0],
// // //               };
// // //             })
// // //           );

// // //           setTimerSessions(formattedSessions);
// // //         }
// // //       } catch (error) {
// // //         console.error("Error loading timer state:", error);
// // //         toast({
// // //           title: "Error",
// // //           description: "Failed to load your time tracking data.",
// // //           variant: "destructive",
// // //           duration: 5000,
// // //         });
// // //       } finally {
// // //         setIsLoading(false);
// // //       }
// // //     };

// // //     loadTimerState();

// // //     // Set up activity tracking for idle detection
// // //     const trackActivity = () => {
// // //       lastActivityRef.current = Date.now();
// // //     };

// // //     window.addEventListener("mousemove", trackActivity);
// // //     window.addEventListener("keydown", trackActivity);
// // //     window.addEventListener("click", trackActivity);

// // //     // Start idle timer
// // //     startIdleTimer();

// // //     // Set up beforeunload event to save timer state
// // //     const handleBeforeUnload = () => {
// // //       saveTimerState();
// // //     };

// // //     window.addEventListener("beforeunload", handleBeforeUnload);

// // //     return () => {
// // //       window.removeEventListener("mousemove", trackActivity);
// // //       window.removeEventListener("keydown", trackActivity);
// // //       window.removeEventListener("click", trackActivity);
// // //       window.removeEventListener("beforeunload", handleBeforeUnload);

// // //       if (timerRef.current) {
// // //         window.clearInterval(timerRef.current);
// // //       }

// // //       if (idleTimerRef.current) {
// // //         window.clearInterval(idleTimerRef.current);
// // //       }
// // //     };
// // //   }, [user]);

// // //   // Save timer state to localStorage whenever it changes
// // //   useEffect(() => {
// // //     saveTimerState();
// // //   }, [timerState]);

// // //   // Save timer sessions to localStorage whenever they change
// // //   useEffect(() => {
// // //     localStorage.setItem("timerSessions", JSON.stringify(timerSessions));
// // //   }, [timerSessions]);

// // //   // Save current breaks to localStorage whenever they change
// // //   useEffect(() => {
// // //     localStorage.setItem("currentBreaks", JSON.stringify(currentBreaks));
// // //   }, [currentBreaks]);

// // //   // Helper function to save timer state
// // //   const saveTimerState = () => {
// // //     localStorage.setItem("timerState", JSON.stringify(timerState));
// // //   };

// // //   // Helper function to update display time
// // //   const updateDisplayTime = (elapsed: number) => {
// // //     setDisplayTime(formatTime(elapsed));
// // //   };

// // //   // Helper function to update progress
// // //   const updateProgress = (elapsed: number) => {
// // //     setProgress(calculateProgress(elapsed));
// // //   };

// // //   // Start the timer interval
// // //   const startTimerInterval = useCallback(() => {
// // //     if (timerRef.current) {
// // //       window.clearInterval(timerRef.current);
// // //     }

// // //     timerRef.current = window.setInterval(() => {
// // //       setTimerState((prevState) => {
// // //         if (prevState.status !== "running" || !prevState.startTimestamp) {
// // //           return prevState;
// // //         }

// // //         const now = Date.now();
// // //         const newElapsed = now - prevState.startTimestamp;

// // //         updateDisplayTime(newElapsed);
// // //         updateProgress(newElapsed);

// // //         return {
// // //           ...prevState,
// // //           totalElapsed: newElapsed,
// // //         };
// // //       });
// // //     }, 100);
// // //   }, []);

// // //   // Start the idle timer
// // //   const startIdleTimer = () => {
// // //     if (idleTimerRef.current) {
// // //       window.clearInterval(idleTimerRef.current);
// // //     }

// // //     idleTimerRef.current = window.setInterval(() => {
// // //       const now = Date.now();
// // //       const idleTimeMs = now - lastActivityRef.current;
// // //       const idleTimeMinutes = Math.floor(idleTimeMs / 60000);

// // //       setIdleTime(idleTimeMinutes);

// // //       // Auto-pause the timer if user is idle for more than 5 minutes and timer is running
// // //       if (idleTimeMinutes >= 5 && timerState.status === "running") {
// // //         pauseTimer();
// // //         toast({
// // //           title: "Timer auto-paused",
// // //           description: "Your timer was paused due to inactivity.",
// // //           duration: 5000,
// // //         });
// // //       }
// // //     }, 60000); // Check every minute
// // //   };

// // //   // Start the timer
// // //   const startTimer = async () => {
// // //     // Check if user is available
// // //     if (!user) {
// // //       toast({
// // //         title: "Authentication required",
// // //         description: "Please sign in to track your time.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     const now = Date.now();
// // //     const currentTime = getCurrentTime();

// // //     try {
// // //       if (timerState.status === "idle" || timerState.status === "stopped") {
// // //         // Create a new session in the database
// // //         const newSession = await createTimeSession(user.id);

// // //         if (!newSession) {
// // //           throw new Error("Failed to create time session");
// // //         }

// // //         const sessionId = newSession.id;

// // //         setTimerState({
// // //           status: "running",
// // //           startTimestamp: now,
// // //           pausedAt: null,
// // //           totalElapsed: 0,
// // //           breakStartTime: null,
// // //           totalBreakTime: 0,
// // //           sessionId,
// // //           currentBreakId: null,
// // //         });

// // //         // Create a new active session for local state
// // //         const newLocalSession: TimerSession = {
// // //           id: sessionId,
// // //           startTime: currentTime,
// // //           endTime: null,
// // //           duration: 0,
// // //           breaks: [],
// // //           status: "active",
// // //           date: getCurrentDate(),
// // //         };

// // //         setTimerSessions((prev) => [newLocalSession, ...prev]);
// // //         setCurrentBreaks([]);
// // //         setClockInTime(currentTime);
// // //         setClockOutTime(null);

// // //         startTimerInterval();

// // //         toast({
// // //           title: "Timer started",
// // //           description: `Clocked in at ${currentTime}`,
// // //           duration: 3000,
// // //         });
// // //       } else if (timerState.status === "paused" && timerState.pausedAt) {
// // //         // Resume the timer from pause
// // //         const pausedDuration = now - timerState.pausedAt;
// // //         const newStartTimestamp = now - timerState.totalElapsed;

// // //         setTimerState({
// // //           ...timerState,
// // //           status: "running",
// // //           startTimestamp: newStartTimestamp,
// // //           pausedAt: null,
// // //         });

// // //         startTimerInterval();

// // //         toast({
// // //           title: "Timer resumed",
// // //           description: `Paused for ${formatDuration(pausedDuration)}`,
// // //           duration: 3000,
// // //         });
// // //       } else if (
// // //         timerState.status === "break" &&
// // //         timerState.breakStartTime &&
// // //         timerState.currentBreakId
// // //       ) {
// // //         // Resume from break - end the break in the database
// // //         const breakDuration = now - timerState.breakStartTime;
// // //         const newStartTimestamp = now - timerState.totalElapsed;
// // //         const totalBreakTime = timerState.totalBreakTime + breakDuration;

// // //         // End the break in the database
// // //         await endTimeBreak(
// // //           timerState.currentBreakId,
// // //           Math.floor(breakDuration / 1000)
// // //         );

// // //         // Update the current break with end time
// // //         const updatedBreaks = [...currentBreaks];
// // //         const currentBreakIndex = updatedBreaks.findIndex(
// // //           (b) => b.end === null
// // //         );
// // //         if (currentBreakIndex !== -1) {
// // //           updatedBreaks[currentBreakIndex] = {
// // //             ...updatedBreaks[currentBreakIndex],
// // //             end: getCurrentTime(),
// // //             duration: Math.floor(breakDuration / 1000),
// // //           };
// // //         }

// // //         // Update the session with the break
// // //         if (timerState.sessionId) {
// // //           setTimerSessions((prev) =>
// // //             prev.map((session) => {
// // //               if (session.id === timerState.sessionId) {
// // //                 return {
// // //                   ...session,
// // //                   breaks: [
// // //                     ...session.breaks,
// // //                     {
// // //                       start:
// // //                         updatedBreaks[currentBreakIndex]?.start ||
// // //                         getCurrentTime(),
// // //                       end: getCurrentTime(),
// // //                       duration: Math.floor(breakDuration / 1000),
// // //                     },
// // //                   ],
// // //                 };
// // //               }
// // //               return session;
// // //             })
// // //           );

// // //           // Update total break time in the database
// // //           await supabase
// // //             .from("time_sessions")
// // //             .update({ total_break_time: Math.floor(totalBreakTime / 1000) })
// // //             .eq("id", timerState.sessionId);
// // //         }

// // //         setCurrentBreaks(updatedBreaks);

// // //         setTimerState({
// // //           ...timerState,
// // //           status: "running",
// // //           startTimestamp: newStartTimestamp,
// // //           breakStartTime: null,
// // //           totalBreakTime,
// // //           currentBreakId: null,
// // //         });

// // //         startTimerInterval();

// // //         toast({
// // //           title: "Break ended",
// // //           description: `Break duration: ${formatDuration(breakDuration)}`,
// // //           duration: 3000,
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error("Error starting timer:", error);
// // //       toast({
// // //         title: "Error",
// // //         description: "Failed to start the timer. Please try again.",
// // //         variant: "destructive",
// // //         duration: 5000,
// // //       });
// // //     }
// // //   };

// // //   // Pause the timer
// // //   const pauseTimer = () => {
// // //     if (timerState.status === "running") {
// // //       const now = Date.now();

// // //       setTimerState({
// // //         ...timerState,
// // //         status: "paused",
// // //         pausedAt: now,
// // //       });

// // //       if (timerRef.current) {
// // //         window.clearInterval(timerRef.current);
// // //         timerRef.current = null;
// // //       }

// // //       toast({
// // //         title: "Timer paused",
// // //         description: "Timer is now paused. Click Resume to continue.",
// // //         duration: 3000,
// // //       });
// // //     }
// // //   };

// // //   // Take a break
// // //   const takeBreak = async () => {
// // //     // Check if user is available
// // //     if (!user) {
// // //       toast({
// // //         title: "Authentication required",
// // //         description: "Please sign in to track your time.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     if (timerState.status === "running" && timerState.sessionId) {
// // //       try {
// // //         const now = Date.now();
// // //         const currentTime = getCurrentTime();

// // //         // Create a break in the database
// // //         const newBreak = await createTimeBreak(timerState.sessionId);

// // //         if (!newBreak) {
// // //           throw new Error("Failed to create break");
// // //         }

// // //         // Add a new break to the current breaks
// // //         const newLocalBreak = {
// // //           start: currentTime,
// // //           end: null,
// // //           duration: 0,
// // //         };

// // //         setCurrentBreaks((prev) => [...prev, newLocalBreak]);

// // //         setTimerState({
// // //           ...timerState,
// // //           status: "break",
// // //           breakStartTime: now,
// // //           currentBreakId: newBreak.id,
// // //         });

// // //         if (timerRef.current) {
// // //           window.clearInterval(timerRef.current);
// // //           timerRef.current = null;
// // //         }

// // //         toast({
// // //           title: "Break started",
// // //           description: "Enjoy your break! Timer is paused.",
// // //           duration: 3000,
// // //         });
// // //       } catch (error) {
// // //         console.error("Error taking break:", error);
// // //         toast({
// // //           title: "Error",
// // //           description: "Failed to start break. Please try again.",
// // //           variant: "destructive",
// // //           duration: 5000,
// // //         });
// // //       }
// // //     }
// // //   };

// // //   // Stop the timer
// // //   const stopTimer = async () => {
// // //     // Check if user is available
// // //     if (!user) {
// // //       toast({
// // //         title: "Authentication required",
// // //         description: "Please sign in to track your time.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     if (
// // //       (timerState.status === "running" ||
// // //         timerState.status === "paused" ||
// // //         timerState.status === "break") &&
// // //       timerState.sessionId
// // //     ) {
// // //       try {
// // //         const now = Date.now();
// // //         const currentTime = getCurrentTime();

// // //         // Calculate final duration
// // //         const finalDuration = timerState.totalElapsed;
// // //         let finalBreakDuration = timerState.totalBreakTime;

// // //         if (
// // //           timerState.status === "break" &&
// // //           timerState.breakStartTime &&
// // //           timerState.currentBreakId
// // //         ) {
// // //           const breakDuration = now - timerState.breakStartTime;
// // //           finalBreakDuration += breakDuration;

// // //           // End the current break in the database
// // //           await endTimeBreak(
// // //             timerState.currentBreakId,
// // //             Math.floor(breakDuration / 1000)
// // //           );

// // //           // Update the current break with end time
// // //           const updatedBreaks = [...currentBreaks];
// // //           const currentBreakIndex = updatedBreaks.findIndex(
// // //             (b) => b.end === null
// // //           );
// // //           if (currentBreakIndex !== -1) {
// // //             updatedBreaks[currentBreakIndex] = {
// // //               ...updatedBreaks[currentBreakIndex],
// // //               end: currentTime,
// // //               duration: Math.floor(breakDuration / 1000),
// // //             };
// // //           }

// // //           setCurrentBreaks(updatedBreaks);
// // //         }

// // //         // End the session in the database
// // //         await endTimeSession(
// // //           timerState.sessionId,
// // //           Math.floor(finalDuration / 1000)
// // //         );

// // //         // Update total break time in the database
// // //         await supabase
// // //           .from("time_sessions")
// // //           .update({ total_break_time: Math.floor(finalBreakDuration / 1000) })
// // //           .eq("id", timerState.sessionId);

// // //         // Save the session in local state
// // //         setTimerSessions((prev) =>
// // //           prev.map((session) => {
// // //             if (session.id === timerState.sessionId) {
// // //               return {
// // //                 ...session,
// // //                 endTime: currentTime,
// // //                 duration: Math.floor(finalDuration / 1000),
// // //                 breaks: session.breaks.concat(
// // //                   currentBreaks
// // //                     .filter((b) => b.end !== null)
// // //                     .map((b) => ({
// // //                       start: b.start,
// // //                       end: b.end || currentTime,
// // //                       duration: b.duration,
// // //                     }))
// // //                 ),
// // //                 status: "completed",
// // //               };
// // //             }
// // //             return session;
// // //           })
// // //         );

// // //         setTimerState({
// // //           status: "stopped",
// // //           startTimestamp: null,
// // //           pausedAt: null,
// // //           totalElapsed: finalDuration,
// // //           breakStartTime: null,
// // //           totalBreakTime: finalBreakDuration,
// // //           sessionId: null,
// // //           currentBreakId: null,
// // //         });

// // //         setClockOutTime(currentTime);

// // //         if (timerRef.current) {
// // //           window.clearInterval(timerRef.current);
// // //           timerRef.current = null;
// // //         }

// // //         toast({
// // //           title: "Checked out",
// // //           description: `Total work time: ${formatDuration(
// // //             finalDuration - finalBreakDuration
// // //           )}`,
// // //           duration: 3000,
// // //         });
// // //       } catch (error) {
// // //         console.error("Error stopping timer:", error);
// // //         toast({
// // //           title: "Error",
// // //           description: "Failed to stop the timer. Please try again.",
// // //           variant: "destructive",
// // //           duration: 5000,
// // //         });
// // //       }
// // //     }
// // //   };

// // //   // If user is not available, show a message
// // //   if (!user) {
// // //     return (
// // //       <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
// // //         <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
// // //         <p className="text-gray-500 mb-4">
// // //           Please sign in to use the time tracking features.
// // //         </p>
// // //       </div>
// // //     );
// // //   }

// // //   // Show loading state
// // //   if (isLoading) {
// // //     return (
// // //       <div className="bg-gray-50 rounded-lg p-6 mb-8 flex justify-center items-center min-h-[300px]">
// // //         <div className="flex flex-col items-center gap-2">
// // //           <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
// // //           <p className="text-sm text-gray-500">Loading time tracking data...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="bg-gray-50 rounded-lg p-6 mb-8">
// // //       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
// // //         <div className="flex flex-col items-center">
// // //           <div className="text-sm font-medium text-gray-500 mb-2">Status</div>
// // //           <StatusBadge status={timerState.status} />
// // //         </div>

// // //         <CircularTimer
// // //           time={displayTime}
// // //           progress={progress}
// // //           state={timerState.status}
// // //           pulseWhenRunning={timerState.status === "running"}
// // //         />

// // //         <div className="flex flex-col items-center">
// // //           <div className="text-sm font-medium text-gray-500 mb-2">Session</div>
// // //           <div className="flex flex-col items-center gap-1">
// // //             {clockInTime && (
// // //               <div className="text-sm">
// // //                 <span className="font-medium">In:</span> {clockInTime}
// // //               </div>
// // //             )}
// // //             {clockOutTime && (
// // //               <div className="text-sm">
// // //                 <span className="font-medium">Out:</span> {clockOutTime}
// // //               </div>
// // //             )}
// // //             {!clockInTime && !clockOutTime && (
// // //               <div className="text-sm text-gray-500">No active session</div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <TimeControls
// // //         status={timerState.status}
// // //         onStart={startTimer}
// // //         onPause={pauseTimer}
// // //         onBreak={takeBreak}
// // //         onStop={stopTimer}
// // //       />

// // //       <BreakSummary breaks={currentBreaks} />

// // //       <div className="flex items-center justify-between mt-8">
// // //         <div className="flex items-center gap-4">
// // //           <div className="text-sm font-medium">Idle Time</div>
// // //           <Badge
// // //             className={
// // //               idleTime >= 5
// // //                 ? "bg-amber-100 text-amber-800"
// // //                 : "bg-gray-100 text-gray-800"
// // //             }
// // //           >
// // //             {idleTime.toString().padStart(2, "0")} min
// // //           </Badge>
// // //         </div>

// // //         <SessionHistoryDialog sessions={timerSessions} />
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useState, useEffect, useRef, useCallback } from "react";
// // import { useToast } from "@/components/ui/use-toast";
// // import { StatusBadge } from "./status-badge";
// // import { TimeControls } from "./time-controls";
// // import { BreakSummary } from "./break-summary";
// // import { SessionHistoryDialog } from "./session-history-dialog";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   formatTime,
// //   formatDuration,
// //   getCurrentTime,
// //   getCurrentDate,
// //   calculateProgress,
// // } from "@/lib/time-utils";
// // import {
// //   createTimeSession,
// //   endTimeSession,
// //   createTimeBreak,
// //   endTimeBreak,
// // } from "@/lib/supabase";
// // import { supabaseBrowserClient as supabase } from "@utils/supabase/client";
// // import type { User } from "@/lib/supabase";
// // import { CircularTimer } from "./circular-time";

// // // Define types for our timer session
// // interface TimerSession {
// //   id: string;
// //   startTime: string;
// //   endTime: string | null;
// //   duration: number; // in seconds
// //   breaks: { start: string; end: string; duration: number }[];
// //   status: "active" | "completed" | "interrupted";
// //   date: string;
// // }

// // // Define types for our timer state
// // interface TimerState {
// //   status: "idle" | "running" | "paused" | "break" | "stopped";
// //   startTimestamp: number | null;
// //   pausedAt: number | null;
// //   totalElapsed: number; // in milliseconds
// //   breakStartTime: number | null;
// //   totalBreakTime: number; // in milliseconds
// //   sessionId: string | null;
// //   currentBreakId: string | null;
// // }

// // interface TimeTrackerProps {
// //   user: User | null;
// // }

// // export function TimeTracker({ user }: TimeTrackerProps) {
// //   const { toast } = useToast();
// //   const [isLoading, setIsLoading] = useState(true);

// //   // Time tracking states
// //   const [timerState, setTimerState] = useState<TimerState>({
// //     status: "idle",
// //     startTimestamp: null,
// //     pausedAt: null,
// //     totalElapsed: 0,
// //     breakStartTime: null,
// //     totalBreakTime: 0,
// //     sessionId: null,
// //     currentBreakId: null,
// //   });
// //   const [displayTime, setDisplayTime] = useState("00:00:00");
// //   const [idleTime, setIdleTime] = useState(0); // in minutes
// //   const [clockInTime, setClockInTime] = useState<string | null>(null);
// //   const [clockOutTime, setClockOutTime] = useState<string | null>(null);
// //   const [timerSessions, setTimerSessions] = useState<TimerSession[]>([]);
// //   const [progress, setProgress] = useState(0);
// //   const [currentBreaks, setCurrentBreaks] = useState<
// //     { start: string; end: string | null; duration: number }[]
// //   >([]);

// //   // Refs
// //   const timerRef = useRef<number | null>(null);
// //   const idleTimerRef = useRef<number | null>(null);
// //   const lastActivityRef = useRef<number>(Date.now());

// //   // Load saved timer state and sessions from localStorage and database on component mount
// //   useEffect(() => {
// //     // Skip if user is null
// //     if (!user) {
// //       setIsLoading(false);
// //       return;
// //     }

// //     const loadTimerState = async () => {
// //       try {
// //         // First check localStorage for any saved state
// //         const savedTimerState = localStorage.getItem("timerState");
// //         const savedTimerSessions = localStorage.getItem("timerSessions");
// //         const savedBreaks = localStorage.getItem("currentBreaks");

// //         if (savedTimerState) {
// //           const parsedState = JSON.parse(savedTimerState) as TimerState;

// //           // If the timer was running or paused when the page was closed/refreshed
// //           if (
// //             parsedState.status === "running" ||
// //             parsedState.status === "paused" ||
// //             parsedState.status === "break"
// //           ) {
// //             // Calculate elapsed time since the page was closed
// //             const now = Date.now();
// //             const adjustedState = { ...parsedState };

// //             if (
// //               parsedState.status === "running" &&
// //               parsedState.startTimestamp
// //             ) {
// //               // For running timers, add the time that passed while the page was closed
// //               const timePassedSinceClose =
// //                 now - parsedState.startTimestamp - parsedState.totalElapsed;
// //               adjustedState.totalElapsed += timePassedSinceClose;

// //               // Auto-pause the timer if it was running
// //               adjustedState.status = "paused";
// //               adjustedState.pausedAt = now;

// //               toast({
// //                 title: "Timer auto-paused",
// //                 description:
// //                   "Your timer was running when you left. It's now paused.",
// //                 duration: 5000,
// //               });
// //             }

// //             setTimerState(adjustedState);
// //             updateDisplayTime(adjustedState.totalElapsed);
// //             updateProgress(adjustedState.totalElapsed);

// //             // If the timer was running, we need to restart it
// //             if (parsedState.status === "running") {
// //               startTimerInterval();
// //             }
// //           } else {
// //             setTimerState(parsedState);
// //             updateDisplayTime(parsedState.totalElapsed);
// //             updateProgress(parsedState.totalElapsed);
// //           }
// //         }

// //         if (savedTimerSessions) {
// //           setTimerSessions(JSON.parse(savedTimerSessions));
// //         }

// //         if (savedBreaks) {
// //           setCurrentBreaks(JSON.parse(savedBreaks));
// //         }

// //         // Now check the database for any active sessions
// //         const { data: activeSessionData } = await supabase
// //           .from("time_sessions")
// //           .select("*")
// //           .eq("user_id", user.id)
// //           .eq("status", "ACTIVE")
// //           .single();

// //         if (activeSessionData && !timerState?.sessionId) {
// //           // We have an active session in the database but not in local state
// //           const startTime = new Date(activeSessionData.start_time).getTime();
// //           const now = Date.now();
// //           const elapsed = now - startTime;

// //           // Check for any active breaks
// //           const { data: activeBreakData } = await supabase
// //             .from("time_breaks")
// //             .select("*")
// //             .eq("session_id", activeSessionData.id)
// //             .is("end_time", null)
// //             .single();

// //           if (activeBreakData) {
// //             // We have an active break
// //             const breakStartTime = new Date(
// //               activeBreakData.start_time
// //             ).getTime();

// //             setTimerState({
// //               status: "break",
// //               startTimestamp: startTime,
// //               pausedAt: null,
// //               totalElapsed: elapsed,
// //               breakStartTime: breakStartTime,
// //               totalBreakTime: activeSessionData.total_break_time || 0,
// //               sessionId: activeSessionData.id,
// //               currentBreakId: activeBreakData.id,
// //             });

// //             // Load all breaks for this session
// //             const { data: breaksData } = await supabase
// //               .from("time_breaks")
// //               .select("*")
// //               .eq("session_id", activeSessionData.id)
// //               .order("start_time", { ascending: true });

// //             if (breaksData) {
// //               setCurrentBreaks(
// //                 breaksData.map((b) => ({
// //                   start: new Date(b.start_time).toLocaleTimeString("en-US", {
// //                     hour: "numeric",
// //                     minute: "2-digit",
// //                     hour12: true,
// //                   }),
// //                   end: b.end_time
// //                     ? new Date(b.end_time).toLocaleTimeString("en-US", {
// //                         hour: "numeric",
// //                         minute: "2-digit",
// //                         hour12: true,
// //                       })
// //                     : null,
// //                   duration: b.duration_seconds || 0,
// //                 }))
// //               );
// //             }
// //           } else {
// //             // No active break, just an active session
// //             setTimerState({
// //               status: "running",
// //               startTimestamp: startTime,
// //               pausedAt: null,
// //               totalElapsed: elapsed,
// //               breakStartTime: null,
// //               totalBreakTime: activeSessionData.total_break_time || 0,
// //               sessionId: activeSessionData.id,
// //               currentBreakId: null,
// //             });

// //             startTimerInterval();
// //           }

// //           setClockInTime(
// //             new Date(activeSessionData.start_time).toLocaleTimeString("en-US", {
// //               hour: "numeric",
// //               minute: "2-digit",
// //               hour12: true,
// //             })
// //           );

// //           updateDisplayTime(elapsed);
// //           updateProgress(elapsed);

// //           toast({
// //             title: "Active session restored",
// //             description: "Your previous session has been restored.",
// //             duration: 3000,
// //           });
// //         }

// //         // Load recent sessions
// //         const { data: sessionsData } = await supabase
// //           .from("time_sessions")
// //           .select("*")
// //           .eq("user_id", user.id)
// //           .order("created_at", { ascending: false })
// //           .limit(10);

// //         if (sessionsData) {
// //           const formattedSessions: TimerSession[] = await Promise.all(
// //             sessionsData.map(async (session) => {
// //               // Get breaks for this session
// //               const { data: sessionBreaks } = await supabase
// //                 .from("time_breaks")
// //                 .select("*")
// //                 .eq("session_id", session.id)
// //                 .order("start_time", { ascending: true });

// //               return {
// //                 id: session.id,
// //                 startTime: new Date(session.start_time).toLocaleTimeString(
// //                   "en-US",
// //                   {
// //                     hour: "numeric",
// //                     minute: "2-digit",
// //                     hour12: true,
// //                   }
// //                 ),
// //                 endTime: session.end_time
// //                   ? new Date(session.end_time).toLocaleTimeString("en-US", {
// //                       hour: "numeric",
// //                       minute: "2-digit",
// //                       hour12: true,
// //                     })
// //                   : null,
// //                 duration: session.duration_seconds || 0,
// //                 breaks: sessionBreaks
// //                   ? sessionBreaks.map((b) => ({
// //                       start: new Date(b.start_time).toLocaleTimeString(
// //                         "en-US",
// //                         {
// //                           hour: "numeric",
// //                           minute: "2-digit",
// //                           hour12: true,
// //                         }
// //                       ),
// //                       end: new Date(b.end_time).toLocaleTimeString("en-US", {
// //                         hour: "numeric",
// //                         minute: "2-digit",
// //                         hour12: true,
// //                       }),
// //                       duration: b.duration_seconds || 0,
// //                     }))
// //                   : [],
// //                 status: session.status.toLowerCase() as
// //                   | "active"
// //                   | "completed"
// //                   | "interrupted",
// //                 date: new Date(session.created_at).toISOString().split("T")[0],
// //               };
// //             })
// //           );

// //           setTimerSessions(formattedSessions);
// //         }
// //       } catch (error) {
// //         console.error("Error loading timer state:", error);
// //         toast({
// //           title: "Error",
// //           description: "Failed to load your time tracking data.",
// //           variant: "destructive",
// //           duration: 5000,
// //         });
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     loadTimerState();

// //     // Set up activity tracking for idle detection
// //     const trackActivity = () => {
// //       lastActivityRef.current = Date.now();
// //     };

// //     window.addEventListener("mousemove", trackActivity);
// //     window.addEventListener("keydown", trackActivity);
// //     window.addEventListener("click", trackActivity);

// //     // Start idle timer
// //     startIdleTimer();

// //     // Set up beforeunload event to save timer state
// //     const handleBeforeUnload = () => {
// //       saveTimerState();
// //     };

// //     window.addEventListener("beforeunload", handleBeforeUnload);

// //     return () => {
// //       window.removeEventListener("mousemove", trackActivity);
// //       window.removeEventListener("keydown", trackActivity);
// //       window.removeEventListener("click", trackActivity);
// //       window.removeEventListener("beforeunload", handleBeforeUnload);

// //       if (timerRef.current) {
// //         window.clearInterval(timerRef.current);
// //       }

// //       if (idleTimerRef.current) {
// //         window.clearInterval(idleTimerRef.current);
// //       }
// //     };
// //   }, [user]);

// //   // Save timer state to localStorage whenever it changes
// //   useEffect(() => {
// //     saveTimerState();
// //   }, [timerState]);

// //   // Save timer sessions to localStorage whenever they change
// //   useEffect(() => {
// //     localStorage.setItem("timerSessions", JSON.stringify(timerSessions));
// //   }, [timerSessions]);

// //   // Save current breaks to localStorage whenever they change
// //   useEffect(() => {
// //     localStorage.setItem("currentBreaks", JSON.stringify(currentBreaks));
// //   }, [currentBreaks]);

// //   // Helper function to save timer state
// //   const saveTimerState = () => {
// //     localStorage.setItem("timerState", JSON.stringify(timerState));
// //   };

// //   // Helper function to update display time
// //   const updateDisplayTime = (elapsed: number) => {
// //     setDisplayTime(formatTime(elapsed));
// //   };

// //   // Helper function to update progress
// //   const updateProgress = (elapsed: number) => {
// //     setProgress(calculateProgress(elapsed));
// //   };

// //   // Start the timer interval
// //   const startTimerInterval = useCallback(() => {
// //     if (timerRef.current) {
// //       window.clearInterval(timerRef.current);
// //     }

// //     timerRef.current = window.setInterval(() => {
// //       setTimerState((prevState) => {
// //         if (prevState.status !== "running" || !prevState.startTimestamp) {
// //           return prevState;
// //         }

// //         const now = Date.now();
// //         const newElapsed = now - prevState.startTimestamp;

// //         updateDisplayTime(newElapsed);
// //         updateProgress(newElapsed);

// //         return {
// //           ...prevState,
// //           totalElapsed: newElapsed,
// //         };
// //       });
// //     }, 100);
// //   }, []);

// //   // Start the idle timer
// //   const startIdleTimer = () => {
// //     if (idleTimerRef.current) {
// //       window.clearInterval(idleTimerRef.current);
// //     }

// //     idleTimerRef.current = window.setInterval(() => {
// //       const now = Date.now();
// //       const idleTimeMs = now - lastActivityRef.current;
// //       const idleTimeMinutes = Math.floor(idleTimeMs / 60000);

// //       setIdleTime(idleTimeMinutes);

// //       // Auto-pause the timer if user is idle for more than 5 minutes and timer is running
// //       if (idleTimeMinutes >= 5 && timerState.status === "running") {
// //         pauseTimer();
// //         toast({
// //           title: "Timer auto-paused",
// //           description: "Your timer was paused due to inactivity.",
// //           duration: 5000,
// //         });
// //       }
// //     }, 60000); // Check every minute
// //   };

// //   // Start the timer
// //   const startTimer = async () => {
// //     // Check if user is available
// //     if (!user) {
// //       toast({
// //         title: "Authentication required",
// //         description: "Please sign in to track your time.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     const now = Date.now();
// //     const currentTime = getCurrentTime();

// //     try {
// //       if (timerState.status === "idle" || timerState.status === "stopped") {
// //         // Create a new session in the database
// //         const newSession = await createTimeSession(user.id);

// //         if (!newSession) {
// //           throw new Error("Failed to create time session");
// //         }

// //         const sessionId = newSession.id;

// //         setTimerState({
// //           status: "running",
// //           startTimestamp: now,
// //           pausedAt: null,
// //           totalElapsed: 0,
// //           breakStartTime: null,
// //           totalBreakTime: 0,
// //           sessionId,
// //           currentBreakId: null,
// //         });

// //         // Create a new active session for local state
// //         const newLocalSession: TimerSession = {
// //           id: sessionId,
// //           startTime: currentTime,
// //           endTime: null,
// //           duration: 0,
// //           breaks: [],
// //           status: "active",
// //           date: getCurrentDate(),
// //         };

// //         setTimerSessions((prev) => [newLocalSession, ...prev]);
// //         setCurrentBreaks([]);
// //         setClockInTime(currentTime);
// //         setClockOutTime(null);

// //         startTimerInterval();

// //         toast({
// //           title: "Timer started",
// //           description: `Clocked in at ${currentTime}`,
// //           duration: 3000,
// //         });
// //       } else if (timerState.status === "paused" && timerState.pausedAt) {
// //         // Resume the timer from pause
// //         const pausedDuration = now - timerState.pausedAt;
// //         const newStartTimestamp = now - timerState.totalElapsed;

// //         setTimerState({
// //           ...timerState,
// //           status: "running",
// //           startTimestamp: newStartTimestamp,
// //           pausedAt: null,
// //         });

// //         startTimerInterval();

// //         toast({
// //           title: "Timer resumed",
// //           description: `Paused for ${formatDuration(pausedDuration)}`,
// //           duration: 3000,
// //         });
// //       } else if (
// //         timerState.status === "break" &&
// //         timerState.breakStartTime &&
// //         timerState.currentBreakId
// //       ) {
// //         // Resume from break - end the break in the database
// //         const breakDuration = now - timerState.breakStartTime;
// //         const newStartTimestamp = now - timerState.totalElapsed;
// //         const totalBreakTime = timerState.totalBreakTime + breakDuration;

// //         // End the break in the database
// //         await endTimeBreak(
// //           timerState.currentBreakId,
// //           Math.floor(breakDuration / 1000)
// //         );

// //         // Update the current break with end time
// //         const updatedBreaks = [...currentBreaks];
// //         const currentBreakIndex = updatedBreaks.findIndex(
// //           (b) => b.end === null
// //         );
// //         if (currentBreakIndex !== -1) {
// //           updatedBreaks[currentBreakIndex] = {
// //             ...updatedBreaks[currentBreakIndex],
// //             end: getCurrentTime(),
// //             duration: Math.floor(breakDuration / 1000),
// //           };
// //         }

// //         // Update the session with the break
// //         if (timerState.sessionId) {
// //           setTimerSessions((prev) =>
// //             prev.map((session) => {
// //               if (session.id === timerState.sessionId) {
// //                 return {
// //                   ...session,
// //                   breaks: [
// //                     ...session.breaks,
// //                     {
// //                       start:
// //                         updatedBreaks[currentBreakIndex]?.start ||
// //                         getCurrentTime(),
// //                       end: getCurrentTime(),
// //                       duration: Math.floor(breakDuration / 1000),
// //                     },
// //                   ],
// //                 };
// //               }
// //               return session;
// //             })
// //           );

// //           // Update total break time in the database
// //           await supabase
// //             .from("time_sessions")
// //             .update({ total_break_time: Math.floor(totalBreakTime / 1000) })
// //             .eq("id", timerState.sessionId);
// //         }

// //         setCurrentBreaks(updatedBreaks);

// //         setTimerState({
// //           ...timerState,
// //           status: "running",
// //           startTimestamp: newStartTimestamp,
// //           breakStartTime: null,
// //           totalBreakTime,
// //           currentBreakId: null,
// //         });

// //         startTimerInterval();

// //         toast({
// //           title: "Break ended",
// //           description: `Break duration: ${formatDuration(breakDuration)}`,
// //           duration: 3000,
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error starting timer:", error);
// //       toast({
// //         title: "Error",
// //         description: "Failed to start the timer. Please try again.",
// //         variant: "destructive",
// //         duration: 5000,
// //       });
// //     }
// //   };

// //   // Pause the timer
// //   const pauseTimer = () => {
// //     if (timerState.status === "running") {
// //       const now = Date.now();

// //       setTimerState({
// //         ...timerState,
// //         status: "paused",
// //         pausedAt: now,
// //       });

// //       if (timerRef.current) {
// //         window.clearInterval(timerRef.current);
// //         timerRef.current = null;
// //       }

// //       toast({
// //         title: "Timer paused",
// //         description: "Timer is now paused. Click Resume to continue.",
// //         duration: 3000,
// //       });
// //     }
// //   };

// //   // Take a break
// //   const takeBreak = async () => {
// //     // Check if user is available
// //     if (!user) {
// //       toast({
// //         title: "Authentication required",
// //         description: "Please sign in to track your time.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     if (timerState.status === "running" && timerState.sessionId) {
// //       try {
// //         const now = Date.now();
// //         const currentTime = getCurrentTime();

// //         // Create a break in the database
// //         const newBreak = await createTimeBreak(timerState.sessionId);

// //         if (!newBreak) {
// //           throw new Error("Failed to create break");
// //         }

// //         // Add a new break to the current breaks
// //         const newLocalBreak = {
// //           start: currentTime,
// //           end: null,
// //           duration: 0,
// //         };

// //         setCurrentBreaks((prev) => [...prev, newLocalBreak]);

// //         setTimerState({
// //           ...timerState,
// //           status: "break",
// //           breakStartTime: now,
// //           currentBreakId: newBreak.id,
// //         });

// //         if (timerRef.current) {
// //           window.clearInterval(timerRef.current);
// //           timerRef.current = null;
// //         }

// //         toast({
// //           title: "Break started",
// //           description: "Enjoy your break! Timer is paused.",
// //           duration: 3000,
// //         });
// //       } catch (error) {
// //         console.error("Error taking break:", error);
// //         toast({
// //           title: "Error",
// //           description: "Failed to start break. Please try again.",
// //           variant: "destructive",
// //           duration: 5000,
// //         });
// //       }
// //     }
// //   };

// //   // Stop the timer
// //   const stopTimer = async () => {
// //     // Check if user is available
// //     if (!user) {
// //       toast({
// //         title: "Authentication required",
// //         description: "Please sign in to track your time.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     if (
// //       (timerState.status === "running" ||
// //         timerState.status === "paused" ||
// //         timerState.status === "break") &&
// //       timerState.sessionId
// //     ) {
// //       try {
// //         const now = Date.now();
// //         const currentTime = getCurrentTime();

// //         // Calculate final duration
// //         const finalDuration = timerState.totalElapsed;
// //         let finalBreakDuration = timerState.totalBreakTime;

// //         if (
// //           timerState.status === "break" &&
// //           timerState.breakStartTime &&
// //           timerState.currentBreakId
// //         ) {
// //           const breakDuration = now - timerState.breakStartTime;
// //           finalBreakDuration += breakDuration;

// //           // End the current break in the database
// //           await endTimeBreak(
// //             timerState.currentBreakId,
// //             Math.floor(breakDuration / 1000)
// //           );

// //           // Update the current break with end time
// //           const updatedBreaks = [...currentBreaks];
// //           const currentBreakIndex = updatedBreaks.findIndex(
// //             (b) => b.end === null
// //           );
// //           if (currentBreakIndex !== -1) {
// //             updatedBreaks[currentBreakIndex] = {
// //               ...updatedBreaks[currentBreakIndex],
// //               end: currentTime,
// //               duration: Math.floor(breakDuration / 1000),
// //             };
// //           }

// //           setCurrentBreaks(updatedBreaks);
// //         }

// //         // End the session in the database
// //         await endTimeSession(
// //           timerState.sessionId,
// //           Math.floor(finalDuration / 1000)
// //         );

// //         // Update total break time in the database
// //         await supabase
// //           .from("time_sessions")
// //           .update({ total_break_time: Math.floor(finalBreakDuration / 1000) })
// //           .eq("id", timerState.sessionId);

// //         // Save the session in local state
// //         setTimerSessions((prev) =>
// //           prev.map((session) => {
// //             if (session.id === timerState.sessionId) {
// //               return {
// //                 ...session,
// //                 endTime: currentTime,
// //                 duration: Math.floor(finalDuration / 1000),
// //                 breaks: session.breaks.concat(
// //                   currentBreaks
// //                     .filter((b) => b.end !== null)
// //                     .map((b) => ({
// //                       start: b.start,
// //                       end: b.end || currentTime,
// //                       duration: b.duration,
// //                     }))
// //                 ),
// //                 status: "completed",
// //               };
// //             }
// //             return session;
// //           })
// //         );

// //         setTimerState({
// //           status: "stopped",
// //           startTimestamp: null,
// //           pausedAt: null,
// //           totalElapsed: finalDuration,
// //           breakStartTime: null,
// //           totalBreakTime: finalBreakDuration,
// //           sessionId: null,
// //           currentBreakId: null,
// //         });

// //         setClockOutTime(currentTime);

// //         if (timerRef.current) {
// //           window.clearInterval(timerRef.current);
// //           timerRef.current = null;
// //         }

// //         toast({
// //           title: "Checked out",
// //           description: `Total work time: ${formatDuration(
// //             finalDuration - finalBreakDuration
// //           )}`,
// //           duration: 3000,
// //         });
// //       } catch (error) {
// //         console.error("Error stopping timer:", error);
// //         toast({
// //           title: "Error",
// //           description: "Failed to stop the timer. Please try again.",
// //           variant: "destructive",
// //           duration: 5000,
// //         });
// //       }
// //     }
// //   };

// //   // If user is not available, show a message
// //   if (!user) {
// //     return (
// //       <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
// //         <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
// //         <p className="text-gray-500 mb-4">
// //           Please sign in to use the time tracking features.
// //         </p>
// //       </div>
// //     );
// //   }

// //   // Show loading state
// //   if (isLoading) {
// //     return (
// //       <div className="bg-gray-50 rounded-lg p-6 mb-8 flex justify-center items-center min-h-[300px]">
// //         <div className="flex flex-col items-center gap-2">
// //           <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
// //           <p className="text-sm text-gray-500">Loading time tracking data...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="bg-gray-50 rounded-lg p-6 mb-8">
// //       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
// //         <div className="flex flex-col items-center">
// //           <div className="text-sm font-medium text-gray-500 mb-2">Status</div>
// //           <StatusBadge status={timerState.status} />
// //         </div>

// //         <CircularTimer
// //           time={displayTime}
// //           progress={progress}
// //           state={timerState.status}
// //           pulseWhenRunning={timerState.status === "running"}
// //         />

// //         <div className="flex flex-col items-center">
// //           <div className="text-sm font-medium text-gray-500 mb-2">Session</div>
// //           <div className="flex flex-col items-center gap-1">
// //             {clockInTime && (
// //               <div className="text-sm">
// //                 <span className="font-medium">In:</span> {clockInTime}
// //               </div>
// //             )}
// //             {clockOutTime && (
// //               <div className="text-sm">
// //                 <span className="font-medium">Out:</span> {clockOutTime}
// //               </div>
// //             )}
// //             {!clockInTime && !clockOutTime && (
// //               <div className="text-sm text-gray-500">No active session</div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       <TimeControls
// //         status={timerState.status}
// //         onStart={startTimer}
// //         onPause={pauseTimer}
// //         onBreak={takeBreak}
// //         onStop={stopTimer}
// //       />

// //       <BreakSummary breaks={currentBreaks} />

// //       <div className="flex items-center justify-between mt-8">
// //         <div className="flex items-center gap-4">
// //           <div className="text-sm font-medium">Idle Time</div>
// //           <Badge
// //             className={
// //               idleTime >= 5
// //                 ? "bg-amber-100 text-amber-800"
// //                 : "bg-gray-100 text-gray-800"
// //             }
// //           >
// //             {idleTime.toString().padStart(2, "0")} min
// //           </Badge>
// //         </div>

// //         <SessionHistoryDialog sessions={timerSessions} />
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useToast } from "@/components/ui/use-toast";
// import { StatusBadge } from "./status-badge";
// import { TimeControls } from "./time-controls";
// import { BreakSummary } from "./break-summary";
// import { SessionHistoryDialog } from "./session-history-dialog";
// import { Badge } from "@/components/ui/badge";
// import {
//   formatTime,
//   formatDuration,
//   getCurrentTime,
//   getCurrentDate,
//   calculateProgress,
// } from "@/lib/time-utils";
// import {
//   createTimeSession,
//   endTimeSession,
//   createTimeBreak,
//   endTimeBreak,
// } from "@/lib/supabase";
// import { supabaseBrowserClient as supabase } from "@utils/supabase/client";
// import type { User } from "@/lib/supabase";
// import { CircularTimer } from "./circular-time";

// // Define types for our timer session
// interface TimerSession {
//   id: string;
//   startTime: string;
//   endTime: string | null;
//   duration: number; // in seconds
//   breaks: { start: string; end: string; duration: number }[];
//   status: "active" | "completed" | "interrupted";
//   date: string;
// }

// // Define types for our timer state
// interface TimerState {
//   status: "idle" | "running" | "paused" | "break" | "stopped";
//   startTimestamp: number | null;
//   pausedAt: number | null;
//   totalElapsed: number; // in milliseconds
//   breakStartTime: number | null;
//   totalBreakTime: number; // in milliseconds
//   sessionId: string | null;
//   currentBreakId: string | null;
// }

// interface TimeTrackerDashboardProps {
//   user: User | null;
// }

// export function TimeTrackingDashboard({ user }: TimeTrackerDashboardProps) {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(true);

//   // Time tracking states
//   const [timerState, setTimerState] = useState<TimerState>({
//     status: "idle",
//     startTimestamp: null,
//     pausedAt: null,
//     totalElapsed: 0,
//     breakStartTime: null,
//     totalBreakTime: 0,
//     sessionId: null,
//     currentBreakId: null,
//   });
//   const [displayTime, setDisplayTime] = useState("00:00:00");
//   const [idleTime, setIdleTime] = useState(0); // in minutes
//   const [clockInTime, setClockInTime] = useState<string | null>(null);
//   const [clockOutTime, setClockOutTime] = useState<string | null>(null);
//   const [timerSessions, setTimerSessions] = useState<TimerSession[]>([]);
//   const [progress, setProgress] = useState(0);
//   const [currentBreaks, setCurrentBreaks] = useState<
//     { start: string; end: string | null; duration: number }[]
//   >([]);

//   // Refs
//   const timerRef = useRef<number | null>(null);
//   const idleTimerRef = useRef<number | null>(null);
//   const lastActivityRef = useRef<number>(Date.now());

//   // Load saved timer state and sessions from localStorage and database on component mount
//   useEffect(() => {
//     // Skip if user is null
//     if (!user) {
//       setIsLoading(false);
//       return;
//     }

//     const loadTimerState = async () => {
//       try {
//         // First check localStorage for any saved state
//         const savedTimerState = localStorage.getItem("timerState");
//         const savedTimerSessions = localStorage.getItem("timerSessions");
//         const savedBreaks = localStorage.getItem("currentBreaks");

//         if (savedTimerState) {
//           const parsedState = JSON.parse(savedTimerState) as TimerState;

//           // If the timer was running or paused when the page was closed/refreshed
//           if (
//             parsedState.status === "running" ||
//             parsedState.status === "paused" ||
//             parsedState.status === "break"
//           ) {
//             // Calculate elapsed time since the page was closed
//             const now = Date.now();
//             const adjustedState = { ...parsedState };

//             if (
//               parsedState.status === "running" &&
//               parsedState.startTimestamp
//             ) {
//               // For running timers, add the time that passed while the page was closed
//               const timePassedSinceClose =
//                 now - parsedState.startTimestamp - parsedState.totalElapsed;
//               adjustedState.totalElapsed += timePassedSinceClose;

//               // Auto-pause the timer if it was running
//               adjustedState.status = "paused";
//               adjustedState.pausedAt = now;

//               toast({
//                 title: "Timer auto-paused",
//                 description:
//                   "Your timer was running when you left. It's now paused.",
//                 duration: 5000,
//               });
//             }

//             setTimerState(adjustedState);
//             updateDisplayTime(adjustedState.totalElapsed);
//             updateProgress(adjustedState.totalElapsed);

//             // If the timer was running, we need to restart it
//             if (parsedState.status === "running") {
//               startTimerInterval();
//             }
//           } else {
//             setTimerState(parsedState);
//             updateDisplayTime(parsedState.totalElapsed);
//             updateProgress(parsedState.totalElapsed);
//           }
//         }

//         if (savedTimerSessions) {
//           setTimerSessions(JSON.parse(savedTimerSessions));
//         }

//         if (savedBreaks) {
//           setCurrentBreaks(JSON.parse(savedBreaks));
//         }

//         // Now check the database for any active sessions
//         const { data: activeSessionData } = await supabase
//           .from("time_sessions")
//           .select("*")
//           .eq("user_id", user.id)
//           .eq("status", "ACTIVE")
//           .single();

//         if (activeSessionData && !timerState?.sessionId) {
//           // We have an active session in the database but not in local state
//           const startTime = new Date(activeSessionData.start_time).getTime();
//           const now = Date.now();
//           const elapsed = now - startTime;

//           // Check for any active breaks
//           const { data: activeBreakData } = await supabase
//             .from("time_breaks")
//             .select("*")
//             .eq("session_id", activeSessionData.id)
//             .is("end_time", null)
//             .single();

//           if (activeBreakData) {
//             // We have an active break
//             const breakStartTime = new Date(
//               activeBreakData.start_time
//             ).getTime();

//             setTimerState({
//               status: "break",
//               startTimestamp: startTime,
//               pausedAt: null,
//               totalElapsed: elapsed,
//               breakStartTime: breakStartTime,
//               totalBreakTime: activeSessionData.total_break_time || 0,
//               sessionId: activeSessionData.id,
//               currentBreakId: activeBreakData.id,
//             });

//             // Load all breaks for this session
//             const { data: breaksData } = await supabase
//               .from("time_breaks")
//               .select("*")
//               .eq("session_id", activeSessionData.id)
//               .order("start_time", { ascending: true });

//             if (breaksData) {
//               setCurrentBreaks(
//                 breaksData.map((b) => ({
//                   start: new Date(b.start_time).toLocaleTimeString("en-US", {
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true,
//                   }),
//                   end: b.end_time
//                     ? new Date(b.end_time).toLocaleTimeString("en-US", {
//                         hour: "numeric",
//                         minute: "2-digit",
//                         hour12: true,
//                       })
//                     : null,
//                   duration: b.duration_seconds || 0,
//                 }))
//               );
//             }
//           } else {
//             // No active break, just an active session
//             setTimerState({
//               status: "running",
//               startTimestamp: startTime,
//               pausedAt: null,
//               totalElapsed: elapsed,
//               breakStartTime: null,
//               totalBreakTime: activeSessionData.total_break_time || 0,
//               sessionId: activeSessionData.id,
//               currentBreakId: null,
//             });

//             startTimerInterval();
//           }

//           setClockInTime(
//             new Date(activeSessionData.start_time).toLocaleTimeString("en-US", {
//               hour: "numeric",
//               minute: "2-digit",
//               hour12: true,
//             })
//           );

//           updateDisplayTime(elapsed);
//           updateProgress(elapsed);

//           toast({
//             title: "Active session restored",
//             description: "Your previous session has been restored.",
//             duration: 3000,
//           });
//         }

//         // Load recent sessions
//         const { data: sessionsData } = await supabase
//           .from("time_sessions")
//           .select("*")
//           .eq("user_id", user.id)
//           .order("created_at", { ascending: false })
//           .limit(10);

//         if (sessionsData) {
//           const formattedSessions: TimerSession[] = await Promise.all(
//             sessionsData.map(async (session) => {
//               // Get breaks for this session
//               const { data: sessionBreaks } = await supabase
//                 .from("time_breaks")
//                 .select("*")
//                 .eq("session_id", session.id)
//                 .order("start_time", { ascending: true });

//               return {
//                 id: session.id,
//                 startTime: new Date(session.start_time).toLocaleTimeString(
//                   "en-US",
//                   {
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true,
//                   }
//                 ),
//                 endTime: session.end_time
//                   ? new Date(session.end_time).toLocaleTimeString("en-US", {
//                       hour: "numeric",
//                       minute: "2-digit",
//                       hour12: true,
//                     })
//                   : null,
//                 duration: session.duration_seconds || 0,
//                 breaks: sessionBreaks
//                   ? sessionBreaks.map((b) => ({
//                       start: new Date(b.start_time).toLocaleTimeString(
//                         "en-US",
//                         {
//                           hour: "numeric",
//                           minute: "2-digit",
//                           hour12: true,
//                         }
//                       ),
//                       end: new Date(b.end_time).toLocaleTimeString("en-US", {
//                         hour: "numeric",
//                         minute: "2-digit",
//                         hour12: true,
//                       }),
//                       duration: b.duration_seconds || 0,
//                     }))
//                   : [],
//                 status: session.status.toLowerCase() as
//                   | "active"
//                   | "completed"
//                   | "interrupted",
//                 date: new Date(session.created_at).toISOString().split("T")[0],
//               };
//             })
//           );

//           setTimerSessions(formattedSessions);
//         }
//       } catch (error) {
//         console.error("Error loading timer state:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load your time tracking data.",
//           variant: "destructive",
//           duration: 5000,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadTimerState();

//     // Set up activity tracking for idle detection
//     const trackActivity = () => {
//       lastActivityRef.current = Date.now();
//     };

//     window.addEventListener("mousemove", trackActivity);
//     window.addEventListener("keydown", trackActivity);
//     window.addEventListener("click", trackActivity);

//     // Start idle timer
//     startIdleTimer();

//     // Set up beforeunload event to save timer state
//     const handleBeforeUnload = () => {
//       saveTimerState();
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("mousemove", trackActivity);
//       window.removeEventListener("keydown", trackActivity);
//       window.removeEventListener("click", trackActivity);
//       window.removeEventListener("beforeunload", handleBeforeUnload);

//       if (timerRef.current) {
//         window.clearInterval(timerRef.current);
//       }

//       if (idleTimerRef.current) {
//         window.clearInterval(idleTimerRef.current);
//       }
//     };
//   }, [user]);

//   // Save timer state to localStorage whenever it changes
//   useEffect(() => {
//     saveTimerState();
//   }, [timerState]);

//   // Save timer sessions to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("timerSessions", JSON.stringify(timerSessions));
//   }, [timerSessions]);

//   // Save current breaks to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("currentBreaks", JSON.stringify(currentBreaks));
//   }, [currentBreaks]);

//   // Helper function to save timer state
//   const saveTimerState = () => {
//     localStorage.setItem("timerState", JSON.stringify(timerState));
//   };

//   // Helper function to update display time
//   const updateDisplayTime = (elapsed: number) => {
//     setDisplayTime(formatTime(elapsed));
//   };

//   // Helper function to update progress
//   const updateProgress = (elapsed: number) => {
//     setProgress(calculateProgress(elapsed));
//   };

//   // Start the timer interval
//   const startTimerInterval = useCallback(() => {
//     if (timerRef.current) {
//       window.clearInterval(timerRef.current);
//     }

//     timerRef.current = window.setInterval(() => {
//       setTimerState((prevState) => {
//         if (prevState.status !== "running" || !prevState.startTimestamp) {
//           return prevState;
//         }

//         const now = Date.now();
//         const newElapsed = now - prevState.startTimestamp;

//         updateDisplayTime(newElapsed);
//         updateProgress(newElapsed);

//         return {
//           ...prevState,
//           totalElapsed: newElapsed,
//         };
//       });
//     }, 100);
//   }, []);

//   // Start the idle timer
//   const startIdleTimer = () => {
//     if (idleTimerRef.current) {
//       window.clearInterval(idleTimerRef.current);
//     }

//     idleTimerRef.current = window.setInterval(() => {
//       const now = Date.now();
//       const idleTimeMs = now - lastActivityRef.current;
//       const idleTimeMinutes = Math.floor(idleTimeMs / 60000);

//       setIdleTime(idleTimeMinutes);

//       // Auto-pause the timer if user is idle for more than 5 minutes and timer is running
//       if (idleTimeMinutes >= 5 && timerState.status === "running") {
//         pauseTimer();
//         toast({
//           title: "Timer auto-paused",
//           description: "Your timer was paused due to inactivity.",
//           duration: 5000,
//         });
//       }
//     }, 60000); // Check every minute
//   };

//   // Start the timer
//   const startTimer = async () => {
//     // Check if user is available
//     if (!user) {
//       toast({
//         title: "Authentication required",
//         description: "Please sign in to track your time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const now = Date.now();
//     const currentTime = getCurrentTime();

//     try {
//       if (timerState.status === "idle" || timerState.status === "stopped") {
//         // Create a new session in the database
//         const newSession = await createTimeSession(user.id);

//         if (!newSession) {
//           throw new Error("Failed to create time session");
//         }

//         const sessionId = newSession.id;

//         setTimerState({
//           status: "running",
//           startTimestamp: now,
//           pausedAt: null,
//           totalElapsed: 0,
//           breakStartTime: null,
//           totalBreakTime: 0,
//           sessionId,
//           currentBreakId: null,
//         });

//         // Create a new active session for local state
//         const newLocalSession: TimerSession = {
//           id: sessionId,
//           startTime: currentTime,
//           endTime: null,
//           duration: 0,
//           breaks: [],
//           status: "active",
//           date: getCurrentDate(),
//         };

//         setTimerSessions((prev) => [newLocalSession, ...prev]);
//         setCurrentBreaks([]);
//         setClockInTime(currentTime);
//         setClockOutTime(null);

//         startTimerInterval();

//         toast({
//           title: "Timer started",
//           description: `Clocked in at ${currentTime}`,
//           duration: 3000,
//         });
//       } else if (timerState.status === "paused" && timerState.pausedAt) {
//         // Resume the timer from pause
//         const pausedDuration = now - timerState.pausedAt;
//         const newStartTimestamp = now - timerState.totalElapsed;

//         setTimerState({
//           ...timerState,
//           status: "running",
//           startTimestamp: newStartTimestamp,
//           pausedAt: null,
//         });

//         startTimerInterval();

//         toast({
//           title: "Timer resumed",
//           description: `Paused for ${formatDuration(pausedDuration)}`,
//           duration: 3000,
//         });
//       } else if (
//         timerState.status === "break" &&
//         timerState.breakStartTime &&
//         timerState.currentBreakId
//       ) {
//         // Resume from break - end the break in the database
//         const breakDuration = now - timerState.breakStartTime;
//         const newStartTimestamp = now - timerState.totalElapsed;
//         const totalBreakTime = timerState.totalBreakTime + breakDuration;

//         // End the break in the database
//         await endTimeBreak(
//           timerState.currentBreakId,
//           Math.floor(breakDuration / 1000)
//         );

//         // Update the current break with end time
//         const updatedBreaks = [...currentBreaks];
//         const currentBreakIndex = updatedBreaks.findIndex(
//           (b) => b.end === null
//         );
//         if (currentBreakIndex !== -1) {
//           updatedBreaks[currentBreakIndex] = {
//             ...updatedBreaks[currentBreakIndex],
//             end: getCurrentTime(),
//             duration: Math.floor(breakDuration / 1000),
//           };
//         }

//         // Update the session with the break
//         if (timerState.sessionId) {
//           setTimerSessions((prev) =>
//             prev.map((session) => {
//               if (session.id === timerState.sessionId) {
//                 return {
//                   ...session,
//                   breaks: [
//                     ...session.breaks,
//                     {
//                       start:
//                         updatedBreaks[currentBreakIndex]?.start ||
//                         getCurrentTime(),
//                       end: getCurrentTime(),
//                       duration: Math.floor(breakDuration / 1000),
//                     },
//                   ],
//                 };
//               }
//               return session;
//             })
//           );

//           // Update total break time in the database
//           await supabase
//             .from("time_sessions")
//             .update({ total_break_time: Math.floor(totalBreakTime / 1000) })
//             .eq("id", timerState.sessionId);
//         }

//         setCurrentBreaks(updatedBreaks);

//         setTimerState({
//           ...timerState,
//           status: "running",
//           startTimestamp: newStartTimestamp,
//           breakStartTime: null,
//           totalBreakTime,
//           currentBreakId: null,
//         });

//         startTimerInterval();

//         toast({
//           title: "Break ended",
//           description: `Break duration: ${formatDuration(breakDuration)}`,
//           duration: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Error starting timer:", error);
//       toast({
//         title: "Error",
//         description: "Failed to start the timer. Please try again.",
//         variant: "destructive",
//         duration: 5000,
//       });
//     }
//   };

//   // Pause the timer
//   const pauseTimer = () => {
//     if (timerState.status === "running") {
//       const now = Date.now();

//       setTimerState({
//         ...timerState,
//         status: "paused",
//         pausedAt: now,
//       });

//       if (timerRef.current) {
//         window.clearInterval(timerRef.current);
//         timerRef.current = null;
//       }

//       toast({
//         title: "Timer paused",
//         description: "Timer is now paused. Click Resume to continue.",
//         duration: 3000,
//       });
//     }
//   };

//   // Take a break
//   const takeBreak = async () => {
//     // Check if user is available
//     if (!user) {
//       toast({
//         title: "Authentication required",
//         description: "Please sign in to track your time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (timerState.status === "running" && timerState.sessionId) {
//       try {
//         const now = Date.now();
//         const currentTime = getCurrentTime();

//         // Create a break in the database
//         const newBreak = await createTimeBreak(timerState.sessionId);

//         if (!newBreak) {
//           throw new Error("Failed to create break");
//         }

//         // Add a new break to the current breaks
//         const newLocalBreak = {
//           start: currentTime,
//           end: null,
//           duration: 0,
//         };

//         setCurrentBreaks((prev) => [...prev, newLocalBreak]);

//         setTimerState({
//           ...timerState,
//           status: "break",
//           breakStartTime: now,
//           currentBreakId: newBreak.id,
//         });

//         if (timerRef.current) {
//           window.clearInterval(timerRef.current);
//           timerRef.current = null;
//         }

//         toast({
//           title: "Break started",
//           description: "Enjoy your break! Timer is paused.",
//           duration: 3000,
//         });
//       } catch (error) {
//         console.error("Error taking break:", error);
//         toast({
//           title: "Error",
//           description: "Failed to start break. Please try again.",
//           variant: "destructive",
//           duration: 5000,
//         });
//       }
//     }
//   };

//   // Stop the timer
//   const stopTimer = async () => {
//     // Check if user is available
//     if (!user) {
//       toast({
//         title: "Authentication required",
//         description: "Please sign in to track your time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (
//       (timerState.status === "running" ||
//         timerState.status === "paused" ||
//         timerState.status === "break") &&
//       timerState.sessionId
//     ) {
//       try {
//         const now = Date.now();
//         const currentTime = getCurrentTime();

//         // Calculate final duration
//         const finalDuration = timerState.totalElapsed;
//         let finalBreakDuration = timerState.totalBreakTime;

//         if (
//           timerState.status === "break" &&
//           timerState.breakStartTime &&
//           timerState.currentBreakId
//         ) {
//           const breakDuration = now - timerState.breakStartTime;
//           finalBreakDuration += breakDuration;

//           // End the current break in the database
//           await endTimeBreak(
//             timerState.currentBreakId,
//             Math.floor(breakDuration / 1000)
//           );

//           // Update the current break with end time
//           const updatedBreaks = [...currentBreaks];
//           const currentBreakIndex = updatedBreaks.findIndex(
//             (b) => b.end === null
//           );
//           if (currentBreakIndex !== -1) {
//             updatedBreaks[currentBreakIndex] = {
//               ...updatedBreaks[currentBreakIndex],
//               end: currentTime,
//               duration: Math.floor(breakDuration / 1000),
//             };
//           }

//           setCurrentBreaks(updatedBreaks);
//         }

//         // End the session in the database
//         await endTimeSession(
//           timerState.sessionId,
//           Math.floor(finalDuration / 1000)
//         );

//         // Update total break time in the database
//         await supabase
//           .from("time_sessions")
//           .update({ total_break_time: Math.floor(finalBreakDuration / 1000) })
//           .eq("id", timerState.sessionId);

//         // Save the session in local state
//         setTimerSessions((prev) =>
//           prev.map((session) => {
//             if (session.id === timerState.sessionId) {
//               return {
//                 ...session,
//                 endTime: currentTime,
//                 duration: Math.floor(finalDuration / 1000),
//                 breaks: session.breaks.concat(
//                   currentBreaks
//                     .filter((b) => b.end !== null)
//                     .map((b) => ({
//                       start: b.start,
//                       end: b.end || currentTime,
//                       duration: b.duration,
//                     }))
//                 ),
//                 status: "completed",
//               };
//             }
//             return session;
//           })
//         );

//         setTimerState({
//           status: "stopped",
//           startTimestamp: null,
//           pausedAt: null,
//           totalElapsed: finalDuration,
//           breakStartTime: null,
//           totalBreakTime: finalBreakDuration,
//           sessionId: null,
//           currentBreakId: null,
//         });

//         setClockOutTime(currentTime);

//         if (timerRef.current) {
//           window.clearInterval(timerRef.current);
//           timerRef.current = null;
//         }

//         toast({
//           title: "Checked out",
//           description: `Total work time: ${formatDuration(
//             finalDuration - finalBreakDuration
//           )}`,
//           duration: 3000,
//         });
//       } catch (error) {
//         console.error("Error stopping timer:", error);
//         toast({
//           title: "Error",
//           description: "Failed to stop the timer. Please try again.",
//           variant: "destructive",
//           duration: 5000,
//         });
//       }
//     }
//   };

//   // If user is not available, show a message
//   if (!user) {
//     return (
//       <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
//         <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
//         <p className="text-gray-500 mb-4">
//           Please sign in to use the time tracking features.
//         </p>
//       </div>
//     );
//   }

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="bg-gray-50 rounded-lg p-6 mb-8 flex justify-center items-center min-h-[300px]">
//         <div className="flex flex-col items-center gap-2">
//           <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
//           <p className="text-sm text-gray-500">Loading time tracking data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 rounded-lg p-6 mb-8">
//       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//         <div className="flex flex-col items-center">
//           <div className="text-sm font-medium text-gray-500 mb-2">Status</div>
//           <StatusBadge status={timerState.status} />
//         </div>

//         <CircularTimer
//           time={displayTime}
//           progress={progress}
//           state={timerState.status}
//           pulseWhenRunning={timerState.status === "running"}
//         />

//         <div className="flex flex-col items-center">
//           <div className="text-sm font-medium text-gray-500 mb-2">Session</div>
//           <div className="flex flex-col items-center gap-1">
//             {clockInTime && (
//               <div className="text-sm">
//                 <span className="font-medium">In:</span> {clockInTime}
//               </div>
//             )}
//             {clockOutTime && (
//               <div className="text-sm">
//                 <span className="font-medium">Out:</span> {clockOutTime}
//               </div>
//             )}
//             {!clockInTime && !clockOutTime && (
//               <div className="text-sm text-gray-500">No active session</div>
//             )}
//           </div>
//         </div>
//       </div>

//       <TimeControls
//         status={timerState.status}
//         onStart={startTimer}
//         onPause={pauseTimer}
//         onBreak={takeBreak}
//         onStop={stopTimer}
//       />

//       <BreakSummary breaks={currentBreaks} />

//       <div className="flex items-center justify-between mt-8">
//         <div className="flex items-center gap-4">
//           <div className="text-sm font-medium">Idle Time</div>
//           <Badge
//             className={
//               idleTime >= 5
//                 ? "bg-amber-100 text-amber-800"
//                 : "bg-gray-100 text-gray-800"
//             }
//           >
//             {idleTime.toString().padStart(2, "0")} min
//           </Badge>
//         </div>

//         <SessionHistoryDialog sessions={timerSessions} />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { StatusBadge } from "./status-badge";
import { TimeControls } from "./time-controls";
import { BreakSummary } from "./break-summary";
import { SessionHistoryDialog } from "./session-history-dialog";
import { Badge } from "@/components/ui/badge";
import {
  formatTime,
  formatDuration,
  getCurrentTime,
  getCurrentDate,
  calculateProgress,
} from "@/lib/time-utils";
import {
  createTimeSession,
  endTimeSession,
  createTimeBreak,
  endTimeBreak,
} from "@/lib/supabase";
import { supabaseBrowserClient as supabase } from "@utils/supabase/client";
import type { User } from "@/lib/supabase";
import { CircularTimer } from "./circular-time";

// Define types for our timer session
interface TimerSession {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number; // in seconds
  breaks: { start: string; end: string; duration: number }[];
  status: "active" | "completed" | "interrupted";
  date: string;
}

// Define types for our timer state
interface TimerState {
  status: "idle" | "running" | "paused" | "break" | "stopped";
  startTimestamp: number | null;
  pausedAt: number | null;
  totalElapsed: number; // in milliseconds
  breakStartTime: number | null;
  totalBreakTime: number; // in milliseconds
  sessionId: string | null;
  currentBreakId: string | null;
}

interface TimeTrackingDashboardProps {
  user: User | null;
}

export function TimeTrackingDashboard({ user }: TimeTrackingDashboardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Time tracking states
  const [timerState, setTimerState] = useState<TimerState>({
    status: "idle",
    startTimestamp: null,
    pausedAt: null,
    totalElapsed: 0,
    breakStartTime: null,
    totalBreakTime: 0,
    sessionId: null,
    currentBreakId: null,
  });
  const [displayTime, setDisplayTime] = useState("00:00:00");
  const [idleTime, setIdleTime] = useState(0); // in minutes
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [timerSessions, setTimerSessions] = useState<TimerSession[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentBreaks, setCurrentBreaks] = useState<
    { start: string; end: string | null; duration: number }[]
  >([]);

  // Refs
  const timerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Load saved timer state and sessions from localStorage and database on component mount
  useEffect(() => {
    // Skip if user is null
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadTimerState = async () => {
      try {
        // First check localStorage for any saved state
        const savedTimerState = localStorage.getItem("timerState");
        const savedTimerSessions = localStorage.getItem("timerSessions");
        const savedBreaks = localStorage.getItem("currentBreaks");

        if (savedTimerState) {
          const parsedState = JSON.parse(savedTimerState) as TimerState;

          // If the timer was running or paused when the page was closed/refreshed
          if (
            parsedState.status === "running" ||
            parsedState.status === "paused" ||
            parsedState.status === "break"
          ) {
            // Calculate elapsed time since the page was closed
            const now = Date.now();
            const adjustedState = { ...parsedState };

            if (
              parsedState.status === "running" &&
              parsedState.startTimestamp
            ) {
              // For running timers, add the time that passed while the page was closed
              const timePassedSinceClose =
                now - parsedState.startTimestamp - parsedState.totalElapsed;
              adjustedState.totalElapsed += timePassedSinceClose;

              // Auto-pause the timer if it was running
              adjustedState.status = "paused";
              adjustedState.pausedAt = now;

              toast({
                title: "Timer auto-paused",
                description:
                  "Your timer was running when you left. It's now paused.",
                duration: 5000,
              });
            }

            setTimerState(adjustedState);
            updateDisplayTime(adjustedState.totalElapsed);
            updateProgress(adjustedState.totalElapsed);

            // If the timer was running, we need to restart it
            if (parsedState.status === "running") {
              startTimerInterval();
            }
          } else {
            setTimerState(parsedState);
            updateDisplayTime(parsedState.totalElapsed);
            updateProgress(parsedState.totalElapsed);
          }
        }

        if (savedTimerSessions) {
          setTimerSessions(JSON.parse(savedTimerSessions));
        }

        if (savedBreaks) {
          setCurrentBreaks(JSON.parse(savedBreaks));
        }

        // Now check the database for any active sessions
        const { data: activeSessionData } = await supabase
          .from("time_sessions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "ACTIVE")
          .single();

        if (activeSessionData && !timerState?.sessionId) {
          // We have an active session in the database but not in local state
          const startTime = new Date(activeSessionData.start_time).getTime();
          const now = Date.now();
          const elapsed = now - startTime;

          // Check for any active breaks
          const { data: activeBreakData } = await supabase
            .from("time_breaks")
            .select("*")
            .eq("session_id", activeSessionData.id)
            .is("end_time", null)
            .single();

          if (activeBreakData) {
            // We have an active break
            const breakStartTime = new Date(
              activeBreakData.start_time
            ).getTime();

            setTimerState({
              status: "break",
              startTimestamp: startTime,
              pausedAt: null,
              totalElapsed: elapsed,
              breakStartTime: breakStartTime,
              totalBreakTime: activeSessionData.total_break_time || 0,
              sessionId: activeSessionData.id,
              currentBreakId: activeBreakData.id,
            });

            // Load all breaks for this session
            const { data: breaksData } = await supabase
              .from("time_breaks")
              .select("*")
              .eq("session_id", activeSessionData.id)
              .order("start_time", { ascending: true });

            if (breaksData) {
              setCurrentBreaks(
                breaksData.map((b) => ({
                  start: new Date(b.start_time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }),
                  end: b.end_time
                    ? new Date(b.end_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : null,
                  duration: b.duration_seconds || 0,
                }))
              );
            }
          } else {
            // No active break, just an active session
            setTimerState({
              status: "running",
              startTimestamp: startTime,
              pausedAt: null,
              totalElapsed: elapsed,
              breakStartTime: null,
              totalBreakTime: activeSessionData.total_break_time || 0,
              sessionId: activeSessionData.id,
              currentBreakId: null,
            });

            startTimerInterval();
          }

          setClockInTime(
            new Date(activeSessionData.start_time).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          );

          updateDisplayTime(elapsed);
          updateProgress(elapsed);

          toast({
            title: "Active session restored",
            description: "Your previous session has been restored.",
            duration: 3000,
          });
        }

        // Load recent sessions
        const { data: sessionsData } = await supabase
          .from("time_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (sessionsData) {
          const formattedSessions: TimerSession[] = await Promise.all(
            sessionsData.map(async (session) => {
              // Get breaks for this session
              const { data: sessionBreaks } = await supabase
                .from("time_breaks")
                .select("*")
                .eq("session_id", session.id)
                .order("start_time", { ascending: true });

              return {
                id: session.id,
                startTime: new Date(session.start_time).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }
                ),
                endTime: session.end_time
                  ? new Date(session.end_time).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : null,
                duration: session.duration_seconds || 0,
                breaks: sessionBreaks
                  ? sessionBreaks.map((b) => ({
                      start: new Date(b.start_time).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      ),
                      end: new Date(b.end_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }),
                      duration: b.duration_seconds || 0,
                    }))
                  : [],
                status: session.status.toLowerCase() as
                  | "active"
                  | "completed"
                  | "interrupted",
                date: new Date(session.created_at).toISOString().split("T")[0],
              };
            })
          );

          setTimerSessions(formattedSessions);
        }
      } catch (error) {
        console.error("Error loading timer state:", error);
        toast({
          title: "Error",
          description: "Failed to load your time tracking data.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTimerState();

    // Set up activity tracking for idle detection
    const trackActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener("mousemove", trackActivity);
    window.addEventListener("keydown", trackActivity);
    window.addEventListener("click", trackActivity);

    // Start idle timer
    startIdleTimer();

    // Set up beforeunload event to save timer state
    const handleBeforeUnload = () => {
      saveTimerState();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("mousemove", trackActivity);
      window.removeEventListener("keydown", trackActivity);
      window.removeEventListener("click", trackActivity);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      if (idleTimerRef.current) {
        window.clearInterval(idleTimerRef.current);
      }
    };
  }, [user]);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    saveTimerState();
  }, [timerState]);

  // Save timer sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("timerSessions", JSON.stringify(timerSessions));
  }, [timerSessions]);

  // Save current breaks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("currentBreaks", JSON.stringify(currentBreaks));
  }, [currentBreaks]);

  // Helper function to save timer state
  const saveTimerState = () => {
    localStorage.setItem("timerState", JSON.stringify(timerState));
  };

  // Helper function to update display time
  const updateDisplayTime = (elapsed: number) => {
    setDisplayTime(formatTime(elapsed));
  };

  // Helper function to update progress
  const updateProgress = (elapsed: number) => {
    setProgress(calculateProgress(elapsed));
  };

  // Start the timer interval
  const startTimerInterval = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setTimerState((prevState) => {
        if (prevState.status !== "running" || !prevState.startTimestamp) {
          return prevState;
        }

        const now = Date.now();
        const newElapsed = now - prevState.startTimestamp;

        updateDisplayTime(newElapsed);
        updateProgress(newElapsed);

        return {
          ...prevState,
          totalElapsed: newElapsed,
        };
      });
    }, 100);
  }, []);

  // Start the idle timer
  const startIdleTimer = () => {
    if (idleTimerRef.current) {
      window.clearInterval(idleTimerRef.current);
    }

    idleTimerRef.current = window.setInterval(() => {
      const now = Date.now();
      const idleTimeMs = now - lastActivityRef.current;
      const idleTimeMinutes = Math.floor(idleTimeMs / 60000);

      setIdleTime(idleTimeMinutes);

      // Auto-pause the timer if user is idle for more than 5 minutes and timer is running
      if (idleTimeMinutes >= 5 && timerState.status === "running") {
        pauseTimer();
        toast({
          title: "Timer auto-paused",
          description: "Your timer was paused due to inactivity.",
          duration: 5000,
        });
      }
    }, 60000); // Check every minute
  };

  // Start the timer
  const startTimer = async () => {
    // Check if user is available
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to track your time.",
        variant: "destructive",
      });
      return;
    }

    const now = Date.now();
    const currentTime = getCurrentTime();

    try {
      if (timerState.status === "idle" || timerState.status === "stopped") {
        // Create a new session in the database
        const newSession = await createTimeSession(user.id);

        if (!newSession) {
          throw new Error("Failed to create time session");
        }

        const sessionId = newSession.id;

        setTimerState({
          status: "running",
          startTimestamp: now,
          pausedAt: null,
          totalElapsed: 0,
          breakStartTime: null,
          totalBreakTime: 0,
          sessionId,
          currentBreakId: null,
        });

        // Create a new active session for local state
        const newLocalSession: TimerSession = {
          id: sessionId,
          startTime: currentTime,
          endTime: null,
          duration: 0,
          breaks: [],
          status: "active",
          date: getCurrentDate(),
        };

        setTimerSessions((prev) => [newLocalSession, ...prev]);
        setCurrentBreaks([]);
        setClockInTime(currentTime);
        setClockOutTime(null);

        startTimerInterval();

        toast({
          title: "Timer started",
          description: `Clocked in at ${currentTime}`,
          duration: 3000,
        });
      } else if (timerState.status === "paused" && timerState.pausedAt) {
        // Resume the timer from pause
        const pausedDuration = now - timerState.pausedAt;
        const newStartTimestamp = now - timerState.totalElapsed;

        setTimerState({
          ...timerState,
          status: "running",
          startTimestamp: newStartTimestamp,
          pausedAt: null,
        });

        startTimerInterval();

        toast({
          title: "Timer resumed",
          description: `Paused for ${formatDuration(pausedDuration)}`,
          duration: 3000,
        });
      } else if (
        timerState.status === "break" &&
        timerState.breakStartTime &&
        timerState.currentBreakId
      ) {
        // Resume from break - end the break in the database
        const breakDuration = now - timerState.breakStartTime;
        const newStartTimestamp = now - timerState.totalElapsed;
        const totalBreakTime = timerState.totalBreakTime + breakDuration;

        // End the break in the database
        await endTimeBreak(
          timerState.currentBreakId,
          Math.floor(breakDuration / 1000)
        );

        // Update the current break with end time
        const updatedBreaks = [...currentBreaks];
        const currentBreakIndex = updatedBreaks.findIndex(
          (b) => b.end === null
        );
        if (currentBreakIndex !== -1) {
          updatedBreaks[currentBreakIndex] = {
            ...updatedBreaks[currentBreakIndex],
            end: getCurrentTime(),
            duration: Math.floor(breakDuration / 1000),
          };
        }

        // Update the session with the break
        if (timerState.sessionId) {
          setTimerSessions((prev) =>
            prev.map((session) => {
              if (session.id === timerState.sessionId) {
                return {
                  ...session,
                  breaks: [
                    ...session.breaks,
                    {
                      start:
                        updatedBreaks[currentBreakIndex]?.start ||
                        getCurrentTime(),
                      end: getCurrentTime(),
                      duration: Math.floor(breakDuration / 1000),
                    },
                  ],
                };
              }
              return session;
            })
          );

          // Update total break time in the database
          await supabase
            .from("time_sessions")
            .update({ total_break_time: Math.floor(totalBreakTime / 1000) })
            .eq("id", timerState.sessionId);
        }

        setCurrentBreaks(updatedBreaks);

        setTimerState({
          ...timerState,
          status: "running",
          startTimestamp: newStartTimestamp,
          breakStartTime: null,
          totalBreakTime,
          currentBreakId: null,
        });

        startTimerInterval();

        toast({
          title: "Break ended",
          description: `Break duration: ${formatDuration(breakDuration)}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error starting timer:", error);
      toast({
        title: "Error",
        description: "Failed to start the timer. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Pause the timer
  const pauseTimer = () => {
    if (timerState.status === "running") {
      const now = Date.now();

      setTimerState({
        ...timerState,
        status: "paused",
        pausedAt: now,
      });

      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast({
        title: "Timer paused",
        description: "Timer is now paused. Click Resume to continue.",
        duration: 3000,
      });
    }
  };

  // Take a break
  const takeBreak = async () => {
    // Check if user is available
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to track your time.",
        variant: "destructive",
      });
      return;
    }

    if (timerState.status === "running" && timerState.sessionId) {
      try {
        const now = Date.now();
        const currentTime = getCurrentTime();

        // Create a break in the database
        const newBreak = await createTimeBreak(timerState.sessionId);

        if (!newBreak) {
          throw new Error("Failed to create break");
        }

        // Add a new break to the current breaks
        const newLocalBreak = {
          start: currentTime,
          end: null,
          duration: 0,
        };

        setCurrentBreaks((prev) => [...prev, newLocalBreak]);

        setTimerState({
          ...timerState,
          status: "break",
          breakStartTime: now,
          currentBreakId: newBreak.id,
        });

        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }

        toast({
          title: "Break started",
          description: "Enjoy your break! Timer is paused.",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error taking break:", error);
        toast({
          title: "Error",
          description: "Failed to start break. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  // Stop the timer
  const stopTimer = async () => {
    // Check if user is available
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to track your time.",
        variant: "destructive",
      });
      return;
    }

    if (
      (timerState.status === "running" ||
        timerState.status === "paused" ||
        timerState.status === "break") &&
      timerState.sessionId
    ) {
      try {
        const now = Date.now();
        const currentTime = getCurrentTime();

        // Calculate final duration
        const finalDuration = timerState.totalElapsed;
        let finalBreakDuration = timerState.totalBreakTime;

        if (
          timerState.status === "break" &&
          timerState.breakStartTime &&
          timerState.currentBreakId
        ) {
          const breakDuration = now - timerState.breakStartTime;
          finalBreakDuration += breakDuration;

          // End the current break in the database
          await endTimeBreak(
            timerState.currentBreakId,
            Math.floor(breakDuration / 1000)
          );

          // Update the current break with end time
          const updatedBreaks = [...currentBreaks];
          const currentBreakIndex = updatedBreaks.findIndex(
            (b) => b.end === null
          );
          if (currentBreakIndex !== -1) {
            updatedBreaks[currentBreakIndex] = {
              ...updatedBreaks[currentBreakIndex],
              end: currentTime,
              duration: Math.floor(breakDuration / 1000),
            };
          }

          setCurrentBreaks(updatedBreaks);
        }

        // End the session in the database
        await endTimeSession(
          timerState.sessionId,
          Math.floor(finalDuration / 1000)
        );

        // Update total break time in the database
        await supabase
          .from("time_sessions")
          .update({ total_break_time: Math.floor(finalBreakDuration / 1000) })
          .eq("id", timerState.sessionId);

        // Save the session in local state
        setTimerSessions((prev) =>
          prev.map((session) => {
            if (session.id === timerState.sessionId) {
              return {
                ...session,
                endTime: currentTime,
                duration: Math.floor(finalDuration / 1000),
                breaks: session.breaks.concat(
                  currentBreaks
                    .filter((b) => b.end !== null)
                    .map((b) => ({
                      start: b.start,
                      end: b.end || currentTime,
                      duration: b.duration,
                    }))
                ),
                status: "completed",
              };
            }
            return session;
          })
        );

        setTimerState({
          status: "stopped",
          startTimestamp: null,
          pausedAt: null,
          totalElapsed: finalDuration,
          breakStartTime: null,
          totalBreakTime: finalBreakDuration,
          sessionId: null,
          currentBreakId: null,
        });

        setClockOutTime(currentTime);

        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }

        toast({
          title: "Checked out",
          description: `Total work time: ${formatDuration(
            finalDuration - finalBreakDuration
          )}`,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error stopping timer:", error);
        toast({
          title: "Error",
          description: "Failed to stop the timer. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };

  // If user is not available, show a message
  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
        <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
        <p className="text-gray-500 mb-4">
          Please sign in to use the time tracking features.
        </p>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 mb-8 flex justify-center items-center min-h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-sm text-gray-500">Loading time tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-gray-500 mb-2">Status</div>
          <StatusBadge status={timerState.status} />
        </div>

        <CircularTimer
          time={displayTime}
          progress={progress}
          state={timerState.status}
          pulseWhenRunning={timerState.status === "running"}
        />

        <div className="flex flex-col items-center">
          <div className="text-sm font-medium text-gray-500 mb-2">Session</div>
          <div className="flex flex-col items-center gap-1">
            {clockInTime && (
              <div className="text-sm">
                <span className="font-medium">In:</span> {clockInTime}
              </div>
            )}
            {clockOutTime && (
              <div className="text-sm">
                <span className="font-medium">Out:</span> {clockOutTime}
              </div>
            )}
            {!clockInTime && !clockOutTime && (
              <div className="text-sm text-gray-500">No active session</div>
            )}
          </div>
        </div>
      </div>

      <TimeControls
        status={timerState.status}
        onStart={startTimer}
        onPause={pauseTimer}
        onBreak={takeBreak}
        onStop={stopTimer}
      />

      <BreakSummary breaks={currentBreaks} />

      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">Idle Time</div>
          <Badge
            className={
              idleTime >= 5
                ? "bg-amber-100 text-amber-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {idleTime.toString().padStart(2, "0")} min
          </Badge>
        </div>

        <SessionHistoryDialog sessions={timerSessions} />
      </div>
    </div>
  );
}
