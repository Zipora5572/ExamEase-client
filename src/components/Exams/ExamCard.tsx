import React from "react"
import { Link } from "react-router-dom"
import { Star, Calendar, Users, BarChart3, Badge } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"

interface ExamCardProps {
  row: any
  isFolder: boolean
  handleToggleStarred?: (id: number, isStarred: boolean) => void
}

const ExamCard: React.FC<ExamCardProps> = ({ row, isFolder, handleToggleStarred }) => {
  const formattedDate = row.exam_date ? formatDate(new Date(row.exam_date).toString()) : "Date not set"

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">
            <Link
              to={`/ExamDetails?id=${row.id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {row.title || row.name}
            </Link>
          </CardTitle>
          {row.course_code && (
            <p className="text-sm text-gray-500">{row.course_code}</p>
          )}
        </div>
        {!isFolder && (
          <Button
            variant="ghost"
            size="icon"
            className={row.is_starred ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"}
            onClick={() => handleToggleStarred && handleToggleStarred(row.id, row.is_starred)}
          >
            <Star className={`h-5 w-5 ${row.is_starred ? "fill-current" : ""}`} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          {row.status && (
            <Badge className="bg-blue-100 text-blue-600">{row.status.replace("_", " ")}</Badge>
          )}
          {row.grading_method && (
            <Badge className="ml-2">
              {row.grading_method} grading
            </Badge>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-2" />
            <span>
              {row.submission_count} submission{row.submission_count !== 1 ? "s" : ""}
            </span>
          </div>
          {row.average_grade && (
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-gray-400 mr-2" />
              <span>Average: {row.average_grade.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-4 pt-0 flex justify-end">
        <Link to={`/ExamDetails?id=${row.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export default ExamCard