"use client"

import type React from "react"

import { useState } from "react"
import type { StudentExamType } from "../../models/StudentExam"
import { Search, Download, Filter, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface AllStudentsProps {
  studentExams: StudentExamType[]
  onAssignStudents: () => void
  onUploadStudents: () => void
}

const AllStudents: React.FC<AllStudentsProps> = ({ studentExams, onAssignStudents, onUploadStudents }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredStudents = studentExams.filter((student) => {
    const matchesSearch =
      student.student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) 

    if (statusFilter === "all") return matchesSearch
    if (statusFilter === "graded") return matchesSearch && student.isChecked
    if (statusFilter === "ungraded") return matchesSearch && !student.isChecked

    return matchesSearch
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  const handleSelectAll = () => {
    if (selectedStudents.length === currentItems.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(currentItems.map((student) => student.id))
    }
  }

  const handleSelectStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((studentId) => studentId !== id))
    } else {
      setSelectedStudents([...selectedStudents, id])
    }
  }

  const handleExportSelected = () => {
    // Implement export functionality
    console.log("Exporting selected students:", selectedStudents)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>All Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search students..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Students</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("submitted")}>Submitted</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("not-submitted")}>Not Submitted</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("graded")}>Graded</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("ungraded")}>Not Graded</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="h-9" onClick={onUploadStudents}>
                <Download className="mr-2 h-4 w-4" />
                Upload Students
              </Button>

              <Button variant="outline" size="sm" className="h-9" onClick={onAssignStudents}>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Students
              </Button>

              {selectedStudents.length > 0 && (
                <Button variant="default" size="sm" className="h-9" onClick={handleExportSelected}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedStudents.length === currentItems.length && currentItems.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleSelectStudent(student.id)}
                        />
                      </TableCell>
                      <TableCell>{student.id}</TableCell>
                      <TableCell className="font-medium">{student.student.firstName} {student.student.lastName}</TableCell>
                   
                      <TableCell>
                        {student.isChecked ? (
                          <span className="font-medium">{student.grade || "N/A"}</span>
                        ) : (
                          <span className="text-gray-500">Not Graded</span>
                        )}
                      </TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AllStudents
