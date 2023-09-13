"use client";

import { useEffect, useState } from "react";
import styles from "./goTop.module.scss";
import { AnimatePresence, motion } from "framer-motion";

const GoTop = () => {
  const [displayGoTop, setDisplayGoTop] = useState<boolean>(false);
  const goTop = () => {
    document.body.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (document) {
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
            <motion.div
              className={styles.top}
              onClick={() => {
                goTop();
              }}
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
            ></motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GoTop;
