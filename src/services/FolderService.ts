import axios from "../utils/axiosConfig"
import { ExamFolderType } from "../models/Exam"

export default {
   
    createFolder: async (folderDetails: Partial<ExamFolderType>): Promise<any> => {
        try {
            console.log(folderDetails);
            
            const response = await axios.post('/folder', folderDetails, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating folder ",error)
        }
    },

    
    deleteFolder: async (id: number) => {
        try {
            const response = await axios.delete(`folder/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting folder ",error)
        }
    }
    ,
    getAllFolders: async () => {
        try {

            const response = await axios.get('/folder');
         
            
            return response.data;
        } catch (error) {
            console.error("Error fetch folders ",error)
        }
    },
    renameFolder: async (id: number, newName: string) => {
        try {
            const response = await axios.patch(`/folder/rename/${id}`, newName, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error renaming exam ",error)

        }
    },
    toggleStarFolder: async (id: number) => {
        try {
            const response = await axios.patch(`/folder/${id}/toggle-star`);
            return response.data;
        } catch (error) {
            console.error("Error toggle star ",error)
        }
    },
}