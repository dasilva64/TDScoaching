"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const WhileInView = ({ children, className, style, type }: any) => {
  if (type === "x") {
    return (
      <motion.div
        style={style}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { translateX: 0, opacity: 1 },
          hidden: { translateX: -200, opacity: 0 },
        }}
        transition={{ type: "spring", bounce: 0.25 }}
      >
        {children}
      </motion.div>
    );
  } else if (type === "y") {
    return (
      <motion.div
        style={style}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { translateY: 0 }, hidden: { translateY: 200 } }}
        transition={{ type: "spring", bounce: 0.25 }}
      >
        {children}
      </motion.div>
    );
  }
};

export default WhileInView;
