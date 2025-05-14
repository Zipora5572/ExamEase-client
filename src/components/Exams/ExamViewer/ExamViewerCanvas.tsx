// "use client"

// import { useEffect, useRef, useState } from "react"
// import { Stage, Layer, Image, Circle, Text, Line } from "react-konva"
// import { Loader2 } from "lucide-react"
// import StudentExamService from "@/services/StudentExamService"

// interface ExamViewerCanvasProps {
//   exam: any
//   loadingImage: boolean
//   setLoadingImage: (loading: boolean) => void
//   markedAnswers: any[]
//   setMarkedAnswers: (answers: any[]) => void
//   zoom: number
//   position: { x: number; y: number }
//   setPosition: (position: { x: number; y: number }) => void;
//   calculategrade: () => void
//   currentPage: number
//   totalPages: number
//   setTotalPages: (pages: number) => void
//   image: HTMLImageElement | null
//   setImage: (image: HTMLImageElement | null) => void
//   setZoom: (zoom: number) => void;
// }

// const ExamViewerCanvas = ({
//   exam,
//   loadingImage,
//   setLoadingImage,
//   markedAnswers,
//   setMarkedAnswers,
//   zoom,
//   position,
//   setPosition,
//   calculategrade,
//   currentPage,
//   totalPages,
//   setTotalPages,
//   image,
//   setImage,
//   setZoom,
// }: ExamViewerCanvasProps) => {
//   const [isDragging, setIsDragging] = useState(false)
//   const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
//   const [isDrawing, setIsDrawing] = useState(false)
//   const [lines, setLines] = useState<any[]>([])
//   const [currentLine, setCurrentLine] = useState<any[]>([])
//   const stageRef = useRef<any>(null)
//   const containerRef = useRef<HTMLDivElement>(null)

//   // useEffect(() => {
//   //   if (exam) {
//   //     loadExamImage()
//   //   }
//   // }, [exam, currentPage])
//   useEffect(() => {
//     const fetchImageWithSignedUrl = async () => {
//       try {
//         if (!exam?.examPath) return

//         setLoadingImage(true)
//         const signedUrl = await StudentExamService.getSignedUrl(exam.examPath)
//         const img = new window.Image()
//         img.crossOrigin = "anonymous"
//         img.src = signedUrl
//         img.onload = () => {
//           setImage(img)
//           setLoadingImage(false)
//           if (containerRef.current) {
//             const containerWidth = containerRef.current.offsetWidth
//             const containerHeight = containerRef.current.offsetHeight
//             const xPos = (containerWidth - img.width * zoom) / 2
//             const yPos = (containerHeight - img.height * zoom) / 2
    
//             setPosition({ x: xPos, y: yPos })
//           }
//           // Simulate multiple pages for demo purposes
//           setTotalPages(Math.ceil(Math.random() * 3) + 1)
//         }
//       } catch (error) {
//         console.error("Failed to load image with signed URL:", error)
//         // toast({
//         //   title: "Error loading exam",
//         //   description: "Could not load the exam image. Please try again.",
//         //   variant: "destructive",
//         // })
//         setLoadingImage(false)
//       }
//     }

//     fetchImageWithSignedUrl()
//   }, [exam?.examPath])
  

//   const handleWheel = (e: any) => {
//     // e.evt.preventDefault()

//     // const stage = stageRef.current
//     // const oldScale = zoom
//     // const pointer = stage.getPointerPosition()
//     // const mousePointTo = {
//     //   x: (pointer.x - position.x) / oldScale,
//     //   y: (pointer.y - position.y) / oldScale,
//     }

//     // Calculate new scale
//     const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1
//     const limitedScale = Math.min(Math.max(newScale, 0.5), 3)

//     // Calculate new position
//     const newPos = {
//       x: pointer.x - mousePointTo.x * limitedScale,
//       y: pointer.y - mousePointTo.y * limitedScale,
//     }

//     setZoom(limitedScale)
//     setPosition(newPos)
//   }

//   const handleDragStart = () => {
//     setIsDragging(true)
//   }

//   const handleDragEnd = () => {
//     setIsDragging(false)
//   }

//   const handleDragMove = (e: any) => {
//     setPosition({
//       x: e.target.x(),
//       y: e.target.y(),
//     })
//   }

//   const handleMouseDown = (e: any) => {
//     if (selectedTemplate === "pen") {
//       setIsDrawing(true)
//       const pos = e.target.getStage().getPointerPosition()
//       setCurrentLine([pos.x, pos.y])
//     }
//   }

//   const handleMouseMove = (e: any) => {
//     if (!isDrawing || selectedTemplate !== "pen") return

//     const stage = e.target.getStage()
//     const point = stage.getPointerPosition()
//     setCurrentLine((currentLine) => [...currentLine, point.x, point.y])
//   }

//   const handleMouseUp = () => {
//     if (selectedTemplate === "pen" && isDrawing) {
//       setIsDrawing(false)
//       setLines([...lines, currentLine])
//       setCurrentLine([])
//     }
//   }

//   const handleStageClick = (e: any) => {
//     if (!selectedTemplate || selectedTemplate === "hand" || isDragging) return

//     const stage = e.target.getStage()
//     const pointerPos = stage.getPointerPosition()

//     // Convert to image coordinates
//     const imageX = (pointerPos.x - position.x) / zoom
//     const imageY = (pointerPos.y - position.y) / zoom

//     if (selectedTemplate === "correct" || selectedTemplate === "incorrect" || selectedTemplate === "circle") {
//       const newMarking = {
//         type: selectedTemplate,
//         x: imageX,
//         y: imageY,
//         grade: selectedTemplate === "correct" ? 1 : selectedTemplate === "incorrect" ? 0 : 0,
//       }

//       setMarkedAnswers([...markedAnswers, newMarking])
//       calculategrade()
//     }
//   }

//   return (
//     <div
//       ref={containerRef}
//       className="flex-1 relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
//       style={{ cursor: selectedTemplate === "hand" ? "grab" : selectedTemplate ? "crosshair" : "default" }}
//     >
//       {loadingImage ? (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
//           <div className="flex flex-col items-center">
//             <Loader2 className="h-8 w-8 animate-spin text-red-600" />
//             <p className="mt-2 text-sm text-gray-600">Loading exam...</p>
//           </div>
//         </div>
//       ) : (
//         <Stage
//           ref={stageRef}
//           width={containerRef.current?.offsetWidth || window.innerWidth - 500}
//           height={containerRef.current?.offsetHeight || window.innerHeight - 200}
//           onWheel={handleWheel}
//           draggable={selectedTemplate === "hand"}
//           onDragStart={handleDragStart}
//           onDragEnd={handleDragEnd}
//           onDragMove={handleDragMove}
//           onClick={handleStageClick}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           className="bg-gray-100"
//         >
//           <Layer>
//             {image && (
//               <Image image={image} x={position.x} y={position.y} scaleX={zoom} scaleY={zoom} listening={false} />
//             )}

//             {/* Render marked answers */}
//             {markedAnswers.map((mark, i) => {
//               if (mark.type === "correct") {
//                 return (
//                   <Text
//                     key={i}
//                     text="✓"
//                     x={position.x + mark.x * zoom - 10 * zoom}
//                     y={position.y + mark.y * zoom - 10 * zoom}
//                     fontSize={24 * zoom}
//                     fill="green"
//                   />
//                 )
//               } else if (mark.type === "incorrect") {
//                 return (
//                   <Text
//                     key={i}
//                     text="✗"
//                     x={position.x + mark.x * zoom - 10 * zoom}
//                     y={position.y + mark.y * zoom - 10 * zoom}
//                     fontSize={24 * zoom}
//                     fill="red"
//                   />
//                 )
//               } else if (mark.type === "circle") {
//                 return (
//                   <Circle
//                     key={i}
//                     x={position.x + mark.x * zoom}
//                     y={position.y + mark.y * zoom}
//                     radius={20 * zoom}
//                     stroke="blue"
//                     strokeWidth={2 * zoom}
//                     fill="transparent"
//                   />
//                 )
//               }
//               return null
//             })}

//             {/* Render drawing lines */}
//             {lines.map((line, i) => (
//               <Line
//                 key={i}
//                 points={line.map((point, j) => {
//                   if (j % 2 === 0) {
//                     return position.x + (point - position.x) * zoom
//                   } else {
//                     return position.y + (point - position.y) * zoom
//                   }
//                 })}
//                 stroke="purple"
//                 strokeWidth={2 * zoom}
//                 tension={0.5}
//                 lineCap="round"
//                 lineJoin="round"
//               />
//             ))}

//             {/* Render current drawing line */}
//             {isDrawing && (
//               <Line
//                 points={currentLine.map((point, j) => {
//                   if (j % 2 === 0) {
//                     return position.x + (point - position.x) * zoom
//                   } else {
//                     return position.y + (point - position.y) * zoom
//                   }
//                 })}
//                 stroke="purple"
//                 strokeWidth={2 * zoom}
//                 tension={0.5}
//                 lineCap="round"
//                 lineJoin="round"
//               />
//             )}
//           </Layer>
//         </Stage>
//       )}
//     </div>
//   )
// }

// export default ExamViewerCanvas
