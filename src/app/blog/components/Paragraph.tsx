"use client";

import React, { useEffect } from "react";
import styles from "./Paragraph.module.scss";

const Paragraph = ({ content }: { content: string }) => {
  const paragraphRef = React.useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (paragraphRef.current) {
      if (
        paragraphRef.current.scrollHeight > paragraphRef.current.offsetHeight
      ) {
        paragraphRef.current.style.maskImage =
          "linear-gradient(to bottom, black 50%, transparent 100%)";
      } else {
        paragraphRef.current.style.maskImage = "none";
      }
    }
  }, [paragraphRef]);
  return (
    <>
      <p ref={paragraphRef} className={`${styles.paragraph} description`}>
        {content}
      </p>
    </>
  );
};

export default Paragraph;
