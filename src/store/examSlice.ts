import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import examService from "../services/ExamService";
import { ExamFileType, ExamFolderType, ExamType } from '../models/Exam';

export const uploadExamFile = createAsyncThunk(
    'exams/uploadExamFile',
    async ({ file, examDetails }: { file: File; examDetails: Partial<ExamType> }, thunkAPI) => {
        try {
            const response = await examService.uploadExamFile(file, examDetails);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'File upload failed');
        }
    }
);



export const deleteExamFile = createAsyncThunk(
    'exams/deleteExamFile',
    async (examId: number, thunkAPI) => {
        try {
            const response = await examService.deleteExamFile(examId);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'File deletion failed');
        }
    }
);



export const getAllExams = createAsyncThunk(
    'exams/getAllExams',
    async (_, thunkAPI) => {
        try {
            const response = await examService.getAllExams();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to fetch exams');
        }
    }
);

export const renameExamFile = createAsyncThunk(
    'exams/renameExamFile',
    async ({ id, newName }: { id: number; newName: string }, thunkAPI) => {
        try {
            const response = await examService.renameExamFile(id, newName);
            return response; 
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Rename failed');
        }
    }
);
export const toggleStarExamFile = createAsyncThunk(
    'exams/toggleStarExamFile',
    async (examId: number, thunkAPI) => {
        try {
            const response = await examService.toggleStarExamFile(examId);
            return response; 
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to toggle star');
        }
    }
);


const examSlice = createSlice({
    name: 'exams',
    initialState: {
        folders:[] as ExamFolderType[],
        exams: [] as ExamFileType[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadExamFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadExamFile.fulfilled, (state, action) => {
                state.loading = false;
                const newExam = { ...action.payload, type: 'FILE' };
                state.exams = [...state.exams, newExam];
            })
            .addCase(uploadExamFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
          
            .addCase(deleteExamFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExamFile.fulfilled, (state, action) => {

                state.loading = false;
                state.exams = state.exams.filter(exam => exam.id !== action.payload); 
                 state.folders = state.folders.filter(folder => folder.id !== action.payload); 
            })
            .addCase(deleteExamFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getAllExams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllExams.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = action.payload; 
            })
            .addCase(getAllExams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(renameExamFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(renameExamFile.fulfilled, (state, action) => {
                state.loading = false;
              
                const { id, name } = action.payload; 
               
                state.exams = state.exams.map(exam => 
                    exam.id == id ? { ...exam, name: name } : exam
                );
            })
            .addCase(renameExamFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(toggleStarExamFile.fulfilled, (state, action) => {
                const updatedExam = action.payload;
            
               
                state.exams = state.exams.map(exam =>
                    exam.id === updatedExam.id ? { ...exam, isStarred: updatedExam.isStarred } : exam
                );
            })
            .addCase(toggleStarExamFile.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            

    },
});

export default examSlice;
