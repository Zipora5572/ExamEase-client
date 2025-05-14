import { createBrowserRouter, Navigate } from "react-router-dom"
import AppLayout from "./components/AppLayout"
import MainLayout from "./components/MainLayout"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import ExamList from "./components/Exams/ExamList"
import Home from "./pages/home"
import Profile from "./pages/Profile"
import SharedExams from "./pages/SharedExams"
import Settings from "./pages/Settings"
import NotFound from "./pages/NotFound"
import GradesOverview from "./components/GradesOverview"
// import Statistics from "./components/Statistics"
import StudentReport from "./components/StudentReport"

import Statistics from "./components/Statistics.tsx"
import StudentsExams from "./components/StudentsExams/index.tsx"
import Search from "./pages/Search"
import ExamFileViewer from "./components/Exams/ExamViewer/index.tsx"
import AuthForm from "./pages/AuthForm.tsx"

export const router = createBrowserRouter([
  // Public routes with header only (no sidebar)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Navigate to="/" replace /> },
      { path: "/about", element: <About /> },
      { path: "/authForm", element: <AuthForm /> },
    ],
  },

  // Protected routes with header and sidebar
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { path: "", element: <Navigate to="/app/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "exams", element: <ExamList /> },
      { path: "shared-exams", element: <SharedExams /> },
      { path: "students-exams", element: <StudentsExams /> },
      { path: "viewExam", element: <ExamFileViewer /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
      { path: "search", element: <Search /> },

      // Nested routes for students section
      {
        path: "students",
        children: [
          { path: "", element: <Navigate to="/app/students/all" replace /> },
          { path: "all", element: <div>All Students</div> },
          { path: "upload", element: <div>Upload Students</div> },
          { path: "assign", element: <div>Assign Students</div> },
        ],
      },

      // Nested routes for reports section
      {
        path: "reports",
        children: [
          { path: "", element: <Navigate to="/app/reports/grades" replace /> },
          { path: "grades", element: <GradesOverview /> },
          { path: "students", element: <StudentReport /> },
          { path: "analytics", element: <Statistics /> },
        ],
      },
    ],
  },

  // redirect legacy routes to new structure
  { path: "/exams", element: <Navigate to="/app/exams" replace /> },
  { path: "/dashboard", element: <Navigate to="/app/dashboard" replace /> },
  { path: "/profile", element: <Navigate to="/app/profile" replace /> },
  { path: "/settings", element: <Navigate to="/app/settings" replace /> },

  // 404 route
  { path: "*", element: <NotFound /> },
])
