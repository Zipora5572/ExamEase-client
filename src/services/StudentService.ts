import axios from "../utils/axiosConfig";

const StudentService = {

    uploadStudentList: async (examDetails: { examId: number }, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('examId', examDetails.examId.toString());

            const response = await axios.post(`/Student/${examDetails.examId}/excel`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error upload student ",error)
        }
    },

    
    getAllStudentsForExam: async (examId: number): Promise<any> => {
        try {
            const response = await axios.get(`/student/exam/${examId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetch students ",error)
        }
    },

    getAllStudentsForTeacher: async (teacherId: number): Promise<any> => {
        try {
            const response = await axios.get(`/student/teacher/${teacherId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetch students ",error)
        }
    },

    deleteStudent: async (studentId: number): Promise<any> => {
        try {
            const response = await axios.delete(`/students/${studentId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting student ",error)
        }
    },

    updateStudentDetails: async (studentId: number, studentData: any): Promise<any> => {
        try {
            const response = await axios.patch(`/students/${studentId}`, studentData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error updating student's details ",error)

        }
    }
};

export default StudentService;
