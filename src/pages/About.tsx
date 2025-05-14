import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FileText, Users, BarChart2, CheckCircle } from "lucide-react"

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-red-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Exam Manager</h1>
            <p className="text-xl text-gray-700 mb-8">
              We're on a mission to simplify exam management for educators worldwide, helping them focus on what matters
              most: teaching.
            </p>
            <Button asChild size="lg">
              <Link to="/app/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Platform Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exam Management</h3>
              <p className="text-gray-600">
                Upload, organize, and manage all your exam files in one secure location with powerful search and
                filtering.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Student Management</h3>
              <p className="text-gray-600">
                Easily manage student lists, assign exams, and track individual progress throughout the academic year.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-gray-600">
                Generate comprehensive reports and analytics to gain insights into student performance and identify
                areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Exam Manager</h2>

          <div className="max-w-3xl mx-auto">
            <div className="grid gap-6">
              {[
                "Intuitive interface designed for educators",
                "Secure storage for all your exam files",
                "Comprehensive analytics and reporting",
                "Time-saving automation features",
                "Dedicated support team",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your exam process?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of educators who are saving time and improving student outcomes with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/app/dashboard">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-red-700"
              size="lg"
            >
              <Link to="/authForm">Sign Up</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
