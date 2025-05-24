"use client"

import { useState } from "react"

export const useCanvasTools = (selectedTemplate: string | null, position: { x: number; y: number }, zoom: number) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [lines, setLines] = useState<any[]>([])
  const [currentLine, setCurrentLine] = useState<any[]>([])

  const handleDrawingStart = (e: any) => {
    if (selectedTemplate !== "pen") return

    setIsDrawing(true)
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()

    // Ensure precise coordinate transformation
    const imageX = (point.x - position.x) / zoom
    const imageY = (point.y - position.y) / zoom

    setCurrentLine([imageX, imageY])
  }

  const handleDrawingMove = (e: any) => {
    if (!isDrawing || selectedTemplate !== "pen") return

    const stage = e.target.getStage()
    const point = stage.getPointerPosition()

    // Ensure precise coordinate transformation
    const imageX = (point.x - position.x) / zoom
    const imageY = (point.y - position.y) / zoom

    setCurrentLine((currentLine) => [...currentLine, imageX, imageY])
  }

  const handleDrawingEnd = () => {
    if (selectedTemplate === "pen" && isDrawing) {
      setIsDrawing(false)
      setLines([...lines, currentLine])
      setCurrentLine([])
    }
  }

  const handleErase = (e: any, lines: any[], setLines: (lines: any[]) => void) => {
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()

    // Ensure precise coordinate transformation
    const imageX = (point.x - position.x) / zoom
    const imageY = (point.y - position.y) / zoom

    // Define eraser radius in image coordinates
    const eraserRadius = 20 / zoom

    // Filter out lines that have points close to the eraser position
    const filteredLines = lines.filter((line) => {
      // Check if any point in the line is within eraser radius
      for (let i = 0; i < line.length; i += 2) {
        const pointX = line[i]
        const pointY = line[i + 1]
        const distance = Math.sqrt(Math.pow(pointX - imageX, 2) + Math.pow(pointY - imageY, 2))
        if (distance < eraserRadius) {
          return false // Remove this line
        }
      }
      return true // Keep this line
    })

    setLines(filteredLines)
  }

  return {
    isDrawing,
    setIsDrawing,
    lines,
    setLines,
    currentLine,
    setCurrentLine,
    handleDrawingStart,
    handleDrawingMove,
    handleDrawingEnd,
    handleErase,
  }
}
