"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import {  getAllExamsByUserId } from "../store/examSlice"
import { getStudentExamsByExamId } from "../store/studentExamSlice"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
// import { useToast } from "@/hooks/use-toast"
import {
  Download,
  FileText,
  Search,
  SortAsc,
  SortDesc,
  User,
  Calendar,
  ArrowUpDown,
  BarChart3,
  PieChart,
  LineChart,
  CheckCircle,
  Clock,
  RefreshCw,
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

  // const { toast } = useToast()
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
      // toast({
      //   title: "Success",
      //   description: "Student grades loaded successfully",
      //   variant: "success",
      // })
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to load student grades",
      //   variant: "destructive",
      // })
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

  // Mock data for trends over time
  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Average grade",
        data: [65, 68, 72, 75, 82, 85],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  if (loading && !isRefreshing && !selectedExam) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Grades Overview</h1>
            <p className="text-muted-foreground">Comprehensive view of student performance across exams</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                // toast({
                //   title: "Export successful",
                //   description: "Grades data exported as Excel file",
                //   variant: "success",
                // })
              }}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Table View
                  </div>
                </SelectItem>
                <SelectItem value="bar">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Bar Chart
                  </div>
                </SelectItem>
                <SelectItem value="pie">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Pie Chart
                  </div>
                </SelectItem>
                <SelectItem value="line">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    Trend Line
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
            <Select value={selectedExam || ""} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-[250px]">
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

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => selectedExam && fetchStudentExams(Number.parseInt(selectedExam))}
            disabled={isRefreshing || !selectedExam}
            className="flex items-center gap-1"
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Exam Selected</h3>
            <p className="text-gray-500 max-w-md">
              Please select an exam from the dropdown above to view student grades and performance data.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    {checkedExams} checked, {totalStudents - checkedExams} pending
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average grade</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averagegrade.toFixed(1)}</div>
                  <Progress value={averagegrade} className="h-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Highest grade</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {studentExams.length > 0 ? Math.max(...studentExams.map((exam) => exam.grade || 0)) : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">Top performing student</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalStudents > 0 ? `${Math.round((checkedExams / totalStudents) * 100)}%` : "0%"}
                  </div>
                  <Progress value={totalStudents > 0 ? (checkedExams / totalStudents) * 100 : 0} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {selectedView === "table" && (
              <Card>
                <CardHeader>
                  <CardTitle>Student Grades</CardTitle>
                  <CardDescription>Detailed breakdown of student performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("studentName")}>
                            <div className="flex items-center space-x-1">
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
                          <TableHead className="cursor-pointer" onClick={() => handleSort("grade")}>
                            <div className="flex items-center space-x-1">
                              <span>grade</span>
                              {sortConfig.key === "grade" &&
                                (sortConfig.direction === "ascending" ? (
                                  <SortAsc className="h-4 w-4" />
                                ) : (
                                  <SortDesc className="h-4 w-4" />
                                ))}
                              {sortConfig.key !== "grade" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                            </div>
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("checkedAt")}>
                            <div className="flex items-center space-x-1">
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
                            <TableCell colSpan={4} className="h-24 text-center">
                              No results found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedExams.map((exam) => (
                            <TableRow key={exam.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {exam.student.firstName || "Unknown"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">ID: {exam.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {exam.isChecked ? (
                                  <div className="flex flex-col">
                                    <span className="font-medium">{exam.grade || 0}/100</span>
                                    <Progress value={exam.grade || 0} className="h-2 w-16" />
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Not graded</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {exam.isChecked ? (
                                  <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Checked
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-100 text-red-800 hover:bg-red-100"
                                  >
                                    <Clock className="mr-1 h-3 w-3" />
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {exam.checkedAt ? (
                                  <div className="flex items-center">
                                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                                    <span>{new Date(exam.checkedAt).toLocaleDateString()}</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
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
              <Card>
                <CardHeader>
                  <CardTitle>grade Distribution</CardTitle>
                  <CardDescription>Breakdown of student grades by range</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-80">
                    <Bar
                      data={gradedistribution}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedView === "pie" && (
              <Card>
                <CardHeader>
                  <CardTitle>Exam Status</CardTitle>
                  <CardDescription>Checked vs. unchecked exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <Doughnut
                      data={statusDistribution}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedView === "line" && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>Average grade over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line
                      data={trendData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
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
