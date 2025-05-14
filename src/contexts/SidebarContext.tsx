"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

interface SidebarContextType {
  showSidebar: boolean
  isCollapsed: boolean
  toggleSidebar: () => void
  toggleCollapse: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  showSidebar: true,
  isCollapsed: false,
  toggleSidebar: () => {},
  toggleCollapse: () => {},
})

export const useSidebarContext = () => useContext(SidebarContext)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  // Determine if we should show the sidebar based on the route
  useEffect(() => {
    const publicRoutes = ["/", "/about", "/home", "/authForm"]
    const shouldShowSidebar = !publicRoutes.includes(location.pathname)
    setShowSidebar(shouldShowSidebar)
  }, [location])

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev)
  }

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <SidebarContext.Provider value={{ showSidebar, isCollapsed, toggleSidebar, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  )
}
