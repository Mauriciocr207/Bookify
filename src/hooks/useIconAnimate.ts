import { PressEvent } from "@react-types/shared";
import { useAnimate, ValueAnimationTransition } from "framer-motion";


type AnimationConfig = {
  keyframes: object;
  options?: ValueAnimationTransition<object>;
}

type PressEventListener = (e?: PressEvent) => void;

export interface useIconAnimateProps {
  handlePressAnimation: AnimationConfig;
  handlePressStartAnimation: AnimationConfig;
  handlePressEvent?: PressEventListener | null;
  handlePressStartEvent?: PressEventListener | null;
}

export default function useIconAnimate({
  handlePressAnimation,
  handlePressStartAnimation,
  handlePressEvent,
  handlePressStartEvent,
}: useIconAnimateProps) {
  const [scope, animate] = useAnimate();

  const handlePress: PressEventListener = (e) => {
    animate(
      scope.current,
      handlePressAnimation.keyframes,
      handlePressAnimation.options
    );
    handlePressEvent?.(e);
  };

  const handlePressStart: PressEventListener = (e) => {
    animate(
      scope.current,
      handlePressStartAnimation.keyframes,
      handlePressStartAnimation.options
    );
    handlePressStartEvent?.(e);
  };

  return { scope, handlePress, handlePressStart };
}
