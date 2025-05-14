"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { StoreType } from "@/store/store"
import type { ExamFileType, ExamFolderType } from "@/models/Exam"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Folder, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search).get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [activeTab, setActiveTab] = useState("all")

  // Get data from Redux store
  const exams = useSelector((state: StoreType) => state.exams.exams)
  const folders = useSelector((state: StoreType) => state.folders.folders)

  // Search results
  const [results, setResults] = useState<{
    exams: ExamFileType[]
    folders: ExamFolderType[]
  }>({
    exams: [],
    folders: [],
  })

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query, exams, folders])

  const performSearch = (searchTerm: string) => {
    const lowerCaseQuery = searchTerm.toLowerCase()

    // Search in folders
    const matchedFolders = folders.filter(
      (folder) => folder.name.toLowerCase().includes(lowerCaseQuery) && folder.ofTeacherExams,
    )

    // Search in exams
    const matchedExams = exams.filter((exam) => exam.name.toLowerCase().includes(lowerCaseQuery))

    setResults({
      folders: matchedFolders,
      exams: matchedExams,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`)
      performSearch(searchQuery)
    }
  }

  const handleOpenFolder = (folderId: number) => {
    navigate(`/app/exams`, { state: { openFolderId: folderId } })
  }

  const handleOpenExam = (exam: ExamFileType) => {
    navigate("/app/viewExam", { state: { fileName: exam.name, fileUrl: exam.examPath } })
  }

  const filteredResults =
    activeTab === "all" ? results : activeTab === "exams" ? { ...results, folders: [] } : { ...results, exams: [] }

  const totalResults = results.exams.length + results.folders.length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Search Results</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Search for exams, folders, and content</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Results ({totalResults})</TabsTrigger>
              <TabsTrigger value="exams">Exams ({results.exams.length})</TabsTrigger>
              <TabsTrigger value="folders">Folders ({results.folders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {totalResults === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No results found</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try searching with different keywords or browse your exams
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate("/app/exams")}>
                    Browse Exams
                  </Button>
                </div>
              ) : (
                <>
                  {filteredResults.folders.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Folders</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Modified</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredResults.folders.map((folder) => (
                            <TableRow
                              key={folder.id}
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleOpenFolder(folder.id)}
                            >
                              <TableCell>
                                <Folder className="h-5 w-5 text-blue-600" />
                              </TableCell>
                              <TableCell>{folder.name}</TableCell>
                              <TableCell className="text-right">
                                {new Date(folder.updatedAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {filteredResults.exams.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Exams</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Modified</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredResults.exams.map((exam) => (
                            <TableRow
                              key={exam.id}
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleOpenExam(exam)}
                            >
                              <TableCell>
                                <FileText className="h-5 w-5 text-red-600" />
                              </TableCell>
                              <TableCell>{exam.name}</TableCell>
                              <TableCell>
                                {exam.folderId
                                  ? folders.find((f) => f.id === exam.folderId)?.name || "Unknown folder"
                                  : "Root"}
                              </TableCell>
                              <TableCell className="text-right">
                                {new Date(exam.updatedAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="exams">
              {filteredResults.exams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No exams found</h3>
                  <p className="text-sm text-muted-foreground mt-2">Try searching with different keywords</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Modified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.exams.map((exam) => (
                      <TableRow
                        key={exam.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleOpenExam(exam)}
                      >
                        <TableCell>
                          <FileText className="h-5 w-5 text-red-600" />
                        </TableCell>
                        <TableCell>{exam.name}</TableCell>
                        <TableCell>
                          {exam.folderId
                            ? folders.find((f) => f.id === exam.folderId)?.name || "Unknown folder"
                            : "Root"}
                        </TableCell>
                        <TableCell className="text-right">{new Date(exam.updatedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="folders">
              {filteredResults.folders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No folders found</h3>
                  <p className="text-sm text-muted-foreground mt-2">Try searching with different keywords</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Parent Folder</TableHead>
                      <TableHead className="text-right">Modified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.folders.map((folder) => (
                      <TableRow
                        key={folder.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleOpenFolder(folder.id)}
                      >
                        <TableCell>
                          <Folder className="h-5 w-5 text-blue-600" />
                        </TableCell>
                        <TableCell>{folder.name}</TableCell>
                        <TableCell>
                          {folder.parentFolderId
                            ? folders.find((f) => f.id === folder.parentFolderId)?.name || "Unknown folder"
                            : "Root"}
                        </TableCell>
                        <TableCell className="text-right">{new Date(folder.updatedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Search
