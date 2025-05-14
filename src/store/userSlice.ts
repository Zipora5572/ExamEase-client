import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../services/AuthService";
import initialState from "../models/authUser";
import { UserType } from "../models/User";
import UserService from "../services/UserService";

export const login = createAsyncThunk(
  "auth/login",
  async (data: Partial<UserType>, thunkAPI) => {
    try {
      const { email, password } = data;
      const response = await AuthService.login({ email, password });  
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: Partial<UserType>, thunkAPI) => {
    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async (userData: { id: number; data:Partial<UserType> }, thunkAPI) => {
      try {
        const response = await UserService.updateUser(userData.id,userData.data)
       
        return response;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data || "Update failed");
      }
    }
  );
  export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
      await AuthService.logout(); 
      return {}; 
    } catch (error) {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  });
  export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
    try {
      const response = await AuthService.checkAuth();
      return response.user;
    } catch (error) {
      return thunkAPI.rejectWithValue("User not authenticated");
    }
  });
  

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { 
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        
        state.user = {...action.payload.user};
     
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state,action) => {
        state.loading = false;
        state.user = {...action.payload.user};
     
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }) .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload }; 
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null; 
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }});


export default authSlice;