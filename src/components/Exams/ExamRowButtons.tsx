import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { toggleStarExamFile } from "../../store/examSlice"
import { toggleStarFolder } from "../../store/folderSlice"
import { Star, Copy, Eye, Check, Users } from "lucide-react"
import type {  ExamFileType, ExamFolderType } from "../../models/Exam"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"

const ExamRowButtons = ({ row }: { row: ExamFileType | ExamFolderType }) => {
  const [isCopied, setIsCopied] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleCopy = async () => {
    try {
      if ('examPath' in row) {
        await navigator.clipboard.writeText(row.examPath)
      } else {
        console.error("Failed to copy: 'examPath' does not exist on this row type")
      }

      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleToggleStar = () => {
  
    row.type == "FILE" ? dispatch(toggleStarExamFile(row.id)) : dispatch(toggleStarFolder(row.id))
  }

  const handleView = () => {
    navigate("/app/students-exams", { state: { examId: row.id, examFileTeacherName: row.namePrefix } })
  }

  const handleStudents = () => {
    navigate("/app/students-exams", {
      state: {
        examId: row.id,
        examFileTeacherName: row.namePrefix,
        initialTab: "list",
      },
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation()
                handleToggleStar()
              }}
            >
              {row.isStarred ? (
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              ) : (
                <Star className="h-4 w-4 text-gray-400 hover:text-amber-400" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{row.isStarred ? "Remove from starred" : "Add to starred"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {row.type == "FILE" && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy()
                  }}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isCopied ? "Copied!" : "Copy link"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleView()
                  }}
                >
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>View student exams</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStudents()
                  }}
                >
                  <Users className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Manage students</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  )
}

export default ExamRowButtons
