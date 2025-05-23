import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"


import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { logout } from "../../store/userSlice"
import { AppDispatch } from "@/store/store"
import { LogOut, Settings, User } from "lucide-react"
import { UserType } from "@/models/User"

interface UserMenuProps {
  user: UserType
}

const UserAccess = ({ user }: UserMenuProps) => {
  const dispatch = useDispatch<AppDispatch>()


  const handleLogout = () => {
    dispatch(logout())
  }


  const getInitials = () => {
    return `${user.firstName?.charAt(0).toUpperCase() || ""}${user.lastName?.charAt(0).toUpperCase() || ""}` || "U"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer ">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src={user.profilePicture || ""} alt={user.firstName || "User"} /> */}
            <AvatarFallback className="bg-red-100 text-red-600">{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{`${user.firstName || ""} ${user.lastName || ""}`}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/app/profile" className="cursor-pointer">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app/settings" className="cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccess
