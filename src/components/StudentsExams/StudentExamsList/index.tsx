"use client"


import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { StudentExamType } from "../../../models/StudentExam"
import { RefreshCw, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ExamsTable from "./ExamsTable"
import ExportDialog from "./ExportDialog"
import FilterPanel from "./FilterPanel"
import Pagination from "./Pagination"

interface StudentsExamsListProps {
  studentExams: StudentExamType[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (filter: string) => void
  sortConfig: { key: string; direction: "ascending" | "descending" }
  setSortConfig: (config: { key: string; direction: "ascending" | "descending" }) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  setItemsPerPage: (items: number) => void
  selectedExams: StudentExamType[]
  setSelectedExams: React.Dispatch<React.SetStateAction<StudentExamType[]>>
  checkingStatus: { [key: string]: "idle" | "pending" | "done" }
  setCheckingStatus: React.Dispatch<
  React.SetStateAction<{ [key: string]: "idle" | "pending" | "done" }>
>
  isRefreshing: boolean
  fetchStudentExams: () => void
  examId: number
  examFileTeacherName: string
}

const StudentsExamsList = ({
  studentExams,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortConfig,
  setSortConfig,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  selectedExams,
  setSelectedExams,
  checkingStatus,
  setCheckingStatus,
  isRefreshing,
  fetchStudentExams,
  examId,
  examFileTeacherName,
}: StudentsExamsListProps) => {
  const [exportFormat, setExportFormat] = useState("xlsx")
  const [exportOptions, setExportOptions] = useState({
    includeGrades: true,
    includeComments: true,
    includeTimestamps: true,
  })
  const [dateFilter, setDateFilter] = useState<{
    startDate: string | null
    endDate: string | null
  }>({
    startDate: null,
    endDate: null,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

  const navigate = useNavigate()

  const filteredExams = studentExams.filter((exam) => {
    const matchesSearch =
      exam.student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.namePrefix && exam.namePrefix.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "checked"
          ? exam.isChecked
          : statusFilter === "unchecked"
            ? !exam.isChecked
            : true

    let matchesDate = true
    if (dateFilter.startDate && exam.checkedAt) {
      const examDate = new Date(exam.checkedAt)
      const startDate = new Date(dateFilter.startDate)
      matchesDate = examDate >= startDate
    }
    if (dateFilter.endDate && exam.checkedAt) {
      const examDate = new Date(exam.checkedAt)
      const endDate = new Date(dateFilter.endDate)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = matchesDate && examDate <= endDate
    }

    return matchesSearch && matchesStatus && matchesDate
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

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentExams = sortedExams.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedExams.length / itemsPerPage)

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setDateFilter({ startDate: null, endDate: null })
  }

  return (
    <>
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-gray-900">Student Exams</CardTitle>
              <CardDescription className="text-gray-500">Manage and review student exam submissions</CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchStudentExams}
                disabled={isRefreshing}
                className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportDialogOpen(true)}
                className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  // Handle batch check
                  const uncheckedExams = selectedExams.filter((exam) => !exam.isChecked)
                  if (uncheckedExams.length > 0) {
                    // Implement batch check logic
                  }
                }}
                disabled={selectedExams.length === 0}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4" />
                Check Selected ({selectedExams.length})
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          {showFilters && (
            <FilterPanel
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              filteredExams={filteredExams}
              clearFilters={clearFilters}
            />
          )}

          {/* Table */}
          <ExamsTable
            currentExams={currentExams}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            selectedExams={selectedExams}
            setSelectedExams={setSelectedExams}
            checkingStatus={checkingStatus}
            setCheckingStatus={setCheckingStatus}
            navigate={navigate}
            examFileTeacherName={examFileTeacherName}
          />

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredExams.length)} of{" "}
                {filteredExams.length}
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[100px] border-gray-300">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            )}
          </div>
        </CardContent>
      </Card>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        exportOptions={exportOptions}
        setExportOptions={setExportOptions}
        studentExams={studentExams}
        examId={examId}
      />
    </>
  )
}

export default StudentsExamsList
