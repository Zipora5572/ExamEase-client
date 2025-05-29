import type React from "react"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import ExamCard from "./ExamCard"

interface ExamGridProps {
  exams: ExamFileType[]
  folders: ExamFolderType[]
  openFolder: (folderId: number, name: string) => void
  openModal: (data: {
    title: string
    initialName?: string
    setNewName?: (name: string) => void
    confirmText?: string
    onConfirm?: (name: string) => void
    children?: React.ReactNode
  }) => void
  handleRowClick: (fileName: string, fileUrl: string) => void
}

const ExamGrid = ({ exams, folders, openFolder, openModal, handleRowClick }: ExamGridProps) => {
  const allItems = [
    ...folders.map((folder) => ({ ...folder, type: "FOLDER" as const })),
    ...exams.map((exam) => ({ ...exam, type: "FILE" as const })),
  ]

  if (allItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No exams found</div>
        <div className="text-gray-500 text-sm">Create your first exam to get started</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allItems.map((item) => (
        <ExamCard
          key={`${item.type}-${item.id}`}
          item={item}
          isFolder={item.type === "FOLDER"}
          onItemClick={() => {}}
          openFolder={openFolder}
          openModal={openModal}
          handleRowClick={handleRowClick}
        />
      ))}
    </div>
  )
}

export default ExamGrid
