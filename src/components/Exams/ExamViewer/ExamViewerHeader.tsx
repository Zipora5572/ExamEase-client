"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Save,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Mail,
  User,
  Calendar,
  RefreshCw,
  Settings,
  Download,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
  toggleSettingsPanel: () => void
  saveAnnotatedExam: () => void
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
  toggleSettingsPanel,
  saveAnnotatedExam,
}: ExamViewerHeaderProps) => {
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5))
  }

  // const handleSave = async () => {
  //   setIsSaving(true)
  //   try {
  //     // Simulate saving
  //     await new Promise((resolve) => setTimeout(resolve, 1000))
  //     // Here you would save the grade, evaluation, and marked answers

      
  //   } catch (error) {
  //     console.error("Error saving:", error)
   
  //   } finally {
  //     setIsSaving(false)
  //   }
  // }

  // Format date if available
  const formatDate = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div className="border-b border-gray-200 py-4 px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleGoBack} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">{exam?.name || "Exam Viewer"}</h1>
              {exam?.status && (
                <Badge
                  className={`${
                    exam.status === "graded"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                  }`}
                >
                  {exam.status === "graded" ? "Graded" : exam.status}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1 gap-4">
              <div className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span className="font-medium">
                  {exam?.student?.firstName} {exam?.student?.lastName}
                </span>
              </div>
              {exam?.student?.email && (
                <div className="flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">{exam?.student?.email}</span>
                </div>
              )}
              {exam?.submittedAt && (
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">{formatDate(exam.submittedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-md shadow-sm">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 rounded-r-none">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-2 text-sm font-medium border-l border-r border-gray-200 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </div>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 rounded-l-none">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="icon" onClick={resetView} title="Reset View" className="h-8 w-8 rounded-full">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSettingsPanel}
            title="Grading Settings"
            className="h-8 w-8 rounded-full"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsShareDialogOpen(true)}
            className="h-8 w-8 rounded-full"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Force a re-render of the canvas
              resetView()
              // Force window resize event to trigger container size update
              window.dispatchEvent(new Event("resize"))
            }}
            className="hidden md:flex"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh View
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={saveAnnotatedExam}
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Save Exam
          </Button>

        
        </div>
      </div>
    </div>
  )
}

export default ExamViewerHeader
