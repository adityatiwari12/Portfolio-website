"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"

interface ResumePreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumePreviewModal({ isOpen, onClose }: ResumePreviewModalProps) {
  // Google Drive direct view link (converted from share link)
  const resumeViewUrl = "https://drive.google.com/file/d/1uVHFS_uwAdEtPMGBr2myxVGH-f29HKn3/preview"
  // Direct download link
  const resumeDownloadUrl = "https://drive.google.com/uc?export=download&id=1uVHFS_uwAdEtPMGBr2myxVGH-f29HKn3"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Aditya Tiwari - Resume</DialogTitle>
        </DialogHeader>

        <div className="flex justify-end gap-4 mb-4">
          <Button variant="outline" onClick={() => window.open(resumeViewUrl, "_blank")}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <a href={resumeDownloadUrl} download="AdityaTiwari-Resume.pdf">
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </Button>
        </div>

        <div className="flex-1 min-h-[60vh] border rounded-md overflow-hidden">
          <iframe src={resumeViewUrl} className="w-full h-full" title="Aditya Tiwari Resume" allow="autoplay"></iframe>
        </div>
      </DialogContent>
    </Dialog>
  )
}
