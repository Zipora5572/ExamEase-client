import axios from "../utils/axiosConfig"
import {  ExamType } from "../models/Exam"

export default {
    uploadExamFile: async (file: File, examDetails: Partial<ExamType>) => {
        const formData = new FormData();
        formData.append('file', file);
        
        if (examDetails.userId !== undefined) formData.append('UserId', examDetails.userId.toString());
        if (examDetails.lang !== undefined) formData.append('Lang', examDetails.lang);
       
        let id=examDetails.folderId?examDetails.folderId.toString():'1'
        if (examDetails.folderId != null) formData.append('FolderId',id);
     
      

        // if (examDetails.folderId !== undefined) formData.append('FolderId', examDetails.folderId.toString());
        try {
            const response = await axios.post('exam/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error upload exam ",error)
        }
    },
   

    download: async (fileName: string) => {
        try {
            const response = await axios.get(`/exam/download`, {
                params: {
                    fileNamePrefix: fileName 
                },
                responseType: 'blob', 
            });

           
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); 
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    }
    ,
    deleteExamFile: async (id: number) => {
        try {
            const response = await axios.delete(`exam/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting exam ",error)
        }
    }
    ,
    getAllExams: async () => {
        try {

            const response = await axios.get('/exam');
            return response.data;
        } catch (error) {
            console.error("Error fetch exams ",error)
        }
    },
    getAllExamsByUserId: async(userId:number|undefined) => {
        try {

            const response = await axios.get(`exam/user/${userId}`);
            
            return response.data;
        } catch (error) {
            console.error("Error fetch exams ",error)
        }
    },
    renameExamFile: async (id: number, newName: string) => {
        try {
            console.log(id + ' renamed' + newName);

            const response = await axios.patch(`/exam/rename/${id}`, newName, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error renaming exam ",error)
        }
    },
   
    toggleStarExamFile: async (id: number) => {
        try {
            console.log("Toggle star for");
  
            const response = await axios.patch(`/exam/${id}/toggle-star`);
            return response.data;
        } catch (error) {
            console.error("Error toggle star ",error)
        }
    },
    
}
