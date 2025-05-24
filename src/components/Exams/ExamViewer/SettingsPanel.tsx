"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Info } from "lucide-react"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface SettingsPanelProps {
  totalPossiblePoints: number
  setTotalPossiblePoints: (points: number) => void
  questionCount: number
  setQuestionCount: (count: number) => void
  questionWeights: Record<string, number>
  pointsPerQuestion: number
  markedAnswers: any[]
  examName: string
}

const SettingsPanel = ({
  totalPossiblePoints,
  setTotalPossiblePoints,
  questionCount,
  setQuestionCount,
  questionWeights,
  pointsPerQuestion,
  markedAnswers,
  examName,
}: SettingsPanelProps) => {
  const handleTotalPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setTotalPossiblePoints(value)
    }
  }

  const handleQuestionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuestionCount(value)
    }
  }

  // Calculate total assigned weight
  const totalAssignedWeight = Object.values(questionWeights).reduce((sum, weight) => sum + weight, 0)

  // Calculate remaining weight
  const remainingWeight = totalPossiblePoints - totalAssignedWeight

  // Calculate marked question count
  const markedQuestionCount = Object.keys(questionWeights).length

  // Calculate remaining questions
  const remainingQuestions = Math.max(0, questionCount - markedQuestionCount)

  return (
    <>
      <DialogHeader>
        <DialogTitle>Grading Settings for {examName}</DialogTitle>
        <DialogDescription>Configure how points are distributed across questions for this exam.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="total-points" className="text-sm font-medium text-gray-700">
              Total Possible Points
            </Label>
            <Input
              id="total-points"
              type="number"
              min="1"
              value={totalPossiblePoints}
              onChange={handleTotalPointsChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="question-count" className="text-sm font-medium text-gray-700">
              Number of Questions
            </Label>
            <Input
              id="question-count"
              type="number"
              min="1"
              value={questionCount}
              onChange={handleQuestionCountChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">Points Distribution</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Marked questions:</span>
                <span className="font-medium">
                  {markedQuestionCount} of {questionCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Assigned points:</span>
                <span className="font-medium">
                  {totalAssignedWeight.toFixed(1)} of {totalPossiblePoints}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Remaining points:</span>
                <span className="font-medium">
                  {remainingWeight.toFixed(1)} for {remainingQuestions} questions
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span>Default per question:</span>
                <span className="font-medium">{pointsPerQuestion.toFixed(1)} points</span>
              </div>
            </div>
          </div>
        </div>

        {markedAnswers.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
            <p className="font-medium">Note: Changing these settings may affect existing marks.</p>
            <p className="mt-1">The point value of each question will be recalculated based on your settings.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default SettingsPanel
