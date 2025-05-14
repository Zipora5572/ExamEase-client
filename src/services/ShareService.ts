import axios from "../utils/axiosConfig"

interface ShareRecipient {
  id: number
  type: "user" | "group"
}

const ShareService = {
  // Share an exam with users or groups
  shareExam: async (examId: number, recipients: ShareRecipient[], permission: string) => {
    try {
      const response = await axios.post(`/exam/${examId}/share`, {
        recipients,
        permission,
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to share exam: ${error.message}`)
    }
  },

  // Get exams shared by the current user
  getSharedByMe: async () => {
    try {
      const response = await axios.get("/exam/shared-by-me")
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to fetch shared exams: ${error.message}`)
    }
  },

  // Get exams shared with the current user
  getSharedWithMe: async () => {
    try {
      const response = await axios.get("/exam/shared-with-me")
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to fetch shared exams: ${error.message}`)
    }
  },

  // Update sharing permissions
  updatePermission: async (examId: number, userId: number, permission: string) => {
    try {
      const response = await axios.patch(`/exam/${examId}/share/${userId}`, {
        permission,
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to update permissions: ${error.message}`)
    }
  },

  // Remove sharing for a user
  removeSharing: async (examId: number, userId: number) => {
    try {
      const response = await axios.delete(`/exam/${examId}/share/${userId}`)
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to remove sharing: ${error.message}`)
    }
  },

  // Get all users that can be shared with
  getShareableUsers: async () => {
    try {
      const response = await axios.get("/users/shareable")
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }
  },

  // Get all groups that can be shared with
  getShareableGroups: async () => {
    try {
      const response = await axios.get("/groups/shareable")
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to fetch groups: ${error.message}`)
    }
  },
}

export default ShareService
