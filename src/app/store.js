import { configureStore } from "@reduxjs/toolkit";
import { projectSlice } from "../features/projectSlice";
import { taskSlice } from "../features/taskSlice";
import { teamSlice } from "../features/teamSlice";
import { ownersSlice } from "../features/ownersSlice";
import { tagsSlice } from "../features/tagsSlice";

export default configureStore({
  reducer: {
    project: projectSlice.reducer,
    task: taskSlice.reducer,
    team: teamSlice.reducer,
    owner: ownersSlice.reducer,
    tag: tagsSlice.reducer,
  },
});
