
import { useState } from "react"
import type { StudentExamType } from "../../models/StudentExam"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Pie, Line } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

interface StudentsExamsStatisticsProps {
  studentExams: StudentExamType[]
}

const StudentsExamsStatistics = ({ studentExams }: StudentsExamsStatisticsProps) => {
  const [timeRange, setTimeRange] = useState<string>("all")

  // Calculate statistics
  const totalExams = studentExams.length
  const checkedExams = studentExams.filter((exam) => exam.isChecked).length
  const uncheckedExams = totalExams - checkedExams

  const averageGrade = totalExams > 0 ? studentExams.reduce((sum, exam) => sum + (exam.grade || 0), 0) / totalExams : 0

  const highestGrade = totalExams > 0 ? Math.max(...studentExams.map((exam) => exam.grade || 0)) : 0

  const lowestGrade =
    totalExams > 0 ? Math.min(...studentExams.filter((exam) => exam.isChecked).map((exam) => exam.grade || 0)) : 0

  const passingRate =
    totalExams > 0 ? (studentExams.filter((exam) => (exam.grade || 0) >= 60).length / totalExams) * 100 : 0

  // grade distribution data
  const gradeDistribution = {
    labels: ["90-100", "80-89", "70-79", "60-69", "Below 60"],
    datasets: [
      {
        label: "Number of Students",
        data: [
          studentExams.filter((exam) => (exam.grade || 0) >= 90).length,
          studentExams.filter((exam) => (exam.grade || 0) >= 80 && (exam.grade || 0) < 90).length,
          studentExams.filter((exam) => (exam.grade || 0) >= 70 && (exam.grade || 0) < 80).length,
          studentExams.filter((exam) => (exam.grade || 0) >= 60 && (exam.grade || 0) < 70).length,
          studentExams.filter((exam) => (exam.grade || 0) < 60).length,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Status distribution data
  const statusDistribution = {
    labels: ["Checked", "Unchecked"],
    datasets: [
      {
        label: "Exams",
        data: [checkedExams, uncheckedExams],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  }

  // Time trend data (mock data for demonstration)
  const timeTrendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Average grade",
        data: [65, 68, 72, 75, 82, 78],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  }

  // Performance distribution (mock data)
  const performanceDistribution = {
    labels: ["Excellent", "Good", "Average", "Below Average", "Poor"],
    datasets: [
      {
        label: "Students",
        data: [
          studentExams.filter((exam) => (exam.grade || 0) >= 90).length,
          studentExams.filter((exam) => (exam.grade || 0) >= 80 && (exam.grade || 0) < 90).length,
          studentExams.filter((exam) => (exam.grade || 0) >= 70 && (exam.grade || 0) < 80).length,
          studentExams.filter((exam) => (exam.grade || 0) >= 60 && (exam.grade || 0) < 70).length,
          studentExams.filter((exam) => (exam.grade || 0) < 60).length,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Handle export data
  const handleExportData = (format: string) => {
    // Implementation for exporting data in different formats
    console.log(`Exporting data in ${format} format`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Exam Statistics</h2>
          <p className="text-muted-foreground">Analysis of {totalExams} student exam submissions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="month">Last month</SelectItem>
              <SelectItem value="week">Last week</SelectItem>
              <SelectItem value="day">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => handleExportData("csv")} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageGrade.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 100 points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Highest Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{highestGrade}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 100 points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lowest Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowestGrade}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 100 points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Passing Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{passingRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Students scoring 60 or above</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different chart views */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">grade Distribution</TabsTrigger>
          <TabsTrigger value="trends">Time Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>grade Distribution</CardTitle>
                <CardDescription>Breakdown of student grades by range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar
                    data={gradeDistribution}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top" as const,
                        },
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Status</CardTitle>
                <CardDescription>Checked vs. unchecked exams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <Pie
                    data={statusDistribution}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top" as const,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed grade Distribution</CardTitle>
              <CardDescription>Comprehensive breakdown of student performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Bar
                  data={gradeDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Data based on {totalExams} student submissions
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Average grades over the past weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Line
                  data={timeTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: "Average grade",
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Shows trends in student performance over time
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Categories</CardTitle>
              <CardDescription>Distribution of students by performance level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Pie
                  data={performanceDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">Categorizes students by performance level</CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional statistics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Statistical Summary</CardTitle>
          <CardDescription>Key statistical measures for this exam</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Central Tendency</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Mean</div>
                  <div className="font-medium">{averageGrade.toFixed(1)}</div>
                </div>
                <div className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Median</div>
                  <div className="font-medium">
                    {totalExams > 0
                      ? (() => {
                          const sortedGrades = [...studentExams]
                            .filter((exam) => exam.isChecked)
                            .map((exam) => exam.grade || 0)
                            .sort((a, b) => a - b)
                          const mid = Math.floor(sortedGrades.length / 2)
                          return sortedGrades.length % 2 === 0
                            ? ((sortedGrades[mid - 1] + sortedGrades[mid]) / 2).toFixed(1)
                            : sortedGrades[mid].toFixed(1)
                        })()
                      : "0"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Dispersion</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Range</div>
                  <div className="font-medium">{totalExams > 0 ? (highestGrade - lowestGrade).toFixed(1) : "0"}</div>
                </div>
                <div className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Std Dev</div>
                  <div className="font-medium">
                    {totalExams > 0
                      ? (() => {
                          const grades = studentExams.filter((exam) => exam.isChecked).map((exam) => exam.grade || 0)
                          const mean = grades.reduce((sum, grade) => sum + grade, 0) / grades.length
                          const variance =
                            grades.reduce((sum, grade) => sum + Math.pow(grade - mean, 2), 0) / grades.length
                          return Math.sqrt(variance).toFixed(1)
                        })()
                      : "0"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Completion</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Checked</div>
                  <div className="font-medium">
                    {checkedExams} ({Math.round((checkedExams / totalExams) * 100) || 0}%)
                  </div>
                </div>
                <div className="bg-muted p-2 rounded-md">
                  <div className="text-xs text-muted-foreground">Unchecked</div>
                  <div className="font-medium">
                    {uncheckedExams} ({Math.round((uncheckedExams / totalExams) * 100) || 0}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentsExamsStatistics
