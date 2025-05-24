"use client"

import type React from "react"

import { useState } from "react"
import {  useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Search, GraduationCap } from "lucide-react"
import { Input } from "./ui/input"
import type {  StoreType } from "../store/store"
import { useSidebarContext } from "@/contexts/SidebarContext"
import HeaderActions from "./HeaderActions"


interface HeaderProps {
  isPublicPage: boolean
}

const Header = ({ isPublicPage }: HeaderProps) => {
  const user = useSelector((state: StoreType) => state.auth.user)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const { showSidebar } = useSidebarContext()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCreateNew = () => {
    navigate("/app/exams/new")
  }

  return (
    <header >
      {/* Logo - only show when sidebar is not present or on public pages */}
      {(!showSidebar) && (
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-red-600">ExamEase</span>
          </Link>
        </div>
      )}

      {/* Search bar - only show when sidebar is not present and not on public pages */}
      {!showSidebar && !isPublicPage && (
        <form onSubmit={handleSearch} className="flex-1 items-center px-4 md:flex lg:px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search exams, students, or folders..."
              className="w-full bg-gray-100 pl-8 focus-visible:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      )}

      {/* Spacer when sidebar is present and not on public pages */}
      {!showSidebar && !isPublicPage && <div className="flex-1"></div>}

      {/* Action buttons */}
      {!showSidebar && 
      <HeaderActions isPublicPage={isPublicPage} user={user} handleCreateNew={handleCreateNew} />}
    </header>
  )
}

export default Header
