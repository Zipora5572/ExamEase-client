"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Student {
  id: string
  name: string
  studentId: string
  isAssigned: boolean
}

interface AssignStudentsProps {
  onClose: () => void
  onSuccess?: () => void
}

const AssignStudents: React.FC<AssignStudentsProps> = ({  onClose, onSuccess }) => {
  // Mock data - in a real app, this would come from an API
  const [students] = useState<Student[]>([
    { id: "1", name: "John Doe", studentId: "S12345", isAssigned: true },
    { id: "2", name: "Jane Smith", studentId: "S12346", isAssigned: false },
    { id: "3", name: "Michael Johnson", studentId: "S12347", isAssigned: false },
    { id: "4", name: "Emily Davis", studentId: "S12348", isAssigned: true },
    { id: "5", name: "Robert Wilson", studentId: "S12349", isAssigned: false },
    { id: "6", name: "Sarah Brown", studentId: "S12350", isAssigned: true },
    { id: "7", name: "David Miller", studentId: "S12351", isAssigned: false },
    { id: "8", name: "Jennifer Taylor", studentId: "S12352", isAssigned: false },
    { id: "9", name: "James Anderson", studentId: "S12353", isAssigned: true },
    { id: "10", name: "Lisa Thomas", studentId: "S12354", isAssigned: false },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)


  // Initialize selected students based on already assigned students
  useEffect(() => {
    const initialSelected = students.filter((student) => student.isAssigned).map((student) => student.id)

    setSelectedStudents(initialSelected)
  }, [])

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map((student) => student.id))
    }
  }

  const handleSelectStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((studentId) => studentId !== id))
    } else {
      setSelectedStudents([...selectedStudents, id])
    }
  }

  const handleAssignStudents = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      console.log("Assigning students:", selectedStudents)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error assigning students:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Assign Students</CardTitle>
        <CardDescription>Select students to assign to this exam</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search students..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select all ({filteredStudents.length})
          </label>

          <div className="ml-auto">
            <Badge variant="outline" className="bg-gray-100">
              {selectedStudents.length} selected
            </Badge>
          </div>
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-2">
          <div className="space-y-2">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center gap-3 p-2 rounded-md transition-colors
                    ${selectedStudents.includes(student.id) ? "bg-gray-100" : "hover:bg-gray-50"}
                  `}
                >
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleSelectStudent(student.id)}
                  />

                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.studentId}</p>
                  </div>

                  {student.isAssigned && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Assigned
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Search className="h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No students found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleAssignStudents}
          disabled={selectedStudents.length === 0 || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <>Processing...</>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Assign Students
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AssignStudents
