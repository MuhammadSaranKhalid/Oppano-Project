// // "use client";

// // import { useState } from "react";
// // import { useList } from "@refinedev/core";
// // import { DocumentsTable } from "@/components/files/documents-table";
// // import { UploadModal } from "@/components/files/upload-modal";
// // import { Button } from "@/components/ui/button";
// // import { Upload, Search } from "lucide-react";
// // import { Input } from "@/components/ui/input";
// // import { useToast } from "@/components/ui/use-toast";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { useSupabaseClient } from "@supabase/auth-helpers-react";

// // export default function FilesPage() {
// //   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [activeTab, setActiveTab] = useState("all");
// //   const { toast } = useToast();
// //   const supabase = useSupabaseClient();

// //   // Fetch files from Supabase using Refine's useList hook
// //   const { data, isLoading, refetch } = useList({
// //     resource: "file_uploads",
// //     filters: [
// //       {
// //         field: "is_archived",
// //         operator: "eq",
// //         value: activeTab === "archived" ? true : false,
// //       },
// //       // ...(searchQuery
// //       //   ? [
// //       //       {
// //       //         field: "name",
// //       //         operator: "contains",
// //       //         value: searchQuery,
// //       //       },
// //       //     ]
// //       //   : []),
// //     ],
// //     sorters: [
// //       {
// //         field: "created_at",
// //         order: "desc",
// //       },
// //     ],
// //     pagination: {
// //       pageSize: 50,
// //     },
// //     meta: {
// //       select: "*, user_profiles(username, avatar_url)",
// //     },
// //   });

// //   const handleUploadComplete = async (files: any) => {
// //     toast({
// //       title: "Upload Complete",
// //       description: `Successfully uploaded ${files.length} file(s)`,
// //     });
// //     refetch();
// //     setIsUploadModalOpen(false);
// //   };

// //   return (
// //     <div className="container mx-auto py-6 space-y-6">
// //       <div className="flex justify-between items-center">
// //         <h1 className="text-2xl font-bold">Files</h1>
// //         {/* Using Shadcn Button with Lucide icon for upload action */}
// //         <Button onClick={() => setIsUploadModalOpen(true)}>
// //           <Upload className="mr-2 h-4 w-4" />
// //           Upload Files
// //         </Button>
// //       </div>

// //       <div className="flex items-center space-x-4">
// //         <div className="relative flex-1">
// //           {/* Search input with icon using Shadcn Input component */}
// //           <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
// //           <Input
// //             type="text"
// //             placeholder="Search files..."
// //             className="pl-8"
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //           />
// //         </div>
// //       </div>

// //       {/* Tabs for filtering files using Shadcn Tabs component */}
// //       <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
// //         <TabsList>
// //           <TabsTrigger value="all">All Files</TabsTrigger>
// //           <TabsTrigger value="recent">Recent</TabsTrigger>
// //           <TabsTrigger value="shared">Shared with me</TabsTrigger>
// //           <TabsTrigger value="archived">Archived</TabsTrigger>
// //         </TabsList>
// //         <TabsContent value="all" className="mt-6">
// //           <DocumentsTable
// //             // documents={data?.data || []}
// //             // isLoading={isLoading}
// //             // onRefresh={refetch}
// //           />
// //         </TabsContent>
// //         <TabsContent value="recent" className="mt-6">
// //           <DocumentsTable
// //             // documents={(data?.data || []).slice(0, 10)}
// //             // isLoading={isLoading}
// //             // onRefresh={refetch}
// //           />
// //         </TabsContent>
// //         <TabsContent value="shared" className="mt-6">
// //           <DocumentsTable
// //             // documents={[]}
// //             // isLoading={isLoading}
// //             // onRefresh={refetch}
// //           />
// //         </TabsContent>
// //         <TabsContent value="archived" className="mt-6">
// //           <DocumentsTable
// //             // documents={data?.data || []}
// //             // isLoading={isLoading}
// //             // onRefresh={refetch}
// //           />
// //         </TabsContent>
// //       </Tabs>

// //       {/* Modal for file uploads */}
// //       <UploadModal
// //         isOpen={isUploadModalOpen}
// //         onClose={() => setIsUploadModalOpen(false)}
// //         onUploadComplete={handleUploadComplete}
// //       />
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { DocumentsTable } from "@/components/files/documents-table";
// import { UploadModal } from "@/components/files/upload-modal";
// import { Button } from "@/components/ui/button";
// import { Upload } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// // import { QueryClientProvider } from "@/providers/query-client-provider";
// import { getFiles, type FileItem } from "@/lib/supabase";

// function FilesPageContent() {
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [documents, setDocuments] = useState<FileItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();

//   const fetchFiles = async () => {
//     setIsLoading(true);
//     try {
//       const files = await getFiles();
//       setDocuments(files);
//     } catch (error) {
//       console.error("Error fetching files:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load files",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Files</h1>
//         <Button onClick={() => setIsUploadModalOpen(true)}>
//           <Upload className="mr-2 h-4 w-4" />
//           Upload Files
//         </Button>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <DocumentsTable
//           documents={documents}
//           isLoading={isLoading}
//           onRefresh={fetchFiles}
//         />
//       </div>

//       <UploadModal
//         isOpen={isUploadModalOpen}
//         onClose={() => setIsUploadModalOpen(false)}
//         onUploadComplete={fetchFiles}
//       />
//     </div>
//   );
// }

// // Wrap with QueryClientProvider to fix the React Query error
// export default function FilesPage() {
//   return (
//     // <QueryClientProvider>
//       <FilesPageContent />
//     // </QueryClientProvider>
//   );
// }

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DocumentsTable } from "@/components/files/documents-table";
import { UploadModal } from "@/components/files/upload-modal";
import { Button } from "@/components/ui/button";
import { Upload, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
// import { QueryClientProvider } from "@/providers/query-client-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileItem, getFiles } from "@lib/supabase";

function FilesPageContent() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const files = await getFiles();
      setDocuments(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to load files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Filter documents based on search query and active tab
  const filteredDocuments = documents
    .filter(
      (doc) =>
        searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.mime_type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((doc) => {
      if (activeTab === "all") return true;
      if (activeTab === "images") return doc.mime_type.startsWith("image/");
      if (activeTab === "documents")
        return (
          doc.mime_type.includes("document") || doc.mime_type.includes("pdf")
        );
      if (activeTab === "media")
        return (
          doc.mime_type.startsWith("video/") ||
          doc.mime_type.startsWith("audio/")
        );
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime()
        );
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "size-asc") return a.size - b.size;
      if (sortBy === "size-desc") return b.size - a.size;
      return 0;
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filteredDocuments variable
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">
            Manage and organize your organization's files
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} size="lg">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>File Management</CardTitle>
          <CardDescription>
            Browse, search, and manage your organization's files. Files are only
            accessible to members of your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search files by name or type..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="size-asc">
                    Size (smallest first)
                  </SelectItem>
                  <SelectItem value="size-desc">
                    Size (largest first)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Files</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <DocumentsTable
                documents={filteredDocuments}
                isLoading={isLoading}
                onRefresh={fetchFiles}
              />
            </TabsContent>
            <TabsContent value="images" className="mt-0">
              <DocumentsTable
                documents={filteredDocuments}
                isLoading={isLoading}
                onRefresh={fetchFiles}
              />
            </TabsContent>
            <TabsContent value="documents" className="mt-0">
              <DocumentsTable
                documents={filteredDocuments}
                isLoading={isLoading}
                onRefresh={fetchFiles}
              />
            </TabsContent>
            <TabsContent value="media" className="mt-0">
              <DocumentsTable
                documents={filteredDocuments}
                isLoading={isLoading}
                onRefresh={fetchFiles}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={fetchFiles}
      />
    </div>
  );
}

// Wrap with QueryClientProvider to fix the React Query error
export default function FilesPage() {
  return (
    // <QueryClientProvider>
      <FilesPageContent />
    // </QueryClientProvider>
  );
}
