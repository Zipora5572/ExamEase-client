import { Line, Text } from "react-konva"

interface MarkingsLayerProps {
  markedAnswers: any[]
  pendingMark: any | null
  position: { x: number; y: number }
  zoom: number
}

export const MarkingsLayer = ({ markedAnswers, pendingMark, position, zoom }: MarkingsLayerProps) => {
  // Combine confirmed marks and pending mark if it exists
  const allMarks = pendingMark ? [...markedAnswers, pendingMark] : markedAnswers

  return (
    <>
      {allMarks.map((mark, index) => {
        const x = mark.x * zoom + position.x
        const y = mark.y * zoom + position.y

        // Determine the size based on zoom level
        const size = 20 * zoom
        const isPending = mark.isPending === true

        if (mark.type === "correct") {
          // Checkmark - without circle
          return (
            <>
              <Line
                key={`checkmark-${index}`}
                points={[x - size / 2, y, x - size / 6, y + size / 3, x + size / 2, y - size / 3]}
                stroke={isPending ? "rgba(22, 163, 74, 0.5)" : "#16a34a"} // Green, semi-transparent if pending
                strokeWidth={3 * zoom}
                lineCap="round"
                lineJoin="round"
                opacity={isPending ? 0.7 : 1}
              />
              {mark.score && !isPending && (
                <Text
                  key={`score-${index}`}
                  text={`+${Math.abs(mark.score).toFixed(1)}`}
                  x={x + size / 1.5}
                  y={y - size / 2}
                  fontSize={12 * zoom}
                  fill="#16a34a"
                  fontStyle="bold"
                />
              )}
            </>
          )
        } else if (mark.type === "incorrect") {
          // X mark - without circle
          return (
            <>
              <Line
                key={`x1-${index}`}
                points={[x - size / 2, y - size / 2, x + size / 2, y + size / 2]}
                stroke={isPending ? "rgba(220, 38, 38, 0.5)" : "#dc2626"} // Red, semi-transparent if pending
                strokeWidth={3 * zoom}
                lineCap="round"
                opacity={isPending ? 0.7 : 1}
              />
              <Line
                key={`x2-${index}`}
                points={[x + size / 2, y - size / 2, x - size / 2, y + size / 2]}
                stroke={isPending ? "rgba(220, 38, 38, 0.5)" : "#dc2626"} // Red, semi-transparent if pending
                strokeWidth={3 * zoom}
                lineCap="round"
                opacity={isPending ? 0.7 : 1}
              />
              {mark.score && !isPending && (
                <Text
                  key={`score-${index}`}
                  text={`-${Math.abs(mark.score).toFixed(1)}`}
                  x={x + size / 1.5}
                  y={y - size / 2}
                  fontSize={12 * zoom}
                  fill="#dc2626"
                  fontStyle="bold"
                />
              )}
            </>
          )
        } else if (mark.type === "circle") {
          // Circle
          return (
            <Line
              key={`circle-${index}`}
              points={[
                x + size * Math.cos(0),
                y + size * Math.sin(0),
                x + size * Math.cos(Math.PI * 0.25),
                y + size * Math.sin(Math.PI * 0.25),
                x + size * Math.cos(Math.PI * 0.5),
                y + size * Math.sin(Math.PI * 0.5),
                x + size * Math.cos(Math.PI * 0.75),
                y + size * Math.sin(Math.PI * 0.75),
                x + size * Math.cos(Math.PI),
                y + size * Math.sin(Math.PI),
                x + size * Math.cos(Math.PI * 1.25),
                y + size * Math.sin(Math.PI * 1.25),
                x + size * Math.cos(Math.PI * 1.5),
                y + size * Math.sin(Math.PI * 1.5),
                x + size * Math.cos(Math.PI * 1.75),
                y + size * Math.sin(Math.PI * 1.75),
                x + size * Math.cos(0),
                y + size * Math.sin(0),
              ]}
              stroke="#2563eb" // Blue
              strokeWidth={2 * zoom}
              closed={true}
              tension={0.5}
            />
          )
        }
        return null
      })}
    </>
  )
}
