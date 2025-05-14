

// import type React from "react"

// import { useEffect, useState } from "react"
// import { getStudentExamsByExamId, updateStudentExam } from "../store/studentExamSlice"
// import { useDispatch, useSelector } from "react-redux"
// import type { AppDispatch, StoreType } from "../store/store"
// import type { StudentExamType } from "../models/Exam"
// import { useLocation, useNavigate } from "react-router-dom"
// import studentExamsService from "../services/StudentExamService"
// import * as XLSX from "xlsx"
// import { Bar, Doughnut } from "react-chartjs-2"
// import {
//   Download,
//   Search,
//   Eye,
//   CheckCircle,
//   MoreHorizontal,
//   RefreshCw,
//   FileText,
//   Calendar,
//   User,
//   Clock,
//   ChevronLeft,
//   ChevronRight,
//   ArrowUpDown,
//   SortAsc,
//   SortDesc,
// } from "lucide-react"
// // import { useToast } from "@/hooks/use-toast"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Progress } from "@/components/ui/progress"

// const StudentsExams = () => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("all")
//   const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
//     key: "studentName",
//     direction: "ascending",
//   })
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage, setItemsPerPage] = useState(10)
//   const [selectedExams, setSelectedExams] = useState<StudentExamType[]>([])
//   const [checkingStatus, setCheckingStatus] = useState<{ [key: string]: "idle" | "pending" | "done" }>({})
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
//   const [exportFormat, setExportFormat] = useState("xlsx")
//   const [exportOptions, setExportOptions] = useState({
//     includeGrades: true,
//     includeComments: true,
//     includeTimestamps: true,
//   })

//   const navigate = useNavigate()
//   const location = useLocation()
//   const { examId, examFileTeacherName } = location.state || {}
//   // const { toast } = useToast()

//   const dispatch = useDispatch<AppDispatch>()

//   useEffect(() => {
//     if (examId) {
//       fetchStudentExams()
//     } else {
//       // toast({
//       //   title: "Error",
//       //   description: "No exam ID provided",
//       //   variant: "destructive",
//       // })
//       navigate("/exams")
//     }
//   }, [examId, dispatch])

//   const fetchStudentExams = async () => {
//     setIsRefreshing(true)
//     try {
//       await dispatch(getStudentExamsByExamId(examId)).unwrap()
//       // toast({
//       //   title: "Success",
//       //   description: "Student exams loaded successfully",
//       //   variant: "success",
//       // })
//     } catch (error) {
//       // toast({
//       //   title: "Error",
//       //   description: "Failed to load student exams",
//       //   variant: "destructive",
//       // })
//     } finally {
//       setIsRefreshing(false)
//     }
//   }

//   const studentExams = useSelector((state: StoreType) => state.studentExams.exams)
//   const loading = useSelector((state: StoreType) => state.studentExams.loading)

//   // Filter and sort exams
//   const filteredExams = studentExams.filter((exam) => {
//     const matchesSearch =
//       exam.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       exam.studentExamName?.toLowerCase().includes(searchQuery.toLowerCase())

//     if (statusFilter === "all") return matchesSearch
//     if (statusFilter === "checked") return matchesSearch && exam.isChecked
//     if (statusFilter === "unchecked") return matchesSearch && !exam.isChecked

//     return matchesSearch
//   })

//   const sortedExams = [...filteredExams].sort((a, b) => {
//     let aValue, bValue

//     switch (sortConfig.key) {
//       case "studentName":
//         aValue = a.studentName || a.studentExamName || ""
//         bValue = b.studentName || b.studentExamName || ""
//         break
//       case "grade":
//         aValue = a.grade || 0
//         bValue = b.grade || 0
//         break
//       case "checkedAt":
//         aValue = a.checkedAt ? new Date(a.checkedAt).getTime() : 0
//         bValue = b.checkedAt ? new Date(b.checkedAt).getTime() : 0
//         break
//       default:
//         aValue = a.studentName || ""
//         bValue = b.studentName || ""
//     }

//     if (sortConfig.direction === "ascending") {
//       return aValue > bValue ? 1 : -1
//     } else {
//       return aValue < bValue ? 1 : -1
//     }
//   })

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentExams = sortedExams.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(sortedExams.length / itemsPerPage)

//   const handleSort = (key: string) => {
//     setSortConfig({
//       key,
//       direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
//     })
//   }

//   const handleSelectExam = (exam: StudentExamType) => {
//     setSelectedExams((prev) =>
//       prev.find((e) => e.id === exam.id) ? prev.filter((e) => e.id !== exam.id) : [...prev, exam],
//     )
//   }

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       setSelectedExams(currentExams)
//     } else {
//       setSelectedExams([])
//     }
//   }

//   const isSelected = (exam: StudentExamType) => selectedExams.some((e) => e.id === exam.id)

//   const handleViewExamDetails = (exam: StudentExamType) => {
//     navigate("/app/viewExam", { state: { exam } })
//   }

//   const handleCheckExam = async (studentExam: StudentExamType) => {
//     const examId = studentExam.id
//     setCheckingStatus((prev) => ({ ...prev, [examId]: "pending" }))

//     try {
//       const response = await studentExamsService.checkExam(studentExam.namePrefix, examFileTeacherName)

//       dispatch(
//         updateStudentExam({
//           id: studentExam.id,
//           studentExam: {
//             ...studentExam,
//             grade: Number(response.grade?.replace("%", "")),
//             evaluation: response.evaluation,
//             isChecked: true,
//             checkedAt: new Date().toISOString(),
//           },
//         }),
//       )

//       setCheckingStatus((prev) => ({ ...prev, [examId]: "done" }))

//       // toast({
//       //   title: "Exam checked",
//       //   description: `${studentExam.studentName}'s exam has been checked successfully`,
//       //   variant: "success",
//       // })
//     } catch (error) {
//       console.error("Error checking exam:", error)
//       setCheckingStatus((prev) => ({ ...prev, [examId]: "idle" }))

//       // toast({
//       //   title: "Error",
//       //   description: "Failed to check exam",
//       //   variant: "destructive",
//       // })
//     }
//   }

//   const handleBatchCheck = async () => {
//     if (selectedExams.length === 0) {
//       // toast({
//       //   title: "No exams selected",
//       //   description: "Please select at least one exam to check",
//       //   variant: "warning",
//       // })
//       return
//     }

//     const uncheckedExams = selectedExams.filter((exam) => !exam.isChecked)

//     if (uncheckedExams.length === 0) {
//       // toast({
//       //   title: "All selected exams are already checked",
//       //   description: "Please select unchecked exams",
//       //   variant: "warning",
//       // })
//       return
//     }

//     for (const exam of uncheckedExams) {
//       await handleCheckExam(exam)
//     }
//   }

//   const handleExportData = () => {
//     const dataToExport = studentExams.map((exam) => {
//       const exportData: Record<string, any> = {
//         "Student Name": exam.studentName || exam.studentExamName || "Unknown",
//       }

//       if (exportOptions.includeGrades) {
//         exportData["grade"] = exam.grade || "N/A"
//         exportData["Status"] = exam.isChecked ? "Checked" : "Not Checked"
//       }

//       if (exportOptions.includeComments) {
//         exportData["Comments"] = exam.evaluation || "N/A"
//       }

//       if (exportOptions.includeTimestamps) {
//         exportData["Checked At"] = exam.checkedAt ? new Date(exam.checkedAt).toLocaleDateString() : "N/A"
//       }

//       return exportData
//     })

//     if (exportFormat === "xlsx") {
//       const worksheet = XLSX.utils.json_to_sheet(dataToExport)
//       const workbook = XLSX.utils.book_new()
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Student Grades")
//       XLSX.writeFile(workbook, `Student_Grades_${examId}.xlsx`)
//     } else if (exportFormat === "csv") {
//       const worksheet = XLSX.utils.json_to_sheet(dataToExport)
//       const csv = XLSX.utils.sheet_to_csv(worksheet)
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
//       const link = document.createElement("a")
//       link.href = URL.createObjectURL(blob)
//       link.download = `Student_Grades_${examId}.csv`
//       link.click()
//     } else if (exportFormat === "pdf") {
//       // In a real implementation, you would use a PDF library
//       // toast({
//       //   title: "PDF Export",
//       //   description: "PDF export functionality would be implemented here",
//       //   variant: "info",
//       // })
//     }

//     setIsExportDialogOpen(false)

//     // toast({
//     //   title: "Export successful",
//     //   description: `Data exported as ${exportFormat.toUpperCase()}`,
//     //   variant: "success",
//     // })
//   }

//   // Calculate statistics
//   const totalStudents = studentExams.length
//   const checkedExams = studentExams.filter((exam) => exam.isChecked).length
//   const averagegrade =
//     studentExams.length > 0 ? studentExams.reduce((sum, exam) => sum + (exam.grade || 0), 0) / totalStudents : 0

//   const gradedistribution = {
//     labels: ["90-100", "80-89", "70-79", "60-69", "Below 60"],
//     datasets: [
//       {
//         label: "Students",
//         data: [
//           studentExams.filter((exam) => (exam.grade || 0) >= 90).length,
//           studentExams.filter((exam) => (exam.grade || 0) >= 80 && (exam.grade || 0) < 90).length,
//           studentExams.filter((exam) => (exam.grade || 0) >= 70 && (exam.grade || 0) < 80).length,
//           studentExams.filter((exam) => (exam.grade || 0) >= 60 && (exam.grade || 0) < 70).length,
//           studentExams.filter((exam) => (exam.grade || 0) < 60).length,
//         ],
//         backgroundColor: [
//           "rgba(75, 192, 192, 0.6)",
//           "rgba(54, 162, 235, 0.6)",
//           "rgba(255, 206, 86, 0.6)",
//           "rgba(255, 159, 64, 0.6)",
//           "rgba(255, 99, 132, 0.6)",
//         ],
//         borderColor: [
//           "rgba(75, 192, 192, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(255, 159, 64, 1)",
//           "rgba(255, 99, 132, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   }

//   const statusDistribution = {
//     labels: ["Checked", "Unchecked"],
//     datasets: [
//       {
//         label: "Exams",
//         data: [checkedExams, totalStudents - checkedExams],
//         backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
//         borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
//         borderWidth: 1,
//       },
//     ],
//   }

//   if (loading && !isRefreshing) {
//     return (
//       <div className="container mx-auto py-8">
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <Skeleton className="h-10 w-64" />
//             <Skeleton className="h-10 w-32" />
//           </div>
//           <Skeleton className="h-64 w-full" />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <div className="flex flex-col space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">Student Exams</h1>
//             <p className="text-muted-foreground">Manage and review student exam submissions</p>
//           </div>
//           <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-1">
//             <ChevronLeft className="h-4 w-4" />
//             Back to exams
//           </Button>
//         </div>

//         <Tabs defaultValue="list" className="w-full">
//           <TabsList className="grid w-full max-w-md grid-cols-3">
//             <TabsTrigger value="list">Exam List</TabsTrigger>
//             <TabsTrigger value="statistics">Statistics</TabsTrigger>
//             <TabsTrigger value="settings">Settings</TabsTrigger>
//           </TabsList>

//           <TabsContent value="list" className="space-y-4">
//             <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
//               <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
//                 <div className="relative">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     type="search"
//                     placeholder="Search students..."
//                     className="pl-8 md:w-[200px] lg:w-[300px]"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Exams</SelectItem>
//                     <SelectItem value="checked">Checked</SelectItem>
//                     <SelectItem value="unchecked">Unchecked</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={fetchStudentExams}
//                   disabled={isRefreshing}
//                   className="flex items-center gap-1"
//                 >
//                   {isRefreshing ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 animate-spin" />
//                       Refreshing...
//                     </>
//                   ) : (
//                     <>
//                       <RefreshCw className="h-4 w-4" />
//                       Refresh
//                     </>
//                   )}
//                 </Button>
//                 <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" size="sm" className="flex items-center gap-1">
//                       <Download className="h-4 w-4" />
//                       Export
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Export Student Data</DialogTitle>
//                       <DialogDescription>Choose your export format and options</DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                       <div className="space-y-2">
//                         <h4 className="font-medium">Export Format</h4>
//                         <div className="flex space-x-2">
//                           {["xlsx", "csv", "pdf"].map((format) => (
//                             <Button
//                               key={format}
//                               variant={exportFormat === format ? "default" : "outline"}
//                               size="sm"
//                               onClick={() => setExportFormat(format)}
//                             >
//                               {format.toUpperCase()}
//                             </Button>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <h4 className="font-medium">Export Options</h4>
//                         <div className="space-y-2">
//                           <div className="flex items-center space-x-2">
//                             <input
//                               type="checkbox"
//                               id="includeGrades"
//                               checked={exportOptions.includeGrades}
//                               onChange={(e) =>
//                                 setExportOptions({
//                                   ...exportOptions,
//                                   includeGrades: e.target.checked,
//                                 })
//                               }
//                             />
//                             <label htmlFor="includeGrades">Include grades and status</label>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <input
//                               type="checkbox"
//                               id="includeComments"
//                               checked={exportOptions.includeComments}
//                               onChange={(e) =>
//                                 setExportOptions({
//                                   ...exportOptions,
//                                   includeComments: e.target.checked,
//                                 })
//                               }
//                             />
//                             <label htmlFor="includeComments">Include teacher comments</label>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <input
//                               type="checkbox"
//                               id="includeTimestamps"
//                               checked={exportOptions.includeTimestamps}
//                               onChange={(e) =>
//                                 setExportOptions({
//                                   ...exportOptions,
//                                   includeTimestamps: e.target.checked,
//                                 })
//                               }
//                             />
//                             <label htmlFor="includeTimestamps">Include timestamps</label>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <DialogFooter>
//                       <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
//                         Cancel
//                       </Button>
//                       <Button onClick={handleExportData}>Export</Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//                 <Button
//                   variant="default"
//                   size="sm"
//                   onClick={handleBatchCheck}
//                   disabled={selectedExams.length === 0}
//                   className="flex items-center gap-1"
//                 >
//                   <CheckCircle className="h-4 w-4" />
//                   Check Selected
//                 </Button>
//               </div>
//             </div>

//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-[40px]">
//                       <input
//                         type="checkbox"
//                         onChange={handleSelectAll}
//                         checked={currentExams.length > 0 && selectedExams.length === currentExams.length}
//                         className="h-4 w-4 rounded border-gray-300"
//                       />
//                     </TableHead>
//                     <TableHead className="cursor-pointer" onClick={() => handleSort("studentName")}>
//                       <div className="flex items-center space-x-1">
//                         <span>Student</span>
//                         {sortConfig.key === "studentName" &&
//                           (sortConfig.direction === "ascending" ? (
//                             <SortAsc className="h-4 w-4" />
//                           ) : (
//                             <SortDesc className="h-4 w-4" />
//                           ))}
//                         {sortConfig.key !== "studentName" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
//                       </div>
//                     </TableHead>
//                     <TableHead className="cursor-pointer" onClick={() => handleSort("grade")}>
//                       <div className="flex items-center space-x-1">
//                         <span>grade</span>
//                         {sortConfig.key === "grade" &&
//                           (sortConfig.direction === "ascending" ? (
//                             <SortAsc className="h-4 w-4" />
//                           ) : (
//                             <SortDesc className="h-4 w-4" />
//                           ))}
//                         {sortConfig.key !== "grade" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
//                       </div>
//                     </TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="cursor-pointer" onClick={() => handleSort("checkedAt")}>
//                       <div className="flex items-center space-x-1">
//                         <span>Checked At</span>
//                         {sortConfig.key === "checkedAt" &&
//                           (sortConfig.direction === "ascending" ? (
//                             <SortAsc className="h-4 w-4" />
//                           ) : (
//                             <SortDesc className="h-4 w-4" />
//                           ))}
//                         {sortConfig.key !== "checkedAt" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
//                       </div>
//                     </TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentExams.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={6} className="h-24 text-center">
//                         No results found.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     currentExams.map((exam) => (
//                       <TableRow key={exam.id} className={isSelected(exam) ? "bg-muted/50" : undefined}>
//                         <TableCell>
//                           <input
//                             type="checkbox"
//                             checked={isSelected(exam)}
//                             onChange={() => handleSelectExam(exam)}
//                             className="h-4 w-4 rounded border-gray-300"
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center space-x-2">
//                             <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
//                               <User className="h-4 w-4 text-muted-foreground" />
//                             </div>
//                             <div>
//                               <div className="font-medium">{exam.studentName || exam.studentExamName || "Unknown"}</div>
//                               <div className="text-xs text-muted-foreground">ID: {exam.id}</div>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           {exam.isChecked ? (
//                             <div className="flex flex-col">
//                               <span className="font-medium">{exam.grade || 0}/100</span>
//                               <Progress value={exam.grade || 0} className="h-2 w-16" />
//                             </div>
//                           ) : (
//                             <span className="text-muted-foreground">Not graded</span>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           {exam.isChecked ? (
//                             <Badge variant="success" className="bg-red-100 text-red-800 hover:bg-red-100">
//                               <CheckCircle className="mr-1 h-3 w-3" />
//                               Checked
//                             </Badge>
//                           ) : (
//                             <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
//                               <Clock className="mr-1 h-3 w-3" />
//                               Pending
//                             </Badge>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           {exam.checkedAt ? (
//                             <div className="flex items-center">
//                               <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
//                               <span>{new Date(exam.checkedAt).toLocaleDateString()}</span>
//                             </div>
//                           ) : (
//                             <span className="text-muted-foreground">-</span>
//                           )}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon" className="h-8 w-8">
//                                 <MoreHorizontal className="h-4 w-4" />
//                                 <span className="sr-only">Open menu</span>
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem onClick={() => handleViewExamDetails(exam)}>
//                                 <Eye className="mr-2 h-4 w-4" />
//                                 View Details
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onClick={() => handleCheckExam(exam)}
//                                 disabled={exam.isChecked || checkingStatus[exam.id] === "pending"}
//                               >
//                                 {checkingStatus[exam.id] === "pending" ? (
//                                   <>
//                                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                                     Checking...
//                                   </>
//                                 ) : (
//                                   <>
//                                     <CheckCircle className="mr-2 h-4 w-4" />
//                                     Check Exam
//                                   </>
//                                 )}
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem>
//                                 <FileText className="mr-2 h-4 w-4" />
//                                 Download Exam
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination */}
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-muted-foreground">
//                 Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedExams.length)} of{" "}
//                 {sortedExams.length} results
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                   <span className="sr-only">Previous page</span>
//                 </Button>
//                 <div className="text-sm">
//                   Page {currentPage} of {totalPages}
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                   <span className="sr-only">Next page</span>
//                 </Button>
//                 <Select
//                   value={itemsPerPage.toString()}
//                   onValueChange={(value) => {
//                     setItemsPerPage(Number(value))
//                     setCurrentPage(1)
//                   }}
//                 >
//                   <SelectTrigger className="w-[100px]">
//                     <SelectValue placeholder="Per page" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="5">5 per page</SelectItem>
//                     <SelectItem value="10">10 per page</SelectItem>
//                     <SelectItem value="20">20 per page</SelectItem>
//                     <SelectItem value="50">50 per page</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="statistics" className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Students</CardTitle>
//                   <User className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{totalStudents}</div>
//                   <p className="text-xs text-muted-foreground">
//                     {checkedExams} checked, {totalStudents - checkedExams} pending
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Average grade</CardTitle>
//                   <FileText className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{averagegrade.toFixed(1)}</div>
//                   <Progress value={averagegrade} className="h-2" />
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Highest grade</CardTitle>
//                   <CheckCircle className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">
//                     {studentExams.length > 0 ? Math.max(...studentExams.map((exam) => exam.grade || 0)) : "N/A"}
//                   </div>
//                   <p className="text-xs text-muted-foreground">Top performing student</p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
//                   <CheckCircle className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">
//                     {totalStudents > 0 ? `${Math.round((checkedExams / totalStudents) * 100)}%` : "0%"}
//                   </div>
//                   <Progress value={totalStudents > 0 ? (checkedExams / totalStudents) * 100 : 0} className="h-2" />
//                 </CardContent>
//               </Card>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>grade Distribution</CardTitle>
//                   <CardDescription>Breakdown of student grades by range</CardDescription>
//                 </CardHeader>
//                 <CardContent className="px-2">
//                   <div className="h-80">
//                     <Bar
//                       data={gradedistribution}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         scales: {
//                           y: {
//                             beginAtZero: true,
//                           },
//                         },
//                       }}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Exam Status</CardTitle>
//                   <CardDescription>Checked vs. unchecked exams</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-80 flex items-center justify-center">
//                     <Doughnut
//                       data={statusDistribution}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             position: "bottom",
//                           },
//                         },
//                       }}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           <TabsContent value="settings" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Exam Settings</CardTitle>
//                 <CardDescription>Configure settings for this exam</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <h3 className="text-sm font-medium">Automatic Grading</h3>
//                   <div className="flex items-center space-x-2">
//                     <input type="checkbox" id="autoGrading" />
//                     <label htmlFor="autoGrading">Enable automatic grading for new submissions</label>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-sm font-medium">Notifications</h3>
//                   <div className="flex items-center space-x-2">
//                     <input type="checkbox" id="emailNotifications" />
//                     <label htmlFor="emailNotifications">
//                       Send email notifications to students when exams are graded
//                     </label>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <h3 className="text-sm font-medium">Privacy</h3>
//                   <div className="flex items-center space-x-2">
//                     <input type="checkbox" id="anonymousGrading" />
//                     <label htmlFor="anonymousGrading">Enable anonymous grading</label>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between">
//                 <Button variant="outline">Cancel</Button>
//                 <Button>Save Settings</Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

// export default StudentsExams
