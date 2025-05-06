"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isPreviewable } from "@/lib/supabase";
import type { FileItem } from "@/lib/supabase";

interface FilePreviewProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");

  if (!file) return null;

  const canPreview = isPreviewable(file.mime_type);
  const isImage = file.mime_type.startsWith("image/");
  const isPdf = file.mime_type === "application/pdf";
  const isVideo = file.mime_type.startsWith("video/");
  const isAudio = file.mime_type.startsWith("audio/");
  const isText = file.mime_type.startsWith("text/");

  const handleDownload = () => {
    window.open(file.url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="truncate max-w-[600px]">
            {file.name}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs
          defaultValue="preview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 min-h-0"
        >
          <TabsList>
            <TabsTrigger value="preview" disabled={!canPreview}>
              Preview
            </TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent
            value="preview"
            className="flex-1 overflow-auto p-4 bg-gray-50 rounded-md"
          >
            {canPreview ? (
              <div className="flex items-center justify-center h-full">
                {isImage && (
                  <img
                    src={file.url || "/placeholder.svg"}
                    alt={file.name}
                    className="max-w-full max-h-[600px] object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/abstract-geometric-shapes.png";
                    }}
                  />
                )}
                {isPdf && (
                  <iframe
                    src={`${file.url}#toolbar=0&navpanes=0`}
                    className="w-full h-[600px]"
                    title={file.name}
                  ></iframe>
                )}
                {isVideo && (
                  <video controls className="max-w-full max-h-[600px]">
                    <source src={file.url} type={file.mime_type} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {isAudio && (
                  <audio controls className="w-full">
                    <source src={file.url} type={file.mime_type} />
                    Your browser does not support the audio tag.
                  </audio>
                )}
                {isText && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-4">
                      Text preview is not available directly.
                    </p>
                    <Button onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download to view
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 mb-4">
                  Preview not available for this file type.
                </p>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download to view
                </Button>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => window.open(file.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in new tab
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="details" className="p-4 bg-gray-50 rounded-md">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">File Name</h3>
                <p className="text-sm">{file.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">File Type</h3>
                <p className="text-sm">{file.mime_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">File Size</h3>
                <p className="text-sm">{formatFileSize(file.size)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Uploaded By
                </h3>
                <p className="text-sm">{file.users?.username || "Unknown"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Upload Date
                </h3>
                <p className="text-sm">
                  {new Date(file.uploaded_at).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Last Modified
                </h3>
                <p className="text-sm">
                  {new Date(file.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
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
