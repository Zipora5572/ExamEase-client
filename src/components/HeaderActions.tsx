import { Link } from "react-router-dom"
import { Plus, Github } from "lucide-react"
import { Button } from "./ui/button"
import NotificationsDropdown from "./NotificationsDropdown"
import HelpCenter from "./HelpCenter"
import UserMenu from "./Auth/UserAccess"
import { UserType } from "@/models/User"

interface HeaderActionsProps {
  isPublicPage: boolean
  user: UserType | null
  handleCreateNew: () => void
}

const HeaderActions = ({ isPublicPage, user, handleCreateNew }: HeaderActionsProps) => {

  return (
    <div className="flex items-center gap-3">
      {!isPublicPage && (
        <>
          <Button variant="outline" size="sm" className="hidden gap-1 md:flex" onClick={handleCreateNew}>
            <Plus className="h-4 w-4" />
            <span>Create Exam</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={handleCreateNew}>
            <Plus className="h-5 w-5" />
          </Button>
        </>
      )}

      <a
        href="https://github.com/Zipora5572/exam-management-app/tree/main/React-App"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center"
      >
        <Button variant="ghost" size="icon">
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
        </Button>
      </a>

      <NotificationsDropdown />
      <HelpCenter />

      {user ? (
        <UserMenu user={user} />
      ) : (
        <Link to="/authForm">
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </Link>
      )}
    </div>
  )
}

export default HeaderActions
