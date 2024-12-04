import React, { useEffect, useState } from "react";
import styles from "./Nav.module.scss";
import { AppDispatch, RootState } from "@/app/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import router from "next/router";
import useSWRMutation from "swr/mutation";
import { defaultSession } from "../../../lib/session";
import fetchDelete from "../../fetch/FetchDelete";
import TabIndex from "../../tabIndex/TabIndex";

const Nav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalNav } = useSelector((state: RootState) => state.ModalNav);
  const closeForm = () => {
    dispatch({
      type: "ModalNav/close",
    });
  };
  const {
    trigger,
    data: dataLogout,
    reset,
  } = useSWRMutation("/components/header/api", fetchDelete);
  const pathname = usePathname();
  useEffect(() => {
    if (dataLogout) {
      if (pathname) {
        let split = pathname.split("/");
        if (split[1] === "utilisateur") {
          router.push("/");
        }
        if (pathname === "/profile" || pathname === "/utilisateurs") {
          router.push("/");
        }
      }
      dispatch({
        type: "flash/storeFlashMessage",
        payload: {
          type: "error",
          flashMessage: dataLogout.message,
        },
      });
      reset();
    }
  }, [dispatch, pathname, reset, dataLogout]);

  return (
    <>
      <TabIndex displayModal={displayModalNav} />
      <AnimatePresence>
        {displayModalNav === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              role="dialog"
              className={styles.nav}
              initial={{ y: "-50%", x: "100%", opacity: 0 }}
              animate={{
                y: "-50%",
                x: 0,
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                y: "-50%",
                x: "100%",
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <button
                className={styles.nav__btn}
                type="button"
                onClick={() => closeForm()}
                aria-label="button pour fermer la modal de navigation"
              >
                <Image
                  className={styles.nav__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <nav className={styles.nav__nav}>
                <ul className={styles.nav__nav__ul}>
                  <li
                    className={`${styles.nav__nav__ul__li} ${styles.nav__nav__ul__li__border}`}
                  >
                    <Link
                      className={`${
                        pathname === "/"
                          ? styles.nav__nav__ul__li__link__active
                          : null
                      } ${styles.nav__nav__ul__li__link}`}
                      href="/"
                      onClick={() => closeForm()}
                    >
                      Accueil
                    </Link>
                  </li>
                  <li
                    className={`${styles.nav__nav__ul__li} ${styles.nav__nav__ul__li__border}`}
                  >
                    <Link
                      className={`${
                        pathname === "/qui-suis-je"
                          ? styles.nav__nav__ul__li__link__active
                          : null
                      } ${styles.nav__nav__ul__li__link}`}
                      href="/qui-suis-je"
                      onClick={() => closeForm()}
                    >
                      Qui-suis-je ?
                    </Link>
                  </li>
                  <li
                    className={`${styles.nav__nav__ul__li} ${styles.nav__nav__ul__li__border}`}
                  >
                    <Link
                      className={`${
                        pathname === "/coaching-de-vie"
                          ? styles.nav__nav__ul__li__link__active
                          : null
                      } ${styles.nav__nav__ul__li__link}`}
                      href="/coaching-de-vie"
                      onClick={() => closeForm()}
                    >
                      Coaching de vie
                    </Link>
                  </li>
                  <li
                    className={`${styles.nav__nav__ul__li} ${styles.nav__nav__ul__li__border}`}
                  >
                    <Link
                      className={`${
                        pathname === "/tarif"
                          ? styles.nav__nav__ul__li__link__active
                          : null
                      } ${styles.nav__nav__ul__li__link}`}
                      href="/tarif"
                      onClick={() => closeForm()}
                    >
                      Tarifs / durée
                    </Link>
                  </li>
                  <li
                    className={`${styles.nav__nav__ul__li} ${styles.nav__nav__ul__li__border}`}
                  >
                    <Link
                      className={`${
                        pathname === "/contact"
                          ? styles.nav__nav__ul__li__link__active
                          : null
                      } ${styles.nav__nav__ul__li__link}`}
                      href="/contact"
                      onClick={() => closeForm()}
                    >
                      Contact
                    </Link>
                  </li>
                  <li
                    className={`${styles.nav__nav__ul__li} ${styles.nav__nav__ul__li__border}`}
                  >
                    <Link
                      className={`${
                        pathname === "/contact"
                          ? styles.nav__nav__ul__li__link__active
                          : null
                      } ${styles.nav__nav__ul__li__link}`}
                      href="/blog"
                      onClick={() => closeForm()}
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
