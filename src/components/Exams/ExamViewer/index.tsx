"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../../store/store"
import { getStudentExamsByExamId } from "../../../store/studentExamSlice"
import { useLocation, useNavigate } from "react-router-dom"

import ExamViewerHeader from "./ExamViewerHeader"
import ExamViewerCanvas from "./Canvas"
import ExamViewerSidebar from "./ExamViewerSidebar"

const ExamFileViewer = () => {
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

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { exam } = location.state || {}

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("examGradingSettings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setTotalPossiblePoints(settings.totalPossiblePoints || 100)
      setQuestionCount(settings.questionCount || 10)
      setQuestionWeights(settings.questionWeights || {})
    }
  }, [])

  useEffect(() => {
    if (exam?.examId) {
      dispatch(getStudentExamsByExamId(exam.examId))
    }
  }, [dispatch, exam?.examId])

  useEffect(() => {
    if (exam) {
      setGrade(exam.grade || 0)
      setEvaluation(exam.evaluation || "")
      // Reset view when exam changes
      setPosition({ x: 0, y: 0 })
      setZoom(1)
    }
  }, [exam])

  const studentExams = useSelector((state: StoreType) => state.studentExams.exams)

  const handleGoBack = () => {
    navigate(-1)
  }

  // Calculate grade based on marked answers
  const updateGrade = () => {
    // Sum up all the scores from marks
    const totalScore = markedAnswers.reduce((total, mark) => {
      // Add scores from marks that have a score property
      return total + (mark.score || 0)
    }, 0)

    // Ensure grade doesn't go below 0
    setGrade(Math.max(0, totalScore))
  }

  // Update grade whenever marked answers change
  useEffect(() => {
    updateGrade()
  }, [markedAnswers])

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

  return (
    <div className="flex flex-col h-full bg-gray-50">
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
      />

      <div className="flex gap-4 h-[calc(100vh-12rem)] px-6 pb-6">
        <ExamViewerSidebar
          exam={exam}
          grade={grade}
          setgrade={setGrade}
          evaluation={evaluation}
          setEvaluation={setEvaluation}
          markedAnswers={markedAnswers}
          setMarkedAnswers={setMarkedAnswers}
          studentExams={studentExams}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          totalPossiblePoints={totalPossiblePoints}
          setTotalPossiblePoints={setTotalPossiblePoints}
          questionWeights={questionWeights}
          setQuestionWeights={setQuestionWeights}
          pointsPerQuestion={pointsPerQuestion}
          setPointsPerQuestion={setPointsPerQuestion}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
        />

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
        />
      </div>
    </div>
  )
}

export default ExamFileViewer
