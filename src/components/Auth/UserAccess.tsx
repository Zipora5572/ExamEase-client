import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, MoreVertical, Settings, User } from "lucide-react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "@/store/userSlice"
import { AppDispatch } from "@/store/store"
import { UserType } from "@/models/User"

interface SidebarUserSectionProps {
  user: UserType
}

const SidebarUserSection = ({ user }: SidebarUserSectionProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleLogout = () => {
    dispatch(logout())
  }

  const getInitials = () =>
    `${user?.firstName?.charAt(0).toUpperCase() || ""}${user?.lastName?.charAt(0).toUpperCase() || ""}`

  return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="h-9 w-9 border shadow-sm">
            <AvatarFallback className="bg-red-100 text-red-600 font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-gray-900 truncate">{`${user.firstName} ${user.lastName}`}</span>
            <span className="text-xs text-gray-500 truncate">{user.email}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 hover:bg-gray-100 transition"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link to="/app/profile" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    
  )
}

export default SidebarUserSection
