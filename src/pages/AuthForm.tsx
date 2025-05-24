"use client"
import { useState } from "react"
import { AlertCircle, Github } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LoginForm from "@/components/Auth/LoginForm"
import SignUpForm from "@/components/Auth/SignUpForm"

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{ backgroundImage: "url('/auth-background.png')", backgroundSize: "cover" }}
      ></div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <img src="/graduation.png" alt="ExamEase" className="h-12" />
          <h1 className="text-2xl font-bold text-gray-900">Welcome to ExamEase</h1>
          <p className="text-gray-600">AI-powered exam management for educators</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {activeTab === "login" ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Sign in to your account</h2>
                </div>
                <LoginForm setError={setError} />
                <div className="text-center mt-4">
                  <button
                    onClick={() => setActiveTab("signup")}
                    className="text-sm text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Create your account</h2>
                </div>
                <SignUpForm setError={setError} />
                <div className="text-center mt-4">
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-sm text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center text-xs text-gray-500 border-t pt-4 pb-6 px-6">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-gray-900 ml-1 mr-1">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-900 ml-1">
              Privacy Policy
            </a>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <a
            href="https://github.com/Zipora5572/exam-management-app"
            className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github className="mr-1 h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
