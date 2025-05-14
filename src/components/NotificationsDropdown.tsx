"use client"

import { useState } from "react"
import { Bell, Check, X } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
// import { useToast } from "../hooks/use-toast"

type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

const NotificationsDropdown = () => {
  // const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Exam Submission",
      message: "John Doe has submitted their exam for Mathematics 101",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Grading Complete",
      message: "All exams for Physics 202 have been graded",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      title: "System Update",
      message: "The system will undergo maintenance tonight at 2 AM",
      time: "3 hours ago",
      read: false,
    },
    {
      id: "4",
      title: "New Feature Available",
      message: "Check out the new AI-powered grading assistant",
      time: "1 day ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    // toast({
    //   title: "All notifications marked as read",
    //   description: "You have no unread notifications",
    // })
  }

  const clearNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-normal" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-3 ${!notification.read ? "bg-gray-50" : ""}`}
            >
              <div className="flex w-full justify-between">
                <span className="font-medium">{notification.title}</span>
                <div className="flex gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(notification.id)
                      }}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearNotification(notification.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">{notification.message}</p>
              <span className="mt-1 text-xs text-gray-400">{notification.time}</span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              // toast({
              //   title: "View all notifications",
              //   description: "This would navigate to the notifications page",
              // })
            }}
          >
            View all notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationsDropdown
