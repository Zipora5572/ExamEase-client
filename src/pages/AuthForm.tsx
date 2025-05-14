"use client"
import { useState } from "react"
import { GraduationCap, AlertCircle, Github } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/components/Auth/LoginForm"

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ExamEase</h1>
          <p className="text-gray-500">AI-powered exam management for educators</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <CardContent className="pt-4">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="login" className="mt-0">
                  <LoginForm setError={setError} />
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  {/* <SignupForm setError={setError} /> */}
                </TabsContent>
              </CardContent>
            </Tabs>
          </CardHeader>

          <CardFooter className="flex justify-center text-xs text-gray-500">
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
            className="flex items-center justify-center text-gray-600 hover:text-gray-900"
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
