"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { deleteExamFile, getAllExams, renameExamFile } from "../../store/examSlice"
import { deleteFolder, renameFolder } from "../../store/folderSlice"
import StudentExamService from "../../services/StudentExamService"
import ExamService from "../../services/ExamService"
import StudentService from "../../services/StudentService"
import LanguageDetectionService from "../../services/LanguageDetectionService"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import {
  Upload,
  Download,
  Trash2,
  Pencil,
  MoreHorizontal,
  HelpCircle,
  FileSpreadsheet,
  FileText,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import LanguageDetectionDialog from "../LangDetectionDialog"

interface ExamMenuProps {
  handleMenuClose: () => void
  row: ExamFileType | ExamFolderType
  openModal: (data: {
    title: string
    initialName?: string
    setNewName?: (name: string) => void
    confirmText?: string
    onConfirm?: (value: string) => void
    children?: React.ReactNode
  }) => void
}
const ExamMenu = ({ handleMenuClose, openModal, row }: ExamMenuProps) => {
  const [newName, setNewName] = useState<string>(row.name)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "hebrew">("english")
  // const [studentListUploaded, setStudentListUploaded] = useState(false)
  const [isProcessingLanguage, setIsProcessingLanguage] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [detectedLanguage, setDetectedLanguage] = useState<"english" | "hebrew" | "unknown">("unknown")
  const [uploadError, setUploadError] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const selectedFilesRef = useRef<FileList | null>(null)

  useEffect(() => {
    setNewName(row.name)
  }, [row.name])

  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      selectedFilesRef.current = selectedFiles
    }
  }, [selectedFiles])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files
      setSelectedFiles(files)
      console.log(event.target.id)

      if (event.target.id.includes("student-file") || event.target.id.includes("folder-input")) {
        setShowLanguageDialog(true)
        setIsProcessingLanguage(true)
        setProcessingProgress(0)

        const progressInterval = setInterval(() => {
          setProcessingProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 300)

        try {
          const result = await LanguageDetectionService.detectLanguage(files[0])
          setDetectedLanguage(result.language)
          clearInterval(progressInterval)
          setProcessingProgress(100)
          setSelectedLanguage(result.language)
        } catch (error) {
          console.error("Error detecting language:", error)
          clearInterval(progressInterval)
          setProcessingProgress(0)
          setDetectedLanguage("unknown")
        } finally {
          setIsProcessingLanguage(false)
        }
      }
    }
  }

  const handleLanguageConfirm = () => {
    setShowLanguageDialog(false)
    handleUploadStudentExams(selectedLanguage)
  }

  // Check if student list has been uploaded for this exam
  // useEffect(() => {
  //   const checkStudentList = async () => {
  //     try {
  //       // This would be a real API call in a production app
  //       // For now, we'll simulate this check
  //       const hasStudents = await StudentService.hasStudents({ examId: row.id })
  //       setStudentListUploaded(hasStudents)
  //     } catch (error) {
  //       console.error("Error checking student list:", error)
  //       setStudentListUploaded(false)
  //     }
  //   }

  //   checkStudentList()
  // }, [row.id])

  const handleUploadStudentList = () => {
    openModal({
      title: "Upload Students Excel",
      children: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload an Excel file containing the list of students for this exam. Our AI will automatically match students
            to their exams.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-3">Excel Template Format</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2 text-left">Student ID</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">First Name</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Last Name</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Email</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">12345</td>
                    <td className="border border-gray-200 px-3 py-2">John</td>
                    <td className="border border-gray-200 px-3 py-2">Smith</td>
                    <td className="border border-gray-200 px-3 py-2">john.smith@example.com</td>
                    <td className="border border-gray-200 px-3 py-2">Class A</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">67890</td>
                    <td className="border border-gray-200 px-3 py-2">Jane</td>
                    <td className="border border-gray-200 px-3 py-2">Doe</td>
                    <td className="border border-gray-200 px-3 py-2">jane.doe@example.com</td>
                    <td className="border border-gray-200 px-3 py-2">Class B</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => window.open("#", "_blank")}>
                <Download className="h-3 w-3 mr-1" />
                Download Template
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-800 flex items-center">
              <HelpCircle className="h-4 w-4 mr-1" />
              How the Process Works
            </h4>
            <ol className="text-xs text-blue-700 mt-1 ml-5 list-decimal">
              <li>Upload your student roster Excel file first</li>
              <li>Then upload scanned student exams</li>
              <li>Our AI will automatically identify student names on the exams</li>
              <li>The system matches exams to students in your roster</li>
              <li>Review and finalize the grading</li>
            </ol>
          </div>

          <input
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            id="upload-student-list-input"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-student-list-input">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById("upload-student-list-input")?.click()}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Select Excel File
            </Button>
          </label>

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </div>
      ),
      confirmText: "Upload",
      onConfirm: async () => {
        const filesToUpload = selectedFilesRef.current
        if (!filesToUpload) {
          setUploadError("Please select a file to upload")
          return
        }

        try {
          await StudentService.uploadStudentList({ examId: row.id }, filesToUpload[0])
          // setStudentListUploaded(true)
          dispatch(getAllExams())
          handleMenuClose()
        } catch (error) {
          console.error("Error uploading student list:", error)
          setUploadError("Failed to upload student list. Please try again.")
        }
      },
    })
  }

  const handleUploadStudentExams = (language: "english" | "hebrew" = "english") => {
    showUploadExamsModal(language)
  }

  const showUploadExamsModal = (language: "english" | "hebrew" = "english") => {
    openModal({
      title: "Upload Student Exams",
      children: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose to upload a full folder of student exams or a single file. Our AI will process them and automatically
            match students to their exams.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
            <h4 className="text-sm font-medium text-blue-800 flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              AI-Powered Processing
            </h4>
            <p className="text-xs text-blue-700 mt-1">
              Our system will automatically identify student names on the exams and match them to your student list.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <input
              accept="*"
              style={{ display: "none" }}
              id="upload-folder-input"
              type="file"
              multiple
              {...({ webkitdirectory: "true" } as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-folder-input">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("upload-folder-input")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Folder
              </Button>
            </label>

            <input
              accept="*"
              style={{ display: "none" }}
              id="upload-student-file-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="upload-student-file-input">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("upload-student-file-input")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </label>
          </div>

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </div>
      ),
      confirmText: "Upload",
      onConfirm: () => {
        const filesToUpload = selectedFilesRef.current
        if (!filesToUpload || filesToUpload.length === 0) {
          setUploadError("Please select files to upload")
          return
        }
        handleFilesUpload(filesToUpload, language)
      },
    })
  }

  const handleFilesUpload = async (files: FileList | null, language: "english" | "hebrew") => {
    if (!files || files.length === 0) return

    setUploadError(null)

    try {
      // In a real implementation, we would pass the selected language to the API
      await StudentExamService.uploadStudentExams(
        {
          examId: row.id,
          lang: language,
        },
        files,
      )
      dispatch(getAllExams())
      handleMenuClose()
    } catch (error) {
      console.error("Error uploading student exams:", error)
      setUploadError("Failed to upload student exams. Please try again.")
    }
  }

  const handleDownload = async () => {
    try {
      await ExamService.download(row.namePrefix)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
    handleMenuClose()
  }

  const handleDelete = () => {
    openModal({
      title: "Delete",
      children: (
        <div className="text-sm text-gray-600">
          You and the people you shared this file with won't be able to access it once it has been deleted. The file
          will be permanently deleted, and this action can't be undone.
        </div>
      ),
      confirmText: "Delete",
      onConfirm: () => {
        if (row.type === "FILE") dispatch(deleteExamFile(row.id))
        else dispatch(deleteFolder(row.id))
        handleMenuClose()
      },
    })
  }

  const handleRename = () => {
    openModal({
      title: "Rename",
      initialName: newName,
      setNewName: (name: string) => {
        setNewName(name)
      },
      confirmText: "Rename",
      onConfirm: (updatedName: string) => {
        if (row.type === "FILE") dispatch(renameExamFile({ id: row.id, newName: updatedName }))
        else dispatch(renameFolder({ id: row.id, newName: updatedName }))
        handleMenuClose()
      },
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUploadStudentList()
                    }}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Upload Students Excel</span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Upload student roster first to enable AI matching</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUploadStudentExams()
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload Student Exams</span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">AI will identify students and grade exams</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleDownload()
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleRename()
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LanguageDetectionDialog
        open={showLanguageDialog}
        onClose={() => setShowLanguageDialog(false)}
        isProcessing={isProcessingLanguage}
        processingProgress={processingProgress}
        detectedLanguage={detectedLanguage}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(language) => setSelectedLanguage(language)}
        onConfirm={handleLanguageConfirm}
        showLanguageSelection={detectedLanguage === "unknown"}
      />
    </>
  )
}

export default ExamMenu
