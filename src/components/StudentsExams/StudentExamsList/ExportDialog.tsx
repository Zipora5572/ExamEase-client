"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import * as XLSX from "xlsx"
import type { StudentExamType } from "../../../models/StudentExam"

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  exportFormat: string
  setExportFormat: (format: string) => void
  exportOptions: {
    includeGrades: boolean
    includeComments: boolean
    includeTimestamps: boolean
  }
  setExportOptions: (options: {
    includeGrades: boolean
    includeComments: boolean
    includeTimestamps: boolean
  }) => void
  studentExams: StudentExamType[]
  examId: number
}

const ExportDialog = ({
  isOpen,
  onClose,
  exportFormat,
  setExportFormat,
  exportOptions,
  setExportOptions,
  studentExams,
  examId,
}: ExportDialogProps) => {
  const handleExportData = () => {
    const dataToExport = studentExams.map((exam) => {
      const exportData: Record<string, any> = {
        "First Name": exam.student.firstName || "Unknown",
        "Last Name": exam.student.lastName || "Unknown",
      }

      if (exportOptions.includeGrades) {
        exportData["grade"] = exam.grade || "N/A"
        exportData["Status"] = exam.isChecked ? "Checked" : "Not Checked"
      }

      if (exportOptions.includeComments) {
        exportData["Comments"] = exam.evaluation || "N/A"
      }

      if (exportOptions.includeTimestamps) {
        exportData["Checked At"] = exam.checkedAt ? new Date(exam.checkedAt).toLocaleDateString() : "N/A"
      }

      return exportData
    })

    if (exportFormat === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Student Grades")
      XLSX.writeFile(workbook, `Student_Grades_${examId}.xlsx`)
    } else if (exportFormat === "csv") {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const csv = XLSX.utils.sheet_to_csv(worksheet)
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `Student_Grades_${examId}.csv`
      link.click()
    } else if (exportFormat === "pdf") {
      // In a real implementation, you would use a PDF library
      console.log("PDF export would be implemented here")
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Student Data</DialogTitle>
          <DialogDescription>Choose your export format and options</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Export Format</h4>
            <div className="flex space-x-2">
              {["xlsx", "csv", "pdf"].map((format) => (
                <Button
                  key={format}
                  variant={exportFormat === format ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExportFormat(format)}
                  className={exportFormat === format ? "bg-red-600 hover:bg-red-700" : "border-gray-300"}
                >
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Export Options</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeGrades"
                  checked={exportOptions.includeGrades}
                  onCheckedChange={(checked) =>
                    setExportOptions({
                      ...exportOptions,
                      includeGrades: checked === true,
                    })
                  }
                  className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <label htmlFor="includeGrades" className="text-sm">
                  Include grades and status
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeComments"
                  checked={exportOptions.includeComments}
                  onCheckedChange={(checked) =>
                    setExportOptions({
                      ...exportOptions,
                      includeComments: checked === true,
                    })
                  }
                  className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <label htmlFor="includeComments" className="text-sm">
                  Include teacher comments
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTimestamps"
                  checked={exportOptions.includeTimestamps}
                  onCheckedChange={(checked) =>
                    setExportOptions({
                      ...exportOptions,
                      includeTimestamps: checked === true,
                    })
                  }
                  className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <label htmlFor="includeTimestamps" className="text-sm">
                  Include timestamps
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-300">
            Cancel
          </Button>
          <Button onClick={handleExportData} className="bg-red-600 hover:bg-red-700">
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExportDialog
