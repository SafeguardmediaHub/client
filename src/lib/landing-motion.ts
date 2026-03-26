import type { Transition, Variants } from "motion/react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const createTransition = (
  reducedMotion: boolean,
  duration: number,
): Transition => ({
  duration: reducedMotion ? 0.01 : duration,
  ease,
});

export const landingViewport = {
  once: true,
  amount: 0.2,
} as const;

export function createLandingMotion(reducedMotion: boolean) {
  const offset = reducedMotion ? 0 : 18;
  const softOffset = reducedMotion ? 0 : 12;
  const blur = reducedMotion ? "blur(0px)" : "blur(8px)";

  const sectionTransition = createTransition(reducedMotion, 0.7);
  const cardTransition = createTransition(reducedMotion, 0.6);
  const quickTransition = createTransition(reducedMotion, 0.45);

  return {
    stagger: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reducedMotion ? 0 : 0.08,
          delayChildren: reducedMotion ? 0 : 0.05,
        },
      },
    } satisfies Variants,
    quickStagger: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reducedMotion ? 0 : 0.06,
          delayChildren: reducedMotion ? 0 : 0.03,
        },
      },
    } satisfies Variants,
    sectionIntro: {
      hidden: {
        opacity: 0,
        y: offset,
        filter: blur,
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: sectionTransition,
      },
    } satisfies Variants,
    item: {
      hidden: {
        opacity: 0,
        y: softOffset,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: quickTransition,
      },
    } satisfies Variants,
    panel: {
      hidden: {
        opacity: 0,
        y: offset,
        scale: reducedMotion ? 1 : 0.985,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: sectionTransition,
      },
    } satisfies Variants,
    card: {
      hidden: {
        opacity: 0,
        y: offset,
        scale: reducedMotion ? 1 : 0.99,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: cardTransition,
      },
    } satisfies Variants,
    swap: {
      hidden: {
        opacity: 0,
        y: softOffset,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: quickTransition,
      },
      exit: {
        opacity: 0,
        y: reducedMotion ? 0 : -8,
        transition: quickTransition,
      },
    } satisfies Variants,
  };
}
