"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Users, UserCheck, Clock, Calendar, Shield } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SharePermissionsDialog from "./SharePermissionDialog"

interface SharedExam {
  id: number
  name: string
  sharedWith?: {
    id: number
    name: string
    email: string
    avatar?: string
    permission: string
    sharedAt: string
  }
  sharedBy?: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  permission?: string
  sharedAt: string
  lastAccessed?: string
}

const SharedExamsTab = () => {
  const [activeTab, setActiveTab] = useState("shared-by-you")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPermission, setFilterPermission] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<SharedExam | null>(null)

  // Mock data - in a real app, this would come from an API
  const [sharedByYou, setSharedByYou] = useState<SharedExam[]>([
    {
      id: 1,
      name: "Final Math Exam 2023",
      sharedWith: {
        id: 1,
        name: "Alex Johnson",
        email: "alex@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        permission: "view",
        sharedAt: "2023-05-15T10:30:00Z",
      },
      sharedAt: "2023-05-15T10:30:00Z",
      lastAccessed: "2023-05-16T14:20:00Z",
    },
    {
      id: 2,
      name: "Physics Midterm",
      sharedWith: {
        id: 2,
        name: "Maria Garcia",
        email: "maria@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        permission: "edit",
        sharedAt: "2023-04-20T09:15:00Z",
      },
      sharedAt: "2023-04-20T09:15:00Z",
      lastAccessed: "2023-05-10T11:45:00Z",
    },
    {
      id: 3,
      name: "Chemistry Quiz",
      sharedWith: {
        id: 3,
        name: "Sam Wilson",
        email: "sam@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        permission: "comment",
        sharedAt: "2023-05-01T14:00:00Z",
      },
      sharedAt: "2023-05-01T14:00:00Z",
      lastAccessed: "2023-05-05T16:30:00Z",
    },
  ])

  const [sharedWithYou] = useState<SharedExam[]>([
    {
      id: 4,
      name: "Biology Final",
      sharedBy: {
        id: 4,
        name: "Taylor Swift",
        email: "taylor@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      permission: "edit",
      sharedAt: "2023-05-10T08:45:00Z",
      lastAccessed: "2023-05-12T13:20:00Z",
    },
    {
      id: 5,
      name: "History Midterm",
      sharedBy: {
        id: 5,
        name: "John Smith",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      permission: "view",
      sharedAt: "2023-04-25T11:30:00Z",
      lastAccessed: "2023-04-26T09:15:00Z",
    },
  ])

  // Filter and sort exams based on current filters
  const getFilteredExams = () => {
    let exams = activeTab === "shared-by-you" ? sharedByYou : sharedWithYou

    // Apply search filter
    if (searchQuery) {
      exams = exams.filter(
        (exam) =>
          exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (activeTab === "shared-by-you" && exam.sharedWith?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (activeTab === "shared-with-you" && exam.sharedBy?.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply permission filter
    if (filterPermission !== "all") {
      exams = exams.filter((exam) => {
        const permission = activeTab === "shared-by-you" ? exam.sharedWith?.permission : exam.permission
        return permission === filterPermission
      })
    }

    // Apply sorting
    return exams.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime()
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
  }

  const filteredExams = getFilteredExams()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleOpenPermissionsDialog = (exam: SharedExam) => {
    setSelectedExam(exam)
    setIsPermissionsDialogOpen(true)
  }

  const handleUpdatePermissions = (examId: number, userId: number, newPermission: string) => {
    // In a real app, this would call an API to update permissions
    if (activeTab === "shared-by-you") {
      setSharedByYou((prevExams) =>
        prevExams.map((exam) => {
          if (exam.id === examId && exam.sharedWith?.id === userId) {
            return {
              ...exam,
              sharedWith: {
                ...exam.sharedWith,
                permission: newPermission,
              },
            }
          }
          return exam
        }),
      )
    }
    setIsPermissionsDialogOpen(false)
  }

  const handleRemoveSharing = (examId: number, userId: number) => {
    // In a real app, this would call an API to remove sharing
    if (activeTab === "shared-by-you") {
      setSharedByYou((prevExams) => prevExams.filter((exam) => !(exam.id === examId && exam.sharedWith?.id === userId)))
    }
    setIsPermissionsDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="shared-by-you" className="flex items-center">
            <UserCheck className="mr-2 h-4 w-4" />
            Shared by You
          </TabsTrigger>
          <TabsTrigger value="shared-with-you" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Shared with You
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exams"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={filterPermission} onValueChange={setFilterPermission}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Permission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Permissions</SelectItem>
              <SelectItem value="view">View only</SelectItem>
              <SelectItem value="comment">Can comment</SelectItem>
              <SelectItem value="edit">Can edit</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>{activeTab === "shared-by-you" ? "Shared With" : "Shared By"}</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Shared Date</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={activeTab === "shared-by-you" ? exam.sharedWith?.avatar : exam.sharedBy?.avatar}
                            alt="Avatar"
                          />
                          <AvatarFallback>
                            {activeTab === "shared-by-you"
                              ? exam.sharedWith?.name.substring(0, 2).toUpperCase()
                              : exam.sharedBy?.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {activeTab === "shared-by-you" ? exam.sharedWith?.name : exam.sharedBy?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activeTab === "shared-by-you" ? exam.sharedWith?.email : exam.sharedBy?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          (activeTab === "shared-by-you" ? exam.sharedWith?.permission : exam.permission) === "edit"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : (activeTab === "shared-by-you" ? exam.sharedWith?.permission : exam.permission) ===
                                "comment"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {activeTab === "shared-by-you"
                          ? exam.sharedWith?.permission === "view"
                            ? "View only"
                            : exam.sharedWith?.permission === "comment"
                              ? "Can comment"
                              : "Can edit"
                          : exam.permission === "view"
                            ? "View only"
                            : exam.permission === "comment"
                              ? "Can comment"
                              : "Can edit"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{formatDate(exam.sharedAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {exam.lastAccessed ? (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{formatDate(exam.lastAccessed)}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {activeTab === "shared-by-you" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenPermissionsDialog(exam)}>
                              Change permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleRemoveSharing(exam.id, exam.sharedWith?.id || 0)}
                            >
                              Remove access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No shared exams found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {selectedExam && (
        <SharePermissionsDialog
          isOpen={isPermissionsDialogOpen}
          onClose={() => setIsPermissionsDialogOpen(false)}
          exam={selectedExam}
          onUpdatePermissions={handleUpdatePermissions}
          onRemoveAccess={handleRemoveSharing}
        />
      )}
    </div>
  )
}

export default SharedExamsTab
