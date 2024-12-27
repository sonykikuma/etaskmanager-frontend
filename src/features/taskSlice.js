import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://wokasana-backend.vercel.app";
const token = localStorage.getItem("token");

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  try {
    const res = await axios.get(`${baseUrl}/tasks`, {
      headers: {
        Authorization: ` ${token}`,
      },
    });
    // console.log("res.data", res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
});

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (newTask) => {
    try {
      const res = await axios.post(`${baseUrl}/tasks`, newTask, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("new: ", res.data.newTask);
      return res.data.newTask;
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error);
      throw error; // Ensure the error propagates to Redux

      //console.log(error);
    }
  }
);

export const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.status = "success";
      state.tasks = action.payload;
      //console.log("action.payload", action.payload);
    });

    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.status = "error";
      state.error = action.error?.message;
    });
    builder
      .addCase(createTask.pending, (state) => {
        state.status = "creating";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = "success";
        state?.tasks?.tasks?.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error?.message;
      });
  },
});

export default taskSlice.reducer;
