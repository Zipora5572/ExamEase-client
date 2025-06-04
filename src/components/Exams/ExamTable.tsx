import type React from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import ExamDetailsRow from "./ExamDetailsRow"

interface ExamTableProps {
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

const ExamTable = ({ exams, folders, openFolder, openModal, handleRowClick }: ExamTableProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
            <TableHead className="w-12 font-semibold text-slate-700 text-xs uppercase tracking-wide pl-6 py-4"></TableHead>
            <TableHead className="font-semibold text-slate-700 text-xs uppercase tracking-wide py-4">Name</TableHead>
            <TableHead className="w-48 font-semibold text-slate-700 text-xs uppercase tracking-wide py-4">
              Actions
            </TableHead>
            <TableHead className="font-semibold text-slate-700 text-xs uppercase tracking-wide py-4">Status</TableHead>
            <TableHead className="font-semibold text-slate-700 text-xs uppercase tracking-wide py-4">
              Submissions
            </TableHead>
            <TableHead className="font-semibold text-slate-700 text-xs uppercase tracking-wide py-4">Average</TableHead>
            <TableHead className="font-semibold text-slate-700 text-xs uppercase tracking-wide py-4">
              Modified
            </TableHead>
            <TableHead className="w-10 font-semibold text-slate-700 text-xs uppercase tracking-wide pr-6 py-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Folders section */}
          {folders.length > 0 && (
            <>
              {folders.map((folder) => (
                <ExamDetailsRow
                  key={`folder-${folder.id}`}
                  row={folder}
                  isFolder={true}
                  openFolder={openFolder}
                  openModal={openModal}
                  handleRowClick={handleRowClick}
                />
              ))}
              {exams.length > 0 && (
                <TableRow className="h-4 border-none">
                  <td colSpan={8} className="p-0 border-none">
                    <div className="h-px bg-slate-200 mx-6"></div>
                  </td>
                </TableRow>
              )}
            </>
          )}

          {/* Files section */}
          {exams.map((exam) => (
            <ExamDetailsRow
              key={`file-${exam.id}`}
              row={exam}
              isFolder={false}
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

export default ExamTable
