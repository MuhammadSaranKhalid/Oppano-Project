// // "use client"

// // import { useState, useMemo } from "react"
// // import {
// //   Download,
// //   Edit,
// //   MoreHorizontal,
// //   Search,
// //   SlidersHorizontal,
// //   Trash,
// //   ArchiveIcon,
// //   LinkIcon,
// //   Upload,
// //   Folder,
// //   ChevronRight,
// //   ChevronDown,
// //   FileIcon,
// // } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Checkbox } from "@/components/ui/checkbox"
// // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// // import { cn } from "@/lib/utils"
// // import { useToast } from "@/components/ui/use-toast"
// // import { UploadModal } from "./upload-modal"
// // import type { UploadedFile } from "./file-upload"

// // // Mock data based on the Prisma schema
// // const initialDocuments = Array(12)
// //   .fill(null)
// //   .map((_, i) => ({
// //     id: `doc-${i}`,
// //     name: `Test_document_${i + 1}.pdf`,
// //     recipient: "Stiv Rogers",
// //     dateCreated: "1/03/2023",
// //     status: "Draft",
// //     modified: "2 hours ago",
// //     tag: "Jobs",
// //     path: null,
// //     isFolder: false,
// //     parentId: null,
// //   }))

// // interface Document {
// //   id: string
// //   name: string
// //   recipient: string
// //   dateCreated: string
// //   status: string
// //   modified: string
// //   tag: string
// //   path: string | null
// //   isFolder: boolean
// //   parentId: string | null
// //   children?: string[]
// // }

// // export function DocumentsTable() {
// //   const { toast } = useToast()
// //   const [selectedDocs, setSelectedDocs] = useState<string[]>([])
// //   const [searchQuery, setSearchQuery] = useState("")
// //   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
// //   const [documents, setDocuments] = useState<Document[]>(initialDocuments)
// //   const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
// //   const [filters, setFilters] = useState({
// //     draft: false,
// //     published: false,
// //     archived: false,
// //   })

// //   // Filter documents based on search query
// //   const filteredDocuments = useMemo(() => {
// //     return documents.filter((doc) => {
// //       const matchesSearch =
// //         searchQuery === "" ||
// //         doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         (doc.path && doc.path.toLowerCase().includes(searchQuery.toLowerCase()))

// //       // If no filters are selected, show all documents
// //       if (!filters.draft && !filters.published && !filters.archived) {
// //         return matchesSearch
// //       }

// //       // Otherwise, apply filters
// //       const matchesFilter =
// //         (filters.draft && doc.status === "Draft") ||
// //         (filters.published && doc.status === "Published") ||
// //         (filters.archived && doc.status === "Archived")

// //       return matchesSearch && matchesFilter
// //     })
// //   }, [documents, searchQuery, filters])

// //   // Organize documents into a hierarchical structure
// //   const organizedDocuments = useMemo(() => {
// //     // Create a map for quick lookup
// //     const docMap = new Map<string, Document>()
// //     filteredDocuments.forEach((doc) => {
// //       docMap.set(doc.id, { ...doc })
// //     })

// //     // Get top-level documents (no parent)
// //     const topLevel = filteredDocuments.filter((doc) => !doc.parentId)

// //     // Sort: folders first, then by name
// //     return topLevel.sort((a, b) => {
// //       if (a.isFolder && !b.isFolder) return -1
// //       if (!a.isFolder && b.isFolder) return 1
// //       return a.name.localeCompare(b.name)
// //     })
// //   }, [filteredDocuments])

// //   const handleSelectAll = (checked: boolean) => {
// //     if (checked) {
// //       // Only select visible documents
// //       const visibleDocIds = getVisibleDocumentIds()
// //       setSelectedDocs(visibleDocIds)
// //     } else {
// //       setSelectedDocs([])
// //     }
// //   }

// //   // Helper to get all currently visible document IDs (based on expanded state)
// //   const getVisibleDocumentIds = () => {
// //     const visibleIds: string[] = []

// //     const addVisibleDocuments = (docs: Document[]) => {
// //       for (const doc of docs) {
// //         visibleIds.push(doc.id)

// //         // If this is an expanded folder, add its children
// //         if (doc.isFolder && expandedFolders.has(doc.id) && doc.children?.length) {
// //           const children = doc.children.map((id) => documents.find((d) => d.id === id)).filter(Boolean) as Document[]

// //           addVisibleDocuments(children)
// //         }
// //       }
// //     }

// //     addVisibleDocuments(organizedDocuments)
// //     return visibleIds
// //   }

// //   const handleSelectDoc = (docId: string, checked: boolean) => {
// //     if (checked) {
// //       setSelectedDocs([...selectedDocs, docId])
// //     } else {
// //       setSelectedDocs(selectedDocs.filter((id) => id !== docId))
// //     }
// //   }

// //   const toggleFolder = (folderId: string) => {
// //     setExpandedFolders((prev) => {
// //       const newSet = new Set(prev)
// //       if (newSet.has(folderId)) {
// //         newSet.delete(folderId)
// //       } else {
// //         newSet.add(folderId)
// //       }
// //       return newSet
// //     })
// //   }

// //   const handleDownload = (docId?: string) => {
// //     const docsToDownload = docId ? [docId] : selectedDocs
// //     toast({
// //       title: "Download started",
// //       description: `Downloading ${docsToDownload.length} document(s)`,
// //     })
// //   }

// //   const handleArchive = () => {
// //     toast({
// //       title: "Documents archived",
// //       description: `${selectedDocs.length} document(s) have been archived`,
// //     })
// //     setSelectedDocs([])
// //   }

// //   const handleDelete = (docId?: string) => {
// //     const docsToDelete = docId ? [docId] : selectedDocs
// //     toast({
// //       title: "Documents deleted",
// //       description: `${docsToDelete.length} document(s) have been deleted`,
// //       variant: "destructive",
// //     })
// //     setSelectedDocs([])
// //   }

// //   const handleEdit = (docId: string) => {
// //     toast({
// //       title: "Edit document",
// //       description: `Editing document ${docId}`,
// //     })
// //   }

// //   const resetFilters = () => {
// //     setFilters({
// //       draft: false,
// //       published: false,
// //       archived: false,
// //     })
// //   }

// //   const applyFilters = () => {
// //     toast({
// //       title: "Filters applied",
// //       description: "Document filters have been applied",
// //     })
// //   }

// //   const handleUploadComplete = (files: UploadedFile[]) => {
// //     // Process uploaded files and their folder structure
// //     const newDocuments: Document[] = []
// //     const folderMap = new Map<string, Document>()

// //     // First, create all the folders
// //     files.forEach((file) => {
// //       if (file.path && file.path.includes("/")) {
// //         const pathParts = file.path.split("/")
// //         let currentPath = ""

// //         // Create each folder in the path if it doesn't exist
// //         for (let i = 0; i < pathParts.length - 1; i++) {
// //           const folderName = pathParts[i]
// //           const prevPath = currentPath
// //           currentPath = currentPath ? `${currentPath}/${folderName}` : folderName

// //           // Skip if we already processed this folder
// //           if (folderMap.has(currentPath)) continue

// //           // Create a new folder document
// //           const folderId = `folder-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
// //           const folderDoc: Document = {
// //             id: folderId,
// //             name: folderName,
// //             recipient: "System",
// //             dateCreated: new Date().toLocaleDateString(),
// //             status: "N/A",
// //             modified: "Just now",
// //             tag: "Folder",
// //             path: currentPath,
// //             isFolder: true,
// //             parentId: prevPath ? folderMap.get(prevPath)?.id || null : null,
// //             children: [],
// //           }

// //           folderMap.set(currentPath, folderDoc)
// //           newDocuments.push(folderDoc)

// //           // Add this folder as a child of its parent
// //           if (prevPath && folderMap.has(prevPath)) {
// //             const parent = folderMap.get(prevPath)!
// //             if (!parent.children) parent.children = []
// //             parent.children.push(folderId)
// //           }
// //         }
// //       }
// //     })

// //     // Now process the files
// //     files.forEach((file) => {
// //       if (file?.isFolder) return // Skip folder entries, we already created them

// //       const fileDoc: Document = {
// //         id: file.id,
// //         name: file?.name,
// //         recipient: "Current User",
// //         dateCreated: new Date().toLocaleDateString(),
// //         status: "Draft",
// //         modified: "Just now",
// //         tag: "New",
// //         path: file.path || null,
// //         isFolder: false,
// //         parentId: null,
// //       }

// //       // If this file is part of a folder structure
// //       if (file.path && file.path.includes("/")) {
// //         const pathParts = file.path.split("/")
// //         const folderPath = pathParts.slice(0, -1).join("/")

// //         if (folderMap.has(folderPath)) {
// //           const parentFolder = folderMap.get(folderPath)!
// //           fileDoc.parentId = parentFolder.id

// //           // Add this file as a child of its parent folder
// //           if (!parentFolder.children) parentFolder.children = []
// //           parentFolder.children.push(file.id)
// //         }
// //       }

// //       newDocuments.push(fileDoc)
// //     })

// //     // Add all new documents to the existing ones
// //     setDocuments((prev) => [...newDocuments, ...prev])

// //     // Auto-expand top-level folders
// //     const topLevelFolders = newDocuments.filter((doc) => doc.isFolder && !doc.parentId)
// //     const newExpandedFolders = new Set(expandedFolders)
// //     topLevelFolders.forEach((folder) => {
// //       newExpandedFolders.add(folder.id)
// //     })
// //     setExpandedFolders(newExpandedFolders)

// //     setIsUploadModalOpen(false)
// //   }

// //   // Recursive function to render document rows
// //   const renderDocumentRow = (doc: Document, depth = 0) => {
// //     const isExpanded = doc.isFolder && expandedFolders.has(doc.id)
// //     const hasChildren = doc.isFolder && doc.children && doc.children.length > 0
// //     const childDocs = hasChildren
// //       ? (doc.children!.map((id) => documents.find((d) => d.id === id)).filter(Boolean) as Document[])
// //       : []

// //     // Sort children: folders first, then by name
// //     const sortedChildren = childDocs.sort((a, b) => {
// //       if (a.isFolder && !b.isFolder) return -1
// //       if (!a.isFolder && b.isFolder) return 1
// //       return a.name.localeCompare(b.name)
// //     })

// //     return (
// //       <>
// //         <tr key={doc.id} className={cn("border-b border-[#dddddd] hover:bg-gray-50", depth > 0 && "bg-gray-50")}>
// //           <td className="px-4 py-3">
// //             <Checkbox
// //               checked={selectedDocs.includes(doc.id)}
// //               onCheckedChange={(checked) => handleSelectDoc(doc.id, checked as boolean)}
// //             />
// //           </td>
// //           <td className="px-4 py-3">
// //             {doc.isFolder ? (
// //               <button
// //                 onClick={() => toggleFolder(doc.id)}
// //                 className={cn("flex items-center justify-center", !hasChildren && "opacity-50 cursor-default")}
// //                 disabled={!hasChildren}
// //               >
// //                 {hasChildren ? (
// //                   isExpanded ? (
// //                     <ChevronDown className="h-4 w-4 text-gray-500" />
// //                   ) : (
// //                     <ChevronRight className="h-4 w-4 text-gray-500" />
// //                   )
// //                 ) : (
// //                   <Folder className="h-4 w-4 text-gray-500" />
// //                 )}
// //               </button>
// //             ) : (
// //               <LinkIcon className="h-4 w-4 text-gray-400" />
// //             )}
// //           </td>
// //           <td className={cn("px-4 py-3", depth > 0 && `pl-${4 + depth * 6}`)}>
// //             <div className="flex items-center">
// //               {doc.isFolder ? (
// //                 <Folder className="h-4 w-4 text-[#ff6a00] mr-2" />
// //               ) : (
// //                 <FileIcon className="h-4 w-4 text-gray-500 mr-2" />
// //               )}
// //               <div>
// //                 <span className="text-sm">{doc.name}</span>
// //                 {!doc.isFolder && (
// //                   <div className="mt-1">
// //                     <span className="inline-block px-2 py-0.5 bg-[#ff6a00] text-white text-xs rounded-md">
// //                       {doc.tag}
// //                     </span>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </td>
// //           <td className="px-4 py-3">
// //             <span className="text-sm">{doc.isFolder ? "-" : doc.recipient}</span>
// //           </td>
// //           <td className="px-4 py-3">
// //             <span className="text-sm">{doc.dateCreated}</span>
// //           </td>
// //           <td className="px-4 py-3">
// //             {doc.isFolder ? (
// //               <span className="text-sm">-</span>
// //             ) : (
// //               <div className="flex items-center gap-2">
// //                 <div className="w-2 h-2 rounded-full bg-gray-300"></div>
// //                 <span className="text-sm">{doc.status}</span>
// //               </div>
// //             )}
// //           </td>
// //           <td className="px-4 py-3">
// //             <span className="text-sm">{doc.modified}</span>
// //           </td>
// //           <td className="px-4 py-3">
// //             <div className="flex items-center justify-center gap-2">
// //               {!doc.isFolder && (
// //                 <button
// //                   className="p-1 hover:bg-gray-100 rounded-md"
// //                   onClick={() => handleDownload(doc.id)}
// //                   aria-label="Download"
// //                 >
// //                   <Download className="h-5 w-5 text-gray-500" />
// //                 </button>
// //               )}
// //               {!doc.isFolder && (
// //                 <button
// //                   className="p-1 hover:bg-gray-100 rounded-md"
// //                   onClick={() => handleEdit(doc.id)}
// //                   aria-label="Edit"
// //                 >
// //                   <Edit className="h-5 w-5 text-gray-500" />
// //                 </button>
// //               )}
// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <button className="p-1 hover:bg-gray-100 rounded-md" aria-label="More options">
// //                     <MoreHorizontal className="h-5 w-5 text-gray-500" />
// //                   </button>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent align="end">
// //                   {!doc.isFolder && (
// //                     <DropdownMenuItem onClick={() => handleDownload(doc.id)}>
// //                       <Download className="mr-2 h-4 w-4" />
// //                       <span>Download</span>
// //                     </DropdownMenuItem>
// //                   )}
// //                   {!doc.isFolder && (
// //                     <DropdownMenuItem onClick={() => handleEdit(doc.id)}>
// //                       <Edit className="mr-2 h-4 w-4" />
// //                       <span>Edit</span>
// //                     </DropdownMenuItem>
// //                   )}
// //                   <DropdownMenuItem onClick={handleArchive}>
// //                     <ArchiveIcon className="mr-2 h-4 w-4" />
// //                     <span>Archive</span>
// //                   </DropdownMenuItem>
// //                   <DropdownMenuItem onClick={() => handleDelete(doc.id)} className="text-red-500 focus:text-red-500">
// //                     <Trash className="mr-2 h-4 w-4" />
// //                     <span>Delete</span>
// //                   </DropdownMenuItem>
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             </div>
// //           </td>
// //         </tr>

// //         {/* Render children if folder is expanded */}
// //         {doc.isFolder && isExpanded && sortedChildren.length > 0 && (
// //           <>{sortedChildren.map((child) => renderDocumentRow(child, depth + 1))}</>
// //         )}
// //       </>
// //     )
// //   }

// //   return (
// //     <div className="bg-white rounded-lg shadow-sm">
// //       <div className="mb-4">
// //         <h2 className="text-2xl font-bold mb-4">Company Wall</h2>
// //         <div className="flex justify-between items-center mb-4">
// //           <div className="flex items-center gap-2">
// //             <Checkbox
// //               id="select-all"
// //               checked={selectedDocs.length > 0 && selectedDocs.length === getVisibleDocumentIds().length}
// //               onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
// //             />
// //             <label htmlFor="select-all" className="text-sm">
// //               Select All
// //             </label>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <div className="relative">
// //               <input
// //                 type="text"
// //                 placeholder="Search"
// //                 className="pl-8 pr-4 py-2 border rounded-md text-sm w-[250px]"
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //               />
// //               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
// //             </div>

// //             <Button
// //               variant="outline"
// //               className="bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white border-none"
// //               onClick={() => setIsUploadModalOpen(true)}
// //             >
// //               <Upload className="mr-2 h-4 w-4" />
// //               Upload
// //             </Button>

// //             <Popover>
// //               <PopoverTrigger asChild>
// //                 <Button variant="outline" className="bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white border-none">
// //                   <SlidersHorizontal className="mr-2 h-4 w-4" />
// //                   Filter
// //                 </Button>
// //               </PopoverTrigger>
// //               <PopoverContent className="w-80">
// //                 <div className="space-y-4">
// //                   <h3 className="font-medium">Filter Documents</h3>
// //                   <div className="space-y-2">
// //                     <div className="flex items-center gap-2">
// //                       <Checkbox
// //                         id="filter-draft"
// //                         checked={filters.draft}
// //                         onCheckedChange={(checked) => setFilters({ ...filters, draft: checked as boolean })}
// //                       />
// //                       <label htmlFor="filter-draft">Draft</label>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       <Checkbox
// //                         id="filter-published"
// //                         checked={filters.published}
// //                         onCheckedChange={(checked) => setFilters({ ...filters, published: checked as boolean })}
// //                       />
// //                       <label htmlFor="filter-published">Published</label>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       <Checkbox
// //                         id="filter-archived"
// //                         checked={filters.archived}
// //                         onCheckedChange={(checked) => setFilters({ ...filters, archived: checked as boolean })}
// //                       />
// //                       <label htmlFor="filter-archived">Archived</label>
// //                     </div>
// //                   </div>
// //                   <div className="flex justify-end gap-2">
// //                     <Button variant="outline" size="sm" onClick={resetFilters}>
// //                       Reset
// //                     </Button>
// //                     <Button size="sm" onClick={applyFilters}>
// //                       Apply
// //                     </Button>
// //                   </div>
// //                 </div>
// //               </PopoverContent>
// //             </Popover>

// //             <Popover>
// //               <PopoverTrigger asChild>
// //                 <Button
// //                   variant="outline"
// //                   className={cn(
// //                     "bg-[#ff6a00] hover:bg-[#ff6a00]/90 text-white border-none",
// //                     selectedDocs.length === 0 && "opacity-50 cursor-not-allowed",
// //                   )}
// //                   disabled={selectedDocs.length === 0}
// //                 >
// //                   Actions
// //                 </Button>
// //               </PopoverTrigger>
// //               <PopoverContent className="w-56">
// //                 <div className="space-y-1">
// //                   <button
// //                     className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md"
// //                     onClick={() => handleDownload()}
// //                   >
// //                     <Download className="h-4 w-4" />
// //                     Download
// //                   </button>
// //                   <button
// //                     className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md"
// //                     onClick={handleArchive}
// //                   >
// //                     <ArchiveIcon className="h-4 w-4" />
// //                     Archive
// //                   </button>
// //                   <button
// //                     className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md text-red-500"
// //                     onClick={() => handleDelete()}
// //                   >
// //                     <Trash className="h-4 w-4" />
// //                     Delete
// //                   </button>
// //                 </div>
// //               </PopoverContent>
// //             </Popover>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="overflow-x-auto">
// //         <table className="w-full">
// //           <thead>
// //             <tr className="border-b border-[#dddddd]">
// //               <th className="px-4 py-3 text-left font-medium text-sm w-10"></th>
// //               <th className="px-4 py-3 text-left font-medium text-sm w-10"></th>
// //               <th className="px-4 py-3 text-left font-medium text-sm">Document Name</th>
// //               <th className="px-4 py-3 text-left font-medium text-sm">Recipient</th>
// //               <th className="px-4 py-3 text-left font-medium text-sm">Date Created</th>
// //               <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
// //               <th className="px-4 py-3 text-left font-medium text-sm">Modified</th>
// //               <th className="px-4 py-3 text-center font-medium text-sm w-[120px]">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {organizedDocuments.length > 0 ? (
// //               organizedDocuments.map((doc) => renderDocumentRow(doc))
// //             ) : (
// //               <tr>
// //                 <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
// //                   No documents found. Upload some files to get started.
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //       <UploadModal
// //         isOpen={isUploadModalOpen}
// //         onClose={() => setIsUploadModalOpen(false)}
// //         onUploadComplete={handleUploadComplete}
// //       />
// //     </div>
// //   )
// // }

// "use client";

// import { useState } from "react";
// import { Download, Trash, FileIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { deleteFile, FileItem } from "@lib/supabase";

// interface DocumentsTableProps {
//   documents: FileItem[];
//   isLoading: boolean;
//   onRefresh: () => void;
// }

// export function DocumentsTable({
//   documents = [],
//   isLoading,
//   onRefresh,
// }: DocumentsTableProps) {
//   const { toast } = useToast();
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const handleDownload = (doc: FileItem) => {
//     window.open(doc.url, "_blank");
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       setDeletingId(id);
//       await deleteFile(id);
//       toast({
//         title: "File deleted",
//         description: "The file has been deleted successfully",
//       });
//       onRefresh();
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast({
//         title: "Delete failed",
//         description: error instanceof Error ? error.message : "Unknown error",
//         variant: "destructive",
//       });
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return (
//       Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//     );
//   };

//   if (isLoading) {
//     return <div className="text-center py-8">Loading files...</div>;
//   }

//   if (documents.length === 0) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         No files found. Upload some files to get started.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead>
//           <tr className="border-b">
//             <th className="px-4 py-3 text-left font-medium text-sm">Name</th>
//             <th className="px-4 py-3 text-left font-medium text-sm">Type</th>
//             <th className="px-4 py-3 text-left font-medium text-sm">Size</th>
//             <th className="px-4 py-3 text-left font-medium text-sm">
//               Uploader
//             </th>
//             <th className="px-4 py-3 text-left font-medium text-sm">Date</th>
//             <th className="px-4 py-3 text-center font-medium text-sm">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {documents.map((doc) => (
//             <tr key={doc.id} className="border-b hover:bg-gray-50">
//               <td className="px-4 py-3">
//                 <div className="flex items-center">
//                   <FileIcon className="h-4 w-4 text-gray-500 mr-2" />
//                   <span className="text-sm truncate max-w-[200px]">
//                     {doc.name}
//                   </span>
//                 </div>
//               </td>
//               <td className="px-4 py-3">
//                 <span className="text-xs bg-[#ff6a00] text-white px-2 py-1 rounded">
//                   {doc.mime_type.split("/")[1]?.toUpperCase() || doc.mime_type}
//                 </span>
//               </td>
//               <td className="px-4 py-3">
//                 <span className="text-sm">{formatFileSize(doc.size)}</span>
//               </td>
//               <td className="px-4 py-3">
//                 <span className="text-sm">
//                   {doc.users?.username || "Unknown"}
//                 </span>
//               </td>
//               <td className="px-4 py-3">
//                 <span className="text-sm">{formatDate(doc.uploaded_at)}</span>
//               </td>
//               <td className="px-4 py-3">
//                 <div className="flex items-center justify-center gap-2">
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => handleDownload(doc)}
//                   >
//                     <Download className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => handleDelete(doc.id)}
//                     disabled={deletingId === doc.id}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <Trash className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  Download,
  Trash,
  FileIcon,
  ImageIcon,
  FileText,
  Video,
  Music,
  Table2,
  File,
  PanelTop,
  Eye,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deleteFile, type FileItem, getFileIcon } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { FilePreview } from "./file-preview";

interface DocumentsTableProps {
  documents: FileItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function DocumentsTable({
  documents = [],
  isLoading,
  onRefresh,
}: DocumentsTableProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = (doc: FileItem) => {
    window.open(doc.url, "_blank");
  };

  const handlePreview = (doc: FileItem) => {
    setPreviewFile(doc);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteFile(id);
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
      });
      onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileTypeIcon = (mimeType: string) => {
    const iconType = getFileIcon(mimeType);

    switch (iconType) {
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "file-text":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "music":
        return <Music className="h-5 w-5" />;
      case "table":
        return <Table2 className="h-5 w-5" />;
      case "presentation":
        return <PanelTop className="h-5 w-5" />;
      default:
        return <FileIcon className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <File className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No files found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Upload some files to get started. Your files will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-md">
                {getFileTypeIcon(doc.mime_type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium truncate">{doc.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {doc.mime_type.split("/")[1]?.toUpperCase() ||
                      doc.mime_type}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{formatDate(doc.uploaded_at)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-[8px]">
                        {doc.users?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{doc.users?.username || "Unknown"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreview(doc)}
                  aria-label="Preview file"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(doc)}
                  aria-label="Download file"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePreview(doc)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="text-destructive focus:text-destructive"
                    >
                      {deletingId === doc.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <FilePreview
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
