import { Circle, Line, Text } from "react-konva"

interface MarkingsLayerProps {
  markedAnswers: any[]
  position: { x: number; y: number }
  zoom: number
}

export const MarkingsLayer = ({ markedAnswers, position, zoom }: MarkingsLayerProps) => {
  return (
    <>
      {markedAnswers.map((mark, index) => {
        // Convert from image coordinates to screen coordinates
        const x = mark.x * zoom + position.x
        const y = mark.y * zoom + position.y

        // Render different marking types
        switch (mark.type) {
          case "correct":
            return (
              <Line
                key={index}
                points={[x - 10 * zoom, y, x - 5 * zoom, y + 5 * zoom, x + 10 * zoom, y - 10 * zoom]}
                stroke="#16a34a" // Green
                strokeWidth={2 * zoom}
                tension={0}
                lineCap="round"
                lineJoin="round"
              />
            )
          case "incorrect":
            return (
              <>
                <Line
                  key={`${index}-1`}
                  points={[x - 10 * zoom, y - 10 * zoom, x + 10 * zoom, y + 10 * zoom]}
                  stroke="#dc2626" // Red
                  strokeWidth={2 * zoom}
                  tension={0}
                  lineCap="round"
                  lineJoin="round"
                />
                <Line
                  key={`${index}-2`}
                  points={[x + 10 * zoom, y - 10 * zoom, x - 10 * zoom, y + 10 * zoom]}
                  stroke="#dc2626" // Red
                  strokeWidth={2 * zoom}
                  tension={0}
                  lineCap="round"
                  lineJoin="round"
                />
              </>
            )
          case "circle":
            return (
              <Circle
                key={index}
                x={x}
                y={y}
                radius={15 * zoom}
                stroke="#2563eb" // Blue
                strokeWidth={2 * zoom}
              />
            )
          default:
            return null
        }
      })}

      {/* Render scores */}
      {markedAnswers.map((mark, index) => {
        if (mark.percentageScore !== undefined) {
          // Convert from image coordinates to screen coordinates
          const x = mark.x * zoom + position.x
          const y = mark.y * zoom + position.y

          // For correct marks
          if (mark.type === "correct") {
            // Only show percentage if not 100%
            const displayText =
              mark.percentageScore < 100 ? `+${mark.percentageScore}%` : `+${Math.abs(mark.score).toFixed(1)}`

            return (
              <Text
                key={`score-${index}`}
                x={x + 15 * zoom}
                y={y - 15 * zoom}
                text={displayText}
                fontSize={14 * zoom}
                fill="#16a34a" // Green
                fontStyle="bold"
              />
            )
          }

          // For incorrect marks
          if (mark.type === "incorrect") {
            // Only show percentage if not 100%
            const displayText =
              mark.percentageScore < 100 ? `-${mark.percentageScore}%` : `-${Math.abs(mark.score).toFixed(1)}`

            return (
              <Text
                key={`score-${index}`}
                x={x + 15 * zoom}
                y={y - 15 * zoom}
                text={displayText}
                fontSize={14 * zoom}
                fill="#dc2626" // Red
                fontStyle="bold"
              />
            )
          }
        }
        return null
      })}
    </>
  )
}
