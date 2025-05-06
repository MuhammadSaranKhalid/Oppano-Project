// // // "use client"

// // // import { useState } from "react"
// // // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // // import { Button } from "@/components/ui/button"
// // // import { FileUpload, type UploadedFile } from "./file-upload"

// // // interface UploadModalProps {
// // //   isOpen: boolean
// // //   onClose: () => void
// // //   onUploadComplete: (files: UploadedFile[]) => void
// // // }

// // // export function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
// // //   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

// // //   const handleUploadComplete = (files: UploadedFile[]) => {
// // //     setUploadedFiles(files)
// // //     onUploadComplete(files)
// // //   }

// // //   return (
// // //     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
// // //       <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
// // //         <DialogHeader>
// // //           <DialogTitle>Upload Documents</DialogTitle>
// // //         </DialogHeader>
// // //         <div className="py-4">
// // //           <FileUpload onUploadComplete={handleUploadComplete} />
// // //         </div>
// // //         <div className="flex justify-end">
// // //           <Button variant="outline" onClick={onClose}>
// // //             Close
// // //           </Button>
// // //         </div>
// // //       </DialogContent>
// // //     </Dialog>
// // //   )
// // // }

// // "use client";

// // import { useState } from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { FileUpload, type UploadedFile } from "./file-upload";

// // interface UploadModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   orgId?: string; // ← new
// //   onUploadComplete: () => void; // no payload needed
// // }

// // export function UploadModal({
// //   isOpen,
// //   onClose,
// //   orgId,
// //   onUploadComplete,
// // }: UploadModalProps) {
// //   /* keep local preview but delegate Supabase work to <FileUpload>  */
// //   return (
// //     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
// //       <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
// //         <DialogHeader>
// //           <DialogTitle>Upload Documents</DialogTitle>
// //         </DialogHeader>

// //         <FileUpload organizationId={orgId} onComplete={onUploadComplete} />

// //         <div className="flex justify-end pt-4">
// //           <Button variant="outline" onClick={onClose}>
// //             Close
// //           </Button>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { FileUpload } from "./file-upload";

// interface UploadModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onUploadComplete: () => void;
// }

// export function UploadModal({
//   isOpen,
//   onClose,
//   onUploadComplete,
// }: UploadModalProps) {
//   const handleUploadComplete = () => {
//     onUploadComplete();
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Upload Files</DialogTitle>
//         </DialogHeader>
//         <div className="py-4">
//           <FileUpload onUploadComplete={handleUploadComplete} />
//         </div>
//         <div className="flex justify-end">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "./file-upload";
import { X } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadModalProps) {
  const handleUploadComplete = () => {
    onUploadComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Upload files to your organization's storage. Files are only
              accessible to members of your organization.
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="py-4">
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
