"use client"

import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./SideBar"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { checkAuth } from "../store/userSlice"
import { initialUserState } from "../models/User"
import { useLocation } from "react-router-dom"
import { useSidebarContext } from "@/contexts/SidebarContext"

const AppLayout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: StoreType) => state.auth.user)
  const location = useLocation()
  const { showSidebar } = useSidebarContext()

  useEffect(() => {
    if (user == null || user === initialUserState) dispatch(checkAuth())
  }, [dispatch, user])

  // Determine if we're on a public page
  const isPublicPage = ["/", "/about", "/home", "/authForm"].includes(location.pathname)

  return (
    <div className="flex h-screen flex-col bg-[#f0f0f0]">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - full height */}
        {showSidebar && !isPublicPage && <Sidebar />}

        {/* Main content area with header */}
        <div className="flex flex-col flex-1">
          {/* Header - conditional rendering based on sidebar state */}
          <Header isPublicPage={isPublicPage} />

          {/* Main content */}
          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
