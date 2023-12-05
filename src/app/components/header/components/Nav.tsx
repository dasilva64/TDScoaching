import React, { useState } from "react";
import styles from "./Nav.module.scss";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "./anim";
import Link from "./Link";

const navItems = [
  {
    title: "Accueil",
    href: "/",
    type: "menu",
  },
  {
    title: "Qui-suis-je ?",
    href: "/qui-suis-je",
    type: "menu",
  },
  {
    title: "Coaching de vie",
    href: "/coaching-de-vie",
    type: "menu",
  },
  {
    title: "Tarifs / durée",
    href: "/tarif",
    type: "menu",
  },
  {
    title: "Contact",
    href: "/contact",
    type: "menu",
  },
];

const Nav = () => {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);

  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
    >
      <div className={styles.body}>
        <div
          onMouseLeave={() => {
            setSelectedIndicator(pathname);
          }}
          className={styles.nav}
        >
          {navItems.map((data, index) => {
            return (
              <Link
                key={index}
                data={{ ...data, index }}
                isActive={selectedIndicator == data.href}
                setSelectedIndicator={setSelectedIndicator}
              ></Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Nav;
