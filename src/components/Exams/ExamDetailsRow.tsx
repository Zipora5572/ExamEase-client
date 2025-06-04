"use client"

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
      return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
    case "grading":
      return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200"
    case "completed":
      return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
    case "in progress":
      return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
  }
}

const ExamDetailsRow: React.FC<ExamDetailsRowProps> = ({ row, isFolder, openFolder, openModal, handleRowClick }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const formattedUpdatedAt = formatDate(row.updatedAt.toString())

  return (
    <TableRow
      key={`folder-${row.id}`}
      className={`h-16 hover:bg-slate-50/70 cursor-pointer transition-all duration-200 border-b border-slate-100 group ${
        isFolder ? "bg-slate-25/30" : "bg-white"
      }`}
      onMouseEnter={() => setHoveredRow(row.id)}
      onMouseLeave={() => setHoveredRow(null)}
    >
      <TableCell className="w-12 pl-6">
        {isFolder ? (
          <div
            className="p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer inline-flex"
            onClick={() => openFolder(row.id, row.name)}
          >
            <Folder className="h-5 w-5 text-red-500" />
          </div>
        ) : (
          <div
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer inline-flex"
            onClick={() => {
              if (!isFolder && "examPath" in row) {
                handleRowClick(row.name, row.examPath)
              }
            }}
          >
            <FileText className="h-5 w-5 text-slate-500" />
          </div>
        )}
      </TableCell>

      <TableCell
        className="font-medium text-slate-900 cursor-pointer py-4"
        onClick={() => {
          if (isFolder) {
            openFolder(row.id, row.name)
          } else {
            if (!isFolder && "examPath" in row) {
              handleRowClick(row.name, row.examPath)
            }
          }
        }}
      >
        <div className="flex items-center">
          <span className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
            {row.name}
          </span>
        </div>
      </TableCell>

      <TableCell className="w-48 py-4">
        <div className={`transition-all duration-200 ${hoveredRow === row.id ? "opacity-100" : "opacity-0"}`}>
          <ExamRowButtons row={row} />
        </div>
      </TableCell>

      <TableCell className="py-4">
        {!isFolder && "status" in row && row.status ? (
          <Badge
            variant="outline"
            className={`${getStatusColor(row.status)} font-medium text-xs px-3 py-1 transition-colors`}
          >
            {row.status}
          </Badge>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        )}
      </TableCell>

      <TableCell className="py-4">
        {!isFolder ? (
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              {!isFolder && "submissions" in row ? row.submissions || 0 : "—"}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        )}
      </TableCell>

      <TableCell className="py-4">
        {!isFolder ? (
          <div className="flex items-center gap-2">
            <Percent className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              {!isFolder && "averageGrade" in row ? (row.averageGrade ?? "N/A") : "—"}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        )}
      </TableCell>

      <TableCell className="text-sm text-slate-500 py-4 font-medium">{formattedUpdatedAt}</TableCell>

      <TableCell className="w-10 pr-6 py-4">
        <ExamMenu row={row} openModal={openModal} />
      </TableCell>
    </TableRow>
  )
}

export default ExamDetailsRow
