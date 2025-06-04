"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { getAllExamsByUserId } from "../store/examSlice"
import { getStudentExamsByExamId } from "../store/studentExamSlice"
import { Bar, Doughnut } from "react-chartjs-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Search,
  SortAsc,
  SortDesc,
  User,
  Calendar,
  ArrowUpDown,
  BarChart3,
  PieChart,
  CheckCircle,
  Clock,
  RefreshCw,
  Users,
  TrendingUp,
  Award,
  Target,
} from "lucide-react"

const GradesOverview = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "studentName",
    direction: "ascending",
  })
  const [timeRange, setTimeRange] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedView, setSelectedView] = useState("table")

  const dispatch = useDispatch<AppDispatch>()
  const exams = useSelector((state: StoreType) => state.exams.exams)
  const user = useSelector((state: StoreType) => state.auth.user)
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
    } catch (error) {
    } finally {
      setIsRefreshing(false)
    }
  }

  // Filter and sort student exams
  const filteredExams = studentExams.filter((exam) => {
    const matchesSearch =
      exam.student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.student.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    if (timeRange === "all") return matchesSearch

    if (!exam.checkedAt) return false

    const examDate = new Date(exam.checkedAt)
    const now = new Date()

    if (timeRange === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(now.getDate() - 7)
      return matchesSearch && examDate >= weekAgo
    }

    if (timeRange === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(now.getMonth() - 1)
      return matchesSearch && examDate >= monthAgo
    }

    if (timeRange === "year") {
      const yearAgo = new Date()
      yearAgo.setFullYear(now.getFullYear() - 1)
      return matchesSearch && examDate >= yearAgo
    }

    return matchesSearch
  })

  const sortedExams = [...filteredExams].sort((a, b) => {
    let aValue, bValue

    switch (sortConfig.key) {
      case "studentName":
        aValue = a.student.firstName || ""
        bValue = b.student.lastName || ""
        break
      case "grade":
        aValue = a.grade || 0
        bValue = b.grade || 0
        break
      case "checkedAt":
        aValue = a.checkedAt ? new Date(a.checkedAt).getTime() : 0
        bValue = b.checkedAt ? new Date(b.checkedAt).getTime() : 0
        break
      default:
        aValue = a.student.firstName || ""
        bValue = b.student.lastName || ""
    }

    if (sortConfig.direction === "ascending") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  // Calculate statistics
  const totalStudents = studentExams.length
  const checkedExams = studentExams.filter((exam) => exam.isChecked).length
  const averagegrade =
    studentExams.length > 0 ? studentExams.reduce((sum, exam) => sum + (exam.grade || 0), 0) / totalStudents : 0

  const gradedistribution = {
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

  // Mock data for trends over time

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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Grades Overview</h1>
            <p className="text-slate-600">Comprehensive view of student performance across exams</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-[180px] border-slate-200 bg-white shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 bg-white shadow-lg">
                <SelectItem value="table" className="hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Table View
                  </div>
                </SelectItem>
                <SelectItem value="bar" className="hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Bar Chart
                  </div>
                </SelectItem>
                <SelectItem value="pie" className="hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Pie Chart
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-10 w-full lg:w-[320px] border-slate-200 bg-white shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

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
          </div>

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

        {!selectedExam ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/60 py-24 shadow-sm backdrop-blur-sm">
            <div className="rounded-full bg-slate-100 p-6 mb-6">
              <FileText className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">No Exam Selected</h3>
            <p className="text-slate-600 text-center max-w-md leading-relaxed">
              Please select an exam from the dropdown above to view student grades and performance data.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Students</CardTitle>
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{totalStudents}</div>
                  <p className="text-sm text-slate-500">
                    {checkedExams} checked, {totalStudents - checkedExams} pending
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Average Grade</CardTitle>
                  <div className="rounded-lg bg-emerald-50 p-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{averagegrade.toFixed(1)}</div>
                  <Progress value={averagegrade} className="h-2 bg-slate-100" />
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Highest Grade</CardTitle>
                  <div className="rounded-lg bg-purple-50 p-2">
                    <Award className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {studentExams.length > 0 ? Math.max(...studentExams.map((exam) => exam.grade || 0)) : "N/A"}
                  </div>
                  <p className="text-sm text-slate-500">Top performing student</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">Completion Rate</CardTitle>
                  <div className="rounded-lg bg-amber-50 p-2">
                    <Target className="h-4 w-4 text-amber-600" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {totalStudents > 0 ? `${Math.round((checkedExams / totalStudents) * 100)}%` : "0%"}
                  </div>
                  <Progress
                    value={totalStudents > 0 ? (checkedExams / totalStudents) * 100 : 0}
                    className="h-2 bg-slate-100"
                  />
                </CardContent>
              </Card>
            </div>

            {selectedView === "table" && (
              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Student Grades</CardTitle>
                  <CardDescription className="text-slate-600">
                    Detailed breakdown of student performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                          <TableHead
                            className="cursor-pointer font-semibold text-slate-700"
                            onClick={() => handleSort("studentName")}
                          >
                            <div className="flex items-center space-x-2">
                              <span>Student</span>
                              {sortConfig.key === "studentName" &&
                                (sortConfig.direction === "ascending" ? (
                                  <SortAsc className="h-4 w-4" />
                                ) : (
                                  <SortDesc className="h-4 w-4" />
                                ))}
                              {sortConfig.key !== "studentName" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                            </div>
                          </TableHead>
                          <TableHead
                            className="cursor-pointer font-semibold text-slate-700"
                            onClick={() => handleSort("grade")}
                          >
                            <div className="flex items-center space-x-2">
                              <span>Grade</span>
                              {sortConfig.key === "grade" &&
                                (sortConfig.direction === "ascending" ? (
                                  <SortAsc className="h-4 w-4" />
                                ) : (
                                  <SortDesc className="h-4 w-4" />
                                ))}
                              {sortConfig.key !== "grade" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">Status</TableHead>
                          <TableHead
                            className="cursor-pointer font-semibold text-slate-700"
                            onClick={() => handleSort("checkedAt")}
                          >
                            <div className="flex items-center space-x-2">
                              <span>Checked At</span>
                              {sortConfig.key === "checkedAt" &&
                                (sortConfig.direction === "ascending" ? (
                                  <SortAsc className="h-4 w-4" />
                                ) : (
                                  <SortDesc className="h-4 w-4" />
                                ))}
                              {sortConfig.key !== "checkedAt" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedExams.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                              No results found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedExams.map((exam) => (
                            <TableRow key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 ring-2 ring-white shadow-sm">
                                    <User className="h-5 w-5 text-slate-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900">
                                      {exam.student.firstName || "Unknown"}
                                    </div>
                                    <div className="text-xs text-slate-500">ID: {exam.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {exam.isChecked ? (
                                  <div className="flex flex-col space-y-2">
                                    <span className="font-semibold text-slate-900">{exam.grade || 0}/100</span>
                                    <Progress value={exam.grade || 0} className="h-2 w-20 bg-slate-100" />
                                  </div>
                                ) : (
                                  <span className="text-slate-400">Not graded</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {exam.isChecked ? (
                                  <Badge
                                    variant="secondary"
                                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  >
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Checked
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                                    <Clock className="mr-1 h-3 w-3" />
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {exam.checkedAt ? (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">
                                      {new Date(exam.checkedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedView === "bar" && (
              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Grade Distribution</CardTitle>
                  <CardDescription className="text-slate-600">Breakdown of student grades by range</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <Bar
                      data={gradedistribution}
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
            )}

            {selectedView === "pie" && (
              <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">Exam Status</CardTitle>
                  <CardDescription className="text-slate-600">Checked vs. unchecked exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center p-4">
                    <Doughnut
                      data={statusDistribution}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
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
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default GradesOverview
