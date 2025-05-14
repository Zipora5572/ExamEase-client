import type React from "react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAllFolders } from "@/store/folderSlice"
import { getAllExams } from "@/store/examSlice"

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchQuery, setSearchQuery] = useState("")
  const user = useSelector((state: StoreType) => state.auth.user)
  const exams = useSelector((state: StoreType) => state.exams.exams)
  const folders = useSelector((state: StoreType) => state.folders.folders)
  const navigate = useNavigate()
  console.log(exams);
  console.log(folders);

  useEffect(() => {
    dispatch(getAllFolders())
    dispatch(getAllExams())
  }, [dispatch])

  // Mock data for dashboard
  const recentExams = [
    { id: 1, name: "Math Final Exam", date: "2 hours ago", type: "exam", starred: true, shared: false },
    { id: 2, name: "Science Tests", date: "Yesterday", type: "folder", starred: false, shared: true },
    { id: 3, name: "History Quiz", date: "3 days ago", type: "exam", starred: false, shared: false },
    { id: 4, name: "English Literature Test", date: "1 week ago", type: "exam", starred: true, shared: true },
    { id: 5, name: "Physics Mid-term", date: "2 weeks ago", type: "exam", starred: false, shared: false },
  ]

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
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.firstName || "User"}</p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search exams..."
              className="w-full pl-8 focus-visible:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Button onClick={() => navigate("/app/exams/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Exam
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length || 24}</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Folders</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{folders.length || 8}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next: Tomorrow</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                <DropdownMenuItem>Last Modified</DropdownMenuItem>
                <DropdownMenuItem>Last Created</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="recent" className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-1 divide-y">
              {recentExams.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/app/${item.type === "folder" ? "folders" : "exams"}/${item.id}`)}
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(item.type)}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Modified {item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.starred && <Star className="h-4 w-4 text-yellow-400" />}
                    {item.shared && <Share2 className="h-4 w-4 text-blue-400" />}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
          </div>
        </TabsContent>

        <TabsContent value="starred" className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-1 divide-y">
              {recentExams
                .filter((item) => item.starred)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/app/${item.type === "folder" ? "folders" : "exams"}/${item.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(item.type)}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Modified {item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      {item.shared && <Share2 className="h-4 w-4 text-blue-400" />}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
          </div>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-1 divide-y">
              {recentExams
                .filter((item) => item.shared)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/app/${item.type === "folder" ? "folders" : "exams"}/${item.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(item.type)}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Modified {item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.starred && <Star className="h-4 w-4 text-yellow-400" />}
                      <Share2 className="h-4 w-4 text-blue-400" />

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Scheduled exams for your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{exam.name}</span>
                    <span className="text-sm text-muted-foreground">{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{exam.students} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={exam.progress} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground">{exam.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/app/exams")}>
              View All Exams
            </Button>
          </CardFooter>
        </Card>

        <Card>
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
                  <Avatar>
                    <AvatarFallback>
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/app/shared-exams")}>
              Manage Sharing
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
