"use client"

import { useState, useEffect } from "react"
import { Search, Users, UserPlus, Shield, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: string
}

interface Group {
  id: number
  name: string
  memberCount: number
  description?: string
}

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  examId: number
  examName: string
  onShare: (recipients: { id: number; type: "user" | "group" }[], permission: string) => Promise<void>
}

const ShareDialog = ({ isOpen, onClose, examName, onShare }: ShareDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPermission, setSelectedPermission] = useState("view")
  const [activeTab, setActiveTab] = useState("users")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [selectedGroups, setSelectedGroups] = useState<number[]>([])
  const [isSharing, setIsSharing] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)

  // Mock data - in a real app, this would come from an API
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Teacher",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria@example.com",
      role: "Teacher",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Sam Wilson",
      email: "sam@example.com",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Taylor Swift",
      email: "taylor@example.com",
      role: "Teacher",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "John Smith",
      email: "john@example.com",
      role: "Teacher",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [groups] = useState<Group[]>([
    { id: 1, name: "Math Department", memberCount: 12, description: "All math teachers" },
    { id: 2, name: "Science Department", memberCount: 8, description: "All science teachers" },
    { id: 3, name: "English Department", memberCount: 10, description: "All english teachers" },
    { id: 4, name: "Admin Team", memberCount: 3, description: "School administrators" },
  ])

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("")
      setSelectedPermission("view")
      setActiveTab("users")
      setSelectedUsers([])
      setSelectedGroups([])
      setShareError(null)
    }
  }, [isOpen])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleGroupSelection = (groupId: number) => {
    setSelectedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const handleShare = async () => {
    if (selectedUsers.length === 0 && selectedGroups.length === 0) {
      setShareError("Please select at least one recipient")
      return
    }

    setIsSharing(true)
    setShareError(null)

    try {
      const recipients = [
        ...selectedUsers.map((id) => ({ id, type: "user" as const })),
        ...selectedGroups.map((id) => ({ id, type: "group" as const })),
      ]

      await onShare(recipients, selectedPermission)
      onClose()
    } catch (error) {
      setShareError("Failed to share exam. Please try again.")
      console.error("Share error:", error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Share "{examName}"</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2 my-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users or groups"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedPermission} onValueChange={setSelectedPermission}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Permission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="view">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>View only</span>
                </div>
              </SelectItem>
              <SelectItem value="comment">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Can comment</span>
                </div>
              </SelectItem>
              <SelectItem value="edit">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Can edit</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="users" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="flex-1 border rounded-md mt-4">
            <ScrollArea className="h-[300px]">
              {filteredUsers.length > 0 ? (
                <div className="p-1">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground">
                  No users found matching your search
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="groups" className="flex-1 border rounded-md mt-4">
            <ScrollArea className="h-[300px]">
              {filteredGroups.length > 0 ? (
                <div className="p-1">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => toggleGroupSelection(group.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedGroups.includes(group.id)}
                          onCheckedChange={() => toggleGroupSelection(group.id)}
                        />
                        <div className="bg-muted rounded-md p-2">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.memberCount} members</p>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{group.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4 text-center text-muted-foreground">
                  No groups found matching your search
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {shareError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{shareError}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {selectedUsers.length > 0 &&
                `${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""} selected`}
              {selectedUsers.length > 0 && selectedGroups.length > 0 && ", "}
              {selectedGroups.length > 0 &&
                `${selectedGroups.length} group${selectedGroups.length > 1 ? "s" : ""} selected`}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleShare} disabled={isSharing}>
                {isSharing ? "Sharing..." : "Share"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ShareDialog
