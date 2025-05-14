"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Circle, PenTool, Hand, Eraser, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ExamViewerSidebarProps {
  exam: any
  grade: number
  setgrade: (grade: number) => void
  evaluation: string
  setEvaluation: (evaluation: string) => void
  markedAnswers: any[]
  setMarkedAnswers: (answers: any[]) => void
  studentExams: any[]
  selectedTemplate: string | null
  setSelectedTemplate: (template: string | null) => void
  totalPossiblePoints: number
  setTotalPossiblePoints: (points: number) => void
  questionWeights: Record<string, number>
  setQuestionWeights: (weights: Record<string, number>) => void
  pointsPerQuestion: number
  setPointsPerQuestion: (points: number) => void
  questionCount: number
  setQuestionCount: (count: number) => void
}

const ExamViewerSidebar = ({
  grade,
  setgrade,
  evaluation,
  setEvaluation,
  selectedTemplate,
  setSelectedTemplate,
  totalPossiblePoints,
  setTotalPossiblePoints,
  questionWeights,
  setQuestionWeights,
  pointsPerQuestion,
  setPointsPerQuestion,
  questionCount,
  setQuestionCount,
}: ExamViewerSidebarProps) => {
  const [activeTab, setActiveTab] = useState("grading")

  // Update points per question when total points or question count changes
  useEffect(() => {
    if (questionCount > 0) {
      // Calculate total assigned points
      const totalAssignedPoints = Object.values(questionWeights).reduce((sum, weight) => sum + weight, 0)

      // Calculate remaining points and questions
      const remainingPoints = totalPossiblePoints - totalAssignedPoints
      const markedQuestionCount = Object.keys(questionWeights).length
      const remainingQuestions = Math.max(1, questionCount - markedQuestionCount)

      // Calculate default points per remaining question
      const defaultPointsPerQuestion = remainingPoints / remainingQuestions

      setPointsPerQuestion(Math.max(0, defaultPointsPerQuestion))

      // Save settings to localStorage
      saveSettingsToLocalStorage()
    }
  }, [totalPossiblePoints, questionCount, questionWeights])

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = loadSettingsFromLocalStorage()
    if (savedSettings) {
      setTotalPossiblePoints(savedSettings.totalPossiblePoints)
      setQuestionCount(savedSettings.questionCount)
      setQuestionWeights(savedSettings.questionWeights || {})
    }
  }, [])

  // Save settings to localStorage
  const saveSettingsToLocalStorage = () => {
    const settings = {
      totalPossiblePoints,
      questionCount,
      questionWeights,
    }
    localStorage.setItem("examGradingSettings", JSON.stringify(settings))
  }

  // Load settings from localStorage
  const loadSettingsFromLocalStorage = () => {
    const savedSettings = localStorage.getItem("examGradingSettings")
    return savedSettings ? JSON.parse(savedSettings) : null
  }

  const handleGradeChange = (value: number[]) => {
    setgrade(value[0])
  }

  const handleEvaluationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvaluation(e.target.value)
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template === selectedTemplate ? null : template)
  }

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

  return (
    <div className="w-80 flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <div className="space-y-4 pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
              <TabsTrigger
                value="grading"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Grading
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Tools
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grading" className="mt-4 space-y-4">
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Score</span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-red-600">
                          {Math.max(0, Math.round(grade))}/{totalPossiblePoints}
                        </span>
                        <div className="text-sm text-gray-500">
                          {totalPossiblePoints > 0 ? Math.max(0, Math.round((grade / totalPossiblePoints) * 100)) : 0}%
                        </div>
                      </div>
                    </div>
                    <Slider
                      value={[Math.max(0, grade)]}
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

              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Evaluation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add your evaluation comments here..."
                    value={evaluation}
                    onChange={handleEvaluationChange}
                    className="min-h-[120px] resize-none border-gray-300 focus-visible:ring-red-500"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="mt-4 space-y-4">
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Marking Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={selectedTemplate === "correct" ? "default" : "outline"}
                        className={`flex flex-col items-center justify-center p-3 h-auto ${
                          selectedTemplate === "correct"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                        onClick={() => handleTemplateSelect("correct")}
                      >
                        <Check className="h-6 w-6 mb-1" />
                        <span className="text-xs">Correct</span>
                        <span className="text-xs mt-1 font-medium">+{pointsPerQuestion.toFixed(1)}</span>
                      </Button>
                      <Button
                        variant={selectedTemplate === "incorrect" ? "default" : "outline"}
                        className={`flex flex-col items-center justify-center p-3 h-auto ${
                          selectedTemplate === "incorrect"
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                        onClick={() => handleTemplateSelect("incorrect")}
                      >
                        <X className="h-6 w-6 mb-1" />
                        <span className="text-xs">Incorrect</span>
                        <span className="text-xs mt-1 font-medium">-{pointsPerQuestion.toFixed(1)}</span>
                      </Button>
                      <Button
                        variant={selectedTemplate === "circle" ? "default" : "outline"}
                        className={`flex flex-col items-center justify-center p-3 h-auto ${
                          selectedTemplate === "circle"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                        onClick={() => handleTemplateSelect("circle")}
                      >
                        <Circle className="h-6 w-6 mb-1" />
                        <span className="text-xs">Circle</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={selectedTemplate === "pen" ? "default" : "outline"}
                        className={`flex flex-col items-center justify-center p-3 h-auto ${
                          selectedTemplate === "pen"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                        onClick={() => handleTemplateSelect("pen")}
                      >
                        <PenTool className="h-6 w-6 mb-1" />
                        <span className="text-xs">Pen</span>
                      </Button>
                      <Button
                        variant={selectedTemplate === "hand" ? "default" : "outline"}
                        className={`flex flex-col items-center justify-center p-3 h-auto ${
                          selectedTemplate === "hand"
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                        onClick={() => handleTemplateSelect("hand")}
                      >
                        <Hand className="h-6 w-6 mb-1" />
                        <span className="text-xs">Pan</span>
                      </Button>
                      <Button
                        variant={selectedTemplate === "eraser" ? "default" : "outline"}
                        className={`flex flex-col items-center justify-center p-3 h-auto ${
                          selectedTemplate === "eraser"
                            ? "bg-gray-600 hover:bg-gray-700 text-white"
                            : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                        onClick={() => handleTemplateSelect("eraser")}
                      >
                        <Eraser className="h-6 w-6 mb-1" />
                        <span className="text-xs">Eraser</span>
                      </Button>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Instructions:</span> Select a marking tool and click on the exam
                        to apply it. For ✓ and ✗ marks, you can assign points for each question.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-4 space-y-4">
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Exam Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-medium mb-1">Points Distribution</p>
                        <p>
                          Each unmarked question is worth{" "}
                          <span className="font-semibold">{pointsPerQuestion.toFixed(1)}</span> points based on current
                          settings.
                        </p>
                        <p className="mt-1">
                          <span className="font-medium">Marked questions:</span> {Object.keys(questionWeights).length}{" "}
                          of {questionCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ExamViewerSidebar
