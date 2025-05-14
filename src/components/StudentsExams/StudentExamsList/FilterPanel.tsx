"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface FilterPanelProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (filter: string) => void
  dateFilter: {
    startDate: string | null
    endDate: string | null
  }
  setDateFilter: (filter: {
    startDate: string | null
    endDate: string | null
  }) => void
  filteredExams: any[]
  clearFilters: () => void
}

const FilterPanel = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  filteredExams,
  clearFilters,
}: FilterPanelProps) => {
  return (
    <div className="mb-4 p-4 border rounded-md bg-gray-50 border-gray-200">
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block text-gray-700">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8 border-gray-300 focus-visible:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-gray-700">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-gray-300">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              <SelectItem value="checked">Checked</SelectItem>
              <SelectItem value="unchecked">Unchecked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-gray-700">Start Date</label>
          <Input
            type="date"
            value={dateFilter.startDate || ""}
            onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value || null })}
            className="border-gray-300 focus-visible:ring-red-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block text-gray-700">End Date</label>
          <Input
            type="date"
            value={dateFilter.endDate || ""}
            onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value || null })}
            className="border-gray-300 focus-visible:ring-red-500"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">{filteredExams.length} results found</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      </div>
    </div>
  )
}

export default FilterPanel
