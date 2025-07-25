"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./WhileInView.module.scss"

const WhileInView = ({
  children,
  className,
  type,
  tab = false,
}: {
  children: any;
  className?: any;
  type: any;
  tab?: any;
}) => {
  const divRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const CurrentRef = divRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 } // Détecte quand 10% de la div est visible
    );

    if (CurrentRef) {
      observer.observe(CurrentRef);
    }

    return () => {
      if (CurrentRef) {
        observer.unobserve(CurrentRef);
      }
    };
  }, []);
  if (type === "x") {
    return (
      <>
        <div ref={divRef} className={`${className} ${styles.transition} ${isVisible ? styles.visible : styles.hidden}`}>
        {children}
        </div>
        {/* <motion.div
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
          </motion.div> */}
      </>
      
    );
  } else if (type === "y") {
    return (
      <>
      <div ref={divRef} className={`${className} ${styles.transition} ${isVisible ? styles.visible : styles.hidden}`}>
      {children}
      </div>
      {/* <motion.div
        tabIndex={tab === true ? 0 : -1}
        className={`${className} ${styles.test}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { translateY: 0 }, hidden: { translateY: 200 } }}
        transition={{ type: "spring", bounce: 0.25 }}
      >
        {children}
      </motion.div> */}
      </>
    );
  }
};

export default WhileInView;
