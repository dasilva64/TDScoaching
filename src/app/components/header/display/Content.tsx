"use client";

import styles from "../header.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import useGet from "../../hook/useGet";
import FormLogin from "../../login/FormLogin";
import FormRegister from "../../register/formRegister";
import Forgot from "../../forgot/Forgot";
import NavAdmin from "../modal/NavAdmin";
import Nav from "../modal/Nav";
import DiscoveryModal from "@/app/tarif/components/DiscoveryModal";
import NormalModal from "@/app/tarif/components/NormalModal";
import NavUser from "../modal/NavUser";
import ModalCalendarDiscoveryMeeting from "../modal/discovery/ModalCalendarDiscoveryMeeting";

const Content = () => {
  const [displayLogMenu, setDisplayLogMenu] = useState<boolean>(false);

  const { isActive } = useSelector((state: RootState) => state.menu);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading } = useGet("/components/header/api");
  useEffect(() => {
    if (data) {
      if (data.isLoggedIn === false) {
        let regex = /\/utilisateur\/[0-9A-Za-z-]+/g;
        let regexTwo = /\/suppression-compte\/[0-9A-Za-z-]+/g;
        if (
          pathname === "/profile" ||
          pathname === "/utilisateurs" ||
          regex.test(pathname) ||
          regexTwo.test(pathname)
        ) {
          router.push("/");
        }
      }
    }
  }, [data, dispatch, pathname, router]);
  let content;
  if (isLoading) {
    content = (
      <div className={styles.header__log}>
        <div className={styles.header__log__div}></div>
      </div>
    );
  }
  if (data) {
    if (data.isLoggedIn === false) {
      content = (
        <>
          <div className={styles.header__log}>
            <button
              data-test="no"
              className={`${styles.header__log__div} modalOpen`}
              onClick={() => {
                handlerClick();
              }}
              aria-label="button pour ouvrir le formulaire de connexion"
            >
              <Image
                className={styles.header__log__img}
                width={25}
                height={25}
                src="/assets/icone/user-xmark-solid.svg"
                alt="Icone utilisateur non connecté"
                priority={true}
              />
            </button>
          </div>
        </>
      );
    } else {
      if (data.role === "ROLE_ADMIN") {
        content = (
          <>
            <div className={styles.header__log}>
              <button
                onClick={() => {
                  dispatch({ type: "ModalNavAdmin/open" });
                }}
                className={`modalOpen ${styles.header__log__div}`}
                aria-label="button pour ouvrir le menu de l'administrateur"
              >
                {" "}
                <Image
                  className={styles.header__log__img}
                  width={25}
                  height={25}
                  src="/assets/icone/user-check-solid.svg"
                  alt="Icone utilisateur connecté"
                  priority={true}
                />
              </button>
            </div>
          </>
        );
      } else if (data.role === "ROLE_USER") {
        content = (
          <>
            <div className={styles.header__log}>
              <button
                onClick={() => {
                  dispatch({ type: "ModalNavUser/open" });
                }}
                aria-label="button pour ouvrir le menu de l'utilisateur connecté"
                className={`modalOpen ${styles.header__log__div}`}
              >
                <Image
                  className={styles.header__log__img}
                  width={25}
                  height={25}
                  src="/assets/icone/user-check-solid.svg"
                  alt="Icone utilisateur connecté"
                  priority={true}
                />
              </button>
            </div>
          </>
        );
      }
    }
  }

  const handlerClick = () => {
    dispatch({
      type: "ModalLogin/open",
    });
  };
  return (
    <>
      {/* <DiscoveryModal />
      <NormalModal /> */}
      <FormLogin />
      {/* <ModalCalendarDiscoveryMeeting /> */}
      {/* <ModalDiscoveryMeetingTest />
      <ModalAddDiscoveryMeeting />
      <ModalRecapDiscoveryMeeting /> */}
      {typeof window !== "undefined" &&
        window.location.pathname === "/profile" && (
          <>
            {/* <EmailCheck /> */}
            {/* <ModalCloseEmail />
            <ModalDeleteAccount /> */}
            {/* <ModalUserLastnameData />
            
            
            <EmailCheck />
            <ModalCloseEmail />
            <ModalDeleteAccount />
             */}
          </>
        )}
      <FormRegister />
      <Forgot />
      <NavAdmin />
      <Nav />
      <NavUser />

      {content}
      <div
        className={`${
          displayLogMenu === true ? styles.headerr__log : styles.headerr
        }`}
      >
        <button
          tabIndex={0}
          onClick={() => {
            dispatch({ type: "ModalNav/open" });
          }}
          className={`modalOpen ${styles.button}`}
          aria-label="button pour ouvrir le menu"
        >
          <span
            className={`${styles.burger} ${
              isActive ? styles.burgerActive : ""
            }`}
          ></span>
        </button>
      </div>
    </>
  );
};

export default Content;
