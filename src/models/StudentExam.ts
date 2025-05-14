import { StudenType } from "./Student"


export type StudentExamType = {
    id: number,
    teacherId: number | null,
    examId: number | null,
    examPath: string,
    lang: string,
    namePrefix: string,
    isChecked: boolean,
    grade: number
    evaluation: string | null,
    checkedAt: Date | null,
    student:StudenType
}

