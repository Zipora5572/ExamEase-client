import { useEffect, useState, useRef, useCallback } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../store/store"
import { getStudentExamsByExamId } from "../../../store/studentExamSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ExamViewerCanvas from "./Canvas"
import ExamViewerSidebar from "./ExamViewerSidebar"
import SettingsPanel from "./SettingsPanel"
import ExamViewerHeader from "./ExamViewerHeader" 

const ExamFileViewer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<any>(null) // Add this line
  const [loadingImage, setLoadingImage] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [grade, setGrade] = useState(0)
  const [evaluation, setEvaluation] = useState("")
  const [markedAnswers, setMarkedAnswers] = useState<any[]>([])
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [totalPossiblePoints, setTotalPossiblePoints] = useState(100) // Default total points
  const [questionCount, setQuestionCount] = useState(10) // Default question count
  const [questionWeights, setQuestionWeights] = useState<Record<string, number>>({})
  const [pointsPerQuestion, setPointsPerQuestion] = useState(10) // Default points per question
  const [isLoading, setIsLoading] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { exam } = location.state || {}

  // Create a memoized saveSettingsToLocalStorage function to avoid recreation on every render
  const saveSettingsToLocalStorage = useCallback(() => {
    if (exam?.examId) {
      try {
        const settings = {
          totalPossiblePoints,
          questionCount,
          questionWeights,
          markedAnswers,
          evaluation,
          grade,
          lastSaved: new Date().toISOString(), // Add timestamp for debugging
        }

        // Log for debugging

        localStorage.setItem(`examGradingSettings-${exam.examId}`, JSON.stringify(settings))
      } catch (error) {
        console.error("Error saving settings to localStorage:", error)
      }
    }
  }, [exam?.examId, totalPossiblePoints, questionCount, questionWeights, markedAnswers, evaluation, grade])

  // Load settings from localStorage on component mount - WITH EXAM-SPECIFIC KEY
  useEffect(() => {
    if (exam?.examId) {
      try {
        const savedSettings = localStorage.getItem(`examGradingSettings-${exam.examId}`)

        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings)

            // Set all the state values from saved settings
            setTotalPossiblePoints(settings.totalPossiblePoints || 100)
            setQuestionCount(settings.questionCount || 10)
            setQuestionWeights(settings.questionWeights || {})

            // Also load any saved marks
            if (settings.markedAnswers && Array.isArray(settings.markedAnswers)) {
              setMarkedAnswers(settings.markedAnswers)
            }

            // And evaluation text
            if (settings.evaluation) {
              setEvaluation(settings.evaluation)
            }

            // And grade
            if (typeof settings.grade === "number") {
              setGrade(settings.grade)
            }

            setDataLoaded(true)
          } catch (e) {
            console.error("Error parsing saved settings:", e)
            // Reset to defaults if there's an error
            resetToDefaults()
          }
        } else {
          // If no saved settings for this exam, use defaults
          resetToDefaults()
        }
      } catch (error) {
        console.error("Error loading settings from localStorage:", error)
        resetToDefaults()
      }
    }

    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [exam?.examId])

  // Reset to default settings
  const resetToDefaults = () => {
    setTotalPossiblePoints(100)
    setQuestionCount(10)
    setQuestionWeights({})
    setPointsPerQuestion(10)
    setMarkedAnswers([])
    setGrade(0)
    setEvaluation("")
    setDataLoaded(true)
  }

  useEffect(() => {
    if (exam?.examId) {
      dispatch(getStudentExamsByExamId(exam.examId))
    }
  }, [dispatch, exam?.examId])

  useEffect(() => {
    if (exam && !dataLoaded) {
      // Only set these if we don't have saved settings and data hasn't been loaded yet
      if (!localStorage.getItem(`examGradingSettings-${exam.examId}`)) {
        setGrade(exam.grade || 0)
        setEvaluation(exam.evaluation || "")
      }
      // Reset view when exam changes
      setPosition({ x: 0, y: 0 })
      setZoom(1)
    }
  }, [exam, dataLoaded])

  // Update points per question when total points or question count changes
  useEffect(() => {
    if (questionCount > 0 && dataLoaded) {
      // Calculate total 
      const totalAssignedPoints = Object.values(questionWeights).reduce((sum, weight) => sum + weight, 0)

      // Calculate remaining points and questions
      const remainingPoints = totalPossiblePoints - totalAssignedPoints
      const markedQuestionCount = Object.keys(questionWeights).length
      const remainingQuestions = Math.max(1, questionCount - markedQuestionCount)

      // Calculate default points per remaining question
      const defaultPointsPerQuestion = remainingPoints / remainingQuestions

      setPointsPerQuestion(Math.max(0, defaultPointsPerQuestion))
    }
  }, [totalPossiblePoints, questionCount, questionWeights, dataLoaded])

  // Save settings when relevant state changes
  useEffect(() => {
    if (exam?.examId && dataLoaded) {
      // Only save if data has been loaded (prevents overwriting with default values)
      saveSettingsToLocalStorage()
    }
  }, [
    exam?.examId,
    markedAnswers,
    evaluation,
    grade,
    totalPossiblePoints,
    questionCount,
    questionWeights,
    saveSettingsToLocalStorage,
    dataLoaded,
  ])

  // Save settings before unloading the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (exam?.examId && dataLoaded) {
        saveSettingsToLocalStorage()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [exam?.examId, saveSettingsToLocalStorage, dataLoaded])


  const handleGoBack = () => {
    // Save settings before navigating away
    if (exam?.examId) {
      saveSettingsToLocalStorage()
    }
    navigate(-1)
  }

  // Add this function to the component
  const saveAnnotatedExam = () => {
    if (!stageRef.current || !image) {
    
      return
    }

    try {
      // Get the stage instance from the ref
      const stage = stageRef.current.getStage()

      // Create a temporary canvas with the same dimensions as the image
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      // Get the context and draw the background
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error("Could not get canvas context")
      }

      // Draw white background
      context.fillStyle = 'white'
      context.fillRect(0, 0, canvas.width, canvas.height)

      // Draw the image
      context.drawImage(image, 0, 0, image.width, image.height)

      // Convert stage to an image at the correct scale and position
      const stageDataUrl = stage.toDataURL({
        pixelRatio: 1 / zoom,
        x: position.x / zoom,
        y: position.y / zoom,
        width: image.width,
        height: image.height
      })

      // Create a new image from the stage data
      const stageImage = new Image()
      stageImage.onload = () => {
        // Draw the stage image on top of the background
        context.drawImage(stageImage, 0, 0, image.width, image.height)

        // Get the final image data
        const finalImageData = canvas.toDataURL('image/png')

        // Create a download link
        const downloadLink = document.createElement('a')
        downloadLink.href = finalImageData
        downloadLink.download = `${exam?.name || 'exam'}_annotated.png`

        // Trigger download
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)

       

        // Here you would typically send the image data to your API
        // For example:
        // sendAnnotatedExamToApi(finalImageData, exam.examId)
      }

      stageImage.src = stageDataUrl
    } catch (error) {
      console.error("Error saving annotated exam:", error)
    
    }
  }

  // Fix the updateGrade function to correctly handle deductions
  // Calculate grade based on marked answers
  const updateGrade = (directGrade?: number) => {
    if (directGrade !== undefined) {
      // If a direct grade is provided, use it
      setGrade(directGrade)
      return
    }

    // Otherwise calculate from marked answers
    let totalScore = 0

    // Process all marks
    markedAnswers.forEach((mark) => {
      if (mark.type === "correct" && mark.score) {
        // For correct answers, add the points to the score
        totalScore += mark.score
      }
      // For incorrect answers, we don't subtract from totalScore
      // The negative score is just for display purposes
    })

    // Ensure grade doesn't go below 0
    setGrade(Math.max(0, totalScore))
  }

  const resetView = () => {
    if (image) {
      const stageWidth = window.innerWidth - 500
      const stageHeight = window.innerHeight - 200

      // Calculate position to center the image
      const xPos = (stageWidth - image.width * zoom) / 2
      const yPos = (stageHeight - image.height * zoom) / 2

      setPosition({ x: xPos, y: yPos })
      setZoom(1)
    }
  }

  const toggleSettingsPanel = () => {
    setIsSettingsOpen(!isSettingsOpen)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-red-600 mb-4" />
        <p className="text-gray-600">Loading exam viewer...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <ExamViewerHeader
          exam={exam}
          handleGoBack={handleGoBack}
          zoom={zoom}
          setZoom={setZoom}
          isShareDialogOpen={isShareDialogOpen}
          setIsShareDialogOpen={setIsShareDialogOpen}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          grade={grade}
          evaluation={evaluation}
          resetView={resetView}
          toggleSettingsPanel={toggleSettingsPanel}
          saveAnnotatedExam={saveAnnotatedExam} // Add this prop
        />
      </div>

      <div className="flex flex-1 h-[calc(100vh-8rem)] overflow-hidden" >
        <div className="flex-1 flex items-stretch p-4"  ref={containerRef}>
          <ExamViewerCanvas
            exam={exam}
            loadingImage={loadingImage}
            setLoadingImage={setLoadingImage}
            markedAnswers={markedAnswers}
            setMarkedAnswers={setMarkedAnswers}
            zoom={zoom}
            position={position}
            setPosition={setPosition}
            updateGrade={updateGrade}
            image={image}
            setImage={setImage}
            setZoom={setZoom}
            selectedTemplate={selectedTemplate}
            pointsPerQuestion={pointsPerQuestion}
            questionWeights={questionWeights}
            setQuestionWeights={setQuestionWeights}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
            stageRef={stageRef} // Add this prop
          />
        </div>

        <ExamViewerSidebar
          exam={exam}
          grade={grade}
          setgrade={setGrade}
          evaluation={evaluation}
          setEvaluation={setEvaluation}
          markedAnswers={markedAnswers}
          setMarkedAnswers={setMarkedAnswers}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          pointsPerQuestion={pointsPerQuestion}
          totalPossiblePoints={totalPossiblePoints}
          questionWeights={questionWeights} // Add this prop
          setQuestionWeights={setQuestionWeights} // Add this prop
        />
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <SettingsPanel
            totalPossiblePoints={totalPossiblePoints}
            setTotalPossiblePoints={setTotalPossiblePoints}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            questionWeights={questionWeights}
            pointsPerQuestion={pointsPerQuestion}
            markedAnswers={markedAnswers}
            examName={exam?.name || "Exam"}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExamFileViewer
