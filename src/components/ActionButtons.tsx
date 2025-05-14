


"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { createFolder } from "../store/folderSlice"
import ExamUpload from "./Exams/ExamUpload"
import { FolderPlus, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
interface ActionButtonsProps {
  folderId: number | null
  folderName: string
  openModal: (data: {
    title: string
    initialName?: string
    setNewName?: (name: string) => void
    confirmText?: string
    onConfirm?: (name: string) => void
    children?: React.ReactNode
  }) => void

  // modalData: { setNewName?: (name: string) => void }|null

}

const ActionButtons: React.FC<ActionButtonsProps> = ({ folderId, openModal }) => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: StoreType) => state.auth.user)
  const [name, setNewName] = useState<string>("")
name
  const handleCreateFolder = () => {
    openModal({
      title: "Create New Folder",
      confirmText: "Create",
      initialName: "",
      setNewName: (name: string) => {
        setNewName(name)
      },
      onConfirm: (folderName: string) => {
        dispatch(createFolder({ userId: user?.id, parentFolderId: folderId, name: folderName }))
      },
      children: (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Folder Name"
            className="block w-full rounded-md border-gray-300 shadow-sm  sm:text-sm"
           
          />
        </div>
      ),
    })
  }

  return (

    <div className="flex items-center space-x-2">
  <DropdownMenu>
    
    <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild>
        <ExamUpload folderId={folderId ?? undefined} />
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleCreateFolder} className="cursor-pointer">
        <FolderPlus className="h-4 w-4 mr-2" />
        New Folder
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>


  )
}

export default ActionButtons
