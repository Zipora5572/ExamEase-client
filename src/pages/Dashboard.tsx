import type React from "react"
import { Skeleton } from "@/components/ui/skeleton" // הנחה שיש לך רכיב Skeleton

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "@/store/store"
import {
  Calendar,
  FileText,
  FolderOpen,
  Users,
  Clock,
  Star,
  Share2,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Download,
  Pencil,
  Trash2,
  ChevronRight,
  CheckCircle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllExamsByUserId } from "@/store/examSlice"
import { getAllFoldersByUserId } from "@/store/folderSlice"
import { ExamFileType } from "@/models/Exam"
import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { StudentExamType } from "@/models/StudentExam"
import { getStudentExamsByExamId, getStudentExamsByUserId } from "@/store/studentExamSlice"

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
  const user = useSelector((state: StoreType) => state.auth.user)
  const exams = useSelector((state: StoreType) => state.exams.exams)
  // const studentxams = useSelector((state: StoreType) => state.exams.exams)
  const loading = useSelector((state: StoreType) => state.exams.loading)
  const studentExams = useSelector((state: StoreType) => state.studentExams.examsByUserId)

  const folders = useSelector((state: StoreType) => state.folders.folders)
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
console.log(studentExams);

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
    
  


  const upcomingExams = [
    { id: 1, name: "Physics Mid-term", date: "Tomorrow", students: 28, progress: 75 },
    { id: 2, name: "Chemistry Lab Test", date: "Next week", students: 22, progress: 45 },
    { id: 3, name: "Biology Final", date: "In 2 weeks", students: 35, progress: 20 },
  ]

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


      <Tabs defaultValue="recent" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="recent" className="data-[state=active]:bg-gray-100">
              Recent
            </TabsTrigger>
            <TabsTrigger value="starred" className="data-[state=active]:bg-gray-100">
              Starred
            </TabsTrigger>
            <TabsTrigger value="shared" className="data-[state=active]:bg-gray-100">
              Shared
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-200 bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>All Items</DropdownMenuItem>
                <DropdownMenuItem>Exams Only</DropdownMenuItem>
                <DropdownMenuItem>Folders Only</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Modified Today</DropdownMenuItem>
                <DropdownMenuItem>Modified This Week</DropdownMenuItem>
                <DropdownMenuItem>Modified This Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-200 bg-white">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                <DropdownMenuItem>Last Modified</DropdownMenuItem>
                <DropdownMenuItem>Last Created</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="recent" className="mt-0">
          <Card className="border-none shadow-sm">
            <div className="grid grid-cols-1 divide-y divide-gray-100">
            {loading ? (
                // מציג כמה שורות Skeleton במקום הרשימה
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
                  onClick={() => navigate(`/app/${item.type == 'FOLDER' ? "folders" : "exams"}/${item.id}`)}
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

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="starred" className="mt-0">
          <Card className="border-none shadow-sm">
            <div className="grid grid-cols-1 divide-y divide-gray-100">
              {recentExams
                .filter((item) => item.isStarred)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/app/${item.type === "folder" ? "folders" : "exams"}/${item.id}`)}
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
                      <Star className="h-4 w-4 text-yellow-400" />
                      {item.isStarred && <Share2 className="h-4 w-4 text-blue-400" />}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="mt-0">
          <Card className="border-none shadow-sm">
            <div className="grid grid-cols-1 divide-y divide-gray-100">
              {recentExams
                .filter((item) => item.isShared)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/app/${item.type === "folder" ? "folders" : "exams"}/${item.id}`)}
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
                      {item.isStarred && <Star className="h-4 w-4 text-yellow-400" />}
                      <Share2 className="h-4 w-4 text-blue-400" />

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

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



        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Collaborators</CardTitle>
            <CardDescription>People you've shared exams with recently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", role: "Teacher" },
                { id: 2, name: "Michael Chen", email: "m.chen@example.com", role: "Assistant" },
                { id: 3, name: "Emma Williams", email: "emma.w@example.com", role: "Teacher" },
              ].map((person) => (
                <div key={person.id} className="flex items-center gap-3">
                  <Avatar className="border border-gray-200">
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{person.name}</p>
                    <p className="text-sm text-gray-500">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-200"
              onClick={() => navigate("/app/shared-exams")}
            >
              Manage Sharing
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
