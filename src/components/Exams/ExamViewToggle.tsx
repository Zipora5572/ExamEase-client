import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExamViewToggleProps {
  viewMode: "table" | "grid"
  onViewModeChange: (mode: "table" | "grid") => void
}

const ExamViewToggle = ({ viewMode, onViewModeChange }: ExamViewToggleProps) => {
  return (
    <div className="flex items-center border rounded-lg p-1 bg-muted/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("table")}
        className={`
          h-8 px-3 cursor-pointer transition
          ${viewMode === "table" ? "text-red-600 font-semibold hover:font-bold hover:text-red-600" : "text-gray-600 hover:font-bold hover:text-gray-900"}
        `}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className={`
          h-8 px-3 cursor-pointer transition
          ${viewMode === "grid" ? "text-red-600 font-semibold hover:font-bold hover:text-red-600" : "text-gray-600 hover:font-bold hover:text-gray-900"}
        `}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default ExamViewToggle
