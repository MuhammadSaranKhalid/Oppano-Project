"use client"

import type React from "react"

import { useState, useRef, useCallback, useMemo } from "react"
import { Upload, X, File, Check, AlertCircle, Folder, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUploadComplete: (files: UploadedFile[]) => void
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "success" | "error"
  progress: number
  url?: string
  error?: string
  path?: string
  isFolder?: boolean
  parentId?: string
  children?: string[]
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback(
    (fileList: FileList, isFromFolderInput = false) => {
      const newFiles: UploadedFile[] = []
      const folderMap = new Map<string, UploadedFile>()

      // First pass: create file objects and identify folders
      Array.from(fileList).forEach((file) => {
        // Get the file path (for folder uploads)
        // @ts-ignore - webkitRelativePath exists on files from directory input
        const relativePath = file.webkitRelativePath || file.relativePath || file.name
        const pathParts = relativePath.split("/")

        // Create a unique ID for this file
        const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

        // Create the file object
        const fileObj: UploadedFile = {
          id: fileId,
          name: pathParts[pathParts.length - 1],
          size: file.size,
          type: file.type,
          status: "uploading" as const,
          progress: 0,
          path: relativePath,
        }

        // If this is part of a folder structure (has path segments)
        if (isFromFolderInput || pathParts.length > 1) {
          // Process folder structure
          let currentPath = ""
          let parentId: string | undefined = undefined

          // For each folder in the path (excluding the file itself)
          for (let i = 0; i < pathParts.length - 1; i++) {
            const folderName = pathParts[i]
            const prevPath = currentPath
            currentPath = currentPath ? `${currentPath}/${folderName}` : folderName

            // If we haven't seen this folder before, create it
            if (!folderMap.has(currentPath)) {
              const folderId = `folder-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
              const folderObj: UploadedFile = {
                id: folderId,
                name: folderName,
                size: 0,
                type: "folder",
                status: "uploading" as const,
                progress: 0,
                path: currentPath,
                isFolder: true,
                parentId: prevPath ? folderMap.get(prevPath)?.id : undefined,
                children: [],
              }
              folderMap.set(currentPath, folderObj)

              // Add this folder as a child of its parent
              if (prevPath && folderMap.has(prevPath)) {
                const parent = folderMap.get(prevPath)!
                parent.children = [...(parent.children || []), folderId]
                folderMap.set(prevPath, parent)
              }
            }

            // Set the parent ID for the next level
            parentId = folderMap.get(currentPath)?.id
          }

          // Set the parent ID for the file
          fileObj.parentId = parentId

          // Add this file as a child of its parent folder
          if (parentId && folderMap.has(pathParts.slice(0, -1).join("/"))) {
            const parent = folderMap.get(pathParts.slice(0, -1).join("/"))!
            parent.children = [...(parent.children || []), fileId]
            folderMap.set(pathParts.slice(0, -1).join("/"), parent)
          }
        }

        newFiles.push(fileObj)
      })

      // Add all folders to the files array
      folderMap.forEach((folder) => {
        newFiles.push(folder)
      })

      // Auto-expand top-level folders
      const topLevelFolders = newFiles.filter((f) => f.isFolder && !f.parentId)
      const newExpandedFolders = new Set(expandedFolders)
      topLevelFolders.forEach((folder) => {
        newExpandedFolders.add(folder.id)
      })
      setExpandedFolders(newExpandedFolders)

      setFiles((prev) => [...prev, ...newFiles])

      // Return only the non-folder files for upload simulation
      return newFiles.filter((f) => !f.isFolder)
    },
    [expandedFolders],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        // Check if any of the items are directories
        const hasDirectory = Array.from(e.dataTransfer.items).some(
          (item) => item.webkitGetAsEntry && item.webkitGetAsEntry()?.isDirectory,
        )

        if (hasDirectory) {
          toast({
            title: "Folder upload from drag and drop",
            description: "Please use the 'Select Folder' button to upload folders",
            variant: "destructive",
          })
          return
        }
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesToUpload = processFiles(e.dataTransfer.files)
        simulateUpload(filesToUpload)
      }
    },
    [processFiles, toast],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const filesToUpload = processFiles(e.target.files)
        simulateUpload(filesToUpload)
        // Reset the input value so the same file can be selected again
        e.target.value = ""
      }
    },
    [processFiles],
  )

  const handleFolderSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const filesToUpload = processFiles(e.target.files, true)
        simulateUpload(filesToUpload)
        // Reset the input value so the same folder can be selected again
        e.target.value = ""
      }
    },
    [processFiles],
  )

  const simulateUpload = useCallback(
    (filesToUpload: UploadedFile[]) => {
      if (filesToUpload.length === 0) return

      setIsUploading(true)

      // Simulate upload progress for each file
      filesToUpload.forEach((file) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 10) + 5

          if (progress >= 100) {
            clearInterval(interval)
            progress = 100

            // Simulate random success/error (90% success rate)
            const isSuccess = Math.random() > 0.1

            setFiles((prevFiles) => {
              const updatedFiles = prevFiles.map((f) => {
                if (f.id === file.id) {
                  return {
                    ...f,
                    status: isSuccess ? "success" : "error",
                    progress: 100,
                    error: isSuccess ? undefined : "Upload failed. Please try again.",
                  }
                }
                return f
              })

              // Update folder progress based on children
              const updatedWithFolderProgress = updateFolderProgress(updatedFiles)
              return updatedWithFolderProgress
            })

            // Check if all files are done uploading
            setTimeout(() => {
              setFiles((prevFiles) => {
                const allDone = prevFiles.filter((f) => !f.isFolder).every((f) => f.status !== "uploading")
                if (allDone) {
                  setIsUploading(false)
                  const successFiles = prevFiles.filter((f) => f.status === "success" && !f.isFolder)
                  if (successFiles.length > 0) {
                    onUploadComplete(successFiles)
                    toast({
                      title: "Upload Complete",
                      description: `Successfully uploaded ${successFiles.length} file(s)`,
                    })
                  }
                  return prevFiles.filter((f) => f.status === "error" || f.isFolder)
                }
                return prevFiles
              })
            }, 500)
          } else {
            setFiles((prevFiles) => {
              const updatedFiles = prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f))
              return updateFolderProgress(updatedFiles)
            })
          }
        }, 200)
      })
    },
    [onUploadComplete, toast],
  )

  // Helper function to update folder progress based on children
  const updateFolderProgress = (files: UploadedFile[]): UploadedFile[] => {
    const fileMap = new Map(files.map((f) => [f.id, f]))
    const folderFiles = files.filter((f) => f.isFolder)

    // Process folders from bottom up (most nested first)
    const sortedFolders = [...folderFiles].sort(
      (a, b) => (b.path?.split("/").length || 0) - (a.path?.split("/").length || 0),
    )

    for (const folder of sortedFolders) {
      if (!folder.children || folder.children.length === 0) continue

      // Calculate progress based on children
      let totalProgress = 0
      let totalFiles = 0
      let allSuccess = true
      let anyError = false

      for (const childId of folder.children) {
        const child = fileMap.get(childId)
        if (!child) continue

        totalProgress += child.progress
        totalFiles++

        if (child.status !== "success") allSuccess = false
        if (child.status === "error") anyError = true
      }

      const avgProgress = totalFiles > 0 ? totalProgress / totalFiles : 0
      let status: "uploading" | "success" | "error" = "uploading"

      if (allSuccess) status = "success"
      else if (anyError) status = "error"

      // Update the folder
      fileMap.set(folder.id, {
        ...folder,
        progress: Math.round(avgProgress),
        status,
      })
    }

    return Array.from(fileMap.values())
  }

  const removeFile = useCallback((fileId: string) => {
    setFiles((prevFiles) => {
      // Find the file to remove
      const fileToRemove = prevFiles.find((f) => f.id === fileId)
      if (!fileToRemove) return prevFiles

      // If it's a folder, also remove all children
      const idsToRemove = new Set<string>([fileId])

      if (fileToRemove.isFolder && fileToRemove.children) {
        // Recursively collect all descendant IDs
        const collectDescendants = (ids: string[]) => {
          ids.forEach((id) => {
            idsToRemove.add(id)
            const child = prevFiles.find((f) => f.id === id)
            if (child?.children?.length) {
              collectDescendants(child.children)
            }
          })
        }

        collectDescendants(fileToRemove.children)
      }

      // Remove the file from its parent's children array
      if (fileToRemove.parentId) {
        const parent = prevFiles.find((f) => f.id === fileToRemove.parentId)
        if (parent && parent.children) {
          const updatedParent = {
            ...parent,
            children: parent.children.filter((id) => id !== fileId),
          }

          // Update the parent in the files array
          return prevFiles.map((f) => (f.id === parent.id ? updatedParent : f)).filter((f) => !idsToRemove.has(f.id))
        }
      }

      // Remove all collected IDs
      return prevFiles.filter((f) => !idsToRemove.has(f.id))
    })
  }, [])

  const retryUpload = useCallback(
    (file: UploadedFile) => {
      const retryFile = { ...file, status: "uploading" as const, progress: 0 }
      setFiles((prevFiles) => prevFiles.map((f) => (f.id === file.id ? retryFile : f)))
      simulateUpload([retryFile])
    },
    [simulateUpload],
  )

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Organize files into a hierarchical structure for display
  const organizedFiles = useMemo(() => {
    const topLevel = files.filter((file) => !file.parentId)

    // Sort folders first, then by name
    return topLevel.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      return a.name.localeCompare(b.name)
    })
  }, [files])

  // Recursive function to render file/folder items
  const renderFileItem = (file: UploadedFile, depth = 0) => {
    const isExpanded = file.isFolder && expandedFolders.has(file.id)
    const hasChildren = file.isFolder && file.children && file.children.length > 0
    const childFiles = hasChildren
      ? (file.children!.map((id) => files.find((f) => f.id === id)).filter(Boolean) as UploadedFile[])
      : []

    // Sort children: folders first, then by name
    const sortedChildren = childFiles.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1
      return a.name.localeCompare(b.name)
    })

    return (
      <div key={file.id} className="space-y-2">
        <div className="flex items-center justify-between p-3 border rounded-md bg-white">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {file.isFolder ? (
              <button
                onClick={() => toggleFolder(file.id)}
                className={cn(
                  "bg-gray-100 p-2 rounded flex items-center justify-center",
                  !hasChildren && "opacity-50 cursor-default",
                )}
                disabled={!hasChildren}
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )
                ) : (
                  <Folder className="h-5 w-5 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="bg-gray-100 p-2 rounded">
                <File className="h-5 w-5 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {file.name}
                {file.isFolder && ` (${file.children?.length || 0} items)`}
              </p>
              {!file.isFolder && <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-3 ml-4">
            {file.status === "uploading" ? (
              <div className="w-24">
                <Progress value={file.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1 text-right">{file.progress}%</p>
              </div>
            ) : file.status === "success" ? (
              <div className="flex items-center text-green-500">
                <Check className="h-5 w-5 mr-1" />
                <span className="text-xs">Complete</span>
              </div>
            ) : (
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                <span className="text-xs text-red-500">Failed</span>
                {!file.isFolder && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-xs text-[#ff6a00] hover:text-[#ff6a00] hover:bg-[#fff9e5]"
                    onClick={(e) => {
                      e.stopPropagation()
                      retryUpload(file)
                    }}
                  >
                    Retry
                  </Button>
                )}
              </div>
            )}

            <button
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                removeFile(file.id)
              }}
              disabled={file.status === "uploading"}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Render children if folder is expanded */}
        {file.isFolder && isExpanded && sortedChildren.length > 0 && (
          <div className="pl-8 space-y-2">{sortedChildren.map((child) => renderFileItem(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging ? "border-[#ff6a00] bg-[#fff9e5]" : "border-gray-300 hover:border-gray-400",
          isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />
        <input
          type="file"
          ref={folderInputRef}
          className="hidden"
          onChange={handleFolderSelect}
          // @ts-ignore - webkitdirectory and directory are non-standard attributes
          webkitdirectory=""
          directory=""
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="rounded-full bg-[#fff9e5] p-3">
            <Upload className="h-6 w-6 text-[#ff6a00]" />
          </div>
          <h3 className="text-lg font-medium">Drag and drop files or folders here</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Drop your files here or click to browse. You can also upload entire folders with their structure preserved.
          </p>
          <div className="flex space-x-3 mt-2">
            <Button
              variant="outline"
              className="border-[#ff6a00] text-[#ff6a00] hover:bg-[#fff9e5] hover:text-[#ff6a00]"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Select Files
            </Button>
            <Button
              variant="outline"
              className="border-[#ff6a00] text-[#ff6a00] hover:bg-[#fff9e5] hover:text-[#ff6a00]"
              onClick={(e) => {
                e.stopPropagation()
                folderInputRef.current?.click()
              }}
            >
              <Folder className="mr-2 h-4 w-4" />
              Select Folder
            </Button>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="font-medium">Files ({files.length})</h4>
          <div className="space-y-2">{organizedFiles.map((file) => renderFileItem(file))}</div>
        </div>
      )}
    </div>
  )
}
