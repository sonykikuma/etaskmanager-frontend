import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://wokasana-backend.vercel.app";
const token = localStorage.getItem("token");

export const fetchOwners = createAsyncThunk("owners/fetchOwners", async () => {
  try {
    const res = await axios.get(`${baseUrl}/user`, {
      headers: {
        Authorization: ` ${token}`,
      },
    });
    //console.log("res.data", res.data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
});

export const ownersSlice = createSlice({
  name: "owners",
  initialState: {
    owners: [],
    status: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOwners.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchOwners.fulfilled, (state, action) => {
      state.status = "success";
      state.owners = action.payload;
      //console.log("action.payload", action.payload);
    });

    builder.addCase(fetchOwners.rejected, (state, action) => {
      state.status = "error";
      state.error = action.error?.message;
    });
  },
});

export default ownersSlice.reducer;
