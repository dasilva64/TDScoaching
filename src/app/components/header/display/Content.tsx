"use client";

import styles from "../header.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { usePathname, useRouter } from "next/navigation";
import Image from "../../image/Image";
import useGet from "../../hook/useGet";
import FormLogin from "../../login/FormLogin";
import FormRegister from "../../register/formRegister";
import Forgot from "../../forgot/Forgot";
import NavAdmin from "../modal/NavAdmin";
import Nav from "../modal/Nav";
import NavUser from "../modal/NavUser";
import ModalCalendarDiscoveryMeeting from "../modal/discovery/ModalCalendarDiscoveryMeeting";
import ModalAddDiscoveryMeeting from "../modal/discovery/ModalAddDiscoveryMeeting";
import ModalRecapDiscoveryMeeting from "../modal/discovery/ModalRecapDiscoveryMeeting";
import { useRefreshCsrfToken } from "../../hook/csrf/useRefreshCsrfToken";
import Form2FACode from "../../login/2fa/Form2FACode";
import useSWR from "swr";

const fetchData = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

const Content = () => {
  const [displayLogMenu, setDisplayLogMenu] = useState<boolean>(false);
 /*  const csrfRefreshToken = useRefreshCsrfToken();   */
  const { data, isLoading } = useSWR("/components/header/api", (url) =>
    fetchData(url), {
      revalidateOnMount: true,
      refreshInterval: 15 * 60 * 1000, 
      revalidateOnFocus: false, 
      revalidateOnReconnect: false, 
    }
  );
  const dispatch = useDispatch();

  const { isActive } = useSelector((state: RootState) => state.menu);
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken);
  
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (data) {
      dispatch({
        type: "csrfToken/store",
        payload: {csrfToken: data.csrfToken}
      })
      if (typeof data.isLoggedIn !== "undefined" && data.isLoggedIn === false) {
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
    if (typeof data.isLoggedIn === "undefined" || data.isLoggedIn === false) {
      content = (
        <>
          <div className={styles.header__log}>
            <button
              data-test="no"
              className={`${styles.header__log__div} modalOpen`}
              onClick={() => {
                handlerClick();
              }}
              onMouseDown={(e) => e.preventDefault()}
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
                onMouseDown={(e) => e.preventDefault()}
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
      <ModalCalendarDiscoveryMeeting />
      <ModalAddDiscoveryMeeting />
      <ModalRecapDiscoveryMeeting />
      <Form2FACode />
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
      {data && data.csrfToken && (
        <>
          <NavUser csrfToken={data.csrfToken} />
          <NavAdmin csrfToken={data.csrfToken} />
        </>
      )}
      
      <Nav />
      

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
          onMouseDown={(e) => e.preventDefault()}
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
