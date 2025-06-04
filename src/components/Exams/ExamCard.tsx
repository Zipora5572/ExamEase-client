"use client"

import type React from "react"
import { Calendar, Users, FileText, Folder, Percent, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import { formatDate } from "../../lib/utils"
import ExamRowButtons from "./ExamRowButtons"
import ExamMenu from "./ExamMenu"

interface ExamCardProps {
  item: ExamFileType | ExamFolderType
  isFolder: boolean
  onItemClick: (item: ExamFileType | ExamFolderType) => void
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
      return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
    case "grading":
      return "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100"
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
    case "in progress":
      return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
    default:
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
  }
}

const ExamCard = ({ item, isFolder, openFolder, openModal, handleRowClick }: ExamCardProps) => {
  const formattedDate = formatDate(item.updatedAt.toString())

  const handleCardClick = () => {
    if (isFolder) {
      openFolder(item.id, item.name)
    } else {
      if ("examPath" in item) {
        handleRowClick(item.name, item.examPath)
      }
    }
  }

  const handleFolderIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFolder) {
      openFolder(item.id, item.name)
    }
  }

  return (
    <Card
      className={`group relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 ease-out hover:-translate-y-1 rounded-2xl ${!isFolder ? "cursor-pointer" : ""}`}
      onClick={!isFolder ? handleCardClick : undefined}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-red-50/20 pointer-events-none" />

      {/* View Details indicator for file cards */}
      {!isFolder && (
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center text-red-600 font-medium text-sm">
            <span className="mr-1">View Details</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      )}

      <CardContent className="relative p-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            {/* Icon Container */}
            <div
              className={`relative p-3 rounded-xl transition-all duration-200 ${
                isFolder
                  ? "bg-gradient-to-br from-red-50 to-rose-100 group-hover:from-red-100 group-hover:to-rose-200 cursor-pointer"
                  : "bg-gradient-to-br from-red-50 to-rose-100"
              }`}
              onClick={isFolder ? handleFolderIconClick : undefined}
            >
              {isFolder ? (
                <Folder className="h-6 w-6 text-red-600 transition-transform duration-200 group-hover:scale-110" />
              ) : (
                <FileText className="h-6 w-6 text-red-600" />
              )}
              {isFolder && (
                <div className="absolute inset-0 rounded-xl bg-red-600/0 group-hover:bg-red-600/5 transition-colors duration-200" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-slate-900 text-lg leading-tight ${isFolder ? "cursor-pointer hover:text-red-600" : ""} transition-colors duration-200 truncate mb-1`}
                    onClick={isFolder ? handleCardClick : undefined}
                  >
                    {item.name}
                  </h3>
                  {!isFolder && "namePrefix" in item && (
                    <p className="text-sm text-slate-500 font-medium">{item.namePrefix}</p>
                  )}
                </div>

                {/* Menu only */}
                <div className="ml-3">
                  <ExamMenu row={item} openModal={openModal} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Metadata Section */}
        {!isFolder && (
          <div className="space-y-5">
            {/* Status Badge */}
            {"status" in item && item.status && (
              <div className="flex justify-start">
                <Badge
                  variant="outline"
                  className={`${getStatusColor(item.status)} px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-200`}
                >
                  {item.status}
                </Badge>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 text-slate-600">
                <div className="p-1.5 rounded-lg bg-slate-100">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>

              {"submissions" in item && (
                <div className="flex items-center space-x-3 text-slate-600">
                  <div className="p-1.5 rounded-lg bg-slate-100">
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{item.submissions || 0} submissions</span>
                </div>
              )}

              {"averageGrade" in item && item.averageGrade && (
                <div className="flex items-center space-x-3 text-slate-600">
                  <div className="p-1.5 rounded-lg bg-slate-100">
                    <Percent className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Average: {item.averageGrade}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Folder Metadata */}
        {isFolder && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-slate-600">
              <div className="p-1.5 rounded-lg bg-slate-100">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>

            <div className="flex items-center space-x-3 text-slate-600">
              <div className="h-2 w-2 rounded-full bg-slate-400"></div>
              <span className="text-sm font-medium">{item.isShared ? "Shared" : "Only you"}</span>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            {/* Action Buttons - Hidden by default, shown on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
              <ExamRowButtons row={item} />
            </div>

            {/* View Details indicator for file cards (mobile-friendly) */}
            {!isFolder && (
              <div className="ml-auto md:hidden">
                <div className="flex items-center text-red-600 font-medium text-sm">
                  <span className="mr-1">View</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive overlay for file cards */}
        {!isFolder && (
  <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-0 pointer-events-none transition-opacity duration-300" />
)}

      </CardContent>
    </Card>
  )
}

export default ExamCard
