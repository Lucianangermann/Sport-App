import type { Variants } from 'framer-motion';

export const scaleIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.15 } },
};

export const slideUp: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 30 } },
  exit: { y: 60, opacity: 0, transition: { duration: 0.2 } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const bounceIn: Variants = {
  hidden: { scale: 0.3, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 600, damping: 15 } },
  exit: { scale: 0.3, opacity: 0 },
};

export const shakeX: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, -6, 6, 0],
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const floatUp: Variants = {
  hidden: { y: 0, opacity: 1 },
  visible: { y: -60, opacity: 0, transition: { duration: 1.2, ease: 'easeOut' } },
};
