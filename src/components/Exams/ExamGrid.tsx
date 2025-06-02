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
  if (folders.length === 0 && exams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No exams found</div>
        <div className="text-gray-500 text-sm">Create your first exam to get started</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Folders section */}
      {folders.length > 0 && (
        <div className="space-y-4">
          {folders.length > 0 && exams.length > 0 && <h3 className="text-lg font-medium text-gray-700">Folders</h3>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {folders.map((folder) => (
              <ExamCard
                key={`folder-${folder.id}`}
                item={folder}
                isFolder={true}
                onItemClick={() => {}}
                openFolder={openFolder}
                openModal={openModal}
                handleRowClick={handleRowClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files section */}
      {exams.length > 0 && (
        <div className="space-y-4">
          {folders.length > 0 && exams.length > 0 && <h3 className="text-lg font-medium text-gray-700">Exams</h3>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exams.map((exam) => (
              <ExamCard
                key={`file-${exam.id}`}
                item={exam}
                isFolder={false}
                onItemClick={() => {}}
                openFolder={openFolder}
                openModal={openModal}
                handleRowClick={handleRowClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamGrid
