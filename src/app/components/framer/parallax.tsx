"use client";

import React, { useEffect, useRef } from "react";
import {
  MotionValue,
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}
const Parallax = ({ className, children }: any) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const y = useParallax(scrollYProgress, 300);

  return (
    <motion.div style={{ y }} className={className} ref={ref}>
      {children}
    </motion.div>
  );
};

export default Parallax;
