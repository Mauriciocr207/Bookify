import { FolderInterface } from '@interfaces';
import { createSlice } from '@reduxjs/toolkit'

const initialState: FolderInterface = {
    id: "",
    name: "",
    parentId: "",
}

const activeFolderSlice = createSlice({
  name: 'activeFolder',
  initialState,
  reducers: {
    setActiveFolder: (state, action) => {
        return action.payload;
    }
  }
});

export const { setActiveFolder } = activeFolderSlice.actions

export default activeFolderSlice.reducer