"use client"

import type React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  FolderOpen,
  Star,
  ChevronDown,
  ChevronRight,
  FileText,
  Settings,
  
  ChevronLeft,
  ExpandIcon,

  BarChart,
  FileBarChart,
  UserCircle,
  LayoutDashboard,
  GraduationCap,
} from "lucide-react"
import { useSelector } from "react-redux"
import type { StoreType } from "@/store/store"
import { Link } from "react-router-dom"
import UserAccess from "./Auth/UserAccess"
import { Button } from "./ui/button"

export default function Sidebar() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    exams: true,
    students: false,
    reports: false,
  })
  const [isCollapsed, setIsCollapsed] = useState(false)
  const user = useSelector((state: StoreType) => state.auth.user)

  const [currentPath, setCurrentPath] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setCurrentPath(location.pathname + location.search)
    if (location.pathname.includes("/app/students")) {
      setOpenSections((prev) => ({ ...prev, students: true }))
    } else if (location.pathname.includes("/app/reports")) {
      setOpenSections((prev) => ({ ...prev, reports: true }))
    } else if (location.pathname.includes("/app/exams") || location.pathname === "/app") {
      setOpenSections((prev) => ({ ...prev, exams: true }))
    }
  }, [location])

 

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const sectionButton = (label: string, icon: React.ReactNode, section: string) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2.5">
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </div>
      {!isCollapsed &&
        (openSections[section] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
    </button>
  )

  const navButton = (label: string, icon: React.ReactNode, path: string, isActive: boolean) => (
    <button
      onClick={() => handleNavigate(path)}
      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors ${
        isActive ? "bg-red-50 font-medium text-red-600" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </button>
  )

  return (
    <div
      className={`h-full border-r border-gray-200 bg-white ${isCollapsed ? "w-16" : "w-64"} flex flex-col transition-all duration-200 `}
    >
      {/* Logo at the top of sidebar */}
      <div className="flex items-center p-4 border-b border-gray-200 relative">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!isCollapsed && <span className="text-xl font-bold text-red-600">ExamEase</span>}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors absolute right-3 top-4"
        >
          {isCollapsed ? <ExpandIcon className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {navButton(
          "Dashboard",
          <LayoutDashboard className="h-4 w-4" />,
          "/app/dashboard",
          currentPath.includes("/app/dashboard"),
        )}

        <div className="pt-1.5">
          {sectionButton("Exams", <FileText className="h-4 w-4" />, "exams")}

          {openSections.exams && !isCollapsed && (
            <div className="ml-6 mt-1.5 space-y-1">
              {navButton(
                "Your Exams",
                <FolderOpen className="h-4 w-4" />,
                "/app/exams?filter=all",
                currentPath.includes("/app/exams") &&
                  (currentPath.includes("filter=all") || !currentPath.includes("filter=")),
              )}
              {/* {navButton(
                "Shared by You",
                <Share2 className="h-4 w-4" />,
                "/app/exams?filter=shared",
                currentPath.includes("filter=shared"),
              )} */}
              {navButton(
                "Starred",
                <Star className="h-4 w-4" />,
                "/app/exams?filter=starred",
                currentPath.includes("filter=starred"),
              )}
              
            </div>
          )}
        </div>

        {/* <div className="pt-1.5">
          {sectionButton("Students", <Users className="h-4 w-4" />, "students")}

          {openSections.students && !isCollapsed && (
            <div className="ml-6 mt-1.5 space-y-1">
              {navButton(
                "All Students",
                <Users className="h-4 w-4" />,
                "/app/students/all",
                currentPath.includes("/app/students/all"),
              )}
              {navButton(
                "Upload List",
                <FileText className="h-4 w-4" />,
                "/app/students/upload",
                currentPath.includes("/app/students/upload"),
              )}
              {navButton(
                "Assign to Exams",
                <User className="h-4 w-4" />,
                "/app/students/assign",
                currentPath.includes("/app/students/assign"),
              )}
            </div>
          )}
        </div> */}

        <div className="pt-1.5">
          {sectionButton("Reports", <BarChart className="h-4 w-4" />, "reports")}

          {openSections.reports && !isCollapsed && (
            <div className="ml-6 mt-1.5 space-y-1">
              {navButton(
                "Grades Overview",
                <FileBarChart className="h-4 w-4" />,
                "/app/reports/grades",
                currentPath.includes("/app/reports/grades"),
              )}
              {navButton(
                "Student Reports",
                <UserCircle className="h-4 w-4" />,
                "/app/reports/students",
                currentPath.includes("/app/reports/students"),
              )}
              {navButton(
                "Analytics",
                <BarChart className="h-4 w-4" />,
                "/app/reports/analytics",
                currentPath.includes("/app/reports/analytics"),
              )}
            </div>
          )}
        </div>

        {navButton(
          "Settings",
          <Settings className="h-4 w-4" />,
          "/app/settings",
          currentPath.includes("/app/settings"),
        )}
      </nav>
      <div className="p-4 border-t border-gray-200 bg-gray-50">
  {user?.id ? (
    <UserAccess user={user} variant="sidebar" />
  ) : (
    <div className="text-center">
      <p className="text-sm text-gray-500 mb-2">Not signed in</p>
      <Link to="/authForm">
        <Button variant="outline" size="sm" className="w-full">
          Sign In
        </Button>
      </Link>
    </div>
  )}
</div>


    </div>
  )
}
