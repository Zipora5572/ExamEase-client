"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, SortAsc, SortDesc } from "lucide-react"
import type { StudentExamType } from "../../../models/StudentExam"
import ExamRowActions from "./ExamRowActions"

interface ExamsTableProps {
  currentExams: StudentExamType[]
  sortConfig: { key: string; direction: "ascending" | "descending" }
  setSortConfig: (config: { key: string; direction: "ascending" | "descending" }) => void
  selectedExams: StudentExamType[]
  setSelectedExams: React.Dispatch<React.SetStateAction<StudentExamType[]>>
  checkingStatus: { [key: string]: "idle" | "pending" | "done" }
  setCheckingStatus: React.Dispatch<
  React.SetStateAction<{ [key: string]: "idle" | "pending" | "done" }>
>
  navigate: any
  examFileTeacherName: string
}

const ExamsTable = ({
  currentExams,
  sortConfig,
  setSortConfig,
  selectedExams,
  setSelectedExams,
  checkingStatus,
  setCheckingStatus,
  navigate,
  examFileTeacherName,
}: ExamsTableProps) => {
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }
  const handleSelectExam = (exam: StudentExamType) => {
    setSelectedExams((prev) =>
      prev.find((e) => e.id === exam.id) ? prev.filter((e) => e.id !== exam.id) : [...prev, exam],
    )
  }
  
  

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedExams(currentExams)
    } else {
      setSelectedExams([])
    }
  }

  const isSelected = (exam: StudentExamType) => selectedExams.some((e) => e.id === exam.id)

  return (
    <div className="rounded-md border border-gray-200">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="hover:bg-gray-50">
            <TableHead className="w-[40px]">
              <Checkbox
                checked={currentExams.length > 0 && selectedExams.length === currentExams.length}
                onCheckedChange={handleSelectAll}
                className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("studentName")}>
              <div className="flex items-center space-x-1">
                <span>Student</span>
                {sortConfig.key === "studentName" &&
                  (sortConfig.direction === "ascending" ? (
                    <SortAsc className="h-4 w-4 text-gray-500" />
                  ) : (
                    <SortDesc className="h-4 w-4 text-gray-500" />
                  ))}
                {sortConfig.key !== "studentName" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("grade")}>
              <div className="flex items-center space-x-1">
                <span>Grade</span>
                {sortConfig.key === "grade" &&
                  (sortConfig.direction === "ascending" ? (
                    <SortAsc className="h-4 w-4 text-gray-500" />
                  ) : (
                    <SortDesc className="h-4 w-4 text-gray-500" />
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
                    <SortAsc className="h-4 w-4 text-gray-500" />
                  ) : (
                    <SortDesc className="h-4 w-4 text-gray-500" />
                  ))}
                {sortConfig.key !== "checkedAt" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
              </div>
            </TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentExams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            currentExams.map((exam) => (
              <TableRow
                key={exam.id}
                className={isSelected(exam) ? "bg-red-50" : "hover:bg-gray-50"}
                data-state={isSelected(exam) ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected(exam)}
                    onCheckedChange={() => handleSelectExam(exam)}
                    className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900">
                    {exam.student.firstName} {exam.student.lastName}
                  </div>
                </TableCell>
                <TableCell>
                  {exam.isChecked ? (
                    <div className="font-medium">{exam.grade}</div>
                  ) : (
                    <span className="text-gray-500">Not graded</span>
                  )}
                </TableCell>
                <TableCell>
                  {exam.isChecked ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Checked
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Unchecked
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {exam.checkedAt ? (
                    <div className="text-sm">
                      {new Date(exam.checkedAt).toLocaleDateString()}
                      <div className="text-xs text-gray-500">{new Date(exam.checkedAt).toLocaleTimeString()}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ExamRowActions
                    exam={exam}
                    navigate={navigate}
                    checkingStatus={checkingStatus}
                    setCheckingStatus={setCheckingStatus}
                    examFileTeacherName={examFileTeacherName}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExamsTable
