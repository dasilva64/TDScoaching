import styles from "./Link.module.scss";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { slide, scale } from "./anim";
import Nav from "./Nav";
import { useDispatch } from "react-redux";

export default function Index({
  data,
  isActive,
  setSelectedIndicator,
  setIsActive,
}: any) {
  const { title, href, type, index } = data;
  const dispatch = useDispatch();
  return (
    <motion.div
      className={styles.link}
      onMouseEnter={() => {
        setSelectedIndicator(href);
      }}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className={styles.indicator}
      ></motion.div>
      <Link
        className={`${type === "sous-menu" ? styles.test : "jskldf"}`}
        href={href}
        onClick={() => {
          dispatch({ type: "menu/closeMenu" });
        }}
      >
        {title}
      </Link>
    </motion.div>
  );
}
