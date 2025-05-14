import { StudentExamType } from "@/models/StudentExam";
import axios from "../utils/axiosConfig";

const StudentExamService = {

    checkExam: async (studentExamImage: string, teacherExamImage: string,lang:string) => {
        try {
            const response = await axios.post('studentExam/autoCheck', {
                studentExamUrl: studentExamImage,
                teacherExamUrl: teacherExamImage,
                lang:lang

            });
    console.log(response);
    
            return response.data;
    
        } catch (error) {
            console.error('Failed to check exam:', error);
        }
    }
    
    ,
   
 uploadStudentExams : async (studentExam:Partial<StudentExamType>, files:FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
        formData.append('Files', file);
    });

     if (studentExam.examId != null) {
         formData.append('ExamId', studentExam.examId.toString());
     }
    formData.append('Lang', studentExam.lang || '');
    // formData.append('StudentId',"1");
    // formData.append('TeacherId',"1");

    try {
        const response = await axios.post(`studentExam/uploadStudentExam`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading student exams",error)
    }
},
uploadCorrectedImage: async (studentExamId: number, formData: FormData) => {
    try {
        const response = await axios.post(`/studentExam/${studentExamId}/upload-corrected`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading corrected image:", error);
        throw error;
    }
},
    getAllStudentExams: async () => {
        try {
            const response = await axios.get(`/studentExam`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all student exams:", error);
            throw error; // לזרוק את השגיאה כדי שהקוד הקורא יוכל לטפל בה
        }
    },


    getStudentExamById: async (id: number) => {
        try {
            const response = await axios.get(`studentExam/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching student exam with ID ${id}:`, error);
            throw error;
        }
    },


    getStudentExamsByExamId: async (examId: number) => {
        try {
            const response = await axios.get(`studentExam/exam/${examId}`);


            return response.data;
        } catch (error) {
            console.error(`Error fetching student exams for exam ID ${examId}:`, error);
            throw error;
        }
    },


    addStudentExam: async (studentExam: Partial<StudentExamType>) => {
        try {
            const response = await axios.post('/studentExam', studentExam);
            return response.data;
        } catch (error) {
            console.error("Error adding student exam:", error);
            throw error;
        }
    }
  
,    
    getSignedUrl: async (objectName: string) => {
        try {
            // חילוץ ה-objectName היחסי (לא ה-URL המלא)
            const relativeObjectName = objectName.split('/exams-bucket/')[1];
    
            // שליחת הבקשה עם ה-objectName היחסי
            const response = await axios.get(`/exam/signed-url`, {

                params: { objectName: relativeObjectName }
            });
            return response.data;
        } catch (error) {
            console.error("Error getting signed URL:", error);
            throw error;
        }
    }
    
,      
    updateStudentExam: async (id: number, studentExam: Partial<StudentExamType>) => {
        try {
            const response = await axios.put(`studentExam/${id}`, studentExam);
            return response.data;
        } catch (error) {
            console.error(`Error updating student exam with ID ${id}:`, error);
            throw error;
        }
    },


    deleteStudentExam: async (id: number) => {
        try {
            await axios.delete(`studentExam/${id}`);
        } catch (error) {
            console.error(`Error deleting student exam with ID ${id}:`, error);
            throw error;
        }
    }
};

export default StudentExamService;

