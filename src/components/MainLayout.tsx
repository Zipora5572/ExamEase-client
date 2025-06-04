import { Outlet } from "react-router-dom"
import Header from "./Header"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { checkAuth } from "../store/userSlice"
import { initialUserState } from "../models/User"

const MainLayout = () => {

  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: StoreType) => state.auth.user)

  useEffect(() => {
    if (user == null || user === initialUserState) dispatch(checkAuth())
  }, [dispatch, user])
  return (
    <div className="flex h-screen flex-col bg-[#f9fafb]">
      <Header isPublicPage={true} />
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
