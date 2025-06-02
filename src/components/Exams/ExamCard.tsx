import type React from "react"
import { Calendar, Users,  Star, FileText, Folder, Percent } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-50">
              {isFolder ? <Folder className="h-5 w-5 text-blue-600" /> : <FileText className="h-5 w-5 text-blue-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors truncate"
                onClick={handleCardClick}
              >
                {item.name}
              </h3>
              {!isFolder && "namePrefix" in item && <p className="text-sm text-gray-500 mt-1">{item.namePrefix}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {item.isStarred && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
            <ExamMenu row={item} openModal={openModal} />
          </div>
        </div>

        {!isFolder && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {"status" in item && item.status && (
                <Badge variant="outline" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              )}
            
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>

              {"submissions" in item && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{item.submissions || 0} submissions</span>
                </div>
              )}

              {"averageGrade" in item && (
                <div className="flex items-center space-x-2 text-gray-600">

<Percent className="h-3.5 w-3.5 text-gray-500" />
                  <span>Average: {item.averageGrade || "N/A"}</span>
                </div>
              )}

              {/* <div className="flex items-center space-x-2 text-gray-600">
                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                <span>{item.isShared ? "Shared" : "Only you"}</span>
              </div> */}
            </div>
          </div>
        )}

        {isFolder && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <span>{item.isShared ? "Shared" : "Only you"}</span>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ExamRowButtons row={item} />
            </div>

            {isFolder ? (
              <Button variant="outline" size="sm" onClick={handleCardClick} className="ml-auto flex items-center gap-1">
                <Folder className="h-4 w-4" />
                <span>Open Folder</span>
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleCardClick} className="ml-auto">
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ExamCard
