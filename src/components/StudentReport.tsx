"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import {  getAllExamsByUserId } from "../store/examSlice"
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
  const uniqueStudents = Array.from(
    new Map(
      studentExams.map((exam) => [exam.student.id, exam.student])
    ).values()
  )
  const selectedStudentObj = uniqueStudents.find(s => s.id.toString() === selectedStudent)
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
      .map((exam) => exam.student.firstName +" "+ exam.student.lastName || "Exam")
      .slice(0, 10),
    datasets: [
      {
        label: "grade",
        data: studentData
          .sort((a, b) => {
            if (!a.checkedAt || !b.checkedAt) return 0
            return new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()
          })
          .map((exam) => exam.grade || 0)
          .slice(0, 10),
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
            <h1 className="text-2xl font-bold tracking-tight">Student Report</h1>
            <p className="text-muted-foreground">Detailed performance analysis for individual students</p>
          </div>
          <div className="flex items-center gap-2">
          <Button
  variant="outline"
  size="sm"
  className="flex items-center gap-1"
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

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <Select value={selectedStudent || ""} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
            {uniqueStudents.map((student) => (
  <SelectItem key={student.id} value={student.id.toString()}>
    {student.firstName} {student.lastName}
  </SelectItem>
))}

            </SelectContent>
          </Select>

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

        {!selectedStudent ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Student Selected</h3>
            <p className="text-gray-500 max-w-md">
              Please select a student from the dropdown above to view their detailed performance report.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="space-y-2">
                    <h3 className="text-xl font-medium">
  {selectedStudentObj?.firstName} {selectedStudentObj?.lastName}
</h3>
<div className="flex items-center text-sm text-gray-500">
  <Mail className="mr-2 h-4 w-4" />
  <span>{selectedStudentObj?.email || "No email available"}</span>
</div>


                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Average grade</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{averagegrade.toFixed(1)}</span>
                        {averagegrade > 75 ? (
                          <Badge variant="default" className="flex items-center">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Good
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center bg-red-100 text-red-800">
                            <TrendingDown className="mr-1 h-3 w-3" />
                            Needs Improvement
                          </Badge>
                        )}
                      </div>
                      <Progress value={averagegrade} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Highest grade</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{highestgrade}</span>
                        <Badge variant="outline" className="flex items-center">
                          <Award className="mr-1 h-3 w-3" />
                          Best
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Completed Exams</p>
                      <p className="text-2xl font-bold">{completedExams}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Last Exam</p>
                      <p className="text-lg font-medium">
                        {studentData.length > 0 && studentData[0].checkedAt
                          ? new Date(studentData[0].checkedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="exams">Exam History</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                    <CardDescription>Student's grade progression over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Line
                      data={performanceTrend}
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
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Excellent understanding of core concepts</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Strong problem-solving skills</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Consistent performance across exams</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-red-500" />
                          <span>Time management during exams</span>
                        </li>
                        <li className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-red-500" />
                          <span>Attention to detail in complex questions</span>
                        </li>
                        <li className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-red-500" />
                          <span>Application of theoretical knowledge</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

          
              <TabsContent value="exams" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Exam History</CardTitle>
                    <CardDescription>Complete record of all exams taken by the student</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Exam Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              grade
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {studentData.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                No exam records found
                              </td>
                            </tr>
                          ) : (
                            studentData.map((exam) => (
                              <tr key={exam.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {exam.student.firstName} {exam.student.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {exam.checkedAt ? new Date(exam.checkedAt).toLocaleDateString() : "Not available"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {exam.isChecked ? (
                                    <span className="font-medium">{exam.grade || 0}/100</span>
                                  ) : (
                                    <span className="text-gray-400">Not graded</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {exam.isChecked ? (
                                    <Badge variant="outline" className="bg-red-100 text-red-800">
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-100 text-red-800">
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
