import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://wokasana-backend.vercel.app";
const token = localStorage.getItem("token");

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    try {
      const res = await axios.get(`${baseUrl}/projects`, {
        headers: {
          Authorization: ` ${token}`,
        },
      });
      //console.log("res.data", res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      //return rejectWithValue(err.res?.data || err.message);
    }
  }
);

export const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    status: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.status = "success";
      state.projects = action.payload;
      //console.log("action.payload", action.payload);
    });

    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.status = "error";
      state.error = action.error?.message;
    });
  },
});

export default projectSlice.reducer;
