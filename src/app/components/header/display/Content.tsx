"use client";

import styles from "../header.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";
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
import Form2FACode from "../../login/2fa/Form2FACode";
import useSWR from "swr";
import Rappel from "../rappel/Rappel";

const fetchData = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

const Content = () => {
  const [displayLogMenu, setDisplayLogMenu] = useState<boolean>(false);
  const { data, isLoading } = useSWR("/components/header/api", (url) =>
    fetchData(url), {
    revalidateOnMount: true,
    refreshInterval: 15 * 60 * 1000,
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
  }
  );
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
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    console.log(data)
    if (data) {
      if (data.status === 429 || data.status === 500) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      } else {
        if (data.status !== 200) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
        }

        dispatch({
          type: "csrfToken/store",
          payload: { csrfToken: data.session.csrfToken }
        })
        if (data.session.isLoggedIn !== true) {
          let regex = /\/utilisateur\/[0-9A-Za-z-]+/g;
          let regexTwo = /\/suppression-compte\/[0-9A-Za-z-]+/g;
          if (

            pathname === "/profile" ||
            pathname === "/rendez-vous" ||
            pathname === "/historique-rendez-vous" ||
            pathname === "/meetings" ||
            pathname === "/redirection-vers-rendez-vous" ||
            pathname === "/utilisateurs" ||
            regex.test(pathname) ||
            regexTwo.test(pathname)
          ) {
            //router.push(`/acces-refuse?destination=${pathname.substring(1, pathname.length)}`);
            router.push(`/`);
          }
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
    if (data.status === 500 || data.status === 429) {
      content = (
        <div className={styles.header__log}>
          <div className={styles.header__log__div}></div>
        </div>
      );
    }
    else if (typeof data.session.isLoggedIn === "undefined" || data.session.isLoggedIn === false) {
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
      if (data.session.role === "ROLE_ADMIN") {
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
      } else if (data.session.role === "ROLE_USER") {
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
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDestination(params.get('destination'));
  }, []);
  const isValidDestination = () => {
    if (!destination) return false;

    const regex = /^utilisateur\/[0-9A-Za-z-]+$/;
    const regexTwo = /^suppression-compte\/[0-9A-Za-z-]+$/;

    return (
      destination.startsWith("meetings") ||
      destination.startsWith("meetingAdmin") ||
      destination === "rendez-vous" ||
      destination.startsWith("profile") ||
      destination.startsWith("historique-rendez-vous") ||
      regex.test(destination) ||
      regexTwo.test(destination)
    );
  };
  const handlerClick = () => {
    dispatch({
      type: "ModalLogin/open",
      payload: { destination: isValidDestination() ? destination : "home" }
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
      {data && data.status === 200 && (
        <>
          {data.session.csrfToken && (
            <>
              <NavUser csrfToken={data.session.csrfToken} />
              <NavAdmin csrfToken={data.session.csrfToken} />
            </>
          )}

        </>
      )}
      {data && data.status && (
        <>
          {data.session && (
            <>
              <Nav discovery={data.body ? data.body.discovery : null} role={data.session.role} isLoggedIn={data.session.isLoggedIn} meeting={data.body ? data.body.hasMeeting : null} />
            </>
          )}
        </>

      )}



      {content}
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
      {data && data.status === 200 && (
        <>
          {data.body && data.session.role === "ROLE_USER" && (
            <>
              {(data.body.meeting === "not_confirmed" || !data.body.offre) && (
                <Rappel meeting={data.body.meeting} offre={data.body.offre} typeOffre={data.body.typeOffre} />
              )}

            </>
          )}
        </>
      )}

    </>
  );
};

export default Content;
