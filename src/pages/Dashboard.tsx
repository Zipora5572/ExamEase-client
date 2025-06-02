import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "@/store/store"
import {
  FileText,
  FolderOpen,
  Users,
  Clock,
  Plus,
  Search,
  ChevronRight,
  CheckCircle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { getAllExamsByUserId } from "@/store/examSlice"
import { getAllFoldersByUserId } from "@/store/folderSlice"
import { ExamFileType } from "@/models/Exam"
import { formatDate } from "@/lib/utils"
import { StudentExamType } from "@/models/StudentExam"
import { getStudentExamsByExamId, getStudentExamsByUserId } from "@/store/studentExamSlice"
import useModal from "@/hooks/useModal"
import ExamMenu from "@/components/Exams/ExamMenu"
import ModalWrapper from "@/components/ModalWrapper"

type PendingExamCard = {
  id: string
  name: string
  uploadedAt: string
  studentsCount: number
  progress: number
}
const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchQuery, setSearchQuery] = useState("")
  const { isOpen, openModal, closeModal, modalData } = useModal()
  
  
  const user = useSelector((state: StoreType) => state.auth.user)
  const exams = useSelector((state: StoreType) => state.exams.exams)
  
// const bestExam = useMemo(() => {
//   if (!Array.isArray(exams) || exams.length === 0) return null;

//   return exams.reduce((best, current) => {
//     return (current.averageGrade ?? 0) > (best.averageGrade ?? 0) ? current : best;
//   }, exams[0]);
// }, [exams]);
  // const studentxams = useSelector((state: StoreType) => state.exams.exams)
  const loading = useSelector((state: StoreType) => state.exams.loading)
  const studentExams = useSelector((state: StoreType) => state.studentExams.examsByUserId)

  
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.id) {
      console.log("in");
      
      dispatch(getAllFoldersByUserId(user?.id))
      dispatch(getAllExamsByUserId(user?.id))
      dispatch(getStudentExamsByUserId(user?.id))
    }
  }, [dispatch])

  
  const [pendingExams, setPendingExams] = useState<PendingExamCard[]>([])

  useEffect(() => {
    if (user?.id) {
      
      
      dispatch(getAllFoldersByUserId(user.id))
      dispatch(getAllExamsByUserId(user.id))
      dispatch(getStudentExamsByUserId(user?.id))
      console.log(studentExams);
    }
  }, [dispatch, user?.id])

  useEffect(() => {
    const loadPendingExams = async () => {
      const pending: PendingExamCard[] = []

      for (const exam of exams) {
        try {
          const studentExams: StudentExamType[] = await dispatch(
            getStudentExamsByExamId(exam.id)
          ).unwrap()

          const total = studentExams.length
          const checked = studentExams.filter(se => se.isChecked).length
          const progress = total === 0 ? 0 : Math.round((checked / total) * 100)

          pending.push({
            id: exam.id.toString(),
            name: exam.name,
            uploadedAt: formatDate(exam.createdAt.toString()),
            studentsCount: total,
            progress: progress,
          })
        } catch (err) {
          console.error(`שגיאה בטעינת מבחן ${exam.id}`, err)
        }
      }

      setPendingExams(pending)
    }

    if (exams.length > 0) {
      loadPendingExams()
    }
  }, [exams, dispatch])

  const recentExams: ExamFileType[] = [...exams]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  const studentIds = new Set(
      studentExams
        .filter(se => exams.some(e => e.id == se.examId))
        .map(se => se.student.id)
    );
    
    const totalStudents = studentIds.size;
    
  


  

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const getFileIcon = (type: string) => {
    if (type === "folder") return <FolderOpen className="h-5 w-5 text-blue-500" />
    return <FileText className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.firstName || "User"}</p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search exams..."
              className="w-full pl-9 bg-white border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Button onClick={() => navigate("/app/exams/new")} className="bg-red-600 hover:bg-red-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Exam
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  {/* Total Exams */}
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
      <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
        <FileText className="h-4 w-4 text-red-500" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{exams.length}</div>
      <p className="text-xs text-gray-500 mt-1">+4 from last month</p>
    </CardContent>
  </Card>

  {/* Pending Exams */}
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
      <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center">
        <Clock className="h-4 w-4 text-yellow-500" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {
          studentExams.filter(exam => !exam.isChecked).length
        }
      </div>
      <p className="text-xs text-gray-500 mt-1">Waiting for review</p>
    </CardContent>
  </Card>

  {/* Total Students */}
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Students</CardTitle>
      <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
        <Users className="h-4 w-4 text-green-500" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
     {totalStudents}
      </div>
      <p className="text-xs text-gray-500 mt-1">Registered</p>
    </CardContent>
  </Card>

  {/* Checked Exams this month */}
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Checked this Month</CardTitle>
      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
        <CheckCircle className="h-4 w-4 text-blue-500" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {
          studentExams.filter(se => {
            const date = new Date(se.checkedAt || '');
            const now = new Date();
            return se.isChecked && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }).length
        }
      </div>
      <p className="text-xs text-gray-500 mt-1">This month</p>
    </CardContent>
  </Card>
</div>

    <Card className="border-none shadow-sm">
      
            <div className="grid grid-cols-1 divide-y divide-gray-100">
            {loading ? (
               
                Array(5).fill(null).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4">
                    <Skeleton className="h-6 w-6 rounded" />
                    <div className="flex-1 ml-4">
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                ))
              ) : (
              recentExams.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/app/${item.type?.toUpperCase() === "FOLDER" ? "folders" : "exams"}/${item.id}`)}
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(item.type)}
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Modified {formatDate(item.updatedAt.toString())}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                   {/* <Star className="h-4 w-4 text-yellow-400" />
                     <Share2 className="h-4 w-4 text-blue-400" /> */}

                  <ExamMenu row={item} openModal={openModal} />
                  </div>
                </div>
              )))}
            </div>
          </Card>

      <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2 border-none shadow-sm">
  <CardHeader>
    <CardTitle>Exams Pending Review</CardTitle>
    <CardDescription>Uploaded exams waiting for manual or automatic checking</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      {pendingExams.map((exam) => (
        <div key={exam.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{exam.name}</span>
            <span className="text-sm text-gray-500">{exam.uploadedAt}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-3 w-3" />
            <span>{exam.studentsCount} students</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={exam.progress} className="h-2 flex-1" />
            <span className="text-xs text-gray-500 min-w-[36px] text-right">{exam.progress}%</span>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
<ModalWrapper
        open={isOpen}
        handleClose={() => {
          closeModal()
        }}
        title={modalData?.title || ""}
        onConfirm={modalData?.onConfirm}
        confirmText={modalData?.confirmText}
        initialName={modalData?.initialName}
      >
        {modalData?.children}
      </ModalWrapper>


      <Card className="border-none shadow-sm">
  <CardHeader>
    <CardTitle>Top Performing Exam</CardTitle>
    <CardDescription>Highest average grade across all exams</CardDescription>
  </CardHeader>
  <CardContent>
    {/* <div className="space-y-2">
      <p className="text-lg font-bold text-green-600">{bestExam?.name}</p>
      <p className="text-sm text-gray-700">
        Average Grade: <span className="font-semibold">{bestExam?.averageGrade?.toFixed(2)}</span>
      </p>
    </div> */}
  </CardContent>
  <CardFooter>
    <Button
      variant="outline"
      size="sm"
      className="w-full border-gray-200"
      onClick={() => navigate("/app/exams")}
    >
      View All Exams
      <ChevronRight className="h-4 w-4 ml-1" />
    </Button>
  </CardFooter>
</Card>

      </div>
    </div>
  )
}

export default Dashboard
