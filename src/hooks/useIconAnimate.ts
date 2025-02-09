import { useAnimate, ValueAnimationTransition } from "framer-motion";

type AnimationConfig = {
  keyframes: object;
  options?: ValueAnimationTransition<object>;
};

export interface useIconAnimateProps {
  handlePressAnimation: AnimationConfig;
  handlePressStartAnimation: AnimationConfig;
}

export default function useIconAnimate({
  handlePressAnimation,
  handlePressStartAnimation,
}: useIconAnimateProps) {
  const [scope, animate] = useAnimate();

  const upAnimate = () =>
    animate(
      scope.current,
      handlePressAnimation.keyframes,
      handlePressAnimation.options
    );

  const downAnimate = () =>
    animate(
      scope.current,
      handlePressStartAnimation.keyframes,
      handlePressStartAnimation.options
    );

  return { scope, downAnimate, upAnimate };
}
