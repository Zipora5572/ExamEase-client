"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Check, X, Circle, PenTool, Hand, Eraser, ChevronRight, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ExamViewerSidebarProps {
  exam: any
  grade: number
  setgrade: (grade: number) => void
  evaluation: string
  setEvaluation: (evaluation: string) => void
  markedAnswers: any[]
  setMarkedAnswers: (answers: any[]) => void
  selectedTemplate: string | null
  setSelectedTemplate: (template: string | null) => void
  pointsPerQuestion: number
  totalPossiblePoints: number
  questionWeights: Record<string, number>
  setQuestionWeights: (weights: Record<string, number>) => void
}

const ExamViewerSidebar = ({
  grade,
  setgrade,
  evaluation,
  setEvaluation,
  selectedTemplate,
  setSelectedTemplate,
  pointsPerQuestion,
  markedAnswers,
  totalPossiblePoints,
  questionWeights,
  setQuestionWeights,
  setMarkedAnswers,
}: ExamViewerSidebarProps) => {
  const [manualGrade, setManualGrade] = useState<number | string>(Math.max(0, Math.round(grade)))
  const [isManualGradeMode, setIsManualGradeMode] = useState(false)
  const [showMarkedQuestions, setShowMarkedQuestions] = useState(true)

  // Update manual grade when calculated grade changes
  useEffect(() => {
    if (!isManualGradeMode) {
      setManualGrade(Math.max(0, Math.round(grade)))
    }
  }, [grade, isManualGradeMode])

  const handleGradeChange = (value: number[]) => {
    setManualGrade(value[0])
    setgrade(value[0])
    setIsManualGradeMode(true)
  }

  const handleManualGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setManualGrade(value)

    const numValue = Number(value)
    if (!isNaN(numValue)) {
      setgrade(Math.min(totalPossiblePoints, Math.max(0, numValue)))
      setIsManualGradeMode(true)
    }
  }

  const handleEvaluationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvaluation(e.target.value)
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template === selectedTemplate ? null : template)
  }

  const resetManualGrade = () => {
    setIsManualGradeMode(false)
    setManualGrade(Math.max(0, Math.round(grade)))
    setgrade(grade)
  }

  // Filter marked answers for correct/incorrect only
  const gradedMarks = markedAnswers.filter((mark) => mark.type === "correct" || mark.type === "incorrect")

  return (
    <div className="w-full md:w-80 flex flex-col h-full border-t md:border-t-0 md:border-l border-gray-200 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-4 p-4 pb-16">
          {/* Score Card */}
          <Card className="shadow-sm border-gray-200 overflow-hidden">
            <CardHeader className="pb-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Final Score</CardTitle>
                {isManualGradeMode && (
                  <Button variant="ghost" size="sm" onClick={resetManualGrade} className="h-7 text-xs">
                    Reset
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Score</span>
                    {isManualGradeMode && (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        Manual
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={manualGrade}
                        onChange={handleManualGradeChange}
                        className="w-16 h-8 text-right font-bold text-red-600"
                        min={0}
                        max={totalPossiblePoints}
                      />
                      <span className="text-lg font-bold text-gray-700">/ {totalPossiblePoints}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {totalPossiblePoints > 0 ? Math.max(0, Math.round((grade / totalPossiblePoints) * 100)) : 0}%
                    </div>
                  </div>
                </div>
                <Slider
                  value={[Math.max(0, isManualGradeMode ? Number(manualGrade) : grade)]}
                  max={totalPossiblePoints}
                  step={1}
                  onValueChange={handleGradeChange}
                  className="[&_[role=slider]]:bg-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{Math.round(totalPossiblePoints * 0.25)}</span>
                  <span>{Math.round(totalPossiblePoints * 0.5)}</span>
                  <span>{Math.round(totalPossiblePoints * 0.75)}</span>
                  <span>{totalPossiblePoints}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marking Tools */}
          <Card className="shadow-sm border-gray-200 overflow-hidden">
            <CardHeader className="pb-2 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900">Marking Tools</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedTemplate === "correct" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 h-auto ${
                      selectedTemplate === "correct"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => handleTemplateSelect("correct")}
                  >
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                    <span className="text-xs">Correct</span>
                    <span className="text-xs mt-1 font-medium">+{pointsPerQuestion.toFixed(1)}</span>
                  </Button>
                  <Button
                    variant={selectedTemplate === "incorrect" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 h-auto ${
                      selectedTemplate === "incorrect"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => handleTemplateSelect("incorrect")}
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                    <span className="text-xs">Incorrect</span>
                    <span className="text-xs mt-1 font-medium">-{pointsPerQuestion.toFixed(1)}</span>
                  </Button>
                  <Button
                    variant={selectedTemplate === "circle" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 h-auto ${
                      selectedTemplate === "circle"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => handleTemplateSelect("circle")}
                  >
                    <Circle className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                    <span className="text-xs">Circle</span>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedTemplate === "pen" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 h-auto ${
                      selectedTemplate === "pen"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => handleTemplateSelect("pen")}
                  >
                    <PenTool className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                    <span className="text-xs">Pen</span>
                  </Button>
                  <Button
                    variant={selectedTemplate === "hand" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 h-auto ${
                      selectedTemplate === "hand"
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => handleTemplateSelect("hand")}
                  >
                    <Hand className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                    <span className="text-xs">Pan</span>
                  </Button>
                  <Button
                    variant={selectedTemplate === "eraser" ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 h-auto ${
                      selectedTemplate === "eraser"
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => handleTemplateSelect("eraser")}
                  >
                    <Eraser className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                    <span className="text-xs">Eraser</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marked Questions List */}
          {gradedMarks.length > 0 && (
            <Card className="shadow-sm border-gray-200 overflow-hidden">
              <CardHeader
                className="pb-2 border-b border-gray-200 cursor-pointer"
                onClick={() => setShowMarkedQuestions(!showMarkedQuestions)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Marked Questions</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    {showMarkedQuestions ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showMarkedQuestions && (
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {gradedMarks.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">No marked questions yet</p>
                    ) : (
                      gradedMarks.map((mark, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border border-gray-200 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            {mark.type === "correct" ? (
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                <X className="h-4 w-4 text-red-600" />
                              </div>
                            )}
                            <span className="text-sm font-medium">Question {index + 1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">
                              {mark.type === "correct" ? (
                                <span className="text-green-600">+{Math.abs(mark.score).toFixed(1)}</span>
                              ) : (
                                <span className="text-red-600">-{Math.abs(mark.score).toFixed(1)}</span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                // Remove this mark from markedAnswers
                                const updatedAnswers = markedAnswers.filter(
                                  (_, i) => !(markedAnswers[i].id === mark.id),
                                )
                                setMarkedAnswers(updatedAnswers)

                                // If the mark has an ID, remove it from questionWeights
                                if (mark.id) {
                                  const newWeights = { ...questionWeights }
                                  delete newWeights[mark.id]
                                  setQuestionWeights(newWeights)
                                }

                                // Update the grade immediately
                                const newGrade = updatedAnswers.reduce((total, m) => {
                                  if (m.type === "correct" && m.score) {
                                    return total + m.score
                                  }
                                  return total
                                }, 0)

                                setgrade(Math.max(0, newGrade))
                              }}
                              className="ml-1 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete mark"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Evaluation */}
          <Card className="shadow-sm border-gray-200 overflow-hidden">
            <CardHeader className="pb-2 border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900">Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                placeholder="Add your evaluation comments here..."
                value={evaluation}
                onChange={handleEvaluationChange}
                className="min-h-[120px] resize-none border-gray-300 focus-visible:ring-red-500"
              />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ExamViewerSidebar
