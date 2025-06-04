"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { getAllExamsByUserId } from "../store/examSlice"
import { getStudentExamsByExamId } from "../store/studentExamSlice"
import { Line } from "react-chartjs-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  CheckCircle,
  Clock,
  RefreshCw,
  Mail,
  Award,
  TrendingUp,
  TrendingDown,
  FileText,
  GraduationCap,
  Calendar,
  Target,
} from "lucide-react"
import ExportDialog from "./StudentsExams/StudentExamsList/ExportDialog"

const StudentReport = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPrinting] = useState(false)

  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")
  const [exportOptions, setExportOptions] = useState({
    includeGrades: true,
    includeComments: true,
    includeTimestamps: true,
  })
  const dispatch = useDispatch<AppDispatch>()

  const exams = useSelector((state: StoreType) => state.exams.exams)
  const studentExams = useSelector((state: StoreType) => state.studentExams.examsByExamId)
  const loading = useSelector((state: StoreType) => state.studentExams.loading)
  const user = useSelector((state: StoreType) => state.auth.user)
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
    } catch (error) {
    } finally {
      setIsRefreshing(false)
    }
  }

  // Get unique students from all exams
  const uniqueStudents = Array.from(new Map(studentExams.map((exam) => [exam.student.id, exam.student])).values())
  const selectedStudentObj = uniqueStudents.find((s) => s.id.toString() === selectedStudent)
  const studentData = selectedStudent
    ? studentExams.filter((exam) => exam.student.id.toString() === selectedStudent)
    : []

  // Calculate student statistics
  const averagegrade =
    studentData.length > 0 ? studentData.reduce((sum, exam) => sum + (exam.grade || 0), 0) / studentData.length : 0

  const highestgrade = studentData.length > 0 ? Math.max(...studentData.map((exam) => exam.grade || 0)) : 0

  const completedExams = studentData.filter((exam) => exam.isChecked).length

  // Performance trend data
  const performanceTrend = {
    labels: studentData
      .sort((a, b) => {
        if (!a.checkedAt || !b.checkedAt) return 0
        return new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()
      })
      .map((exam) => exam.student.firstName + " " + exam.student.lastName || "Exam")
      .slice(0, 10),
    datasets: [
      {
        label: "Grade",
        data: studentData
          .sort((a, b) => {
            if (!a.checkedAt || !b.checkedAt) return 0
            return new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()
          })
          .map((exam) => exam.grade || 0)
          .slice(0, 10),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointRadius: 6,
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
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Report</h1>
            <p className="text-slate-600">Detailed performance analysis for individual students</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:border-slate-300"
              onClick={() => setIsExportDialogOpen(true)}
              disabled={!selectedStudent}
            >
              {isPrinting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <Select value={selectedStudent || ""} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-full lg:w-[280px] border-slate-200 bg-white shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 bg-white shadow-lg">
              {uniqueStudents.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()} className="hover:bg-slate-50">
                  {student.firstName} {student.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedExam || ""} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-full lg:w-[280px] border-slate-200 bg-white shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
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
            <SelectTrigger className="w-full lg:w-[180px] border-slate-200 bg-white shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 bg-white shadow-lg">
              <SelectItem value="all" className="hover:bg-slate-50">
                All Time
              </SelectItem>
              <SelectItem value="week" className="hover:bg-slate-50">
                Last Week
              </SelectItem>
              <SelectItem value="month" className="hover:bg-slate-50">
                Last Month
              </SelectItem>
              <SelectItem value="year" className="hover:bg-slate-50">
                Last Year
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => selectedExam && fetchStudentExams(Number.parseInt(selectedExam))}
            disabled={isRefreshing || !selectedExam}
            className="flex items-center gap-2 border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>

        {!selectedStudent ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/60 py-24 shadow-sm backdrop-blur-sm">
            <div className="rounded-full bg-slate-100 p-6 mb-6">
              <User className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">No Student Selected</h3>
            <p className="text-slate-600 text-center max-w-md leading-relaxed">
              Please select a student from the dropdown above to view their detailed performance report.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 ring-4 ring-white shadow-sm">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {selectedStudentObj?.firstName} {selectedStudentObj?.lastName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-4 w-4" />
                        <span>{selectedStudentObj?.email || "No email available"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-emerald-50 p-1.5">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Average Grade</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-slate-900">{averagegrade.toFixed(1)}</span>
                          {averagegrade > 75 ? (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              Good
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100">
                              <TrendingDown className="mr-1 h-3 w-3" />
                              Needs Improvement
                            </Badge>
                          )}
                        </div>
                        <Progress value={averagegrade} className="h-2 bg-slate-100" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-purple-50 p-1.5">
                          <Award className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Highest Grade</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-slate-900">{highestgrade}</span>
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                          <Award className="mr-1 h-3 w-3" />
                          Best
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-blue-50 p-1.5">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Completed Exams</p>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{completedExams}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-amber-50 p-1.5">
                          <Calendar className="h-4 w-4 text-amber-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Last Exam</p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">
                        {studentData.length > 0 && studentData[0].checkedAt
                          ? new Date(studentData[0].checkedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="performance" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger
                  value="performance"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger
                  value="exams"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Exam History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-6">
                <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">Performance Trend</CardTitle>
                    <CardDescription className="text-slate-600">Student's grade progression over time</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-80">
                      <Line
                        data={performanceTrend}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              grid: {
                                color: "rgba(148, 163, 184, 0.1)",
                              },
                              border: {
                                display: false,
                              },
                            },
                            x: {
                              grid: {
                                display: false,
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

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-slate-900">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="rounded-full bg-emerald-50 p-1">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-slate-700">Excellent understanding of core concepts</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="rounded-full bg-emerald-50 p-1">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-slate-700">Strong problem-solving skills</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="rounded-full bg-emerald-50 p-1">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-slate-700">Consistent performance across exams</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold text-slate-900">Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="rounded-full bg-amber-50 p-1">
                            <Clock className="h-4 w-4 text-amber-600" />
                          </div>
                          <span className="text-slate-700">Time management during exams</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="rounded-full bg-amber-50 p-1">
                            <Target className="h-4 w-4 text-amber-600" />
                          </div>
                          <span className="text-slate-700">Attention to detail in complex questions</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="rounded-full bg-amber-50 p-1">
                            <Clock className="h-4 w-4 text-amber-600" />
                          </div>
                          <span className="text-slate-700">Application of theoretical knowledge</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="exams" className="space-y-6">
                <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900">Exam History</CardTitle>
                    <CardDescription className="text-slate-600">
                      Complete record of all exams taken by the student
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50/80">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                            >
                              Exam Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                            >
                              Grade
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {studentData.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                                No exam records found
                              </td>
                            </tr>
                          ) : (
                            studentData.map((exam) => (
                              <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                  {exam.student.firstName} {exam.student.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                  {exam.checkedAt ? new Date(exam.checkedAt).toLocaleDateString() : "Not available"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                  {exam.isChecked ? (
                                    <span className="font-semibold text-slate-900">{exam.grade || 0}/100</span>
                                  ) : (
                                    <span className="text-slate-400">Not graded</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                  {exam.isChecked ? (
                                    <Badge
                                      variant="secondary"
                                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    >
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="secondary"
                                      className="bg-amber-50 text-amber-700 hover:bg-amber-100"
                                    >
                                      Pending
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        exportOptions={exportOptions}
        setExportOptions={setExportOptions}
        studentExams={studentData}
        examId={Number(selectedExam)}
      />
    </div>
  )
}

export default StudentReport
