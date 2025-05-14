import { Line } from "react-konva"

interface DrawingLayerProps {
  lines: any[]
  currentLine: any[]
  isDrawing: boolean
  position: { x: number; y: number }
  zoom: number
}

export const DrawingLayer = ({ lines, currentLine, isDrawing, position, zoom }: DrawingLayerProps) => {
  return (
    <>
      {/* Render completed lines */}
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.map((point: number, index: number) => {
            // Convert from image coordinates to screen coordinates
            return index % 2 === 0
              ? point * zoom + position.x // x coordinate
              : point * zoom + position.y // y coordinate
          })}
          stroke="#9333ea" // Purple color for pen
          strokeWidth={2 * zoom} // Scale stroke width with zoom
          tension={0.5}
          lineCap="round"
          lineJoin="round"
        />
      ))}

      {/* Render current line being drawn */}
      {isDrawing && (
        <Line
          points={currentLine.map((point, index) => {
            // Convert from image coordinates to screen coordinates
            return index % 2 === 0
              ? point * zoom + position.x // x coordinate
              : point * zoom + position.y // y coordinate
          })}
          stroke="#9333ea" // Purple color for pen
          strokeWidth={2 * zoom} // Scale stroke width with zoom
          tension={0.5}
          lineCap="round"
          lineJoin="round"
        />
      )}
    </>
  )
}
