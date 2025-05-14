"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Share2, ZoomIn, ZoomOut, RotateCcw, Mail } from "lucide-react"

interface ExamViewerHeaderProps {
  exam: any
  handleGoBack: () => void
  zoom: number
  setZoom: (zoom: number) => void
  isShareDialogOpen: boolean
  setIsShareDialogOpen: (isOpen: boolean) => void
  isSaving: boolean
  setIsSaving: (isSaving: boolean) => void
  grade: number
  evaluation: string
  resetView: () => void
}

const ExamViewerHeader = ({
  exam,
  handleGoBack,
  zoom,
  setZoom,
  setIsShareDialogOpen,
  isSaving,
  setIsSaving,
  grade,
  evaluation,
  resetView,
}: ExamViewerHeaderProps) => {
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate saving
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Here you would save the grade, evaluation, and marked answers
      console.log("Saved:", { grade, evaluation })
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{exam?.name || "Exam Viewer"}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <span className="font-medium">
                {exam?.student?.firstName} {exam?.student?.lastName}
              </span>
              {exam?.student?.email && (
                <div className="flex items-center ml-3">
                  <Mail className="h-3 w-3 mr-1" />
                  <span className="text-xs">{exam?.student?.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-gray-200 rounded-md">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 rounded-r-none">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-2 text-sm font-medium border-l border-r border-gray-200">{Math.round(zoom * 100)}%</div>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 rounded-l-none">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="icon" onClick={resetView} title="Reset View">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => setIsShareDialogOpen(true)}>
            <Share2 className="h-4 w-4" />
          </Button>

          <Button onClick={handleSave} disabled={isSaving} className="bg-red-600 hover:bg-red-700">
            {isSaving ? "Saving..." : "Save"}
            {!isSaving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExamViewerHeader
