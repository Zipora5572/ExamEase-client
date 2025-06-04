import type React from "react"

interface SidebarNavItemProps {
  label: string
  icon: React.ReactNode
  path: string
  isActive: boolean
  isCollapsed: boolean
  onClick: () => void
}

const SidebarNavItem = ({ label, icon, isActive, isCollapsed, onClick }: SidebarNavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${
        isActive ? "bg-gray-100 font-medium text-gray-900" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </button>
  )
}

export default SidebarNavItem
