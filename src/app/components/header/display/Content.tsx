"use client";

import styles from "../header.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/app/assets/img/logo.png";
/* import EmailCheck from "../../../../../test/app/profile/components/emailData/EmailData";
import ModalUserSendToken from "../../../../../test/app/profile/components/emailSendTokenData/modal/ModalUserSendToken";
import ModalUserPasswordData from "../../../../../test/app/profile/components/passwordData/modal/ModalUserPasswordData"; */
/* import Forgot from "../../../../../test/app/components/forgot/Forgot";
import FormLogin from "../../../../../test/app/components/login/formLogin";
import FormRegister from "../../../../../test/app/components/register/formRegister"; */
//import ModalDeleteAccount from "../../../../../test/app/profile/components/deleteAccount/modal/ModalDeleteAccount";
//import ModalCloseEmail from "../../../../../test/app/profile/components/emailData/modal/ModalCloseEmail";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "../components/Nav";
/* import ModalUserFirstnameData from "../../../../../test/app/profile/components/firstnameData/modal/ModalUserFirstnameData";
import ModalUserLastnameData from "../../../../../test/app/profile/components/lastnameData/modal/ModalUserLastnameData"; */
//import useGet from "../../../../../test/app/components/hook/useGet";

import { mutate, useSWRConfig } from "swr";
/* import ModalEditFormuleUser from "../../../../../test/app/rendez-vous/components/take/modal/ModalEditFormule";
import ModalCancelMeeting from "../../../../../test/app/rendez-vous/components/not-comfirm/modal/ModalCancelMeeting";
import ModalDatePickerEditDesktop from "../../../../../test/app/rendez-vous/components/my-meeting/modal/ModalDatePickerEdit";
import ModalAddDiscoveryMeeting from "../../../../../test/app/rendez-vous/components/takeDiscovery/modal/ModalAddDiscoveryMeeting";
import ModalDeleteDiscoveryMeeting from "../../../../../test/app/rendez-vous/components/my-discovery-meeting/modal/ModalDeleteDiscoveryMeeting";
import ModalDatePicker from "../../../../../test/app/rendez-vous/components/take/modal/ModalDatePicker";
import ModalAddMeeting from "../../../../../test/app/rendez-vous/components/take/modal/ModalAddMeeting";
import ModalEditDiscoveryMeeting from "../../../../../test/app/rendez-vous/components/my-discovery-meeting/modal/ModalEditDiscoveryMeeting";
import ModalDatePickerDiscovery from "../../../../../test/app/rendez-vous/components/takeDiscovery/modal/ModalDatePickerDiscovery";
import ModalDatePickerEditDiscovery from "../../../../../test/app/rendez-vous/components/my-discovery-meeting/modal/ModalDatePickerEditDiscovery";
import ModalDatePickerEdit from "../../../../../test/app/rendez-vous/components/my-meeting/modal/ModalDatePickerEdit";
import ModalEditMeeting from "../../../../../test/app/rendez-vous/components/my-meeting/modal/ModalEditMeeting";
import ModalDeleteMeeting from "../../../../../test/app/rendez-vous/components/my-meeting/modal/ModalDeleteMeeting";
import ModalAddMeetingAdmin from "../../../../../test/app/meetingAdmin/components/modal/ModalAddMeetingAdmin";
import ModalCloseTwoFactor from "../../../../../test/app/profile/components/twoFactorData/modal/ModalCloseTwoFactor";
import ModalTwoFactorSendToken from "../../../../../test/app/profile/components/twoFactorSendTokenData/Modal/ModalTwoFactorSendToken";
import ModalTwoFactor from "../../../../../test/app/profile/components/twoFactorData/ModalTwoFactor";
import ModalComfirmDisable from "../../../../../test/app/profile/components/twoFactorSendTokenData/Modal/ModalComfirmDisable"; */
import DiscoveryModal from "@/app/tarif/components/DiscoveryModal";
import NormalModal from "@/app/tarif/components/NormalModal";
import ModalSurMesure from "@/app/redux/feature/modal/ModalSurMesure";
import useGet from "../../hook/useGet";
import FormLogin from "../../login/FormLogin";
import useSWRMutation from "swr/mutation";
import fetchDelete from "../../fetch/FetchDelete";
import { defaultSession } from "../../../../../lib/session";
import ModalUserFirstnameData from "@/app/profile/components/firstnameData/modal/ModalUserFirstnameData";
import ModalUserLastnameData from "@/app/profile/components/lastnameData/modal/ModalUserLastnameData";
import ModalUserPasswordData from "@/app/profile/components/passwordData/modal/ModalUserPasswordData";
import ModalUserSendToken from "@/app/profile/components/emailSendTokenData/modal/ModalUserSendToken";
import EmailCheck from "@/app/profile/components/emailData/EmailData";
import ModalCloseEmail from "@/app/profile/components/emailData/modal/ModalCloseEmail";
import ModalDeleteAccount from "@/app/profile/components/deleteAccount/modal/ModalDeleteAccount";
import FormRegister from "../../register/formRegister";
import Forgot from "../../forgot/Forgot";
/* import SurMesureModal from "../../../../../test/app/rendez-vous/components/formule/components/SurMesureModal";
import ContractModal from "../../../../../test/app/rendez-vous/components/formule/components/ContractModal";
import ModalComfirmDeleteContrat from "../../../../../test/app/rendez-vous/components/take/modal/ModalComfirmDeleteContrat";
import ModalComfirmEditContrat from "../../../../../test/app/rendez-vous/components/take/modal/ModalComfirmEditContrat"; */

const Content = () => {
  const [cookieEnabled, setCookieEnabled] = useState<boolean>(true);
  const [closeCookieEnabled, setCloseCookieEnabled] = useState<boolean>(false);
  useEffect(() => {
    var cookie = navigator.cookieEnabled;
    if (!cookie) {
      setCookieEnabled(false);
    } else {
      setCookieEnabled(true);
    }
  }, []);
  const [displayLogMenu, setDisplayLogMenu] = useState<boolean>(false);

  const { isActive } = useSelector((state: RootState) => state.menu);
  useEffect(() => {
    if (document) {
      if (isActive === true) {
        let body = document.querySelector("body");
        let htmlElementRequiresChange = document.querySelectorAll(".modalOpen");
        htmlElementRequiresChange.forEach((tab) => {
          tab.setAttribute("tabindex", "-1");
        });
        if (body) {
          body.style.overflow = "hidden";
        }
      } else {
        let body = document.querySelector("body");
        let htmlElementRequiresChange = document.querySelectorAll(".modalOpen");
        htmlElementRequiresChange.forEach((tab) => {
          tab.setAttribute("tabindex", "0");
        });
        if (body) {
          if (displayLogMenu === false) {
            body.style.overflow = "unset";
          }
        }
      }
      if (displayLogMenu === true) {
        let body = document.querySelector("body");
        let htmlElementRequiresChange = document.querySelectorAll(".modalOpen");
        htmlElementRequiresChange.forEach((tab) => {
          tab.setAttribute("tabindex", "-1");
        });
        if (body) {
          body.style.overflow = "hidden";
        }
      } else {
        let body = document.querySelector("body");
        let htmlElementRequiresChange = document.querySelectorAll(".modalOpen");
        htmlElementRequiresChange.forEach((tab) => {
          tab.setAttribute("tabindex", "0");
        });
        if (body) {
          if (isActive === false) {
            body.style.overflow = "unset";
          }
        }
      }
    }
  }, [displayLogMenu, isActive]);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [onHoverLink, setOnHoverLink] = useState<string | null>(pathname);
  const { isMobile } = useSelector((state: RootState) => state.Mobile);
  /* useEffect(() => {
    const fetchCheckUser = async () => {
      let response = await fetch("/api/user/checkDelete");
      let json = await response.json();
    };
    fetchCheckUser();
  }, []); */

  const {
    trigger,
    data: dataLogout,
    reset,
  } = useSWRMutation("/components/header/api", fetchDelete);
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
  }, [dispatch, pathname, reset, router, dataLogout]);
  const { data, isLoading } = useGet("/components/header/api");
  useEffect(() => {
    console.log(data);
    if (data) {
      if (data.isLoggedIn === false) {
        if (pathname === "/profile") {
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
              className={`${styles.header__log__div} modalOpen`}
              onClick={() => {
                handlerClick();
              }}
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
              <div
                onClick={() => {
                  setDisplayLogMenu(!displayLogMenu);
                  if (isActive) {
                    dispatch({ type: "menu/closeMenu" });
                  }
                }}
                className={styles.header__log__div}
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
              </div>

              <>
                <div
                  className={`${styles.header__log__container} ${
                    displayLogMenu === true
                      ? styles.header__log__container__show
                      : styles.header__log__container__hide
                  }`}
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
                        src="/assets/logo/logo3.webp"
                        alt="logo tdss coaching"
                        priority={true}
                      />
                    </Link>
                  </div>
                  <div className={styles.line}></div>
                  <div className={styles.div}>
                    <ul
                      className={styles.header__log__ul}
                      onMouseLeave={() => setOnHoverLink(pathname)}
                    >
                      <li
                        className={`${styles.header__log__li} ${
                          styles.header__log__li__1
                        } ${
                          displayLogMenu === true
                            ? styles.header__log__li__show
                            : styles.header__log__li__hide
                        }`}
                        onMouseOver={() => setOnHoverLink("/profile")}
                      >
                        <Link
                          className={styles.header__log__li__link}
                          href="/profile"
                          onClick={() => setDisplayLogMenu(false)}
                        >
                          <div
                            className={`${styles.header__log__li__point} ${
                              onHoverLink === "/profile"
                                ? styles.header__log__li__point__show
                                : styles.header__log__li__point__hide
                            }`}
                          ></div>
                          Compte
                        </Link>
                      </li>
                      {/* <li
                      className={`${styles.header__log__li} ${
                        styles.header__log__li__2
                      } ${
                        displayLogMenu === true
                          ? styles.header__log__li__show
                          : styles.header__log__li__hide
                      }`}
                      onMouseOver={() => setOnHoverLink("/meetings")}
                    >
                      <Link
                        className={styles.header__log__li__link}
                        href="/meetings"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        <div
                          className={`${styles.header__log__li__point} ${
                            onHoverLink === "/meetings"
                              ? styles.header__log__li__point__show
                              : styles.header__log__li__point__hide
                          }`}
                        ></div>
                        Historique des rendez-vous
                      </Link>
                    </li> */}
                      {/* <li
                      className={`${styles.header__log__li} ${
                        styles.header__log__li__3
                      } ${
                        displayLogMenu === true
                          ? styles.header__log__li__show
                          : styles.header__log__li__hide
                      }`}
                      onMouseOver={() => setOnHoverLink("/meetingAdmin")}
                    >
                      <Link
                        className={styles.header__log__li__link}
                        href="/meetingAdmin"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        <div
                          className={`${styles.header__log__li__point} ${
                            onHoverLink === "/meetingAdmin"
                              ? styles.header__log__li__point__show
                              : styles.header__log__li__point__hide
                          }`}
                        ></div>
                        Calendrier
                      </Link>
                    </li> */}
                      <li
                        className={`${styles.header__log__li} ${
                          styles.header__log__li__4
                        } ${
                          displayLogMenu === true
                            ? styles.header__log__li__show
                            : styles.header__log__li__hide
                        }`}
                        onMouseOver={() => setOnHoverLink("/utilisateurs")}
                      >
                        <Link
                          className={styles.header__log__li__link}
                          href="/utilisateurs"
                          onClick={() => setDisplayLogMenu(false)}
                        >
                          <div
                            className={`${styles.header__log__li__point} ${
                              onHoverLink === "/utilisateurs"
                                ? styles.header__log__li__point__show
                                : styles.header__log__li__point__hide
                            }`}
                          ></div>
                          Tous les utilisateurs
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.line__bottom}></div>
                  <button
                    className={styles.header__log__btn}
                    onClick={() => {
                      setDisplayLogMenu(false);
                      const logout = async () => {
                        trigger(null, {
                          optimisticData: defaultSession,
                        });
                      };
                      setTimeout(() => {
                        logout();
                      }, 800);
                    }}
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            </div>
          </>
        );
      } else if (data.role === "ROLE_USER") {
        content = (
          <>
            <div className={styles.header__log}>
              <div
                onClick={() => {
                  setDisplayLogMenu(!displayLogMenu);
                  if (isActive) {
                    dispatch({ type: "menu/closeMenu" });
                  }
                }}
                className={styles.header__log__div}
              >
                <Image
                  className={styles.header__log__img}
                  width={25}
                  height={25}
                  src="/assets/icone/user-check-solid.svg"
                  alt="Icone utilisateur connecté"
                  priority={true}
                />
              </div>
              <>
                <div
                  className={`${styles.header__log__container} ${
                    displayLogMenu === true
                      ? styles.header__log__container__show
                      : styles.header__log__container__hide
                  }`}
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
                        src="/assets/logo/logo3.webp"
                        alt="logo tdss coaching"
                        priority={true}
                      />
                    </Link>
                  </div>
                  <div className={styles.line}></div>
                  <div className={styles.div}>
                    <ul
                      onMouseLeave={() => setOnHoverLink(pathname)}
                      className={`${styles.header__log__ul}`}
                    >
                      <li
                        onMouseOver={() => setOnHoverLink("/profile")}
                        className={`${styles.header__log__li} ${
                          styles.header__log__li__1
                        } ${
                          displayLogMenu === true
                            ? styles.header__log__li__show
                            : styles.header__log__li__hide
                        }`}
                      >
                        <Link
                          className={styles.header__log__li__link}
                          href="/profile"
                          onClick={() => setDisplayLogMenu(false)}
                        >
                          <div
                            className={`${styles.header__log__li__point} ${
                              onHoverLink === "/profile"
                                ? styles.header__log__li__point__show
                                : styles.header__log__li__point__hide
                            }`}
                          ></div>
                          Compte
                        </Link>
                      </li>
                      {/* <li
                      onMouseOver={() => setOnHoverLink("/historique")}
                      className={`${styles.header__log__li} ${
                        styles.header__log__li__2
                      } ${
                        displayLogMenu === true
                          ? styles.header__log__li__show
                          : styles.header__log__li__hide
                      }`}
                    >
                      <Link
                        className={styles.header__log__li__link}
                        href="/historique"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        <div
                          className={`${styles.header__log__li__point} ${
                            onHoverLink === "/historique"
                              ? styles.header__log__li__point__show
                              : styles.header__log__li__point__hide
                          }`}
                        ></div>
                        Historique des rendez-vous
                      </Link>
                    </li> */}
                      {/* <li
                      onMouseOver={() => setOnHoverLink("/rendez-vous")}
                      className={`${styles.header__log__li} ${
                        styles.header__log__li__3
                      } ${
                        displayLogMenu === true
                          ? styles.header__log__li__show
                          : styles.header__log__li__hide
                      }`}
                    >
                      <Link
                        className={styles.header__log__li__link}
                        href="/rendez-vous"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        <div
                          className={`${styles.header__log__li__point} ${
                            onHoverLink === "/rendez-vous"
                              ? styles.header__log__li__point__show
                              : styles.header__log__li__point__hide
                          }`}
                        ></div>
                        Mes rendez-vous
                      </Link>
                    </li> */}
                      {/*<li
                        onMouseOver={() => setOnHoverLink("/logout")}
                        className={`${styles.header__log__li} ${
                          styles.header__log__li__4
                        } ${
                          displayLogMenu === true
                            ? styles.header__log__li__show
                            : styles.header__log__li__hide
                        }`}
                      >
                        <span
                          className={styles.header__log__li__link}
                          onClick={() => {
                            setDisplayLogMenu(false);
                            const logout = async () => {
                              trigger(null, {
                                optimisticData: defaultSession,
                              });
                               let response = await fetch(
                              "/components/header/api",
                              {
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                              }
                            );
                            let json = await response.json();
                            if (json.status === 200) {
                              setTimeout(() => {
                                dispatch({
                                  type: "auth/logout",
                                });

                                mutate("/api/user/check", {
                                  ...json,
                                });
                                cache.delete("/api/user/check");
                                if (
                                  pathname === "/rendez-vous" ||
                                  pathname === "/historique" ||
                                  pathname === "/profile"
                                ) {
                                  router.push("/");
                                }
                                dispatch({
                                  type: "flash/storeFlashMessage",
                                  payload: {
                                    type: "error",
                                    flashMessage: json.message,
                                  },
                                });
                              }, 600);
                            } 
                            };

                            logout();
                          }}
                        >
                          <div
                            className={`${styles.header__log__li__point} ${
                              onHoverLink === "/logout"
                                ? styles.header__log__li__point__show
                                : styles.header__log__li__point__hide
                            }`}
                          ></div>
                          Déconnection
                        </span>
                          </li>*/}
                    </ul>
                  </div>
                  <div className={styles.line__bottom}></div>
                  <button
                    className={styles.header__log__btn}
                    onClick={() => {
                      setDisplayLogMenu(false);
                      const logout = async () => {
                        trigger(null, {
                          optimisticData: defaultSession,
                        });
                      };
                      setTimeout(() => {
                        logout();
                      }, 800);
                    }}
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            </div>
          </>
        );
      }
    }
  }

  const [isClick, setIsClick] = useState<boolean>(false);
  const { displayModalLogin } = useSelector(
    (state: RootState) => state.ModalLogin
  );
  const { displayModalRegister } = useSelector(
    (state: RootState) => state.ModalRegister
  );

  const { displayModalEditFirstname } = useSelector(
    (state: RootState) => state.ModalEditFirstname
  );
  const { displayModalEditLastname } = useSelector(
    (state: RootState) => state.ModalEditLastname
  );
  const { displayModalEditPassword } = useSelector(
    (state: RootState) => state.ModalEditPassword
  );
  const { displayModalSendTokenEmail } = useSelector(
    (state: RootState) => state.ModalSendTokenEmail
  );
  const { displayModalEditEmail } = useSelector(
    (state: RootState) => state.ModalEditEmail
  );
  const { displayModalCancelEmail } = useSelector(
    (state: RootState) => state.ModalCancelEmail
  );
  const { displayModalDeleteAccount } = useSelector(
    (state: RootState) => state.ModalDeleteAccount
  );
  const { displayModalForgot } = useSelector(
    (state: RootState) => state.ModalForgot
  );
  /*
  const { displayModalRegister } = useSelector(
    (state: RootState) => state.ModalRegister
  );
  const { displayModalEditFirstname } = useSelector(
    (state: RootState) => state.ModalEditFirstname
  );

  const { displayModalEditLastname } = useSelector(
    (state: RootState) => state.ModalEditLastname
  );
 
  
  
  const { displayModalEditTwoFactor } = useSelector(
    (state: RootState) => state.ModalEditTwoFactor
  );
  const { displayModalDeleteAccount } = useSelector(
    (state: RootState) => state.ModalDeleteAccount
  );
  const { displayModalDatePickerDiscovery } = useSelector(
    (state: RootState) => state.ModalDatePickerDiscovery
  );
  const { displayModalAddDiscoveryMeeting } = useSelector(
    (state: RootState) => state.ModalAddDiscoveryMeeting
  );
  const { displayModalAddMeeting } = useSelector(
    (state: RootState) => state.ModalAddMeeting
  );
  const { displayModalDatePickerEditDiscovery } = useSelector(
    (state: RootState) => state.ModalDatePickerEditDiscovery
  );
  const { displayModalDeleteDiscoveryMeeting } = useSelector(
    (state: RootState) => state.ModalDeleteDiscoveryMeeting
  );
  const { displayModalEditDiscoveryMeeting } = useSelector(
    (state: RootState) => state.ModalEditDiscoveryMeeting
  );
  const { displayModalEditFormule } = useSelector(
    (state: RootState) => state.ModalEditFormule
  );
  const { displayModalDatePicker } = useSelector(
    (state: RootState) => state.ModalDatePicker
  );
  const { displayModalCancelMeeting } = useSelector(
    (state: RootState) => state.ModalCancelMeeting
  );
  const { displayModalDatePickerEdit } = useSelector(
    (state: RootState) => state.ModalDatePickerEdit
  );
  const { displayModalEditMeeting } = useSelector(
    (state: RootState) => state.ModalEditMeeting
  );
  const { displayModalDeleteMeeting } = useSelector(
    (state: RootState) => state.ModalDeleteMeeting
  );
  const { displayModalAddMeetingAdmin } = useSelector(
    (state: RootState) => state.ModalAddMeetingAdmin
  );
  const { displayModalCancelTwoFactor } = useSelector(
    (state: RootState) => state.ModalCancelTwoFactor
  );
  
  const { displayModalComfirmDisableTwoFactor } = useSelector(
    (state: RootState) => state.ModalComfirmDisableTwoFactor
  );
  const { displayModalDiscovery } = useSelector(
    (state: RootState) => state.ModalDiscovery
  );
  const { displayModalNormal } = useSelector(
    (state: RootState) => state.ModalNormal
  );
  const { displayModalSurMesure } = useSelector(
    (state: RootState) => state.ModalSurMesure
  );
  const { displayModalContract } = useSelector(
    (state: RootState) => state.ModalContract
  );
  const { displayModalComfirmDeleteContrat } = useSelector(
    (state: RootState) => state.ModalComfirmDeleteContrat
  );
  const { displayModalComfirmEditContrat } = useSelector(
    (state: RootState) => state.ModalComfirmEditContrat
  ); */
  const { displayModalDiscovery } = useSelector(
    (state: RootState) => state.ModalDiscovery
  );
  const { displayModalNormal } = useSelector(
    (state: RootState) => state.ModalNormal
  );
  /* const { displayModalCancelMeeting } = useSelector(
    (state: RootState) => state.ModalCancelMeeting
  ); */
  /* const {
    displayFormCheck,
    displaySendCode,
    displayModalEditValidEmailData,
    displayModalDeleteMeeting,
    displayModalMeeting,
    displayModalCloseEmail,
    displayModalCancelFormule,
    displayModalEditMeeting,
    displayModalAddMeetingAdmin,
    displayModalDatePickerEdit,
  } = useSelector((state: RootState) => state.form); */

  const { flashMessage } = useSelector((state: RootState) => state.flash);
  const handlerClick = () => {
    dispatch({
      type: "ModalLogin/open",
    });
  };
  const classNameLine = () => {
    if (
      displayModalDiscovery === true ||
      displayModalNormal === true ||
      displayModalLogin === true ||
      displayModalEditFirstname === true ||
      displayModalEditLastname === true ||
      displayModalEditPassword === true ||
      displayModalSendTokenEmail === true ||
      displayModalEditEmail === true ||
      displayModalCancelEmail === true ||
      displayModalDeleteAccount === true ||
      displayModalForgot === true ||
      displayModalRegister === true
    ) {
      return `${styles.line__hide}`;
    } else {
      return `${styles.line__show}`;
    }
  };

  useEffect(() => {
    if (document) {
      let mainDiv = document.querySelector("main");
      let footerDiv = document.querySelector("footer");
      let htlmElement = document.querySelector("html");
      let htlmbody = document.querySelector("body");
      let header = document.querySelector("header");

      if (mainDiv && footerDiv && htlmElement && htlmbody && header) {
        if (
          displayModalDiscovery === true ||
          displayModalNormal === true ||
          displayModalLogin === true ||
          displayModalEditFirstname === true ||
          displayModalEditLastname === true ||
          displayModalEditPassword === true ||
          displayModalSendTokenEmail === true ||
          displayModalEditEmail === true ||
          displayModalCancelEmail === true ||
          displayModalDeleteAccount === true ||
          displayModalForgot === true ||
          displayModalRegister === true
        ) {
          /* header.style.opacity = "0.02";
          mainDiv.style.opacity = "0.02";
          footerDiv.style.opacity = "0.02";
          htlmElement.style.height = "100%";
          htlmbody.style.height = "100%"; */
          htlmbody.style.overflowY = "hidden";
        } else {
          /* mainDiv.style.opacity = "1";
          header.style.opacity = "1";
          footerDiv.style.opacity = "1";
          htlmElement.style.height = "100%";
          htlmbody.style.height = "100%"; */
          htlmbody.style.overflowY = "unset";
        }
      }
    }
  }, [
    displayModalDiscovery,
    displayModalLogin,
    displayModalNormal,
    displayModalEditFirstname,
    displayModalEditLastname,
    displayModalEditPassword,
    displayModalSendTokenEmail,
    displayModalEditEmail,
    displayModalCancelEmail,
    displayModalDeleteAccount,
    displayModalForgot,
    displayModalRegister,
  ]);

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1201) {
      } else {
        if (isActive) {
          dispatch({
            type: "menu/closeMenu",
          });
        }
        setIsClick(false);
      }
    });
  }

  /*   useEffect(() => {
    if (document) {
      let body = document.querySelector("body");
      if (body) {
        if (isActive === true) {
          if (window.innerWidth < 601) {
            body.style.overflow = "hidden";
            body.style.height = "100vh";
          } else {
            body.style.overflow = "hidden";
            body.style.height = "unset";
          }
        } else {
          body.style.overflow = "unset";
          body.style.height = "unset";
        }
      }
    }
  }, [isActive]); */
  useEffect(() => {
    if (flashMessage && flashMessage[1].length > 0) {
      let timer = setTimeout(() => {
        dispatch({
          type: "flash/clearFlashMessage",
        });
      }, 10000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [dispatch, flashMessage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        if (isMobile === false || isMobile === null) {
          //setMobile(true);
          dispatch({
            type: "Mobile/isMobile",
          });
        }
      } else {
        if (isMobile === true || isMobile === null) {
          //setMobile(false);
          dispatch({
            type: "Mobile/notMobile",
          });
        }
      }
    }
  }, [dispatch, isMobile]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        if (window.innerWidth < 768) {
          if (isMobile === false || isMobile === null) {
            dispatch({
              type: "Mobile/isMobile",
            });
            //setMobile(true);
          }
        } else {
          if (isMobile === true || isMobile === null) {
            dispatch({
              type: "Mobile/notMobile",
            });
            //setMobile(false);
          }
        }
      });
    }
  }, [dispatch, isMobile]);
  return (
    <>
      <FormLogin />
      {typeof window !== "undefined" &&
        window.location.pathname === "/profile" && (
          <>
            <ModalUserFirstnameData />
            <ModalUserLastnameData />
            <ModalUserPasswordData />
            <ModalUserSendToken />
            {/* <ModalTwoFactorSendToken />
            <ModalComfirmDisable /> */}
            <EmailCheck />
            <ModalCloseEmail />
            <ModalDeleteAccount />
            {/* <ModalTwoFactor /> 
            <ModalCloseTwoFactor />*/}
            {/* <ModalUserLastnameData />
            
            
            <EmailCheck />
            <ModalCloseEmail />
            <ModalTwoFactor />
            <ModalDeleteAccount />
            <ModalCloseTwoFactor />
             */}
          </>
        )}
      <FormRegister />
      <Forgot />
      {/* <FormLogin />
      <FormRegister />
      <Forgot /> */}

      {/* <ModalDatePickerDiscoveryMobile /> */}
      {/* <ModalDatePickerDiscovery />
      <ModalAddDiscoveryMeeting />
      <ModalDeleteDiscoveryMeeting />
      <ModalEditDiscoveryMeeting />
      <ModalDatePickerEditDiscovery />
      <ModalDatePicker />
      <ModalAddMeeting />
      <ModalCancelMeeting />
      <ModalDatePickerEdit />
      <ModalEditMeeting />
      <ModalDeleteMeeting />
      <ModalAddMeetingAdmin />
      
      <DiscoveryModal />
      
      <SurMesureModal />
      <ContractModal />
      <ModalComfirmDeleteContrat />
      <ModalComfirmEditContrat />

      <ModalEditFormuleUser />
      <ModalCancelMeeting />
      <ModalDatePickerEditDesktop /> */}
      <NormalModal />
      <DiscoveryModal />
      <AnimatePresence>
        {flashMessage && flashMessage[1].length > 0 && (
          <>
            <motion.div
              className={`${`flash__modal__${flashMessage[0]}`} ${`flash__modal__standard`}`}
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{
                y: -20,
                x: "-50%",
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                y: 200,
                x: "-50%",
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <Image
                className={`flash__modal__standard__img`}
                width={25}
                height={25}
                src="/assets/icone/circle-exclamation-solid.svg"
                alt="logo tdss coaching"
                priority={true}
              />
              {flashMessage[1]}{" "}
              <span
                onClick={() => {
                  dispatch({
                    type: "flash/clearFlashMessage",
                  });
                }}
                className={`${`flash__modal__standard__span`} ${`flash__modal__standard__span__${flashMessage[0]}`}`}
              >
                &times;
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <header className={styles.header}>
        {cookieEnabled === false && closeCookieEnabled === false && (
          <>
            <div className={styles.header__nocookie}>
              <button
                className={styles.header__nocookie__btn}
                onClick={() => setCloseCookieEnabled(true)}
              >
                <Image
                  className={styles.header__nocookie__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>

              <p>
                Pour utiliser ce site, vous devez activer les cookies dans les
                paramètres de votre navigateur.
              </p>
            </div>
          </>
        )}
        <div className={styles.header__div}>
          <figure className={styles.header__figure}>
            <Link className="link modalOpen" href="/" tabIndex={0}>
              <Image
                className={styles.header__logo}
                width={0}
                height={0}
                sizes="100vw"
                //src="/assets/logo/logo3.png"
                src="/assets/logo/logo3.webp"
                alt="logo tdss coaching"
                priority={true}
              />
            </Link>
            <figcaption className={styles.header__figcaption}>
              Coach de vie
            </figcaption>
          </figure>
          <nav
            className={
              isClick === false
                ? `${styles.header__nav}`
                : `${styles.header__nav__mobile}`
            }
          >
            <ul
              className={
                isClick === false
                  ? `${styles.header__ul}`
                  : `${styles.header__ul__mobile}`
              }
            >
              <li className={styles.header__li}>
                <Link
                  className={
                    pathname == "/"
                      ? `${styles.header__a} ${styles.active} modalOpen`
                      : `${styles.header__a} modalOpen`
                  }
                  tabIndex={0}
                  href="/"
                  onClick={(e) => {
                    displayLogMenu === true ? setDisplayLogMenu(false) : null;
                  }}
                >
                  Accueil
                </Link>
              </li>
              <li className={styles.header__li}>
                <Link
                  className={
                    pathname == "/qui-suis-je"
                      ? `${styles.header__a} ${styles.active} modalOpen`
                      : `${styles.header__a} modalOpen`
                  }
                  tabIndex={0}
                  href="/qui-suis-je"
                  onClick={(e) => {
                    displayLogMenu === true ? setDisplayLogMenu(false) : null;
                  }}
                >
                  Qui suis-je ?
                </Link>
              </li>
              <li className={`${styles.header__li}`}>
                <Link
                  className={
                    pathname == "/coaching-de-vie"
                      ? `${styles.header__a} ${styles.active} modalOpen`
                      : `${styles.header__a} modalOpen`
                  }
                  tabIndex={0}
                  href="/coaching-de-vie"
                  onClick={(e) => {
                    displayLogMenu === true ? setDisplayLogMenu(false) : null;
                  }}
                >
                  Coaching de vie
                </Link>
                {/* <span className={`${styles.header__a}`}>Coaching de vie</span>
              <span
                tabIndex={0}
                aria-label="sous menu coaching de vie"
                className={styles.header__span}
                aria-haspopup="true"
                aria-expanded="false"
              >
                ❯
              </span>
              <ul
                role="listbox"
                className={`${styles.header__ul__hidden} ${styles.header__ul__hidden__hover}`}
                aria-expanded="true"
                aria-activedescendant="option1"
              >
                <li className={styles.header__li}>
                  <Link
                    className={
                      pathname == "/coaching-de-vie/vie-familiale"
                        ? `${styles.header__a} ${styles.active}`
                        : `${styles.header__a}`
                    }
                    tabIndex={0}
                    href="/coaching-de-vie/vie-familiale"
                    onClick={(e) => {
                      displayLogMenu === true ? setDisplayLogMenu(false) : null;
                    }}
                  >
                    Vie familiale
                  </Link>
                </li>
                <li className={styles.header__li}>
                  <Link
                    className={
                      pathname == "/coaching-de-vie/vie-de-couple"
                        ? `${styles.header__a} ${styles.active}`
                        : `${styles.header__a}`
                    }
                    tabIndex={0}
                    href="/coaching-de-vie/vie-de-couple"
                    onClick={(e) => {
                      displayLogMenu === true ? setDisplayLogMenu(false) : null;
                    }}
                  >
                    Vie de couple
                  </Link>
                </li>
                <li className={styles.header__li}>
                  <Link
                    className={
                      pathname == "/coaching-de-vie/vie-professionnelle"
                        ? `${styles.header__a} ${styles.active}`
                        : `${styles.header__a}`
                    }
                    tabIndex={0}
                    href="/coaching-de-vie/vie-professionnelle"
                    onClick={(e) => {
                      displayLogMenu === true ? setDisplayLogMenu(false) : null;
                    }}
                  >
                    Vie professionnelle
                  </Link>
                </li>
              </ul> */}
              </li>
              <li className={styles.header__li}>
                <Link
                  className={
                    pathname == "/tarif"
                      ? `${styles.header__a} ${styles.active} modalOpen`
                      : `${styles.header__a} modalOpen`
                  }
                  tabIndex={0}
                  href="/tarif"
                  onClick={(e) => {
                    displayLogMenu === true ? setDisplayLogMenu(false) : null;
                  }}
                >
                  Tarifs et modalité
                </Link>
              </li>
              {/* <li className={`${styles.header__li} ${styles.header__li__hover}`}>
              <span className={`${styles.header__a}`}>Mes prestations</span>
              <span
                tabIndex={0}
                aria-label="sous menu mes prestations"
                className={styles.header__span}
                aria-haspopup="true"
                aria-expanded="false"
              >
                ❯
              </span>
              <ul
                role="listbox"
                className={`${styles.header__ul__hidden} ${styles.header__ul__hidden__hover}`}
                aria-expanded="true"
                aria-activedescendant="option2"
              >
                <li className={styles.header__li}>
                  <Link
                    className={
                      pathname == "/modalite"
                        ? `${styles.header__a} ${styles.active}`
                        : `${styles.header__a}`
                    }
                    tabIndex={0}
                    href="/modalite"
                    onClick={(e) => {
                      displayLogMenu === true ? setDisplayLogMenu(false) : null;
                    }}
                  >
                    {" "}
                    Modalités du coaching
                  </Link>
                </li>
                <li className={styles.header__li}>
                  <Link
                    className={
                      pathname == "/tarif"
                        ? `${styles.header__a} ${styles.active}`
                        : `${styles.header__a}`
                    }
                    tabIndex={0}
                    href="/tarif"
                    onClick={(e) => {
                      displayLogMenu === true ? setDisplayLogMenu(false) : null;
                    }}
                  >
                    Tarif
                  </Link>
                </li>
                <li className={styles.header__li}>
                  <Link
                    className={
                      pathname == "/code-de-deontologie"
                        ? `${styles.header__a} ${styles.active}`
                        : `${styles.header__a}`
                    }
                    tabIndex={0}
                    href="/assets/pdf/Code-deontologie-ICF-France.pdf"
                    target="_blank"
                    onClick={(e) => {
                      displayLogMenu === true ? setDisplayLogMenu(false) : null;
                    }}
                  >
                    Code de déontologie
                  </Link>
                </li>
              </ul>
            </li> */}
              <li className={styles.header__li}>
                <Link
                  className={
                    pathname == "/contact"
                      ? `${styles.header__a} ${styles.active} modalOpen`
                      : `${styles.header__a} modalOpen`
                  }
                  href="/contact"
                  onClick={(e) => {
                    displayLogMenu === true ? setDisplayLogMenu(false) : null;
                  }}
                >
                  Contact
                </Link>
              </li>
            </ul>
            {/* //cookieEnabled === true && */}
            {cookieEnabled === true && content}
          </nav>
          <div
            className={`${
              cookieEnabled === true
                ? styles.main
                : cookieEnabled === false && isActive === false
                ? styles.main
                : closeCookieEnabled === true
                ? styles.main__top__test
                : styles.main__top
            } ${styles.main__test}`}
          >
            <div className={styles.headerr}>
              <button
                tabIndex={0}
                onClick={() => {
                  if (displayLogMenu === true) {
                    setDisplayLogMenu(false);
                    setTimeout(() => {
                      dispatch({
                        type: "menu/toggleMenu",
                      });
                    }, 500);
                  } else {
                    dispatch({
                      type: "menu/toggleMenu",
                    });
                  }
                }}
                className={`${styles.button} modalOpen`}
              >
                <div
                  className={`${styles.burger} ${
                    isActive ? styles.burgerActive : ""
                  }`}
                ></div>
              </button>
            </div>
          </div>
          <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
        </div>

        {/* <button
          className={styles.header__burger__btn}
          onClick={() => {
            toggleOpen();
            //updateUseState();
          }}
        >
          <div className={styles.header__burger__line}>
            <span
              className={
                displayLogMenu
                  ? `${styles.header__cross} ${styles.header__bar1__rotate}`
                  : `${styles.header__bar} ${styles.header__bar1}`
              }
            ></span>
            <span
              className={
                displayLogMenu
                  ? ""
                  : `${styles.header__bar} ${styles.header__bar2}`
              }
            ></span>
            <span
              className={
                displayLogMenu
                  ? `${styles.header__cross} ${styles.header__bar2__rotate}`
                  : `${styles.header__bar} ${styles.header__bar3}`
              }
            ></span>
          </div>
        </button> */}
      </header>
      <div className={classNameLine()}></div>
    </>
  );
};

export default Content;
