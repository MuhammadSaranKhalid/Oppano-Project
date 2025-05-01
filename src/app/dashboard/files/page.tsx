// import { DocumentsTable } from "@/components/files/documents-table"

// export default function FilesPage() {
//   return (
//     <div className="flex h-full flex-col">
//       <div className="border-b p-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-medium">Dashboard</h2>
//           <span className="text-sm text-muted-foreground">Documents</span>
//         </div>
//       </div>
//       <main className="flex-1 overflow-auto">
//         <div className="p-6">
//           <DocumentsTable />
//         </div>
//       </main>
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import { useList } from "@refinedev/core";
import { DocumentsTable } from "@/components/files/documents-table";
import { UploadModal } from "@/components/files/upload-modal";
import { Button } from "@/components/ui/button";
import { Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

/**
 * Files Page Component
 *
 * This component displays a file management interface using Shadcn UI components.
 * It allows users to view, search, filter, and upload files stored in Supabase.
 */
export default function FilesPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const supabase = useSupabaseClient();

  // Fetch files from Supabase using Refine's useList hook
  const { data, isLoading, refetch } = useList({
    resource: "file_uploads",
    filters: [
      {
        field: "is_archived",
        operator: "eq",
        value: activeTab === "archived" ? true : false,
      },
      // ...(searchQuery
      //   ? [
      //       {
      //         field: "name",
      //         operator: "contains",
      //         value: searchQuery,
      //       },
      //     ]
      //   : []),
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
    pagination: {
      pageSize: 50,
    },
    meta: {
      select: "*, user_profiles(username, avatar_url)",
    },
  });

  const handleUploadComplete = async (files) => {
    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${files.length} file(s)`,
    });
    refetch();
    setIsUploadModalOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Files</h1>
        {/* Using Shadcn Button with Lucide icon for upload action */}
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          {/* Search input with icon using Shadcn Input component */}
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search files..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs for filtering files using Shadcn Tabs component */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared with me</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <DocumentsTable
            documents={data?.data || []}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <DocumentsTable
            documents={(data?.data || []).slice(0, 10)}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </TabsContent>
        <TabsContent value="shared" className="mt-6">
          <DocumentsTable
            documents={[]}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </TabsContent>
        <TabsContent value="archived" className="mt-6">
          <DocumentsTable
            documents={data?.data || []}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </TabsContent>
      </Tabs>

      {/* Modal for file uploads */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
