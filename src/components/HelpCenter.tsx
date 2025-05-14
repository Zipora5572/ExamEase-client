"use client"

import type React from "react"

import { useState } from "react"
import { HelpCircle, Search, ChevronRight, Book, MessageSquare, FileQuestion, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
// import { useToast } from "../hooks/use-toast"

const HelpCenter = () => {
//   const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("guides")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // toast({
    //   title: "Search initiated",
    //   description: `Searching for "${searchQuery}"`,
    // })
  }

  // const openExternalLink = (url: string) => {
  //   // toast({
  //   //   title: "External link",
  //   //   description: `This would open ${url} in a new tab`,
  //   // })
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Help Center</DialogTitle>
          <DialogDescription>Find guides, tutorials, and answers to frequently asked questions.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 my-4">
          <Input
            type="search"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <Book className="h-4 w-4" /> Guides
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" /> FAQ
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-4">
            <Card
              className="cursor-pointer hover:bg-gray-50"
             
            >
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  Getting Started
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Learn the basics of using the Exams App</CardDescription>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-gray-50"
             
            >
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  Uploading Exams
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>How to upload and manage exam files</CardDescription>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-gray-50"  >
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  Grading System
                  <ChevronRight className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardDescription>Understanding the grading system and features</CardDescription>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" >
              View all guides <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">How do I reset my password?</h3>
                <p className="text-sm text-gray-500">
                  Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Can I share exams with other teachers?</h3>
                <p className="text-sm text-gray-500">
                  Yes, you can share exams with other teachers by using the share button on the exam details page.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">How do students access their exams?</h3>
                <p className="text-sm text-gray-500">
                  Students receive an email with a link to access their assigned exams when you distribute them.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Is my data secure?</h3>
                <p className="text-sm text-gray-500">
                  Yes, all data is encrypted and stored securely. We follow industry best practices for data protection.
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full" >
              View all FAQs <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Email Support</h3>
                <p className="text-sm text-gray-500">
                  For general inquiries and support:{" "}
                  <a href="mailto:support@examsapp.com" className="text-primary">
                    support@examsapp.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Technical Support</h3>
                <p className="text-sm text-gray-500">
                  For technical issues and bug reports:{" "}
                  <a href="mailto:tech@examsapp.com" className="text-primary">
                    tech@examsapp.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Phone Support</h3>
                <p className="text-sm text-gray-500">
                  Available Monday-Friday, 9 AM - 5 PM EST:{" "}
                  <a href="tel:+18001234567" className="text-primary">
                    +1 (800) 123-4567
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Live Chat</h3>
                <p className="text-sm text-gray-500">Chat with our support team during business hours.</p>
                <Button
                  className="mt-2"
                  // onClick={() =>
                  //   toast({
                  //     title: "Live chat",
                  //     description: "This would open the live chat interface",
                  //   })
                  // }
                >
                  Start Chat
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default HelpCenter
