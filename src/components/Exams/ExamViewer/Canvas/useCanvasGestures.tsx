"use client"

import type React from "react"

import { useState } from "react"

interface UseCanvasGesturesProps {
  stageRef: React.RefObject<any>
  zoom: number
  position: { x: number; y: number }
  setZoom: (zoom: number) => void
  setPosition: (position: { x: number; y: number }) => void
  selectedTemplate: string | null
  isDrawing: boolean
}

export const useCanvasGestures = ({
  stageRef,
  zoom,
  position,
  setZoom,
  setPosition,
  selectedTemplate,
  isDrawing,
}: UseCanvasGesturesProps) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleWheel = (e: any) => {
    e.evt.preventDefault()

    const stage = stageRef.current
    const oldScale = zoom

    // Get pointer position relative to stage
    const pointer = stage.getPointerPosition()

    // Calculate where the pointer is on the image
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    }

    // Calculate new scale with limits
    const scaleBy = 1.1
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    const limitedScale = Math.max(0.1, Math.min(newScale, 5)) // Limit zoom between 0.1x and 5x

    // Calculate new position to keep the point under the mouse in the same position
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    }

    setZoom(limitedScale)
    setPosition(newPos)
  }

  const handleDragStart = () => {
    if (selectedTemplate === "hand") {
      setIsDragging(true)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragMove = (e: any) => {
    if (selectedTemplate === "hand" && !isDrawing) {
      setPosition({
        x: e.target.x(),
        y: e.target.y(),
      })
    }
  }

  return {
    isDragging,
    handleWheel,
    handleDragStart,
    handleDragEnd,
    handleDragMove,
  }
}
