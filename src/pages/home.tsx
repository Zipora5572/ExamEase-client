import { Link } from "react-router-dom"
import { GraduationCapIcon as Graduation, ArrowRight, Brain, Sparkles, Languages, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#f0f0f0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
                AI-Powered Exam Management with ExamEase
              </h1>
              <p className="mb-6 text-lg text-red-100">
                Our intelligent system automatically identifies student names, detects languages, and grades tests in
                both English and Hebrew, saving you valuable time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/app/dashboard">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-red-700">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-64 w-64 rounded-full bg-red-500 p-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Graduation className="h-32 w-32 text-white opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-800">AI-Powered Exam Management</h2>
          <p className="mb-12 text-center text-lg text-gray-600 max-w-3xl mx-auto">
            Our advanced AI technology streamlines the entire exam process, from language detection to student
            identification and grading.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Languages className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Bilingual Language Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI automatically detects and processes exams in both English and Hebrew, with intelligent OCR
                  optimized for each language.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Brain className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Automatic Student Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI automatically identifies student names from scanned tests, eliminating manual matching and
                  reducing errors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Intelligent Grading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Save hours of grading time with our AI that automatically checks answers in both English and Hebrew,
                  with manual override options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">How It Works</h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-red-200 md:left-1/2"></div>

              {/* Step 1 */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Student Roster</h3>
                    <p className="text-gray-600">
                      Start by uploading an Excel file with your student information. This will be used to match
                      students to their exams automatically.
                    </p>
                  </div>
                  <div className="mb-4 md:mb-0 z-10 order-1 md:order-2">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white">
                      1
                    </div>
                  </div>
                  <div className="flex-1 md:pl-8 order-3 hidden md:block"></div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:pr-8 order-2 hidden md:block"></div>
                  <div className="mb-4 md:mb-0 z-10 order-1">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white">
                      2
                    </div>
                  </div>
                  <div className="flex-1 md:pl-8 order-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Scan & Upload Exams</h3>
                    <p className="text-gray-600">
                      Scan your completed exams and upload them to the system. Our AI automatically detects if they're
                      in English or Hebrew for accurate OCR processing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:pr-8 md:text-right order-2 md:order-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">AI Processes Everything</h3>
                    <p className="text-gray-600">
                      Our AI identifies student names, matches them to your roster, and automatically grades the exams
                      based on your answer key.
                    </p>
                  </div>
                  <div className="mb-4 md:mb-0 z-10 order-1 md:order-2">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white">
                      3
                    </div>
                  </div>
                  <div className="flex-1 md:pl-8 order-3 hidden md:block"></div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 md:pr-8 order-2 hidden md:block"></div>
                  <div className="mb-4 md:mb-0 z-10 order-1">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white">
                      4
                    </div>
                  </div>
                  <div className="flex-1 md:pl-8 order-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Review & Finalize</h3>
                    <p className="text-gray-600">
                      Review the AI-graded exams, make any necessary adjustments with our intuitive interface, and
                      generate comprehensive reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">Key Features</h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Languages className="h-5 w-5 text-red-600 mr-2" />
                Automatic Language Detection
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Automatically detects if exams are in English or Hebrew</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Optimizes OCR processing for each language</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Allows manual confirmation when needed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Supports mixed-language documents</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="h-5 w-5 text-red-600 mr-2" />
                AI-Powered Student Matching
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Identifies student names directly from scanned tests</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Matches to your Excel student roster automatically</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Works with handwritten and printed names</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Handles various exam formats and layouts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">What Our Users Say</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 rounded-full bg-red-100 text-red-600">
                  <div className="flex h-full w-full items-center justify-center font-bold">JD</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">John Doe</h4>
                  <p className="text-sm text-gray-500">Math Teacher</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The language detection feature is incredible. I teach in a bilingual school, and the system handles
                both English and Hebrew exams flawlessly, saving me hours of manual work."
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 rounded-full bg-red-100 text-red-600">
                  <div className="flex h-full w-full items-center justify-center font-bold">JS</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Jane Smith</h4>
                  <p className="text-sm text-gray-500">School Administrator</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The Excel integration is seamless. We upload our student roster once, and the system handles everything
                else, matching students to their exams automatically."
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 rounded-full bg-red-100 text-red-600">
                  <div className="flex h-full w-full items-center justify-center font-bold">RJ</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Robert Johnson</h4>
                  <p className="text-sm text-gray-500">Science Department Head</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The bilingual support for English and Hebrew exams has been a game-changer for our international
                school. The OCR accuracy is impressive in both languages."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Transform Your Exam Management?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-red-100">
            Join thousands of educators who have simplified their exam processes with ExamEase's AI-powered grading
            system.
          </p>
          <Link to="/authForm">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
              Sign Up Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center">
              <Graduation className="mr-2 h-6 w-6" />
              <span className="text-xl font-bold">ExamEase</span>
            </div>
            <div className="flex gap-6">
              <Link to="/about" className="hover:text-white">
                About
              </Link>
              <Link to="/app/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </div>
            <div className="text-sm">© 2023 ExamEase. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
