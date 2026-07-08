/**
 * Raw easing functions for consumers outside GSAP (shaders, canvas,
 * scroll math). GSAP consumers use the string tokens in config/motion.
 */

export const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const smoothstep = (t: number) => t * t * (3 - 2 * t);
