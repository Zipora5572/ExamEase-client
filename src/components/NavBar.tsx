"use client"

import { Link } from "react-router-dom"
import { useState } from "react"
import { GraduationCap } from "lucide-react"

const pages = ["Home", "Dashboard", "About", "Exams"]

const NavBar = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-red-600 ml-2">ExamEase</span>
            </Link>

            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {pages.map((page) => (
                <div
                  key={page}
                  onMouseEnter={() => setHoveredButton(page)}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="relative"
                >
                  <Link
                    to={`/${page.toLowerCase()}`}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {page}
                  </Link>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 transform origin-left transition-transform duration-300 ease-in-out ${
                      hoveredButton === page ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <Link
              to="/authForm"
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
