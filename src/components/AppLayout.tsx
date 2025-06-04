import { Outlet } from "react-router-dom"
import Sidebar from "./SideBar"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { checkAuth } from "../store/userSlice"
import { initialUserState } from "../models/User"

const AppLayout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: StoreType) => state.auth.user)

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find(row => row.startsWith("JWT="));
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch, user]);


  useEffect(() => {
    if (user == null || user === initialUserState) dispatch(checkAuth())
  }, [dispatch, user])


  return (
    <div className="flex h-screen flex-col bg-[#f9fafb]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-auto p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
