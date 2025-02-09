import { FolderWithFilesInterface } from "@interfaces";
import { createSlice } from "@reduxjs/toolkit";
import { createFolder, deleteFolder, setFolder, updateFolder } from "../thunks";

export const initialState: FolderWithFilesInterface = {
  name: "~",
  id: "root",
  parentId: "root",
  books: [],
  folders: [],
};

const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createFolder.fulfilled, (state, action) => {
      state.folders.push(action.payload);
    });

    builder.addCase(setFolder.fulfilled, (state, action) => {
      if (!action.payload) return;
      return action.payload;
    });

    builder.addCase(updateFolder.fulfilled, (state, action) => {
      const index = state.folders.findIndex(
        (folder) => folder.id === action.payload.id
      );
      
      if(index === -1) return;
      
      state.folders[index] = action.payload;
    });

    builder.addCase(deleteFolder.fulfilled, (state, action) => {
      const folderIdToDelete = action.payload;
      state.folders = state.folders.filter(
        (folder) => folder.id !== folderIdToDelete
      );
    });
  },
});

export const {} = folderSlice.actions;

export default folderSlice.reducer;
