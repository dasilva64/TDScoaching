"use client";

import styles from "../header.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import EmailCheck from "@/app/profile/components/emailData/EmailData";
import ModalUserSendToken from "@/app/profile/components/emailSendTokenData/modal/ModalUserSendToken";
import ModalUserPasswordData from "@/app/profile/components/passwordData/modal/ModalUserPasswordData";
import Forgot from "../../forgot/Forgot";
import FormLogin from "../../login/formLogin";
import FormRegister from "../../register/formRegister";
import ModalDeleteAccount from "@/app/profile/components/deleteAccount/modal/ModalDeleteAccount";
import ModalCloseEmail from "@/app/profile/components/emailData/modal/ModalCloseEmail";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "../components/Nav";
import ModalUserFirstnameData from "@/app/profile/components/firstnameData/modal/ModalUserFirstnameData";
import ModalUserLastnameData from "@/app/profile/components/lastnameData/modal/ModalUserLastnameData";
import useGet from "../../hook/useGet";
import { mutate } from "swr";
import ModalEditFormuleUser from "@/app/rendez-vous/components/take/modal/ModalEditFormule";
import ModalCancelMeeting from "@/app/rendez-vous/components/not-comfirm/modal/ModalCancelMeeting";
import ModalDatePickerEditDesktop from "@/app/rendez-vous/components/my-meeting/modal/ModalDatePickerEdit";
import ModalAddDiscoveryMeeting from "@/app/rendez-vous/components/takeDiscovery/modal/ModalAddDiscoveryMeeting";
import ModalDeleteDiscoveryMeeting from "@/app/rendez-vous/components/my-discovery-meeting/modal/ModalDeleteDiscoveryMeeting";
import ModalDatePicker from "@/app/rendez-vous/components/take/modal/ModalDatePicker";
import ModalAddMeeting from "@/app/rendez-vous/components/take/modal/ModalAddMeeting";
import ModalEditDiscoveryMeeting from "@/app/rendez-vous/components/my-discovery-meeting/modal/ModalEditDiscoveryMeeting";
import ModalDatePickerDiscovery from "@/app/rendez-vous/components/takeDiscovery/modal/ModalDatePickerDiscovery";
import ModalDatePickerEditDiscovery from "@/app/rendez-vous/components/my-discovery-meeting/modal/ModalDatePickerEditDiscovery";
import ModalDatePickerEdit from "@/app/rendez-vous/components/my-meeting/modal/ModalDatePickerEdit";
import ModalEditMeeting from "@/app/rendez-vous/components/my-meeting/modal/ModalEditMeeting";
import ModalDeleteMeeting from "@/app/rendez-vous/components/my-meeting/modal/ModalDeleteMeeting";
import ModalAddMeetingAdmin from "@/app/meetingAdmin/components/modal/ModalAddMeetingAdmin";
import ModalCloseTwoFactor from "@/app/profile/components/twoFactorData/modal/ModalCloseTwoFactor";
import ModalTwoFactorSendToken from "@/app/profile/components/twoFactorSendTokenData/Modal/ModalTwoFactorSendToken";
import ModalTwoFactor from "@/app/profile/components/twoFactorData/ModalTwoFactor";

const Content = () => {
  const { isActive } = useSelector((state: RootState) => state.menu);
  const [displayLogMenu, setDisplayLogMenu] = useState<boolean>(false);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [onHoverLink, setOnHoverLink] = useState<string | null>(pathname);
  const router = useRouter();
  const { isMobile } = useSelector((state: RootState) => state.Mobile);
  /* useEffect(() => {
    const fetchCheckUser = async () => {
      let response = await fetch("/api/user/checkDelete");
      let json = await response.json();
    };
    fetchCheckUser();
  }, []); */

  const { data, isLoading, isError } = useGet("/api/user/check");
  useEffect(() => {
    if (data) {
      if (data.body !== null) {
        dispatch({
          type: "auth/login",
          payload: {
            role: data.body.role,
            id: data.body.id,
          },
        });
      }
    }
  }, [data, dispatch]);
  let content;
  if (isError) {
    content = <div>Erreur</div>;
  }
  if (isLoading) {
    content = <div className={styles.header__login__load}></div>;
  }
  if (data) {
    if (data.body === null) {
      content = (
        <button
          type="button"
          className={styles.header__login}
          onClick={() => {
            handlerClick();
          }}
        >
          Se connecter
        </button>
      );
    } else {
      if (data.body.role === "ROLE_ADMIN") {
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
              ></div>
              <>
                <div
                  className={`${styles.header__log__container} ${
                    displayLogMenu === true
                      ? styles.header__log__container__show
                      : styles.header__log__container__hide
                  }`}
                >
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
                    <li
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
                    </li>
                    <li
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
                        Tous les rendez-vous
                      </Link>
                    </li>
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
                    <li
                      className={`${styles.header__log__li} ${
                        styles.header__log__li__5
                      } ${
                        displayLogMenu === true
                          ? styles.header__log__li__show
                          : styles.header__log__li__hide
                      }`}
                      onMouseOver={() => setOnHoverLink("/logout")}
                    >
                      <span
                        className={styles.header__log__li__link}
                        onClick={() => {
                          const logout = async () => {
                            let response = await fetch("/api/user/logout");
                            let json = await response.json();
                            if (json && json.status === 200) {
                              dispatch({
                                type: "auth/logout",
                              });
                              dispatch({
                                type: "flash/storeFlashMessage",
                                payload: {
                                  type: "error",
                                  flashMessage: json.message,
                                },
                              });
                              mutate("/api/user/check", {
                                ...json,
                              });
                              if (
                                pathname === "/profile" ||
                                pathname === "/meetings" ||
                                pathname === "/meetingAdmin" ||
                                pathname === "/utilisateurs"
                              ) {
                                router.push("/");
                              }
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
                    </li>
                  </ul>
                </div>
              </>
            </div>
          </>
        );
      } else if (data.body.role === "ROLE_USER") {
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
              ></div>
              <>
                <div
                  className={`${styles.header__log__container} ${
                    displayLogMenu === true
                      ? styles.header__log__container__show
                      : styles.header__log__container__hide
                  }`}
                >
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
                    <li
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
                    </li>
                    <li
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
                    </li>
                    <li
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
                          const logout = async () => {
                            let response = await fetch("/api/user/logout");
                            let json = await response.json();
                            if (json && json.status === 200) {
                              dispatch({
                                type: "auth/logout",
                              });
                              dispatch({
                                type: "flash/storeFlashMessage",
                                payload: {
                                  type: "error",
                                  flashMessage: json.message,
                                },
                              });
                              mutate("/api/user/check", {
                                ...json,
                              });
                              if (
                                pathname === "/profile" ||
                                pathname === "/historique" ||
                                pathname === "/rendez-vous"
                              ) {
                                router.push("/");
                              }
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
                    </li>
                  </ul>
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
  const { displayModalSendTokenTwoFactor } = useSelector(
    (state: RootState) => state.ModalSendTokenTwoFactor
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
      displayModalSendTokenTwoFactor === true ||
      displayModalCancelTwoFactor === true ||
      displayModalAddMeetingAdmin === true ||
      displayModalDeleteMeeting === true ||
      displayModalEditMeeting === true ||
      displayModalDatePickerEdit === true ||
      displayModalAddMeeting === true ||
      displayModalDatePicker === true ||
      displayModalEditDiscoveryMeeting === true ||
      displayModalDatePickerEditDiscovery === true ||
      displayModalLogin === true ||
      displayModalRegister === true ||
      displayModalDatePickerDiscovery === true ||
      displayModalEditFirstname === true ||
      displayModalEditLastname === true ||
      displayModalEditPassword === true ||
      displayModalSendTokenEmail === true ||
      displayModalEditEmail === true ||
      displayModalEditTwoFactor === true ||
      displayModalCancelMeeting === true ||
      displayModalDeleteAccount === true ||
      displayModalAddDiscoveryMeeting === true ||
      displayModalDeleteDiscoveryMeeting === true ||
      displayModalEditFormule === true
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
          displayModalSendTokenTwoFactor === true ||
          displayModalCancelTwoFactor === true ||
          displayModalAddMeetingAdmin === true ||
          displayModalDeleteMeeting === true ||
          displayModalEditMeeting === true ||
          displayModalDatePickerEdit === true ||
          displayModalAddMeeting === true ||
          displayModalDatePicker === true ||
          displayModalEditDiscoveryMeeting === true ||
          displayModalDatePickerEditDiscovery === true ||
          displayModalLogin === true ||
          displayModalRegister === true ||
          displayModalDatePickerDiscovery === true ||
          displayModalEditFirstname === true ||
          displayModalEditLastname === true ||
          displayModalEditPassword === true ||
          displayModalSendTokenEmail === true ||
          displayModalEditEmail === true ||
          displayModalEditTwoFactor === true ||
          displayModalCancelMeeting === true ||
          displayModalDeleteAccount === true ||
          displayModalAddDiscoveryMeeting === true ||
          displayModalDeleteDiscoveryMeeting === true ||
          displayModalEditFormule === true
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
    displayModalSendTokenEmail,
    displayModalLogin,
    displayModalRegister,
    displayModalEditPassword,
    displayModalEditEmail,
    displayModalEditTwoFactor,
    displayModalCancelMeeting,
    displayModalDeleteAccount,
    displayModalEditLastname,
    displayModalAddDiscoveryMeeting,
    displayModalDeleteDiscoveryMeeting,
    displayModalEditFormule,
    displayModalDatePicker,
    displayModalEditFirstname,
    displayModalDatePickerDiscovery,
    displayModalDatePickerEditDiscovery,
    displayModalEditDiscoveryMeeting,
    displayModalAddMeeting,
    displayModalDatePickerEdit,
    displayModalEditMeeting,
    displayModalDeleteMeeting,
    displayModalAddMeetingAdmin,
    displayModalCancelTwoFactor,
    displayModalSendTokenTwoFactor,
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
      <FormRegister />
      <Forgot />
      <ModalUserFirstnameData />
      <ModalUserLastnameData />
      <ModalUserPasswordData />
      <ModalUserSendToken />
      <EmailCheck />
      <ModalCloseEmail />
      <ModalTwoFactor />
      <ModalDeleteAccount />
      <ModalCloseTwoFactor />
      <ModalTwoFactorSendToken />

      {/* <ModalDatePickerDiscoveryMobile /> */}
      <ModalDatePickerDiscovery />
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

      {/* <ModalAddMeeting /> */}
      {/* <ModalDeleteFirstMeeting /> */}
      {/* {mobile === true ? null : <DatePickerEditDesktop />}
      {mobile === true ? null : <ModalEditMeeting />} */}
      <ModalEditFormuleUser />
      <ModalCancelMeeting />
      <ModalDatePickerEditDesktop />
      {/* <DisplayModal
        state={displayModalCancelMeeting}
        textClassName="displayModalCancelMeeting"
        component={<ModalCancel />}
        componentFake={<ModalCancelFake />}
      />
      <DisplayModal
        state={displayModalDeleteMeeting}
        textClassName="displayModalDeleteMeeting"
        component={<ModalDeleteMeeting />}
        componentFake={<ModalDeleteMeetingFake />}
      />

      <DisplayModal
        state={displayModalDatePicker}
        textClassName="displayModalDatePicker"
        component={
          mobile === true ? <DatePickerMobile /> : <DatePickerDesktop />
        }
        componentFake={<ModalDeleteMeetingFake />}
      /> */}
      {/* {displayModalTwoFactorCode === true && <ModalTwoFactorCode />} */}
      {/* {displayModalCancelMeeting === true && <ModalCancel />} */}
      {/* {displayModalDeleteMeeting === true && <ModalDeleteMeeting />} */}
      {/* {displayModalMeeting === true && <ModalAddMeeting />} */}
      {/* {displayModalDeleteDiscoveryMeeting === true && <ModalDeleteFirstMeeting />} */}
      {/* {displayModalEditFormule === true && <ModalEditFormuleUser />} */}
      {/* {displayModalCancelFormule === true && <ModalCancelFormuleUser />} */}
      {/* {displayModalEditMeeting === true && <ModalEditMeeting />} */}

      {/* <DisplayModal
        state={displayModalAddMeetingAdmin}
        textClassName="displayModalAddMeetingAdmin"
        component={<ModalAddMeetingAdmin />}
        componentFake={<ModalDeleteMeetingFake />}
      /> */}
      {/* {displayModalAddMeetingAdmin === true && <ModalAddMeetingAdmin />} */}

      <AnimatePresence>
        {flashMessage && flashMessage[1].length > 0 && (
          <>
            <motion.div
              className={`${`flash__modal__${flashMessage[0]}`} ${`flash__modal__standard`}`}
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
              exit={{ y: 200, opacity: 0, transition: { duration: 0.3 } }}
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
        <figure className={styles.header__figure}>
          <Link className="link" href="/" tabIndex={0}>
            <Image
              className={styles.header__logo}
              width={0}
              height={0}
              sizes="100vw"
              src="/assets/logo/logo.png"
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
                    ? `${styles.header__a} ${styles.active}`
                    : `${styles.header__a}`
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
                    ? `${styles.header__a} ${styles.active}`
                    : `${styles.header__a}`
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
            <li className={`${styles.header__li} ${styles.header__li__hover}`}>
              <span className={`${styles.header__a}`}>Coaching de vie</span>
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
              </ul>
            </li>
            <li className={`${styles.header__li} ${styles.header__li__hover}`}>
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
                    Tarif / Durée
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
                    href="/code-de-deontologie"
                    onClick={(e) => {
                      displayLogMenu === true ? setDisplayLogMenu(false) : null;
                    }}
                  >
                    Code de déontologie
                  </Link>
                </li>
              </ul>
            </li>
            <li className={styles.header__li}>
              <Link
                className={
                  pathname == "/contact"
                    ? `${styles.header__a} ${styles.active}`
                    : `${styles.header__a}`
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
          {content}
        </nav>

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
        <div className={styles.main}>
          <div className={styles.headerr}>
            <div
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
              className={styles.button}
            >
              <div
                className={`${styles.burger} ${
                  isActive ? styles.burgerActive : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
      </header>
      <div className={classNameLine()}></div>
    </>
  );
};

export default Content;
