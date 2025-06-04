"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import type { AppDispatch, StoreType } from "../../store/store"
import { getAllExamsByUserId } from "../../store/examSlice"
import useModal from "../../hooks/useModal"
import ModalWrapper from "../ModalWrapper"
import ActionButtons from "../ActionButtons"
import ExamsDisplay from "./ExamsDisplay"
import { ChevronLeft, Search, Filter } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { getAllFoldersByUserId } from "@/store/folderSlice"

const ExamList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: StoreType) => state.auth.user)
  const exams = useSelector((state: StoreType) => state.exams.exams)
  const folders = useSelector((state: StoreType) => state.folders.folders)
  const loading = useSelector((state: StoreType) => state.exams.loading)
  const error = useSelector((state: StoreType) => state.exams.error)
  const { isOpen, openModal, closeModal, modalData } = useModal()
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<{ id: number | null; name: string }[]>([])
  const location = useLocation()
  const filter = new URLSearchParams(location.search).get("filter") || "all"
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredExams = exams?.filter((exam) => {
    let matches = true

    if (filter === "shared") matches = matches && exam.isShared
    if (filter === "starred") matches = matches && exam.isStarred
    if (searchQuery) matches = matches && exam.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (statusFilter !== "all" && "status" in exam) matches = matches && exam.status === statusFilter

    return matches
  })

  const filteredFolders = statusFilter !== "all"
  ? [] 
  : folders.filter((folder) => {
      let matches = true

      if (filter === "shared") matches = matches && folder.isShared
      if (filter === "starred") matches = matches && folder.isStarred
      if (searchQuery) matches = matches && folder.name.toLowerCase().includes(searchQuery.toLowerCase())

      return matches
    })

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllFoldersByUserId(user?.id))
      dispatch(getAllExamsByUserId(user?.id))
    }
  }, [user])
  
  const handleGoBack = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath]
      newPath.pop()
      setFolderPath(newPath)
      setCurrentFolderId(newPath.length > 0 ? newPath[newPath.length - 1].id : null)
    }
  }

  const getFilterBadgeText = () => {
    if (filter === "shared") return "Shared"
    if (filter === "starred") return "Starred"
    if (statusFilter !== "all") return statusFilter
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-4">
          {folderPath.length > 0 && (
            <Button variant="ghost" size="icon" onClick={handleGoBack} className="shrink-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => {
                    setFolderPath([])
                    setCurrentFolderId(null)
                  }}
                  className={`text-lg font-semibold transition-colors ${
                    folderPath.length === 0 ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Exams
                </button>
                
              </li>

              {folderPath.map((folder, index) => (
                <li key={index} className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <button
                    onClick={() => {
                      setFolderPath(folderPath.slice(0, index + 1))
                      setCurrentFolderId(folder.id)
                    }}
                    className={`text-lg font-semibold transition-colors ${
                      index === folderPath.length - 1 ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {folder.name}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search exams..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {getFilterBadgeText() && (
                  <Badge variant="secondary" className="ml-1">
                    {getFilterBadgeText()}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Grading")}>Grading</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("InProgress")}>In Progress</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ActionButtons folderId={currentFolderId} folderName={currentFolderName || "Main"} openModal={openModal} />
        </div>
      </div>

      {/* Content spacing */}
      <div className="h-2"></div>

      {/* Content */}
      {error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg border border-red-200">{error}</div>
      ) : (
        <ExamsDisplay
          exams={filteredExams}
          folders={filteredFolders}
          loading={loading}
          currentFolderId={currentFolderId}
          setCurrentFolderId={setCurrentFolderId}
          currentFolderName={currentFolderName}
          setCurrentFolderName={setCurrentFolderName}
          folderPath={folderPath}
          setFolderPath={setFolderPath}
        />
      )}

      <ModalWrapper
        open={isOpen}
        handleClose={closeModal}
        title={modalData?.title || ""}
        onConfirm={modalData?.onConfirm}
        confirmText={modalData?.confirmText}
        initialName={modalData?.initialName}
        setNewName={() => {}}
      >
        {modalData?.children}
      </ModalWrapper>
    </div>
  )
}

export default ExamList
