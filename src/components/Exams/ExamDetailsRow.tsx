import type React from "react"
import { useState } from "react"
import { Folder, FileText, Users, Percent } from "lucide-react"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import ExamRowButtons from "./ExamRowButtons"
import { formatDate } from "../../lib/utils"
import { TableCell, TableRow } from "@/components/ui/table"
import ExamMenu from "./ExamMenu"
import { Badge } from "@/components/ui/badge"

interface ExamDetailsRowProps {
  row: ExamFileType | ExamFolderType
  isFolder: boolean
 
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

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "draft":
      return "bg-gray-100 text-gray-700 border-gray-200"
    case "grading":
      return "bg-purple-100 text-purple-700 border-purple-200"
    case "completed":
      return "bg-green-100 text-green-700 border-green-200"
    case "in progress":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const ExamDetailsRow: React.FC<ExamDetailsRowProps> = ({
  row,
  isFolder,
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
            className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors"
            onClick={() => {
              openFolder(row.id, row.name)
            }}
          />
        ) : (
          <FileText
            className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors"
            onClick={() => {
              if (!isFolder && "examPath" in row) {
                if ("examPath" in row) {
                  handleRowClick(row.name, row.examPath)
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
            if (!isFolder && "examPath" in row) {
              if ("examPath" in row) {
                handleRowClick(row.name, row.examPath)
              }
            }
          }
        }}
      >
        {row.name}
      </TableCell>

      <TableCell>{hoveredRow === row.id && <ExamRowButtons row={row} />}</TableCell>

      <TableCell>
        {!isFolder && "status" in row && row.status ? (
          <Badge variant="outline" className={getStatusColor(row.status)}>
            {row.status}
          </Badge>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>

      <TableCell>
        {!isFolder? (
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-gray-500" />
            <span>{!isFolder && "submissions" in row ? row.submissions || 0 : "-"}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>

      <TableCell>
        {!isFolder ? (
          <div className="flex items-center gap-1.5">

<Percent className="h-3.5 w-3.5 text-gray-500" />
            <span>{!isFolder && "averageGrade" in row ? row.averageGrade ?? "N/A" : "-"}</span>

          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>

      {/* <TableCell>
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
      </TableCell> */}

      <TableCell className="text-sm text-gray-600 text-left">{formattedUpdatedAt}</TableCell>

      <TableCell align="right">
        <ExamMenu row={row} openModal={openModal} />
      </TableCell>
    </TableRow>
  )
}

export default ExamDetailsRow
