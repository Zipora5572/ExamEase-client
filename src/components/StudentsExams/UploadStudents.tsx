"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { getAllExams } from "../../store/examSlice"
import StudentService from "../../services/StudentService"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface UploadStudentsProps {
  examId: number
  onClose: () => void
  onSuccess?: () => void
}

const UploadStudents: React.FC<UploadStudentsProps> = ({ examId, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch<AppDispatch>()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0])
      setUploadStatus("idle")
      setErrorMessage("")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        setSelectedFile(file)
        setUploadStatus("idle")
        setErrorMessage("")
      } else {
        setErrorMessage("Please upload an Excel file (.xlsx or .xls)")
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 300)

    try {
      await StudentService.uploadStudentList({ examId }, selectedFile)

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadStatus("success")

      // Refresh exam data
      dispatch(getAllExams())

      // Call success callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (error) {
      clearInterval(progressInterval)
      setUploadProgress(0)
      setUploadStatus("error")
      setErrorMessage("Failed to upload student list. Please try again.")
      console.error("Error uploading student list:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Students</CardTitle>
        <CardDescription>Upload an Excel file containing the list of students for this exam</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {uploadStatus === "success" && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Student list uploaded successfully!</AlertDescription>
          </Alert>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${selectedFile ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-gray-400"}
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input ref={fileInputRef} type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />

          <div className="flex flex-col items-center gap-2">
            {selectedFile ? (
              <>
                <FileSpreadsheet className="h-10 w-10 text-green-500" />
                <p className="font-medium text-green-600">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">Excel files only (.xlsx, .xls)</p>
              </>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-center text-gray-500">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading || uploadStatus === "success"}>
          {isUploading ? "Uploading..." : "Upload Students"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UploadStudents
