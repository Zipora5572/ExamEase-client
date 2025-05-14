import type { ExamType } from "./Exam"
import type { UserType } from "./User"

export type Permission = "view" | "comment" | "edit"

export interface SharedExamType {
  id: number
  examId: number
  exam: ExamType
  sharedById: number
  sharedBy: UserType
  sharedWithId: number
  sharedWith: UserType
  permission: Permission
  sharedAt: string
  lastAccessedAt?: string
}

export interface SharedExamStats {
  totalSharedByMe: number
  totalSharedWithMe: number
  recentlyAccessed: SharedExamType[]
}
