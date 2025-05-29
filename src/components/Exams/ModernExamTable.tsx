import type React from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import ExamDetailsRow from "./ExamDetailsRow"

interface ModernExamTableProps {
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

const ModernExamTable = ({ exams, folders, openFolder, openModal, handleRowClick }: ModernExamTableProps) => {
  const handleMenuClose = () => {}

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
            <TableHead className="w-12 font-semibold text-gray-700"></TableHead>
            <TableHead className="font-semibold text-gray-700">Name</TableHead>
            <TableHead className="w-48 font-semibold text-gray-700">Actions</TableHead>
            <TableHead className="font-semibold text-gray-700">Sharing</TableHead>
            <TableHead className="font-semibold text-gray-700">Modified</TableHead>
            <TableHead className="w-10 font-semibold text-gray-700"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.map((folder) => (
            <ExamDetailsRow
              key={`folder-${folder.id}`}
              row={folder}
              isFolder={true}
              handleMenuClose={handleMenuClose}
              openFolder={openFolder}
              openModal={openModal}
              handleRowClick={handleRowClick}
            />
          ))}
          {exams.map((exam) => (
            <ExamDetailsRow
              key={`file-${exam.id}`}
              row={exam}
              isFolder={false}
              handleMenuClose={handleMenuClose}
              openFolder={openFolder}
              openModal={openModal}
              handleRowClick={handleRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ModernExamTable
