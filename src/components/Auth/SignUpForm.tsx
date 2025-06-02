"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { register } from "../../store/userSlice"
import { Mail, Lock, ArrowRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AppDispatch } from "@/store/store"

interface SignUpFormProps {
  setError: (error: string | null) => void
}

const SignUpForm = ({ setError }: SignUpFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate inputs
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError("Please fill in all fields")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to create an account
      // For now, we'll just simulate a login
      await dispatch(register({ firstName, lastName, email, password }))
      navigate("/app/dashboard")
    } catch (error) {
      setError("Error creating account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10 h-10 border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="pl-10 h-10 border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="SignUpEmail" className="text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="SignUpEmail"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-10 border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="SignUpPassword" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="SignUpPassword"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-10 border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 h-10 border-gray-200 focus-visible:ring-red-500 focus-visible:border-red-500"
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-10 bg-red-600 hover:bg-red-700 transition-colors" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}

export default SignUpForm
