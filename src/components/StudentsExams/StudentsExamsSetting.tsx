"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Users, FileText, Bell } from "lucide-react"

const StudentsExamsSettings = () => {
  return (
    <div className="space-y-6">
      

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Students</span>
          </TabsTrigger>
          <TabsTrigger value="grading" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Grading</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general exam settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name</Label>
                <Input id="examName" placeholder="Enter exam name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examDescription">Exam Description</Label>
                <Input id="examDescription" placeholder="Enter exam description" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="publicResults">Public Results</Label>
                  <p className="text-sm text-muted-foreground">Make exam results visible to all students</p>
                </div>
                <Switch id="publicResults" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Settings</CardTitle>
              <CardDescription>Configure student access and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowSelfEnrollment">Self Enrollment</Label>
                  <p className="text-sm text-muted-foreground">Allow students to enroll themselves in this exam</p>
                </div>
                <Switch id="allowSelfEnrollment" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowViewOwnGrade">View Own Grade</Label>
                  <p className="text-sm text-muted-foreground">Allow students to view their own grades</p>
                </div>
                <Switch id="allowViewOwnGrade" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowViewFeedback">View Feedback</Label>
                  <p className="text-sm text-muted-foreground">Allow students to view teacher feedback</p>
                </div>
                <Switch id="allowViewFeedback" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="grading" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grading Settings</CardTitle>
              <CardDescription>Configure grading options and scales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gradingScale">Grading Scale</Label>
                <Input id="gradingScale" placeholder="0-100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingGrade">Passing Grade</Label>
                <Input id="passingGrade" placeholder="60" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoGrading">Auto Grading</Label>
                  <p className="text-sm text-muted-foreground">Enable automatic grading for this exam</p>
                </div>
                <Switch id="autoGrading" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email notifications for exam updates</p>
                </div>
                <Switch id="emailNotifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="gradeNotifications">Grade Notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify students when grades are published</p>
                </div>
                <Switch id="gradeNotifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="teacherNotifications">Teacher Notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify teachers when students submit exams</p>
                </div>
                <Switch id="teacherNotifications" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default StudentsExamsSettings
