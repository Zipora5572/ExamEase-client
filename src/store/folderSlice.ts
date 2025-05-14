import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import examService from "../services/ExamService";
import folderService from "../services/FolderService";
import { ExamFolderType } from '../models/Exam';


export const createFolder = createAsyncThunk(
    'exams/createFolder',
    async (folderDetails: Partial<ExamFolderType>, thunkAPI) => {
        try {
            const response = await folderService.createFolder(folderDetails);
            return response; 
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Folder creation failed');
        }
    }
);


export const deleteFolder= createAsyncThunk(
    'exams/deleteFolder',
    async (id: number, thunkAPI) => {
        try {
            const response = await folderService.deleteFolder(+id);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Folder deletion failed');
        }
    }
);


export const getAllFolders = createAsyncThunk(
    'exams/getAllFolders',
    async (_, thunkAPI) => {
        try {
          
            
            const response = await examService.getAllFolders();
      
      
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to fetch exams');
        }
    }
);


export const renameFolder = createAsyncThunk(
    'exams/renameFolder',
    async ({ id, newName }: { id: number; newName: string }, thunkAPI) => {
        try {
            const response = await folderService.renameFolder(id, newName);
            return response; 
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Rename failed');
        }
    }
);
export const toggleStarFolder = createAsyncThunk(
    'exams/toggleStarFolder',
    async (examId: number, thunkAPI) => {
        try {
            const response = await folderService.toggleStarFolder(examId);
            return response; 
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to toggle star');
        }
    }
);
const folderSlice = createSlice({
    name: 'folders',
    initialState: {
        folders:[] as ExamFolderType[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFolder.fulfilled, (state, action) => {
                state.loading = false;      
                const newFolder = { ...action.payload, type: 'FOLDER' };     
                state.folders = [...state.folders, newFolder];           
            })
            .addCase(createFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFolder.fulfilled, (state, action) => {
              
                state.folders = state.folders.filter(folder => folder.id !== action.payload); 
            })
            .addCase(deleteFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
           
            .addCase(renameFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(renameFolder.fulfilled, (state, action) => {
                state.loading = false;
                const { id, folderName } = action.payload; 
               console.log(folderName);
               
                state.folders = state.folders.map(folder => 
                    folder.id == id ? { ...folder, folderName: folderName } : folder
                );
            })
            .addCase(renameFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getAllFolders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFolders.fulfilled, (state, action) => {
                state.loading = false;
                state.folders = action.payload;
            })
            .addCase(getAllFolders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(toggleStarFolder.fulfilled, (state, action) => {
                const updatedFolder = action.payload;
                state.folders = state.folders.map(folder =>
                    folder.id === updatedFolder.id ? { ...folder, isStarred: updatedFolder.isStarred } : folder
                );
            })
            .addCase(toggleStarFolder.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default folderSlice;
