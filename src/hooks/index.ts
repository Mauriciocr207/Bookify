import { useDispatch, useSelector, useStore } from "react-redux";
import useIconAnimate, {useIconAnimateProps} from "./useIconAnimate";
import useTheme from "./useTheme";
import { AppDispatch, AppStore, RootState } from "@store";


export type { useIconAnimateProps };
export { useIconAnimate, useTheme };

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();