"use client";

import styles from "../header.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import Nav from "../modal/Nav";


const Content = () => {
  const [displayLogMenu, setDisplayLogMenu] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { isActive } = useSelector((state: RootState) => state.menu);
  useEffect(() => {
    let previousY = 0;
    let lastDirection: any = null;
    let hasResized = false;
    const header = document.getElementById("header");

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const isNearBottom = scrollY >= maxScroll - 50;
      if (!header) return;
      if (scrollY > previousY && scrollY > 50) {
        if (lastDirection !== "down") {
          hasResized = false;
          lastDirection = "down"
          header.style.top = "-84px"
        }
      } else if (scrollY < previousY && !isNearBottom) {
        if (lastDirection !== "up") {
          hasResized = false;
          header.style.top = "0px"
          lastDirection = "up"
        }
      }
      previousY = scrollY;
    };
    const handleResize = () => {
      if (!header || hasResized) return;
      header.style.top = "0px";
      lastDirection = "up";
      hasResized = true;
    }
    window.addEventListener('resize', handleResize);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <>
     

      <Nav />

      <div
        className={`${displayLogMenu === true ? styles.headerr__log : styles.headerr
          }`}
      >
        <button
          tabIndex={0}
          onClick={() => {
            dispatch({ type: "ModalNav/open" });
          }}
          onMouseDown={(e) => e.preventDefault()}
          className={`modalOpen ${styles.button}`}
          aria-label="button pour ouvrir le menu"
        >
          <span
            className={`${styles.burger} ${isActive ? styles.burgerActive : ""
              }`}
          ></span>
        </button>
      </div>

    </>
  );
};

export default Content;
