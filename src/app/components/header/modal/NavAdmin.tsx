import React, { useEffect, useState } from "react";
import styles from "./NavAdmin.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Image from "../../image/Image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { defaultSession } from "../../../lib/session";
import fetchDelete from "../../fetch/FetchDelete";
import TabIndex from "../../tabIndex/TabIndex";
import fetchLogout from "../../fetch/FetchLogout";
import FetchLogout from "../../fetch/FetchLogout";
import { mutate } from "swr";

const NavAdmin = ({csrfToken}: any) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalNavAdmin } = useSelector(
    (state: RootState) => state.ModalNavAdmin
  );
  const closeForm = () => {
    dispatch({
      type: "ModalNavAdmin/close",
    });
  };
  const pathname = usePathname();
  const [onHoverLink, setOnHoverLink] = useState<string | null>(pathname);
  const {
    trigger,
    data: dataLogout,
    reset,
  } = useSWRMutation("/components/header/api", FetchLogout);

  useEffect(() => {
    if (dataLogout) {
      if (pathname) {
        let split = pathname.split("/");
        if (split[1] === "utilisateur") {
          router.push("/");
        }
        if (pathname === "/profile" || pathname === "/utilisateurs" || pathname === "/meetings") {
          router.push("/");
        }
      }
      mutate("/components/header/ui/api");
      mutate("/components/header/api");
      dispatch({
        type: "flash/storeFlashMessage",
        payload: {
          type: "error",
          flashMessage: dataLogout.message,
        },
      });
      reset();
    }
  }, [dispatch, pathname, reset, dataLogout, router]);
  return (
    <>
      <TabIndex displayModal={displayModalNavAdmin} />
      <AnimatePresence>
        {displayModalNavAdmin === true && (
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
              className={styles.navAdmin}
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
                className={styles.navAdmin__btn}
                type="button"
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="button pour fermer la modal de navigation"
              >
                <Image
                  className={styles.navAdmin__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <nav className={styles.navAdmin__nav}>
                <ul className={styles.navAdmin__nav__ul}>
                  <li
                    className={`${styles.navAdmin__nav__ul__li} ${styles.navAdmin__nav__ul__li__border}`}
                    onMouseOver={() => setOnHoverLink("/profile")}
                  >
                    <Link
                      className={`${pathname === "/profile"
                          ? styles.navAdmin__nav__ul__li__link__active
                          : null
                        } ${styles.navAdmin__nav__ul__li__link}`}
                      href="/profile"
                      onClick={() => closeForm()}
                    >
                      Compte
                    </Link>
                  </li>
                  <li
                    className={`${styles.navAdmin__nav__ul__li} ${styles.navAdmin__nav__ul__li__border}`}
                  >
                    <Link
                      className={`${pathname === "/utilisateurs"
                          ? styles.navAdmin__nav__ul__li__link__active
                          : null
                        } ${styles.navAdmin__nav__ul__li__link}`}
                      href="/utilisateurs"
                      onClick={() => closeForm()}
                    >
                      Tous les utilisateurs
                    </Link>
                  </li>
                  <li
                    className={`${styles.navAdmin__nav__ul__li} ${styles.navAdmin__nav__ul__li__border}`}
                  >
                    <Link
                      className={`${pathname === "/meetings"
                          ? styles.navAdmin__nav__ul__li__link__active
                          : null
                        } ${styles.navAdmin__nav__ul__li__link}`}
                      href="/meetings"
                      onClick={() => closeForm()}
                    >
                      Tous les rendez-vous
                    </Link>
                  </li>
                </ul>
              </nav>
              <button
                className={styles.btn}
                onClick={() => {
                  closeForm();
                  const logout = async () => {
                    trigger({ csrfToken });
                  };
                  setTimeout(() => {
                    logout();
                  }, 800);
                }}
              >
                Se déconnecter
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavAdmin;
