"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../store/store"
import { deleteExamFile, getAllExamsByUserId, renameExamFile } from "../../store/examSlice"
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

const ExamMenu = ({ openModal, row }: ExamMenuProps) => {
  const [newName, setNewName] = useState<string>(row.name)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "hebrew">("english")
  const [isProcessingLanguage, setIsProcessingLanguage] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [detectedLanguage, setDetectedLanguage] = useState<"english" | "hebrew" | "unknown">("unknown")
  const [uploadError, setUploadError] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: StoreType) => state.auth.user)
  const selectedFilesRef = useRef<FileList | null>(null)
  const isFolder = row.type === "FOLDER"

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

  const handleUploadStudentList = () => {
    setUploadError(null) // Reset error state when opening modal
    openModal({
      title: "Upload Students Excel",
      children: (
        <div className="space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Upload an Excel file containing the list of students for this exam. Our AI will automatically match students
            to their exams.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-slate-600" />
              Excel Template Format
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 text-sm rounded-md overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border border-slate-200 px-4 py-3 text-left font-medium text-slate-700">
                      Student ID
                    </th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-medium text-slate-700">
                      First Name
                    </th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-medium text-slate-700">
                      Last Name
                    </th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-medium text-slate-700">Email</th>
                    <th className="border border-slate-200 px-4 py-3 text-left font-medium text-slate-700">Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">12345</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">John</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Smith</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">john.smith@example.com</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Class A</td>
                  </tr>
                  <tr className="bg-slate-25">
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">67890</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Jane</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Doe</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">jane.doe@example.com</td>
                    <td className="border border-slate-200 px-4 py-3 text-slate-600">Class B</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                className="text-xs font-medium hover:bg-slate-100 transition-colors"
                onClick={() => window.open("#", "_blank")}
              >
                <Download className="h-3 w-3 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-3">
              <HelpCircle className="h-4 w-4" />
              How the Process Works
            </h4>
            <ol className="text-sm text-red-700 space-y-1 ml-5 list-decimal">
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
              className="w-full h-11 font-medium hover:bg-slate-50 transition-colors text-slate-700"
              onClick={() => document.getElementById("upload-student-list-input")?.click()}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Select Excel File
            </Button>
          </label>

          {uploadError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{uploadError}</AlertDescription>
            </Alert>
          )}
        </div>
      ),
      confirmText: "Upload",
      onConfirm: async () => {
        const filesToUpload = selectedFilesRef.current
        if (!filesToUpload) {
          setUploadError("Please select a file to upload")
          throw new Error("No file selected") // Prevent modal from closing
        }

        try {
          await StudentService.uploadStudentList({ examId: row.id }, filesToUpload[0])
          dispatch(getAllExamsByUserId(user?.id))
          // Clear the file selection after successful upload
          setSelectedFiles(null)
          selectedFilesRef.current = null
          setUploadError(null)
          // Modal will close automatically on successful completion
        } catch (error) {
          console.error("Error uploading student list:", error)
          setUploadError("Failed to upload student list. Please try again.")
          throw error // Prevent modal from closing on error
        }
      },
    })
  }

  const handleUploadStudentExams = (language: "english" | "hebrew" = "english") => {
    showUploadExamsModal(language)
  }

  const showUploadExamsModal = (language: "english" | "hebrew" = "english") => {
    setUploadError(null) // Reset error state when opening modal
    openModal({
      title: "Upload Student Exams",
      children: (
        <div className="space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Choose to upload a full folder of student exams or a single file. Our AI will process them and automatically
            match students to their exams.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              AI-Powered Processing
            </h4>
            <p className="text-sm text-red-700">
              Our system will automatically identify student names on the exams and match them to your student list.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
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
                className="w-full h-11 font-medium hover:bg-slate-50 transition-colors text-slate-700"
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
                className="w-full h-11 font-medium hover:bg-slate-50 transition-colors text-slate-700"
                onClick={() => document.getElementById("upload-student-file-input")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </label>
          </div>

          {uploadError && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">{uploadError}</AlertDescription>
            </Alert>
          )}
        </div>
      ),
      confirmText: "Upload",
      onConfirm: async () => {
        const filesToUpload = selectedFilesRef.current
        if (!filesToUpload || filesToUpload.length === 0) {
          setUploadError("Please select files to upload")
          throw new Error("No files selected") // Prevent modal from closing
        }

        try {
          await handleFilesUpload(filesToUpload, language)
          // Clear the file selection after successful upload
          setSelectedFiles(null)
          selectedFilesRef.current = null
          setUploadError(null)
          // Modal will close automatically on successful completion
        } catch (error) {
          // Error is already handled in handleFilesUpload
          throw error // Prevent modal from closing on error
        }
      },
    })
  }

  const handleFilesUpload = async (files: FileList | null, language: "english" | "hebrew") => {
    if (!files || files.length === 0) return

    setUploadError(null)

    try {
      await StudentExamService.uploadStudentExams(
        {
          examId: row.id,
          lang: language,
        },
        files,
      )
      dispatch(getAllExamsByUserId(user?.id))
    } catch (error) {
      console.error("Error uploading student exams:", error)
      setUploadError("Failed to upload student exams. Please try again.")
      throw error // Re-throw to prevent modal from closing
    }
  }

  const handleDownload = async () => {
    try {
      await ExamService.download(row.namePrefix)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  const handleDelete = () => {
    openModal({
      title: "Delete",
      children: (
        <div className="text-sm text-slate-600 leading-relaxed">
          You and the people you shared this {isFolder ? "folder" : "file"} with won't be able to access it once it has
          been deleted. The {isFolder ? "folder" : "file"} will be permanently deleted, and this action can't be undone.
        </div>
      ),
      confirmText: "Delete",
      onConfirm: () => {
        if (row.type === "FILE") dispatch(deleteExamFile(row.id))
        else dispatch(deleteFolder(row.id))
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
      },
    })
  }

  useEffect(() => {
    return () => {
      // Cleanup file selection when component unmounts
      setSelectedFiles(null)
      selectedFilesRef.current = null
      setUploadError(null)
    }
  }, [row.id])

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
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer h-8 w-8 rounded-lg transition-all duration-200"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 shadow-lg border-slate-200">
          {/* File-specific options */}
          {!isFolder && (
            <>
              <DropdownMenuGroup>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUploadStudentList()
                        }}
                        className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-slate-700"
                      >
                        <FileSpreadsheet className="mr-3 h-4 w-4 text-slate-500" />
                        <span className="font-medium">Upload Students Excel</span>
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
                        className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-slate-700"
                      >
                        <Upload className="mr-3 h-4 w-4 text-slate-500" />
                        <span className="font-medium">Upload Student Exams</span>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">AI will identify students and grade exams</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-slate-200" />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
                className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-slate-700"
              >
                <Download className="mr-3 h-4 w-4 text-slate-500" />
                <span className="font-medium">Download</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200" />
            </>
          )}

          {/* Common options for both files and folders */}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleRename()
            }}
            className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-slate-700"
          >
            <Pencil className="mr-3 h-4 w-4 text-slate-500" />
            <span className="font-medium">Rename</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-200" />

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
          >
            <Trash2 className="mr-3 h-4 w-4" />
            <span className="font-medium">Delete</span>
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
