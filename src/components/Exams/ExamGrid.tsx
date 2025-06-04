import type React from "react"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import ExamCard from "./ExamCard"
import { FileText } from "lucide-react"
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
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
            <FileText className="h-8 w-8 text-red-400" /> {/* Use FileText component */}
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No exams found</h3>
          <p className="text-slate-500">Create your first exam to get started with grading</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Folders section */}
      {folders.length > 0 && (
        <div className="space-y-6">
          {folders.length > 0 && exams.length > 0 && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
              <h3 className="text-xl font-semibold text-slate-800">Folders</h3>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
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
        <div className="space-y-6">
          {folders.length > 0 && exams.length > 0 && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
              <h3 className="text-xl font-semibold text-slate-800">Exams</h3>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
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
