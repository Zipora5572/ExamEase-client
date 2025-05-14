"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { getAllExams } from "../store/examSlice"
import { getStudentExamsByExamId } from "../store/studentExamSlice"
// import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, BarChart4 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Import Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Pie } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

const Statistics = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const dispatch = useDispatch<AppDispatch>()
  // const { toast } = useToast()

  const exams = useSelector((state: StoreType) => state.exams.exams)
  const studentExams = useSelector((state: StoreType) => state.studentExams.exams)
  const loading = useSelector((state: StoreType) => state.studentExams.loading)

  useEffect(() => {
    dispatch(getAllExams())
  }, [dispatch])

  useEffect(() => {
    if (selectedExam) {
      fetchStudentExams(Number.parseInt(selectedExam))
    }
  }, [selectedExam, dispatch])

  const fetchStudentExams = async (examId: number) => {
    setIsRefreshing(true)
    try {
      await dispatch(getStudentExamsByExamId(examId)).unwrap()
      // toast({
      //   title: "Success",
      //   description: "Exam statistics loaded successfully",
      //   variant: "success",
      // })
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to load exam statistics",
      //   variant: "destructive",
      // })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate statistics
  const totalStudents = studentExams.length
  const checkedExams = studentExams.filter((exam) => exam.isChecked).length
  const averagegrade =
    studentExams.length > 0 ? studentExams.reduce((sum, exam) => sum + (exam.grade || 0), 0) / totalStudents : 0

  const passingRate =
    studentExams.length > 0 ? (studentExams.filter((exam) => (exam.grade || 0) >= 60).length / totalStudents) * 100 : 0

  // grade distribution data
  const gradeDistribution = {
    labels: ["90-100", "80-89", "70-79", "60-69", "Below 60"],
    datasets: [
      {
        label: "Students",
        data: [
          studentExams.filter((exam) => (exam.grade || 0) >= 90).length,
          studentExams.filter((exam) => (exam.grade || 0) >= 80 && (exam.grade || 0) < 90).length,
          studentExams.filter((exam) => (exam.grade || 0) >= 70 && (exam.grade || 0) < 80).length,
          studentExams.filter((exam) => (exam.grade || 0) >= 60 && (exam.grade || 0) < 70).length,
          studentExams.filter((exam) => (exam.grade || 0) < 60).length,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Status distribution data
  const statusDistribution = {
    labels: ["Checked", "Unchecked"],
    datasets: [
      {
        label: "Exams",
        data: [checkedExams, totalStudents - checkedExams],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  }

  // Question difficulty analysis (mock data)
  const questionDifficulty = {
    labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10"],
    datasets: [
      {
        label: "Average grade (%)",
        data: [85, 65, 92, 45, 78, 55, 88, 72, 60, 50],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Performance by topic (mock data)
  const topicPerformance = {
    labels: ["Grammar", "Vocabulary", "Reading", "Writing", "Listening", "Speaking"],
    datasets: [
      {
        label: "Average grade",
        data: [75, 82, 68, 90, 65, 78],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  }

  if (loading && !isRefreshing && !selectedExam) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Exam Statistics</h1>
            <p className="text-muted-foreground">Analyze student performance and exam results</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedExam || ""} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select an exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id.toString()}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="month">Last month</SelectItem>
                <SelectItem value="week">Last week</SelectItem>
                <SelectItem value="day">Last 24 hours</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => selectedExam && fetchStudentExams(Number.parseInt(selectedExam))}
              disabled={isRefreshing || !selectedExam}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {!selectedExam ? (
          <div className="flex flex-col items-center justify-center h-80 border rounded-lg bg-muted/20">
            <BarChart4 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Exam Selected</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Please select an exam from the dropdown above to view statistics and analytics.
            </p>
          </div>
        ) : (
          <>
            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {checkedExams} checked ({Math.round((checkedExams / totalStudents) * 100) || 0}%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{averagegrade.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Out of 100 points</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Passing Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{passingRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Students scoring 60 or above</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Highest grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {studentExams.length > 0 ? Math.max(...studentExams.map((exam) => exam.grade || 0)) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Out of 100 points</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different chart views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="distribution">grade Distribution</TabsTrigger>
                <TabsTrigger value="questions">Question Analysis</TabsTrigger>
                <TabsTrigger value="topics">Topic Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>grade Distribution</CardTitle>
                      <CardDescription>Breakdown of student grades by range</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <Bar
                          data={gradeDistribution}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "top" as const,
                              },
                              title: {
                                display: false,
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Exam Status</CardTitle>
                      <CardDescription>Checked vs. unchecked exams</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <Pie
                          data={statusDistribution}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "top" as const,
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="distribution" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed grade Distribution</CardTitle>
                    <CardDescription>Comprehensive breakdown of student performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <Bar
                        data={gradeDistribution}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top" as const,
                            },
                            title: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Data based on {totalStudents} student submissions
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Question Difficulty Analysis</CardTitle>
                    <CardDescription>Average grades per question</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <Bar
                        data={questionDifficulty}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top" as const,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              title: {
                                display: true,
                                text: "Average grade (%)",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Lower grades indicate more difficult questions
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="topics" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance by Topic</CardTitle>
                    <CardDescription>Average grades across different subject areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <Bar
                        data={topicPerformance}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top" as const,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              title: {
                                display: true,
                                text: "Average grade",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Identifies strengths and areas for improvement
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}

export default Statistics
