
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <FileQuestion className="h-16 w-16 text-red-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-lg text-gray-600 mb-8">Sorry, we couldn't find the page you're looking for.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/app/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
