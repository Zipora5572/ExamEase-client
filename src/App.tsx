import { RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store/store"
import { router } from "./AppRoutes"

function App() {
  

  return (
    <>
     <Provider store={store}>
     
        <RouterProvider router={router} />
      
      </Provider>
  
    </>
  )
}

export default App
