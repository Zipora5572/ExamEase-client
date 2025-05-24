"use client"

import { useEffect, useState } from "react"
import { getStudentExamsByExamId } from "../../store/studentExamSlice"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../store/store"
import type { StudentExamType } from "../../models/StudentExam"
import { useLocation, useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import StudentsExamsStatistics from "./StudentExamsStatistics"
import StudentsExamsSettings from "./StudentsExamsSetting"
import AllStudents from "./AllStudents"
import UploadStudents from "./UploadStudents"
import AssignStudents from "./AssignStudents"
import StudentsExamsList from "./StudentExamsList"

const StudentsExams = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" }>({
    key: "studentName",
    direction: "ascending",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedExams, setSelectedExams] = useState<StudentExamType[]>([])
  const [checkingStatus, setCheckingStatus] = useState<{ [key: string]: "idle" | "pending" | "done" }>({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("list")

  // New state for student management dialogs
  const [isUploadStudentsOpen, setIsUploadStudentsOpen] = useState(false)
  const [isAssignStudentsOpen, setIsAssignStudentsOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { examId, examFileTeacherName, initialTab } = location.state || {}

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (examId) {
      fetchStudentExams()

      // Set initial tab if provided
      if (initialTab) {
        setActiveTab(initialTab)
      }
    } else {
      navigate("/exams")
    }
  }, [examId, dispatch, initialTab])

  const fetchStudentExams = async () => {
    setIsRefreshing(true)
    try {
      await dispatch(getStudentExamsByExamId(examId)).unwrap()
    } catch (error) {
      console.error("Failed to load student exams:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const studentExams = useSelector((state: StoreType) => state.studentExams.examsByExamId)
  const loading = useSelector((state: StoreType) => state.studentExams.loading)

  const handleOpenUploadStudents = () => {
    setIsUploadStudentsOpen(true)
  }

  const handleOpenAssignStudents = () => {
    setIsAssignStudentsOpen(true)
  }

  if (loading && !isRefreshing) {
    return (
      <div className="container mx-auto py-8 px-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-12 w-full max-w-md" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Student Exams</h1>
            <p className="text-gray-500">Manage and review student exam submissions</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to exams
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 p-1">
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              Exam List
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4 mt-6">
            <StudentsExamsList
              studentExams={studentExams}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              selectedExams={selectedExams}
              setSelectedExams={setSelectedExams}
              checkingStatus={checkingStatus}
              setCheckingStatus={setCheckingStatus}
              isRefreshing={isRefreshing}
              fetchStudentExams={fetchStudentExams}
             
              examId={examId}
              examFileTeacherName={examFileTeacherName}
            />
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <StudentsExamsStatistics studentExams={studentExams} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <StudentsExamsSettings />
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <AllStudents
              studentExams={studentExams}
              onAssignStudents={handleOpenAssignStudents}
              onUploadStudents={handleOpenUploadStudents}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Students Dialog */}
      <Dialog open={isUploadStudentsOpen} onOpenChange={setIsUploadStudentsOpen}>
        <DialogContent className="sm:max-w-md">
          <UploadStudents
            examId={examId}
            onClose={() => setIsUploadStudentsOpen(false)}
            onSuccess={() => {
              setIsUploadStudentsOpen(false)
              fetchStudentExams()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Assign Students Dialog */}
      <Dialog open={isAssignStudentsOpen} onOpenChange={setIsAssignStudentsOpen}>
        <DialogContent className="sm:max-w-md">
          <AssignStudents
           
            onClose={() => setIsAssignStudentsOpen(false)}
            onSuccess={() => {
              setIsAssignStudentsOpen(false)
              fetchStudentExams()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StudentsExams
