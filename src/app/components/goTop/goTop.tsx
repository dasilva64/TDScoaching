"use client";

import { useEffect, useState } from "react";
import styles from "./goTop.module.scss";
import { AnimatePresence, motion } from "framer-motion";

const GoTop = () => {
  const [displayGoTop, setDisplayGoTop] = useState<boolean>(false);
  const goTop = () => {
    const html = document.querySelector("html");
    html?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (document) {
      if (document.documentElement.scrollTop > 50) {
        setDisplayGoTop(true);
      }
      document.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 50) {
          setDisplayGoTop(true);
        } else {
          setDisplayGoTop(false);
        }
      });
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {displayGoTop === true && (
          <>
          <motion.button
          className={`${styles.top__noFlash
          } modalOpen`}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            goTop();
          }}
          aria-label="goTop"
          initial={{ y: 20, x: "-50%", opacity: 0 }}
          animate={{
            y: "-50%",
            x: "-50%",
            opacity: 1,
            transition: { duration: 0.3 },
          }}
          exit={{
            y: 20,
            x: "-50%",
            opacity: 0,
            transition: { duration: 0.3 },
          }}
        ></motion.button>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GoTop;
