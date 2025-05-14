"use client"

import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, CheckCircle, RefreshCw, FileText } from "lucide-react"
import type { StudentExamType } from "../../../models/StudentExam"
import { updateStudentExam } from "../../../store/studentExamSlice"
import studentExamsService from "../../../services/StudentExamService"
import type { AppDispatch } from "../../../store/store"

interface ExamRowActionsProps {
    exam: StudentExamType
    navigate: any
    checkingStatus: { [key: string]: "idle" | "pending" | "done" }
    setCheckingStatus: React.Dispatch<
        React.SetStateAction<{ [key: string]: "idle" | "pending" | "done" }>
    >
    examFileTeacherName: string
}

const ExamRowActions = ({
    exam,
    navigate,
    checkingStatus,
    setCheckingStatus,
    examFileTeacherName,
}: ExamRowActionsProps) => {
    const dispatch = useDispatch<AppDispatch>()

    const handleViewExamDetails = () => {
        navigate("/app/viewExam", { state: { exam } })
    }

    const handleCheckExam = async () => {
        const examId = exam.id
        setCheckingStatus((prev) => ({ ...prev, [examId]: "pending" }))

        try {
            const response = await studentExamsService.checkExam(exam.namePrefix, examFileTeacherName, exam.lang)

            dispatch(
                updateStudentExam({
                    id: exam.id,
                    studentExam: {
                        ...exam,
                        grade: Number(response.grade?.replace("%", "")),
                        evaluation: response.evaluation,
                        isChecked: true,
                        checkedAt: new Date()
                    },
                }),
            )

            setCheckingStatus((prev) => ({ ...prev, [examId]: "done" }))
        } catch (error) {
            console.error("Error checking exam:", error)
            setCheckingStatus((prev) => ({ ...prev, [examId]: "idle" }))
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-gray-200">
                <DropdownMenuItem
                    onClick={handleViewExamDetails}
                    className="text-gray-700 focus:text-gray-900 focus:bg-gray-100"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleCheckExam}
                    disabled={exam.isChecked || checkingStatus[exam.id] === "pending"}
                    className="text-gray-700 focus:text-gray-900 focus:bg-gray-100"
                >
                    {checkingStatus[exam.id] === "pending" ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Checking...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Check Exam
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="text-gray-700 focus:text-gray-900 focus:bg-gray-100">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Exam
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ExamRowActions
