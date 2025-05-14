"use client"
import SharedExamsTab from "@/components/Sharing/SharedExamsTabs"


const SharedExams = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* <Helmet>
        <title>Shared Exams | Sunday</title>
      </Helmet> */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Shared Exams</h1>
        <p className="text-muted-foreground">Manage exams you've shared and exams shared with you</p>
      </div>

      <SharedExamsTab />
    </div>
  )
}

export default SharedExams
