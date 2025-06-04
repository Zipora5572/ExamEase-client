import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { toggleStarExamFile } from "../../store/examSlice"
import { toggleStarFolder } from "../../store/folderSlice"
import { Star, Copy, Eye, Check } from "lucide-react"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"

const ExamRowButtons = ({ row }: { row: ExamFileType | ExamFolderType }) => {
  const [isCopied, setIsCopied] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleCopy = async () => {
    try {
      if ("examPath" in row) {
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


  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all duration-200 hover:scale-110 group bg-transparent border-none shadow-none"
              onClick={(e) => {
                e.stopPropagation()
                handleToggleStar()
              }}
            >
              {row.isStarred ? (
                <Star className="h-4 w-4 fill-amber-400 text-amber-400 transition-colors" />
              ) : (
                <Star className="h-4 w-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-slate-800 text-white border-slate-600 text-xs">
            <p className="text-xs font-medium">{row.isStarred ? "Remove from starred" : "Add to starred"}</p>
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
                  className="h-8 w-8 transition-all duration-200 hover:scale-110 group bg-transparent border-none shadow-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy()
                  }}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-emerald-500 transition-colors" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-800 text-white border-slate-600 text-xs">
                <p className="text-xs font-medium">{isCopied ? "Copied!" : "Copy link"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 transition-all duration-200 hover:scale-110 group bg-transparent border-none shadow-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleView()
                  }}
                >
                  <Eye className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-800 text-white border-slate-600 text-xs">
                <p className="text-xs font-medium">View student exams</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </>
      )}
    </div>
  )
}

export default ExamRowButtons
