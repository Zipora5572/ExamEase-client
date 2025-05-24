import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import StudentExamService from "../services/StudentExamService";
import { StudentExamType } from '@/models/StudentExam';


export const getStudentExamById = createAsyncThunk(
    'studentExams/getStudentExamById',
    async (id: number, thunkAPI) => {
        try {
            const response = await StudentExamService.getStudentExamById(id);
            console.log(response);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to fetch student exam');
        }
    }
);
export const addStudentExam = createAsyncThunk(
    'studentExams/addStudentExam',
    async (studentExam: Partial<StudentExamType>, thunkAPI) => {
        try {
            const response = await StudentExamService.addStudentExam(studentExam);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to add student exam');
        }
    }
);

export const updateStudentExam = createAsyncThunk(
    'studentExams/updateStudentExam',
    async ({ id, studentExam }: { id: number; studentExam: Partial<StudentExamType> }, thunkAPI) => {
        try {
            const response = await StudentExamService.updateStudentExam(id, studentExam);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to update student exam');
        }
    }
);

export const deleteStudentExam = createAsyncThunk(
    'studentExams/deleteStudentExam',
    async (id: number, thunkAPI) => {
        try {
            await StudentExamService.deleteStudentExam(id);
            return { id }; 
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to delete student exam');
        }
    }
);
export const getStudentExamsByExamId = createAsyncThunk(
    'studentExams/getStudentExamsByExamId',
    async (examId: number, thunkAPI) => {
        try {
            const response = await StudentExamService.getStudentExamsByExamId(examId);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to fetch student exams by exam ID');
        }
    }
);
export const getStudentExamsByUserId = createAsyncThunk(
    'studentExams/getStudentExamsByUserId',
    async (userId: number, thunkAPI) => {
        try {
            const response = await StudentExamService.getStudentExamsByUserId(userId);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to fetch student exams by exam ID');
        }
    }
);

const studentExamsSlice = createSlice({
    name: 'studentExams',
    initialState: {
        examsByExamId: [] as StudentExamType[],
        examsByUserId: [] as StudentExamType[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStudentExamById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentExamById.fulfilled, (state) => {
                state.loading = false;
                // טיפול במקרה של קבלת מבחן תלמיד לפי ID (אם יש צורך)
            })
            .addCase(getStudentExamById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addStudentExam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addStudentExam.fulfilled, (state, action) => {
                state.loading = false;
                state.examsByExamId.push(action.payload);
            })
            .addCase(addStudentExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateStudentExam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudentExam.fulfilled, (state, action) => {
                state.loading = false;
                const updatedExam = action.payload;
                const index = state.examsByExamId.findIndex(exam => exam.id === updatedExam.id);
                if (index !== -1) {
                    state.examsByExamId[index] = updatedExam;
                }
            })
            .addCase(updateStudentExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteStudentExam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStudentExam.fulfilled, (state, action) => {
                state.loading = false;
                state.examsByExamId = state.examsByExamId.filter(exam => exam.id !== action.payload.id);
            })
            .addCase(deleteStudentExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
             .addCase(getStudentExamsByExamId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentExamsByExamId.fulfilled, (state, action) => {
                state.loading = false;
                state.examsByExamId = action.payload; // עדכון המבחנים לפי התגובה
            })
            .addCase(getStudentExamsByExamId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getStudentExamsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentExamsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.examsByUserId = action.payload; // עדכון המבחנים לפי התגובה
            })
            .addCase(getStudentExamsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default studentExamsSlice;
