import { configureStore } from "@reduxjs/toolkit";
import { activeFolderslice, folderSlice } from "./slices";


export const makeStore = () => configureStore({
    reducer: {
        folder: folderSlice,
        activeFolder: activeFolderslice,
    },
})

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export * from "./thunks";
export * from "./slices";