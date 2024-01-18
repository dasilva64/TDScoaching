import React, { useState } from "react";
import styles from "./Nav.module.scss";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "./anim";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import LinkBurger from "./Link";
import Link from "next/link";

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
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <motion.div
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
    >
      <div className={styles.logo}>
        <Link
          className={styles.logo__link}
          href="/"
          tabIndex={0}
          onClick={() => {
            dispatch({ type: "menu/closeMenu" });
          }}
        >
          <Image
            className={styles.logo__link__img}
            width={0}
            height={0}
            sizes="100vw"
            src="/assets/logo/logo3.png"
            alt="logo tdss coaching"
            priority={true}
          />
        </Link>
      </div>
      <div className={styles.line}></div>
      <div className={styles.body}>
        <div
          onMouseLeave={() => {
            setSelectedIndicator(pathname);
          }}
          className={styles.nav}
        >
          {navItems.map((data, index) => {
            return (
              <LinkBurger
                key={index}
                data={{ ...data, index }}
                isActive={selectedIndicator == data.href}
                setSelectedIndicator={setSelectedIndicator}
              ></LinkBurger>
            );
          })}
        </div>
      </div>
      <div className={styles.line__bottom}></div>
      <button
        onClick={() => {
          dispatch({ type: "menu/closeMenu" });
          router.back();
        }}
        className={styles.back}
      >
        Retour à la page précedente
      </button>
    </motion.div>
  );
};

export default Nav;
