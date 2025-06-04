import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { GraduationCap } from "lucide-react"
import type { StoreType } from "../store/store"
import HeaderActions from "./HeaderActions"

interface HeaderProps {
  isPublicPage: boolean
}

const Header = ({ isPublicPage }: HeaderProps) => {
  const user = useSelector((state: StoreType) => state.auth.user)
  const navigate = useNavigate()
 

  const handleCreateNew = () => {
    navigate("/app/exams/new")
  }

  if (!isPublicPage) return null

  return (
    <header className="w-full px-4 md:px-6 py-5 border-b shadow-sm bg-white z-50">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      {/* לוגו */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-600 text-white shadow-sm">
          <GraduationCap className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold text-red-600">ExamEase</span>
      </Link>
  
      {/* פעולות */}
      <HeaderActions
        isPublicPage={isPublicPage}
        user={user}
        handleCreateNew={handleCreateNew}
      />
    </div>
  </header>
  
  )
}

export default Header
