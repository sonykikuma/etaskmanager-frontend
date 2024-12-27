import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://wokasana-backend.vercel.app";
const token = localStorage.getItem("token");

export const fetchTeams = createAsyncThunk("teams/fetchTeams", async () => {
  try {
    const res = await axios.get(`${baseUrl}/teams`, {
      headers: {
        Authorization: ` ${token}`,
      },
    });
    // console.log("res.data", res.data.teams);
    return res.data.teams;
  } catch (err) {
    console.log(err);
  }
});

export const createTeam = createAsyncThunk(
  "teams/createTeam",
  async (newTeam) => {
    try {
      const res = await axios.post(`${baseUrl}/teams`, newTeam, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log("new: ", res.data);
      return res.data.newTeamSaved;
    } catch (error) {
      console.log(error);
    }
  }
);

export const teamSlice = createSlice({
  name: "teams",
  initialState: {
    teams: [],
    status: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTeams.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTeams.fulfilled, (state, action) => {
      state.status = "success";
      state.teams = action.payload;
      //console.log("action.payload", action.payload);
    });

    builder.addCase(fetchTeams.rejected, (state, action) => {
      state.status = "error";
      state.error = action.error?.message;
    });
    builder
      .addCase(createTeam.pending, (state) => {
        state.status = "creating";
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.status = "success";
        state?.teams?.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error?.message;
      });
  },
});

export default teamSlice.reducer;
