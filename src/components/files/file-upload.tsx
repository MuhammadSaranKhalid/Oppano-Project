// // // "use client"

// // // import type React from "react"

// // // import { useState, useRef, useCallback, useMemo } from "react"
// // // import { Upload, X, File, Check, AlertCircle, Folder, ChevronRight, ChevronDown } from "lucide-react"
// // // import { Button } from "@/components/ui/button"
// // // import { Progress } from "@/components/ui/progress"
// // // import { useToast } from "@/components/ui/use-toast"
// // // import { cn } from "@/lib/utils"

// // // interface FileUploadProps {
// // //   onUploadComplete: (files: UploadedFile[]) => void
// // // }

// // // export interface UploadedFile {
// // //   id: string
// // //   name: string
// // //   size: number
// // //   type: string
// // //   status: "uploading" | "success" | "error"
// // //   progress: number
// // //   url?: string
// // //   error?: string
// // //   path?: string
// // //   isFolder?: boolean
// // //   parentId?: string
// // //   children?: string[]
// // // }

// // // export function FileUpload({ onUploadComplete }: FileUploadProps) {
// // //   const { toast } = useToast()
// // //   const [isDragging, setIsDragging] = useState(false)
// // //   const [files, setFiles] = useState<UploadedFile[]>([])
// // //   const [isUploading, setIsUploading] = useState(false)
// // //   const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
// // //   const fileInputRef = useRef<HTMLInputElement>(null)
// // //   const folderInputRef = useRef<HTMLInputElement>(null)

// // //   const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
// // //     e.preventDefault()
// // //     e.stopPropagation()
// // //     setIsDragging(true)
// // //   }, [])

// // //   const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
// // //     e.preventDefault()
// // //     e.stopPropagation()
// // //     setIsDragging(false)
// // //   }, [])

// // //   const processFiles = useCallback(
// // //     (fileList: FileList, isFromFolderInput = false) => {
// // //       const newFiles: UploadedFile[] = []
// // //       const folderMap = new Map<string, UploadedFile>()

// // //       // First pass: create file objects and identify folders
// // //       Array.from(fileList).forEach((file) => {
// // //         // Get the file path (for folder uploads)
// // //         // @ts-ignore - webkitRelativePath exists on files from directory input
// // //         const relativePath = file.webkitRelativePath || file.relativePath || file.name
// // //         const pathParts = relativePath.split("/")

// // //         // Create a unique ID for this file
// // //         const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

// // //         // Create the file object
// // //         const fileObj: UploadedFile = {
// // //           id: fileId,
// // //           name: pathParts[pathParts.length - 1],
// // //           size: file.size,
// // //           type: file.type,
// // //           status: "uploading" as const,
// // //           progress: 0,
// // //           path: relativePath,
// // //         }

// // //         // If this is part of a folder structure (has path segments)
// // //         if (isFromFolderInput || pathParts.length > 1) {
// // //           // Process folder structure
// // //           let currentPath = ""
// // //           let parentId: string | undefined = undefined

// // //           // For each folder in the path (excluding the file itself)
// // //           for (let i = 0; i < pathParts.length - 1; i++) {
// // //             const folderName = pathParts[i]
// // //             const prevPath = currentPath
// // //             currentPath = currentPath ? `${currentPath}/${folderName}` : folderName

// // //             // If we haven't seen this folder before, create it
// // //             if (!folderMap.has(currentPath)) {
// // //               const folderId = `folder-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
// // //               const folderObj: UploadedFile = {
// // //                 id: folderId,
// // //                 name: folderName,
// // //                 size: 0,
// // //                 type: "folder",
// // //                 status: "uploading" as const,
// // //                 progress: 0,
// // //                 path: currentPath,
// // //                 isFolder: true,
// // //                 parentId: prevPath ? folderMap.get(prevPath)?.id : undefined,
// // //                 children: [],
// // //               }
// // //               folderMap.set(currentPath, folderObj)

// // //               // Add this folder as a child of its parent
// // //               if (prevPath && folderMap.has(prevPath)) {
// // //                 const parent = folderMap.get(prevPath)!
// // //                 parent.children = [...(parent.children || []), folderId]
// // //                 folderMap.set(prevPath, parent)
// // //               }
// // //             }

// // //             // Set the parent ID for the next level
// // //             parentId = folderMap.get(currentPath)?.id
// // //           }

// // //           // Set the parent ID for the file
// // //           fileObj.parentId = parentId

// // //           // Add this file as a child of its parent folder
// // //           if (parentId && folderMap.has(pathParts.slice(0, -1).join("/"))) {
// // //             const parent = folderMap.get(pathParts.slice(0, -1).join("/"))!
// // //             parent.children = [...(parent.children || []), fileId]
// // //             folderMap.set(pathParts.slice(0, -1).join("/"), parent)
// // //           }
// // //         }

// // //         newFiles.push(fileObj)
// // //       })

// // //       // Add all folders to the files array
// // //       folderMap.forEach((folder) => {
// // //         newFiles.push(folder)
// // //       })

// // //       // Auto-expand top-level folders
// // //       const topLevelFolders = newFiles.filter((f) => f.isFolder && !f.parentId)
// // //       const newExpandedFolders = new Set(expandedFolders)
// // //       topLevelFolders.forEach((folder) => {
// // //         newExpandedFolders.add(folder.id)
// // //       })
// // //       setExpandedFolders(newExpandedFolders)

// // //       setFiles((prev) => [...prev, ...newFiles])

// // //       // Return only the non-folder files for upload simulation
// // //       return newFiles.filter((f) => !f.isFolder)
// // //     },
// // //     [expandedFolders],
// // //   )

// // //   const handleDrop = useCallback(
// // //     (e: React.DragEvent<HTMLDivElement>) => {
// // //       e.preventDefault()
// // //       e.stopPropagation()
// // //       setIsDragging(false)

// // //       if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
// // //         // Check if any of the items are directories
// // //         const hasDirectory = Array.from(e.dataTransfer.items).some(
// // //           (item) => item.webkitGetAsEntry && item.webkitGetAsEntry()?.isDirectory,
// // //         )

// // //         if (hasDirectory) {
// // //           toast({
// // //             title: "Folder upload from drag and drop",
// // //             description: "Please use the 'Select Folder' button to upload folders",
// // //             variant: "destructive",
// // //           })
// // //           return
// // //         }
// // //       }

// // //       if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
// // //         const filesToUpload = processFiles(e.dataTransfer.files)
// // //         simulateUpload(filesToUpload)
// // //       }
// // //     },
// // //     [processFiles, toast],
// // //   )

// // //   const handleFileSelect = useCallback(
// // //     (e: React.ChangeEvent<HTMLInputElement>) => {
// // //       if (e.target.files && e.target.files.length > 0) {
// // //         const filesToUpload = processFiles(e.target.files)
// // //         simulateUpload(filesToUpload)
// // //         // Reset the input value so the same file can be selected again
// // //         e.target.value = ""
// // //       }
// // //     },
// // //     [processFiles],
// // //   )

// // //   const handleFolderSelect = useCallback(
// // //     (e: React.ChangeEvent<HTMLInputElement>) => {
// // //       if (e.target.files && e.target.files.length > 0) {
// // //         const filesToUpload = processFiles(e.target.files, true)
// // //         simulateUpload(filesToUpload)
// // //         // Reset the input value so the same folder can be selected again
// // //         e.target.value = ""
// // //       }
// // //     },
// // //     [processFiles],
// // //   )

// // //   const simulateUpload = useCallback(
// // //     (filesToUpload: UploadedFile[]) => {
// // //       if (filesToUpload.length === 0) return

// // //       setIsUploading(true)

// // //       // Simulate upload progress for each file
// // //       filesToUpload.forEach((file) => {
// // //         let progress = 0
// // //         const interval = setInterval(() => {
// // //           progress += Math.floor(Math.random() * 10) + 5

// // //           if (progress >= 100) {
// // //             clearInterval(interval)
// // //             progress = 100

// // //             // Simulate random success/error (90% success rate)
// // //             const isSuccess = Math.random() > 0.1

// // //             setFiles((prevFiles) => {
// // //               const updatedFiles = prevFiles.map((f) => {
// // //                 if (f.id === file.id) {
// // //                   return {
// // //                     ...f,
// // //                     status: isSuccess ? "success" as const : "error" as const,
// // //                     progress: 100,
// // //                     error: isSuccess ? undefined : "Upload failed. Please try again.",
// // //                   }
// // //                 }
// // //                 return f
// // //               })

// // //               // Update folder progress based on children
// // //               const updatedWithFolderProgress = updateFolderProgress(updatedFiles)
// // //               return updatedWithFolderProgress
// // //             })

// // //             // Check if all files are done uploading
// // //             setTimeout(() => {
// // //               setFiles((prevFiles) => {
// // //                 const allDone = prevFiles.filter((f) => !f.isFolder).every((f) => f.status !== "uploading")
// // //                 if (allDone) {
// // //                   setIsUploading(false)
// // //                   const successFiles = prevFiles.filter((f) => f.status === "success" && !f.isFolder)
// // //                   if (successFiles.length > 0) {
// // //                     onUploadComplete(successFiles)
// // //                     toast({
// // //                       title: "Upload Complete",
// // //                       description: `Successfully uploaded ${successFiles.length} file(s)`,
// // //                     })
// // //                   }
// // //                   return prevFiles.filter((f) => f.status === "error" || f.isFolder)
// // //                 }
// // //                 return prevFiles
// // //               })
// // //             }, 500)
// // //           } else {
// // //             setFiles((prevFiles) => {
// // //               const updatedFiles = prevFiles.map((f) => {
// // //                 if (f.id === file.id) {
// // //                   return {
// // //                     ...f,
// // //                     progress,
// // //                     status: "uploading" as const
// // //                   }
// // //                 }
// // //                 return f
// // //               })
// // //               return updateFolderProgress(updatedFiles)
// // //             })
// // //           }
// // //         }, 200)
// // //       })
// // //     },
// // //     [onUploadComplete, toast],
// // //   )

// // //   // Helper function to update folder progress based on children
// // //   const updateFolderProgress = (files: UploadedFile[]): UploadedFile[] => {
// // //     const fileMap = new Map(files.map((f) => [f.id, f]))
// // //     const folderFiles = files.filter((f) => f.isFolder)

// // //     // Process folders from bottom up (most nested first)
// // //     const sortedFolders = [...folderFiles].sort(
// // //       (a, b) => (b.path?.split("/").length || 0) - (a.path?.split("/").length || 0),
// // //     )

// // //     for (const folder of sortedFolders) {
// // //       if (!folder.children || folder.children.length === 0) continue

// // //       // Calculate progress based on children
// // //       let totalProgress = 0
// // //       let totalFiles = 0
// // //       let allSuccess = true
// // //       let anyError = false

// // //       for (const childId of folder.children) {
// // //         const child = fileMap.get(childId)
// // //         if (!child) continue

// // //         totalProgress += child.progress
// // //         totalFiles++

// // //         if (child.status !== "success") allSuccess = false
// // //         if (child.status === "error") anyError = true
// // //       }

// // //       const avgProgress = totalFiles > 0 ? totalProgress / totalFiles : 0
// // //       let status: "uploading" | "success" | "error" = "uploading"

// // //       if (allSuccess) status = "success"
// // //       else if (anyError) status = "error"

// // //       // Update the folder
// // //       fileMap.set(folder.id, {
// // //         ...folder,
// // //         progress: Math.round(avgProgress),
// // //         status,
// // //       })
// // //     }

// // //     // Ensure all files in the result are properly typed as UploadedFile
// // //     return Array.from(fileMap.values()) as UploadedFile[]
// // //   }

// // //   const removeFile = useCallback((fileId: string) => {
// // //     setFiles((prevFiles) => {
// // //       // Find the file to remove
// // //       const fileToRemove = prevFiles.find((f) => f.id === fileId)
// // //       if (!fileToRemove) return prevFiles

// // //       // If it's a folder, also remove all children
// // //       const idsToRemove = new Set<string>([fileId])

// // //       if (fileToRemove.isFolder && fileToRemove.children) {
// // //         // Recursively collect all descendant IDs
// // //         const collectDescendants = (ids: string[]) => {
// // //           ids.forEach((id) => {
// // //             idsToRemove.add(id)
// // //             const child = prevFiles.find((f) => f.id === id)
// // //             if (child?.children?.length) {
// // //               collectDescendants(child.children)
// // //             }
// // //           })
// // //         }

// // //         collectDescendants(fileToRemove.children)
// // //       }

// // //       // Remove the file from its parent's children array
// // //       if (fileToRemove.parentId) {
// // //         const parent = prevFiles.find((f) => f.id === fileToRemove.parentId)
// // //         if (parent && parent.children) {
// // //           const updatedParent = {
// // //             ...parent,
// // //             children: parent.children.filter((id) => id !== fileId),
// // //           }

// // //           // Update the parent in the files array
// // //           return prevFiles.map((f) => (f.id === parent.id ? updatedParent : f)).filter((f) => !idsToRemove.has(f.id))
// // //         }
// // //       }

// // //       // Remove all collected IDs
// // //       return prevFiles.filter((f) => !idsToRemove.has(f.id))
// // //     })
// // //   }, [])

// // //   const retryUpload = useCallback(
// // //     (file: UploadedFile) => {
// // //       const retryFile = { ...file, status: "uploading" as const, progress: 0 }
// // //       setFiles((prevFiles) => prevFiles.map((f) => (f.id === file.id ? retryFile : f)))
// // //       simulateUpload([retryFile])
// // //     },
// // //     [simulateUpload],
// // //   )

// // //   const toggleFolder = useCallback((folderId: string) => {
// // //     setExpandedFolders((prev) => {
// // //       const newSet = new Set(prev)
// // //       if (newSet.has(folderId)) {
// // //         newSet.delete(folderId)
// // //       } else {
// // //         newSet.add(folderId)
// // //       }
// // //       return newSet
// // //     })
// // //   }, [])

// // //   const formatFileSize = (bytes: number): string => {
// // //     if (bytes === 0) return "0 Bytes"
// // //     const k = 1024
// // //     const sizes = ["Bytes", "KB", "MB", "GB"]
// // //     const i = Math.floor(Math.log(bytes) / Math.log(k))
// // //     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
// // //   }

// // //   // Organize files into a hierarchical structure for display
// // //   const organizedFiles = useMemo(() => {
// // //     const topLevel = files.filter((file) => !file.parentId)

// // //     // Sort folders first, then by name
// // //     return topLevel.sort((a, b) => {
// // //       if (a.isFolder && !b.isFolder) return -1
// // //       if (!a.isFolder && b.isFolder) return 1
// // //       return a.name.localeCompare(b.name)
// // //     })
// // //   }, [files])

// // //   // Recursive function to render file/folder items
// // //   const renderFileItem = (file: UploadedFile, depth = 0) => {
// // //     const isExpanded = file.isFolder && expandedFolders.has(file.id)
// // //     const hasChildren = file.isFolder && file.children && file.children.length > 0
// // //     const childFiles = hasChildren
// // //       ? (file.children!.map((id) => files.find((f) => f.id === id)).filter(Boolean) as UploadedFile[])
// // //       : []

// // //     // Sort children: folders first, then by name
// // //     const sortedChildren = childFiles.sort((a, b) => {
// // //       if (a.isFolder && !b.isFolder) return -1
// // //       if (!a.isFolder && b.isFolder) return 1
// // //       return a.name.localeCompare(b.name)
// // //     })

// // //     return (
// // //       <div key={file.id} className="space-y-2">
// // //         <div className="flex items-center justify-between p-3 border rounded-md bg-white">
// // //           <div className="flex items-center space-x-3 flex-1 min-w-0">
// // //             {file.isFolder ? (
// // //               <button
// // //                 onClick={() => toggleFolder(file.id)}
// // //                 className={cn(
// // //                   "bg-gray-100 p-2 rounded flex items-center justify-center",
// // //                   !hasChildren && "opacity-50 cursor-default",
// // //                 )}
// // //                 disabled={!hasChildren}
// // //               >
// // //                 {hasChildren ? (
// // //                   isExpanded ? (
// // //                     <ChevronDown className="h-5 w-5 text-gray-500" />
// // //                   ) : (
// // //                     <ChevronRight className="h-5 w-5 text-gray-500" />
// // //                   )
// // //                 ) : (
// // //                   <Folder className="h-5 w-5 text-gray-500" />
// // //                 )}
// // //               </button>
// // //             ) : (
// // //               <div className="bg-gray-100 p-2 rounded">
// // //                 <File className="h-5 w-5 text-gray-500" />
// // //               </div>
// // //             )}
// // //             <div className="flex-1 min-w-0">
// // //               <p className="text-sm font-medium truncate">
// // //                 {file.name}
// // //                 {file.isFolder && ` (${file.children?.length || 0} items)`}
// // //               </p>
// // //               {!file.isFolder && <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>}
// // //             </div>
// // //           </div>

// // //           <div className="flex items-center space-x-3 ml-4">
// // //             {file.status === "uploading" ? (
// // //               <div className="w-24">
// // //                 <Progress value={file.progress} className="h-2" />
// // //                 <p className="text-xs text-gray-500 mt-1 text-right">{file.progress}%</p>
// // //               </div>
// // //             ) : file.status === "success" ? (
// // //               <div className="flex items-center text-green-500">
// // //                 <Check className="h-5 w-5 mr-1" />
// // //                 <span className="text-xs">Complete</span>
// // //               </div>
// // //             ) : (
// // //               <div className="flex items-center">
// // //                 <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
// // //                 <span className="text-xs text-red-500">Failed</span>
// // //                 {!file.isFolder && (
// // //                   <Button
// // //                     variant="ghost"
// // //                     size="sm"
// // //                     className="ml-2 text-xs text-[#ff6a00] hover:text-[#ff6a00] hover:bg-[#fff9e5]"
// // //                     onClick={(e) => {
// // //                       e.stopPropagation()
// // //                       retryUpload(file)
// // //                     }}
// // //                   >
// // //                     Retry
// // //                   </Button>
// // //                 )}
// // //               </div>
// // //             )}

// // //             <button
// // //               className="p-1 hover:bg-gray-100 rounded-full"
// // //               onClick={(e) => {
// // //                 e.stopPropagation()
// // //                 removeFile(file.id)
// // //               }}
// // //               disabled={file.status === "uploading"}
// // //             >
// // //               <X className="h-4 w-4 text-gray-500" />
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Render children if folder is expanded */}
// // //         {file.isFolder && isExpanded && sortedChildren.length > 0 && (
// // //           <div className="pl-8 space-y-2">{sortedChildren.map((child) => renderFileItem(child, depth + 1))}</div>
// // //         )}
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="w-full space-y-4">
// // //       <div
// // //         className={cn(
// // //           "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
// // //           isDragging ? "border-[#ff6a00] bg-[#fff9e5]" : "border-gray-300 hover:border-gray-400",
// // //           isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer",
// // //         )}
// // //         onDragOver={handleDragOver}
// // //         onDragLeave={handleDragLeave}
// // //         onDrop={handleDrop}
// // //         onClick={() => fileInputRef.current?.click()}
// // //       >
// // //         <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />
// // //         <input
// // //           type="file"
// // //           ref={folderInputRef}
// // //           className="hidden"
// // //           onChange={handleFolderSelect}
// // //           // @ts-ignore - webkitdirectory and directory are non-standard attributes
// // //           webkitdirectory=""
// // //           directory=""
// // //         />
// // //         <div className="flex flex-col items-center justify-center space-y-3">
// // //           <div className="rounded-full bg-[#fff9e5] p-3">
// // //             <Upload className="h-6 w-6 text-[#ff6a00]" />
// // //           </div>
// // //           <h3 className="text-lg font-medium">Drag and drop files or folders here</h3>
// // //           <p className="text-sm text-gray-500 max-w-md">
// // //             Drop your files here or click to browse. You can also upload entire folders with their structure preserved.
// // //           </p>
// // //           <div className="flex space-x-3 mt-2">
// // //             <Button
// // //               variant="outline"
// // //               className="border-[#ff6a00] text-[#ff6a00] hover:bg-[#fff9e5] hover:text-[#ff6a00]"
// // //               onClick={(e) => {
// // //                 e.stopPropagation()
// // //                 fileInputRef.current?.click()
// // //               }}
// // //             >
// // //               Select Files
// // //             </Button>
// // //             <Button
// // //               variant="outline"
// // //               className="border-[#ff6a00] text-[#ff6a00] hover:bg-[#fff9e5] hover:text-[#ff6a00]"
// // //               onClick={(e) => {
// // //                 e.stopPropagation()
// // //                 folderInputRef.current?.click()
// // //               }}
// // //             >
// // //               <Folder className="mr-2 h-4 w-4" />
// // //               Select Folder
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {files.length > 0 && (
// // //         <div className="space-y-3 mt-4">
// // //           <h4 className="font-medium">Files ({files.length})</h4>
// // //           <div className="space-y-2">{organizedFiles.map((file) => renderFileItem(file))}</div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }

// // "use client";

// // import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
// // import { v4 as uuid } from "uuid";
// // import dayjs from "dayjs";
// // import { useCallback, useMemo, useRef, useState } from "react";
// // import {
// //   Upload,
// //   X,
// //   Check,
// //   AlertCircle,
// //   File,
// //   Folder,
// //   ChevronRight,
// //   ChevronDown,
// // } from "lucide-react";
// // import { Progress } from "@/components/ui/progress";
// // import { Button } from "@/components/ui/button";
// // import { useToast } from "@/components/ui/use-toast";
// // import { cn } from "@/lib/utils";
// // import { supabaseBrowserClient } from "@utils/supabase/client";
// // import { useGetIdentity } from "@refinedev/core";

// // /* ------------------------------------------------------------------ */
// // /* Types                                                               */
// // /* ------------------------------------------------------------------ */
// // export interface UploadedFile {
// //   file: File; // the raw File object
// //   id: string; // local ID
// //   path: string; // original relative path (for folder uploads)
// //   storageKey: string; // final key in bucket
// //   progress: number;
// //   status: "waiting" | "uploading" | "success" | "error";
// //   error?: string;
// // }

// // interface Props {
// //   organizationId?: string;
// //   onComplete: () => void;
// // }

// // /* ------------------------------------------------------------------ */
// // /* Component                                                           */
// // /* ------------------------------------------------------------------ */
// // export function FileUpload({ organizationId, onComplete }: Props) {
// //   const { toast } = useToast();
// //   const { data } = useGetIdentity();
// //   console.log("USER DATA : ", data);

// //   const [files, setFiles] = useState<UploadedFile[]>([]);
// //   const [isUploading, setIsUploading] = useState(false);

// //   /* -------- helpers ------------------------------------------------ */
// //   const computeStorageKey = (file: File, relPath: string) => {
// //     const today = dayjs().format("YYYY/MM/DD");
// //     return `${organizationId}/${today}/${uuid()}__${file.name}`.replaceAll(
// //       " ",
// //       "_"
// //     );
// //   };

// //   const addFiles = (fileList: FileList | File[], basePath = "") => {
// //     const newEntries: UploadedFile[] = [];

// //     Array.from(fileList).forEach((file) => {
// //       // `webkitRelativePath` is present when folder upload
// //       // @ts-ignore
// //       const relPath: string =
// //         file.webkitRelativePath || `${basePath}${file.name}`;

// //       newEntries.push({
// //         file,
// //         id: uuid(),
// //         path: relPath,
// //         storageKey: computeStorageKey(file, relPath),
// //         progress: 0,
// //         status: "waiting",
// //       });
// //     });

// //     setFiles((prev) => [...prev, ...newEntries]);
// //   };

// //   /* ------------------------------------------------------------------ */
// //   /* Real upload using Supabase Storage                                 */
// //   /* ------------------------------------------------------------------ */
// //   const startUpload = async () => {
// //     if (!organizationId) {
// //       toast({
// //         title: "Missing organisation",
// //         description: "Cannot upload without org context",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
// //     setIsUploading(true);

// //     for (const entry of files) {
// //       setFiles((prev) =>
// //         prev.map((f) =>
// //           f.id === entry.id ? { ...f, status: "uploading", progress: 1 } : f
// //         )
// //       );

// //       const { error } = await supabaseBrowserClient.storage
// //         .from("org_files")
// //         .upload(entry.storageKey, entry.file, {
// //           // onUploadProgress isn't exposed directly, but you can pass
// //           // a custom fetch to track progress:
// //           // fetch: (url, options) => {
// //           //   const xhr = new XMLHttpRequest();
// //           //   return new Promise<Response>((resolve, reject) => {
// //           //     xhr.open(options?.method ?? "POST", url);
// //           //     Object.entries(options?.headers ?? {}).forEach(([k, v]) =>
// //           //       xhr.setRequestHeader(k, v as string)
// //           //     );

// //           //     xhr.upload.onprogress = (evt) => {
// //           //       if (evt.lengthComputable) {
// //           //         const pct = Math.round((evt.loaded / evt.total) * 100);
// //           //         setFiles((prev) =>
// //           //           prev.map((f) =>
// //           //             f.id === entry.id ? { ...f, progress: pct } : f
// //           //           )
// //           //         );
// //           //       }
// //           //     };

// //           //     xhr.onload = () => {
// //           //       const res = new Response(xhr.response, { status: xhr.status });
// //           //       resolve(res);
// //           //     };
// //           //     xhr.onerror = reject;
// //           //     xhr.responseType = "json";
// //           //     xhr.send(options?.body);
// //           //   });
// //           // },
// //           upsert: false,
// //         });

// //       if (error) {
// //         setFiles((prev) =>
// //           prev.map((f) =>
// //             f.id === entry.id
// //               ? { ...f, status: "error", progress: 100, error: error.message }
// //               : f
// //           )
// //         );
// //         continue;
// //       }

// //       /* insert metadata row */
// //       await supabaseBrowserClient.from("files").insert({
// //         organization_id: organizationId,
// //         uploader_id: data?.user?.id,
// //         name: entry.file.name,
// //         original_name: entry.file.name,
// //         mime_type: entry.file.type,
// //         size: entry.file.size,
// //         storage_key: entry.storageKey,
// //         relative_path: entry.path,
// //       });

// //       setFiles((prev) =>
// //         prev.map((f) =>
// //           f.id === entry.id ? { ...f, status: "success", progress: 100 } : f
// //         )
// //       );
// //     }

// //     setIsUploading(false);
// //     onComplete();
// //   };

// //   /* ------------------------------------------------------------------ */
// //   /* UI (simplified)                                                    */
// //   /* ------------------------------------------------------------------ */
// //   return (
// //     <div className="w-full space-y-4">
// //       {/* Dropzone & selectors */}
// //       <div
// //         className={cn(
// //           "border-2 border-dashed rounded-lg p-8 text-center",
// //           "hover:border-gray-400 cursor-pointer",
// //           isUploading && "opacity-50 pointer-events-none"
// //         )}
// //         onClick={() => document.getElementById("file-selector")?.click()}
// //       >
// //         <Upload className="mx-auto h-8 w-8 text-[#ff6a00]" />
// //         <p className="mt-2 text-sm text-gray-600">
// //           Click to select files or folders
// //         </p>
// //         <input
// //           id="file-selector"
// //           type="file"
// //           multiple
// //           className="hidden"
// //           onChange={(e) => e.target.files && addFiles(e.target.files)}
// //           // folder selection:
// //           /* @ts-ignore */
// //           webkitdirectory=""
// //           directory=""
// //         />
// //       </div>

// //       {/* File list */}
// //       {files.length > 0 && (
// //         <div className="space-y-2">
// //           {files.map((f) => (
// //             <div
// //               key={f.id}
// //               className="flex items-center justify-between border p-3 rounded-md bg-white"
// //             >
// //               <div className="flex items-center gap-3">
// //                 <File className="h-4 w-4 text-gray-500" />
// //                 <span className="text-sm truncate">{f.file.name}</span>
// //               </div>

// //               {f.status === "uploading" ? (
// //                 <Progress value={f.progress} className="w-40 h-2" />
// //               ) : f.status === "success" ? (
// //                 <Check className="h-5 w-5 text-green-500" />
// //               ) : f.status === "error" ? (
// //                 <AlertCircle className="h-5 w-5 text-red-500" />
// //               ) : null}
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* Action bar */}
// //       <div className="flex justify-end pt-4">
// //         <Button
// //           disabled={files.length === 0 || isUploading}
// //           onClick={startUpload}
// //         >
// //           {isUploading ? "Uploading…" : "Start Upload"}
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import type React from "react";

// import { useState, useRef } from "react";
// import { Upload, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { useToast } from "@/components/ui/use-toast";
// import { cn } from "@/lib/utils";
// import { uploadFile } from "@lib/supabase";

// interface FileUploadProps {
//   onUploadComplete: () => void;
// }

// export function FileUpload({ onUploadComplete }: FileUploadProps) {
//   const { toast } = useToast();
//   const [isDragging, setIsDragging] = useState(false);
//   const [files, setFiles] = useState<File[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);

//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       setFiles(Array.from(e.dataTransfer.files));
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFiles(Array.from(e.target.files));
//     }
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) return;

//     setUploading(true);
//     setProgress(0);

//     try {
//       // Upload each file
//       for (let i = 0; i < files.length; i++) {
//         await uploadFile(files[i]);
//         setProgress(Math.round(((i + 1) / files.length) * 100));
//       }

//       toast({
//         title: "Upload Complete",
//         description: `Successfully uploaded ${files.length} file(s)`,
//       });

//       setFiles([]);
//       onUploadComplete();
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast({
//         title: "Upload Failed",
//         description: error instanceof Error ? error.message : "Unknown error",
//         variant: "destructive",
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeFile = (index: number) => {
//     setFiles(files.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="w-full space-y-4">
//       <div
//         className={cn(
//           "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
//           isDragging
//             ? "border-[#ff6a00] bg-[#fff9e5]"
//             : "border-gray-300 hover:border-gray-400",
//           uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"
//         )}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={() => fileInputRef.current?.click()}
//       >
//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           onChange={handleFileChange}
//           multiple
//         />
//         <div className="flex flex-col items-center justify-center space-y-3">
//           <div className="rounded-full bg-[#fff9e5] p-3">
//             <Upload className="h-6 w-6 text-[#ff6a00]" />
//           </div>
//           <h3 className="text-lg font-medium">Click to select files</h3>
//           <p className="text-sm text-gray-500">Or drag and drop files here</p>
//         </div>
//       </div>

//       {files.length > 0 && (
//         <div className="space-y-4">
//           <div className="space-y-2">
//             {files.map((file, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-3 border rounded-md"
//               >
//                 <span className="text-sm truncate max-w-[300px]">
//                   {file.name}
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-gray-500">
//                     {formatFileSize(file.size)}
//                   </span>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeFile(index);
//                     }}
//                     className="p-1 hover:bg-gray-100 rounded-full"
//                   >
//                     <X className="h-4 w-4 text-gray-500" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {uploading ? (
//             <div className="space-y-2">
//               <Progress value={progress} className="h-2" />
//               <p className="text-xs text-center text-gray-500">
//                 {progress}% complete
//               </p>
//             </div>
//           ) : (
//             <Button className="w-full" onClick={handleUpload}>
//               Upload {files.length} file{files.length !== 1 ? "s" : ""}
//             </Button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function formatFileSize(bytes: number): string {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return (
//     Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   );
// }

"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, X, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  onUploadComplete: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i]);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${files.length} file(s)`,
      });

      setFiles([]);
      onUploadComplete();
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Unknown error occurred during upload"
      );
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-6">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/50",
          uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Drag and drop your files here</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Upload any file type. Files are securely stored and only accessible
            to members of your organization.
          </p>
          <Button variant="outline" size="lg" className="mt-2">
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {files.map((file, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="bg-primary/10 p-2 rounded">
                      <File className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {uploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <Button className="w-full" onClick={handleUpload}>
              Upload {files.length} file{files.length !== 1 ? "s" : ""}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}
