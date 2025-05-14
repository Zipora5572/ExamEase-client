"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import type React from "react"

interface SidebarSectionProps {
  label: string
  icon: React.ReactNode
  isOpen: boolean
  isCollapsed: boolean
  onToggle: () => void
  children: React.ReactNode
}

const SidebarSection = ({ label, icon, isOpen, isCollapsed, onToggle, children }: SidebarSectionProps) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          {icon}
          {!isCollapsed && <span>{label}</span>}
        </div>
        {!isCollapsed && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
      </button>

      {isOpen && !isCollapsed && <div className="ml-6 mt-1 space-y-1">{children}</div>}
    </div>
  )
}

export default SidebarSection
