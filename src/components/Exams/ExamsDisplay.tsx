"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import ModalWrapper from "../ModalWrapper"
import useModal from "../../hooks/useModal"
import NoDocuments from "../NoDocuments"
import ExamGrid from "./ExamGrid"
import ExamViewToggle from "./ExamViewToggle"
import ExamTable from "./ExamTable"

interface ExamsDisplayProps {
  exams: ExamFileType[] | null
  folders: ExamFolderType[]
  loading: boolean
  currentFolderId: number | null
  setCurrentFolderId: React.Dispatch<React.SetStateAction<number | null>>
  currentFolderName: string | null
  setCurrentFolderName: React.Dispatch<React.SetStateAction<string | null>>
  folderPath: { id: number | null; name: string }[]
  setFolderPath: React.Dispatch<React.SetStateAction<{ id: number | null; name: string }[]>>
}


const ExamsDisplay = ({
  exams,
  folders,
  loading,
  currentFolderId,
  setCurrentFolderId,
  setCurrentFolderName,
  setFolderPath,
}: ExamsDisplayProps) => {
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null)
  const { isOpen, openModal, closeModal, modalData } = useModal()
  const [viewMode, setViewMode] = useState<"all" | "folder">("all")
  const [displayMode, setDisplayMode] = useState<"table" | "grid">("table")
  const [filteredExams, setFilteredExams] = useState<ExamFileType[]>(exams || [])
  const [filteredFolders, setFilteredFolders] = useState<ExamFolderType[]>(folders)

  // 🆕 טוען מצב תצוגה מ-localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("exam-display-mode")
    if (savedMode === "table" || savedMode === "grid") {
      setDisplayMode(savedMode)
    }
  }, [])

  const handleDisplayModeChange = (mode: "table" | "grid") => {
    setDisplayMode(mode)
    localStorage.setItem("exam-display-mode", mode) // 🆕 שמירת מצב
  }

  useEffect(() => {
    if (viewMode === "folder" && currentFolderId !== null) {
      setFilteredExams(exams ? exams.filter((exam) => exam.folderId === currentFolderId) : [])
      setFilteredFolders(folders.filter((folder) => folder.parentFolderId === currentFolderId && folder.ofTeacherExams))
    } else {
      setFilteredExams(exams ? exams.filter((exam) => exam.folderId === null) : [])
      setFilteredFolders(folders.filter((folder) => folder.parentFolderId === null && folder.ofTeacherExams))
    }
  }, [viewMode, currentFolderId, exams, folders])

  const openFolder = (folderId: number, folderName: string) => {
    setFolderPath((prevPath) => [...prevPath, { id: folderId, name: folderName }])
    setCurrentFolderId(folderId)
    setCurrentFolderName(folderName)
    setViewMode("folder")
  }

  const navigate = useNavigate()

  const handleRowClick = (fileName: string, fileUrl: string) => {
    setSelectedFile({ name: fileName, url: fileUrl })
  }

  if (selectedFile) {
    navigate("/app/viewExam", { state: { fileName: selectedFile.name, fileUrl: selectedFile.url } })
  }

  if (!loading && filteredFolders.length === 0 && filteredExams.length === 0) {
    return <NoDocuments />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <ExamViewToggle viewMode={displayMode} onViewModeChange={handleDisplayModeChange} />
        </div>

        {displayMode === "table" ? (
          <ExamTable
            exams={filteredExams}
            folders={filteredFolders}
            openFolder={openFolder}
            openModal={openModal}
            handleRowClick={handleRowClick}
          />
        ) : (
          <ExamGrid
            exams={filteredExams}
            folders={filteredFolders}
            openFolder={openFolder}
            openModal={openModal}
            handleRowClick={handleRowClick}
          />
        )}
      </div>

      <ModalWrapper
        open={isOpen}
        handleClose={() => {
          closeModal()
        }}
        title={modalData?.title || ""}
        onConfirm={modalData?.onConfirm}
        confirmText={modalData?.confirmText}
        initialName={modalData?.initialName}
      >
        {modalData?.children}
      </ModalWrapper>
    </>
  )
}

export default ExamsDisplay
