import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://tasker-backend-mocha.vercel.app"; //"https://wokasana-backend.vercel.app";
const token = localStorage.getItem("token");

export const fetchTags = createAsyncThunk("tags/fetchTags", async () => {
  try {
    const res = await axios.get(`${baseUrl}/tags`, {
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

export const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    tags: [],
    status: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.status = "success";
      state.tags = action.payload;
      //console.log("action.payload", action.payload);
    });

    builder.addCase(fetchTags.rejected, (state, action) => {
      state.status = "error";
      state.error = action.error?.message;
    });
  },
});

export default tagsSlice.reducer;
