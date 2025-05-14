import { useEffect, useRef, useState } from "react"
import { Stage, Layer } from "react-konva"
import { Loader2 } from "lucide-react"
import { DrawingLayer } from "./DrawingLayer"
import { MarkingsLayer } from "./MarkingsLayer"
import { ImageLayer } from "./ImageLayer"
import { useCanvasGestures } from "./useCanvasGestures"
import StudentExamService from "../../../../services/StudentExamService"
import { useCanvasTools } from "./useCanvasTools"

interface ExamViewerCanvasProps {
  exam: any
  loadingImage: boolean
  setLoadingImage: (loading: boolean) => void
  markedAnswers: any[]
  setMarkedAnswers: (answers: any[]) => void
  zoom: number
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
  updateGrade: () => void
  image: HTMLImageElement | null
  setImage: (image: HTMLImageElement | null) => void
  setZoom: (zoom: number) => void
  selectedTemplate: string | null
  pointsPerQuestion: number
  questionWeights: Record<string, number>
  setQuestionWeights: (weights: Record<string, number>) => void
}

const ExamViewerCanvas = ({
  exam,
  loadingImage,
  setLoadingImage,
  markedAnswers,
  setMarkedAnswers,
  zoom,
  position,
  setPosition,
  updateGrade,
  image,
  setImage,
  setZoom,
  selectedTemplate,
  pointsPerQuestion,
  questionWeights,
  setQuestionWeights,
}: ExamViewerCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<any>(null)
  const [scoreDialogPosition, setScoreDialogPosition] = useState<{ x: number; y: number } | null>(null)
  const [currentMarkScore, setCurrentMarkScore] = useState<number>(0)
  const [currentMarkType, setCurrentMarkType] = useState<string | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [newMarkIndex, setNewMarkIndex] = useState<number | null>(null)
  const [isHoveringImage, setIsHoveringImage] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null)

  const {
    lines,
    currentLine,
    isDrawing, 
    setLines,
    handleDrawingStart,
    handleDrawingMove,
    handleDrawingEnd,
    handleErase,
  } = useCanvasTools(selectedTemplate, position, zoom)

  const {  handleWheel, handleDragStart, handleDragEnd, handleDragMove } = useCanvasGestures({
    stageRef,
    zoom,
    position,
    setZoom,
    setPosition,
    selectedTemplate,
    isDrawing,
  })

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // New image loading logic with signed URLs
  useEffect(() => {
    const fetchImageWithSignedUrl = async () => {
      try {
        if (!exam?.examPath) return

        setLoadingImage(true)
        const signedUrl = await StudentExamService.getSignedUrl(exam.examPath)
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.src = signedUrl
        img.onload = () => {
          setImage(img)
          setLoadingImage(false)
          if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth
            const containerHeight = containerRef.current.offsetHeight

            // Calculate scale to fit image within container
            const scaleX = containerWidth / img.width
            const scaleY = containerHeight / img.height
            const scale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 100%

            setZoom(scale)

            // Center the image
            const xPos = (containerWidth - img.width * scale) / 2
            const yPos = (containerHeight - img.height * scale) / 2

            setPosition({ x: xPos, y: yPos })
          }
        }

        img.onerror = () => {
          console.error("Error loading image")
          setLoadingImage(false)
        }
      } catch (error) {
        console.error("Failed to load image with signed URL:", error)
        setLoadingImage(false)
      }
    }

    fetchImageWithSignedUrl()
  }, [exam?.examPath, setImage, setLoadingImage, setPosition, setZoom])

  // Handle erasing marks
  const handleEraseMarks = (e: any) => {
    if (selectedTemplate !== "eraser") return

    const stage = e.target.getStage()
    const point = stage.getPointerPosition()

    // Convert to image coordinates
    const imageX = (point.x - position.x) / zoom
    const imageY = (point.y - position.y) / zoom

    // Define eraser radius in image coordinates
    const eraserRadius = 20 / zoom

    // Check if any mark is within eraser radius
    const updatedMarks = markedAnswers.filter((mark) => {
      const distance = Math.sqrt(Math.pow(mark.x - imageX, 2) + Math.pow(mark.y - imageY, 2))

      // If mark is erased, remove its weight from questionWeights
      if (distance < eraserRadius && mark.id) {
        const newWeights = { ...questionWeights }
        delete newWeights[mark.id]
        setQuestionWeights(newWeights)
      }

      return distance >= eraserRadius
    })

    // If we removed any marks, update the state
    if (updatedMarks.length !== markedAnswers.length) {
      setMarkedAnswers(updatedMarks)
      updateGrade()
    }
  }

  // Handle template placement (checkmark, x, circle)
  const handleStageClick = (e: any) => {
    if (
      !selectedTemplate ||
      selectedTemplate === "pen" ||
      selectedTemplate === "hand" ||
      selectedTemplate === "eraser" ||
      scoreDialogPosition !== null // Don't place new marks if score dialog is open
    ) {
      return
    }

    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()

    // Convert to image coordinates
    const imageX = (pointerPosition.x - position.x) / zoom
    const imageY = (pointerPosition.y - position.y) / zoom

    // Generate a unique ID for this question
    const questionId = `q-${Date.now()}`
    setCurrentQuestionId(questionId)

    // Only show score dialog for correct/incorrect marks
    if (selectedTemplate === "correct" || selectedTemplate === "incorrect") {
      // Create a new mark
      const newMark = {
        id: questionId,
        type: selectedTemplate,
        x: imageX,
        y: imageY,
        score: selectedTemplate === "correct" ? pointsPerQuestion : -pointsPerQuestion, // Default full points for correct, negative for incorrect
        questionValue: pointsPerQuestion, // Store the question's total value
        percentageScore: 100, // Default percentage (100% of the question value)
      }

      // Add to marked answers
      const updatedAnswers = [...markedAnswers, newMark]
      setMarkedAnswers(updatedAnswers)
      setNewMarkIndex(updatedAnswers.length - 1)

      // Update question weights
      const newWeights = { ...questionWeights, [questionId]: pointsPerQuestion }
      setQuestionWeights(newWeights)

      // Show score dialog at the click position
      setScoreDialogPosition({
        x: pointerPosition.x,
        y: pointerPosition.y,
      })

      // Set default score based on mark type
      setCurrentMarkScore(100) // 100% for both correct and incorrect (full value)
      setCurrentMarkType(selectedTemplate)
    } else {
      // For other templates (like circle), just add without score dialog
      const newMark = {
        id: questionId,
        type: selectedTemplate,
        x: imageX,
        y: imageY,
      }
      setMarkedAnswers([...markedAnswers, newMark])
      updateGrade()
    }
  }

  // Handle score assignment
  const handleScoreAssignment = (percentageScore: number) => {
    if (newMarkIndex === null || !currentQuestionId) return

    // Update the mark with the score
    const updatedAnswers = [...markedAnswers]
    const mark = updatedAnswers[newMarkIndex]

    // Calculate actual points based on percentage of question value
    let actualPoints = 0

    if (currentMarkType === "correct") {
      // For correct marks, score is positive percentage of question value
      actualPoints = (percentageScore / 100) * pointsPerQuestion
    } else if (currentMarkType === "incorrect") {
      // For incorrect marks, score is negative percentage of question value
      actualPoints = -(percentageScore / 100) * pointsPerQuestion
    }

    updatedAnswers[newMarkIndex] = {
      ...mark,
      score: actualPoints,
      percentageScore: percentageScore,
    }

    // Update question weights with the actual assigned value
    const newWeights = { ...questionWeights }
    newWeights[currentQuestionId] = Math.abs(actualPoints)
    setQuestionWeights(newWeights)

    setMarkedAnswers(updatedAnswers)
    setScoreDialogPosition(null)
    setNewMarkIndex(null)
    setCurrentQuestionId(null)
    updateGrade()
  }

  const getCursorStyle = () => {
    if (!isHoveringImage) return "default"

    switch (selectedTemplate) {
      case "correct":
        return 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>\') 12 12, auto'
      case "incorrect":
        return 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>\') 12 12, auto'
      case "circle":
        return 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>\') 12 12, auto'
      case "pen":
        return 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>\') 0 24, auto'
      case "hand":
        return "grab"
      case "eraser":
        return 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4C13.5 3.5 14.5 3.5 15 4L21 10C21.5 10.5 21.5 11.5 21 12L11 22"></path></svg>\') 0 24, auto'
      default:
        return "default"
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      style={{ cursor: getCursorStyle() }}
      onMouseEnter={() => setIsHoveringImage(true)}
      onMouseLeave={() => setIsHoveringImage(false)}
    >
      {loadingImage ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <p className="mt-2 text-sm text-gray-600">Loading exam...</p>
          </div>
        </div>
      ) : (
        <>
          <Stage
            ref={stageRef}
            width={containerSize.width}
            height={containerSize.height}
            onWheel={handleWheel}
            draggable={selectedTemplate === "hand"}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
            onClick={handleStageClick}
            onMouseDown={(e) => {
              if (selectedTemplate === "pen") {
                handleDrawingStart(e)
              } else if (selectedTemplate === "eraser") {
                handleErase(e, lines, setLines)
                handleEraseMarks(e)
              }
            }}
            onMouseMove={(e) => {
              if (selectedTemplate === "pen" && isDrawing) {
                handleDrawingMove(e)
              }
            }}
            onMouseUp={handleDrawingEnd}
            className="bg-gray-100"
          >
            <Layer>
              <ImageLayer image={image} position={position} zoom={zoom} />
              <MarkingsLayer markedAnswers={markedAnswers} position={position} zoom={zoom} />
              <DrawingLayer
                lines={lines}
                currentLine={currentLine}
                isDrawing={isDrawing}
                position={position}
                zoom={zoom}
              />
            </Layer>
          </Stage>

          {/* Score Assignment Dialog */}
          {scoreDialogPosition && (
            <div
              className="absolute bg-white shadow-lg rounded-md p-3 z-10 border border-gray-200"
              style={{
                left: scoreDialogPosition.x,
                top: scoreDialogPosition.y,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="text-sm font-medium mb-2">
                {currentMarkType === "correct"
                  ? `Assign percentage of ${pointsPerQuestion.toFixed(1)} points:`
                  : `Deduct percentage of ${pointsPerQuestion.toFixed(1)} points:`}
              </div>

              <div className="flex space-x-2 mb-3">
                {[25, 50, 75, 100].map((score) => (
                  <button
                    key={score}
                    className={`px-2 py-1 rounded ${
                      currentMarkScore === score
                        ? currentMarkType === "correct"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setCurrentMarkScore(score)}
                  >
                    {score}%
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-3">
                <button
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    // Remove the mark if canceled
                    if (newMarkIndex !== null) {
                      setMarkedAnswers(markedAnswers.filter((_, i) => i !== newMarkIndex))

                      // Remove from question weights
                      if (currentQuestionId) {
                        const newWeights = { ...questionWeights }
                        delete newWeights[currentQuestionId]
                        setQuestionWeights(newWeights)
                      }
                    }
                    setScoreDialogPosition(null)
                    setNewMarkIndex(null)
                    setCurrentQuestionId(null)
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`${
                    currentMarkType === "correct" ? "bg-green-600" : "bg-red-600"
                  } text-white px-3 py-1 rounded text-sm`}
                  onClick={() => handleScoreAssignment(currentMarkScore)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExamViewerCanvas
