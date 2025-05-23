"use client"

import type React from "react"
import { Upload } from "lucide-react"
import { useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { uploadExamFile } from "../../store/examSlice"
import type {  AppDispatch } from "../../store/store"
import LanguageDetectionService from "../../services/LanguageDetectionService"
import { Button } from "@/components/ui/button"
import type { ExamFileType } from "@/models/Exam"
import LanguageDetectionDialog from "../LangDetectionDialog"

const ExamUpload = ({ folderId }: { folderId: number | undefined }) => {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [detectedLanguage, setDetectedLanguage] = useState<"english" | "hebrew" | "unknown">("unknown")
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "hebrew">("english")
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [examDetails] = useState<Partial<ExamFileType>>({
    userId: 1,
    name: " ",
    folderId: folderId,
  })

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)

      setIsProcessing(true)
      setShowLanguageDialog(true)
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
        const result = await LanguageDetectionService.detectLanguage(selectedFile)
        setDetectedLanguage(result.language)
        clearInterval(progressInterval)
        setProcessingProgress(100)
        setSelectedLanguage(result.language)
      } catch (error) {
        console.error("Error detecting language:", error)
        clearInterval(progressInterval)
        setProcessingProgress(0)
        setDetectedLanguage("unknown")
      }
    }
  }

  const handleLanguageConfirm = () => {
    if (file) {
      handleUpload(file, selectedLanguage)
    }
    setShowLanguageDialog(false)
  }

  const handleUpload = async (selectedFile: File, language: "english" | "hebrew") => {
    if (selectedFile) {
      try {
        examDetails.folderId = folderId
        examDetails.lang = language
        dispatch(
          uploadExamFile({
            file: selectedFile,
            examDetails: examDetails,
          }),
        )
        setIsProcessing(false)
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }
  }

  return (
    <div>
      <input accept="*" ref={fileInputRef} style={{ display: "none" }} type="file" onChange={handleFileChange} />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Exam
      </Button>

      <LanguageDetectionDialog
        open={showLanguageDialog}
        onClose={() => setShowLanguageDialog(false)}
        isProcessing={isProcessing}
        processingProgress={processingProgress}
        detectedLanguage={detectedLanguage}
        selectedLanguage={selectedLanguage}
        onLanguageChange={(language) => setSelectedLanguage(language)}
        onConfirm={handleLanguageConfirm}
        showLanguageSelection={detectedLanguage === "unknown"}
      />
    </div>
  )
}
export default ExamUpload
