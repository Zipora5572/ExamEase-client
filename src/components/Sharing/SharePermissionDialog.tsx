"use client"

import React from "react"

import { Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SharedExam {
  id: number
  name: string
  sharedWith?: {
    id: number
    name: string
    email: string
    avatar?: string
    permission: string
    sharedAt: string
  }
  sharedBy?: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  permission?: string
  sharedAt: string
  lastAccessed?: string
}

interface SharePermissionsDialogProps {
  isOpen: boolean
  onClose: () => void
  exam: SharedExam
  onUpdatePermissions: (examId: number, userId: number, newPermission: string) => void
  onRemoveAccess: (examId: number, userId: number) => void
}

const SharePermissionsDialog = ({
  isOpen,
  onClose,
  exam,
  onUpdatePermissions,
  onRemoveAccess,
}: SharePermissionsDialogProps) => {
  const user = exam.sharedWith
  const [selectedPermission, setSelectedPermission] = React.useState(user?.permission || "view")

  React.useEffect(() => {
    if (isOpen && user) {
      setSelectedPermission(user.permission)
    }
  }, [isOpen, user])

  const handleUpdatePermissions = () => {
    if (user) {
      onUpdatePermissions(exam.id, user.id, selectedPermission)
    }
  }

  const handleRemoveAccess = () => {
    if (user) {
      onRemoveAccess(exam.id, user.id)
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Access Permissions</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center space-x-3 mb-6">
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <RadioGroup value={selectedPermission} onValueChange={setSelectedPermission}>
            <div className="space-y-3">
              <div
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted cursor-pointer"
                onClick={() => setSelectedPermission("view")}
              >
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view" className="flex items-center cursor-pointer">
                  <Shield className="mr-2 h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">View only</p>
                    <p className="text-sm text-muted-foreground">Can view but not edit or comment</p>
                  </div>
                </Label>
              </div>

              <div
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted cursor-pointer"
                onClick={() => setSelectedPermission("comment")}
              >
                <RadioGroupItem value="comment" id="comment" />
                <Label htmlFor="comment" className="flex items-center cursor-pointer">
                  <Shield className="mr-2 h-4 w-4 text-amber-500" />
                  <div>
                    <p className="font-medium">Can comment</p>
                    <p className="text-sm text-muted-foreground">Can add comments but not edit</p>
                  </div>
                </Label>
              </div>

              <div
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted cursor-pointer"
                onClick={() => setSelectedPermission("edit")}
              >
                <RadioGroupItem value="edit" id="edit" />
                <Label htmlFor="edit" className="flex items-center cursor-pointer">
                  <Shield className="mr-2 h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium">Can edit</p>
                    <p className="text-sm text-muted-foreground">Can make changes to the exam</p>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemoveAccess}
          >
            Remove access
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePermissions}>Update</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SharePermissionsDialog
