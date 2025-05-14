import type React from "react"
import { useState } from "react"
import { Folder, FileText } from "lucide-react"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import ExamRowButtons from "./ExamRowButtons"
import { formatDate } from "../../lib/utils"
import { TableCell, TableRow } from "@/components/ui/table"
import FileMenu from "./ExamMenu"

interface ExamDetailsRowProps {
  row: ExamFileType | ExamFolderType
  isFolder: boolean
  handleMenuClose: () => void
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

const ExamDetailsRow: React.FC<ExamDetailsRowProps> = ({
  row,
  isFolder,
  handleMenuClose,
  openFolder,
  openModal,
  handleRowClick,
}) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const formattedUpdatedAt = formatDate(row.updatedAt.toString())
  return (
    <TableRow
      key={`folder-${row.id}`}
      className="h-15 hover:bg-gray-50 cursor-pointer"
      onMouseEnter={() => setHoveredRow(row.id)}
      onMouseLeave={() => setHoveredRow(null)}
    >
      <TableCell>
        {isFolder ? (
          <Folder
            className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => {
              openFolder(row.id, row.name)
            }}
          />
        ) : (
          <FileText
            className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => {
              if (!isFolder && 'examPath' in row) {
                if ('examPath' in row) {
                  if ('examPath' in row) {
                    handleRowClick(row.name, row.examPath)
                  }
                }
              }
            }}
          />
        )}
      </TableCell>

      <TableCell
        className="font-medium text-left"
        onClick={() => {
          if (isFolder) {
            openFolder(row.id, row.name)
          } else {
            if (!isFolder && 'examPath' in row) {
              if ('examPath' in row) {
                if ('examPath' in row) {
                  handleRowClick(row.name, row.examPath)
                }
              }
            }
          }
        }}
      >
        {row.name}
      </TableCell>
      <TableCell>{hoveredRow === row.id && <ExamRowButtons row={row} />}</TableCell>
      <TableCell>
        <div className="flex items-center text-left">
          {row.isShared ? (
            <>
              <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                <span className="text-xs">👥</span>
              </div>
              <span className="text-sm text-gray-600">Shared</span>
            </>
          ) : (
            <span className="text-sm text-gray-600">Only you</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600 text-left">{formattedUpdatedAt}</TableCell>
      <TableCell align="right">
      <FileMenu
                    row={row}
                    handleMenuClose={handleMenuClose}
                    openModal={openModal}
                />
      </TableCell>
    </TableRow>
  )
}
export default ExamDetailsRow
