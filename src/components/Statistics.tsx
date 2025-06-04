"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { getAllExamsByUserId } from "../store/examSlice"
import { getStudentExamsByExamId } from "../store/studentExamSlice"
// import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, BarChart4, TrendingUp, Users, Award, Target } from "lucide-react"
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
  const user = useSelector((state: StoreType) => state.auth.user)
  const exams = useSelector((state: StoreType) => state.exams.exams)
  const studentExams = useSelector((state: StoreType) => state.studentExams.examsByExamId)
  const loading = useSelector((state: StoreType) => state.studentExams.loading)

  useEffect(() => {
    dispatch(getAllExamsByUserId(user?.id))
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
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 0,
        borderRadius: 8,
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
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(156, 163, 175, 0.8)"],
        borderColor: ["rgba(34, 197, 94, 1)", "rgba(156, 163, 175, 1)"],
        borderWidth: 0,
      },
    ],
  }

  if (loading && !isRefreshing && !selectedExam) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-12 w-80" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Exam Statistics</h1>
            <p className="text-slate-600">Analyze student performance and exam results with detailed insights</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Select value={selectedExam || ""} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-full sm:w-[220px] border-slate-200 bg-white shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="Select an exam" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 bg-white shadow-lg">
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id.toString()} className="hover:bg-slate-50">
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[160px] border-slate-200 bg-white shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 bg-white shadow-lg">
                <SelectItem value="all" className="hover:bg-slate-50">
                  All time
                </SelectItem>
                <SelectItem value="month" className="hover:bg-slate-50">
                  Last month
                </SelectItem>
                <SelectItem value="week" className="hover:bg-slate-50">
                  Last week
                </SelectItem>
                <SelectItem value="day" className="hover:bg-slate-50">
                  Last 24 hours
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => selectedExam && fetchStudentExams(Number.parseInt(selectedExam))}
              disabled={isRefreshing || !selectedExam}
              className="flex items-center gap-2 border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {!selectedExam ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/60 py-24 shadow-sm backdrop-blur-sm">
            <div className="rounded-full bg-slate-100 p-6 mb-6">
              <BarChart4 className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">No Exam Selected</h3>
            <p className="text-slate-600 text-center max-w-md leading-relaxed">
              Please select an exam from the dropdown above to view comprehensive statistics and analytics.
            </p>
          </div>
        ) : (
          <>
            {/* Key metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-600">Total Students</CardTitle>
                    <div className="rounded-lg bg-blue-50 p-2">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{totalStudents}</div>
                  <p className="text-sm text-slate-500">
                    {checkedExams} checked ({Math.round((checkedExams / totalStudents) * 100) || 0}%)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-600">Average Grade</CardTitle>
                    <div className="rounded-lg bg-emerald-50 p-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{averagegrade.toFixed(1)}</div>
                  <p className="text-sm text-slate-500">Out of 100 points</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-600">Passing Rate</CardTitle>
                    <div className="rounded-lg bg-amber-50 p-2">
                      <Target className="h-4 w-4 text-amber-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{passingRate.toFixed(1)}%</div>
                  <p className="text-sm text-slate-500">Students scoring 60 or above</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-600">Highest Grade</CardTitle>
                    <div className="rounded-lg bg-purple-50 p-2">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {studentExams.length > 0 ? Math.max(...studentExams.map((exam) => exam.grade || 0)) : 0}
                  </div>
                  <p className="text-sm text-slate-500">Out of 100 points</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different chart views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger
                  value="overview"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="distribution"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Grade Distribution
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-slate-900">Grade Distribution</CardTitle>
                      <CardDescription className="text-slate-600">Breakdown of student grades by range</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 p-4">
                        <Bar
                          data={gradeDistribution}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              title: {
                                display: false,
                              },
                            },
                            scales: {
                              x: {
                                grid: {
                                  display: false,
                                },
                                border: {
                                  display: false,
                                },
                              },
                              y: {
                                grid: {
                                  color: "rgba(148, 163, 184, 0.1)",
                                },
                                border: {
                                  display: false,
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-slate-900">Exam Status</CardTitle>
                      <CardDescription className="text-slate-600">Checked vs. unchecked exams</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center p-4">
                        <Pie
                          data={statusDistribution}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "bottom" as const,
                                labels: {
                                  usePointStyle: true,
                                  padding: 20,
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="distribution">
                <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">Detailed Grade Distribution</CardTitle>
                    <CardDescription className="text-slate-600">
                      Comprehensive breakdown of student performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 p-4">
                      <Bar
                        data={gradeDistribution}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                            title: {
                              display: false,
                            },
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                              border: {
                                display: false,
                              },
                            },
                            y: {
                              grid: {
                                color: "rgba(148, 163, 184, 0.1)",
                              },
                              border: {
                                display: false,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-slate-500 bg-slate-50/50 rounded-b-lg">
                    Data based on {totalStudents} student submissions
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
