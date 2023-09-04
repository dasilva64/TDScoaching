"use client";

import styles from "../header.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { usePathname } from "next/navigation";
import Image from "next/image";
import EmailCheck from "@/app/profile/components/emailData/EmailData";
import ModalUserSendToken from "@/app/profile/components/emailSendTokenData/modal/ModalUserSendToken";
import ModalUserPasswordData from "@/app/profile/components/passwordData/modal/ModalUserPasswordData";
import ModalTwoFactorDisable from "@/app/profile/components/twoFactorData/modal/ModalTwoFactorDisable";
import ModalTwoFactor from "@/app/profile/components/twoFactorData/modal/ModalTwoFactorUser";
import ModalCancel from "@/app/rendez-vous/components/meeting/modal/ModalCancel";
import Forgot from "../../forgot/Forgot";
import FormLogin from "../../login/formLogin";
import FormRegister from "../../register/formRegister";
import SendCode from "../../sendCode/SendCode";
import ModalAddMeeting from "@/app/rendez-vous/components/modal/ModalAddMeeting";
import ModalDeleteMeeting from "@/app/rendez-vous/components/meeting/modal/ModalDeleteMeeting";
import ModalDeleteAccount from "@/app/profile/components/deleteAccount/modal/ModalDeleteAccount";
import ModalCloseEmail from "@/app/profile/components/emailData/modal/ModalCloseEmail";
import { AnimatePresence } from "framer-motion";
import Nav from "../components/Nav";
import ModalUserFirstnameData from "@/app/profile/components/firstnameData/modal/ModalUserFirstnameData";
import ModalUserLastnameData from "@/app/profile/components/lastnameData/modal/ModalUserLastnameData";
import ModalAddFirstMeeting from "@/app/rendez-vous/components/modal/ModalAddDiscoveryMeeting";
import ModalDeleteFirstMeeting from "@/app/rendez-vous/components/meeting/modal/ModalDeleteDiscoveryMeeting";
import ModalEditFormuleUser from "@/app/rendez-vous/components/modal/ModalEditFormuleUser";
import ModalCancelFormuleUser from "@/app/rendez-vous/components/modal/ModalCancelFormuleUser";
import useGet from "../../hook/useGet";
import ModalAddMeetingAdmin from "@/app/meetingAdmin/components/modal/ModalAddMeetingAdmin";
import ModalEditMeeting from "@/app/rendez-vous/components/modal/ModalEditMeeting";

const Content = () => {
  const { isActive } = useSelector((state: RootState) => state.menu);
  const [displayLogMenu, setDisplayLogMenu] = useState<boolean>(false);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [scroll, setScroll] = useState<boolean>(false);

  /* useEffect(() => {
    const fetchCheckUser = async () => {
      let response = await fetch("/api/user/checkDelete");
      let json = await response.json();
    };
    fetchCheckUser();
  }, []); */
  let content = (
    <button
      type="button"
      className={styles.header__login}
      onClick={() => {
        handlerClick();
        let body = document.body;
        let test = body?.scrollHeight;
      }}
    >
      Se connecter
    </button>
  );

  /* const { data, isLoading, isError } = useGet("/api/user/check");
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
            let body = document.body;
            let test = body?.scrollHeight;
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
              {displayLogMenu === true && (
                <>
                  <ul className={styles.header__log__ul}>
                    <li className={styles.header__log__li}>
                      <Link
                        href="/profile"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        Compte
                      </Link>
                    </li>
                    <li className={styles.header__log__li}>
                      <Link
                        href="/meetings"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        Historique des rendez-vous
                      </Link>
                    </li>
                    <li className={styles.header__log__li}>
                      <Link
                        href="/meetingAdmin"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        Tous les rendez-vous
                      </Link>
                    </li>
                    <li className={styles.header__log__li}>
                      <Link
                        href="/utilisateurs"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        Tous les utilisateurs
                      </Link>
                    </li>
                    <li className={styles.header__log__li}>
                      <button
                        onClick={() => {
                          const logout = async () => {
                            let response = await fetch("/api/user/logout");
                            let json = await response.json();
                            if (json && json.status === 200) {
                              dispatch({
                                type: "auth/logout",
                              });
                              window.location.reload();
                            }
                          };
                          logout();
                        }}
                      >
                        Déconnection
                      </button>
                    </li>
                  </ul>
                </>
              )}
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
              {displayLogMenu === true && (
                <>
                  <ul className={styles.header__log__ul}>
                    <li className={styles.header__log__li}>
                      <Link
                        href="/profile"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        Compte
                      </Link>
                    </li>
                    <li className={styles.header__log__li}>
                      <Link
                        href="/historique"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        Historique des rendez-vous
                      </Link>
                    </li>
                    <li className={styles.header__log__li}>
                      <Link
                        href="/rendez-vous"
                        onClick={() => setDisplayLogMenu(false)}
                      >
                        Mes rendez-vous
                      </Link>
                    </li>
                    <li className={styles.header__log__li}>
                      <button
                        onClick={() => {
                          const logout = async () => {
                            let response = await fetch("/api/user/logout");
                            let json = await response.json();
                            if (json && json.status === 200) {
                              dispatch({
                                type: "auth/logout",
                              });
                              window.location.reload();
                            }
                          };
                          logout();
                        }}
                      >
                        Déconnection
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </>
        );
      }
    }
  } */

  const [isClick, setIsClick] = useState<boolean>(false);
  const {
    displayFormLogin,
    displayFormRegister,
    displayFormCheck,
    displaySendCode,
    displayModalEditPasswordData,
    displayModalEditFirstnameUserData,
    displayModalEditLastnameUserData,
    displayModalEditBirthUserData,
    displayFormForgot,
    displayModalEditGenderUserData,
    displayModalEditEmailSendData,
    displayModalEditEmailData,
    displayModalEditValidEmailData,
    displayModalEditPhoneData,
    displayModalDeleteMeeting,
    displayModalEditPhoneSendData,
    displayModalEditValidPhoneData,
    displayModalTwoFactor,
    displayModalTwoFactorDisable,
    displayModalCancelMeeting,
    displayModalMeeting,
    displayModalFirstMeeting,
    displayModalDeleteAccount,
    displayModalCloseEmail,
    displayModalClosePhone,
    displayModalDeleteFirstMeeting,
    displayModalEditFormule,
    displayModalCancelFormule,
    displayModalEditMeeting,
    displayModalAddMeetingAdmin,
  } = useSelector((state: RootState) => state.form);

  const { flashMessage } = useSelector((state: RootState) => state.flash);
  const handlerClick = () => {
    dispatch({
      type: "form/toggleLogin",
    });
  };

  const classNameLine = () => {
    if (
      displayFormLogin === true ||
      displayFormRegister === true ||
      displaySendCode === true ||
      displayFormCheck === true ||
      displayFormForgot === true ||
      displayModalEditFirstnameUserData === true ||
      displayModalEditLastnameUserData === true ||
      displayModalEditPasswordData === true ||
      displayModalEditEmailSendData === true ||
      displayModalEditEmailData === true ||
      displayModalEditValidEmailData === true ||
      displayModalEditPhoneData === true ||
      displayModalEditPhoneSendData === true ||
      displayModalEditValidPhoneData === true ||
      displayModalTwoFactor === true ||
      displayModalTwoFactorDisable === true ||
      displayModalCancelMeeting === true ||
      displayModalDeleteMeeting === true ||
      displayModalMeeting === true ||
      displayModalDeleteAccount === true ||
      displayModalCloseEmail === true ||
      displayModalClosePhone === true ||
      displayModalEditBirthUserData === true ||
      displayModalEditGenderUserData === true ||
      displayModalFirstMeeting === true ||
      displayModalDeleteFirstMeeting === true ||
      displayModalEditFormule === true ||
      displayModalCancelFormule === true ||
      displayModalEditMeeting === true ||
      displayModalAddMeetingAdmin === true
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
          displayFormLogin === true ||
          displayFormRegister === true ||
          displaySendCode === true ||
          displayFormCheck === true ||
          displayFormForgot === true ||
          displayModalEditFirstnameUserData === true ||
          displayModalEditLastnameUserData === true ||
          displayModalEditPasswordData === true ||
          displayModalEditEmailSendData === true ||
          displayModalEditEmailData === true ||
          displayModalEditValidEmailData === true ||
          displayModalEditPhoneData === true ||
          displayModalEditPhoneSendData === true ||
          displayModalEditValidPhoneData === true ||
          displayModalTwoFactor === true ||
          displayModalTwoFactorDisable === true ||
          displayModalCancelMeeting === true ||
          displayModalDeleteMeeting === true ||
          displayModalMeeting === true ||
          displayModalDeleteAccount === true ||
          displayModalCloseEmail === true ||
          displayModalClosePhone === true ||
          displayModalEditBirthUserData === true ||
          displayModalEditGenderUserData === true ||
          displayModalFirstMeeting === true ||
          displayModalDeleteFirstMeeting === true ||
          displayModalEditFormule === true ||
          displayModalCancelFormule === true ||
          displayModalEditMeeting === true ||
          displayModalAddMeetingAdmin === true
        ) {
          header.style.opacity = "0.02";
          mainDiv.style.opacity = "0.02";
          footerDiv.style.opacity = "0.02";
          htlmElement.style.height = "100%";
          htlmbody.style.height = "100%";
          htlmbody.style.overflowY = "hidden";
        } else {
          mainDiv.style.opacity = "1";
          header.style.opacity = "1";
          footerDiv.style.opacity = "1";
          htlmElement.style.height = "100%";
          htlmbody.style.height = "100%";
          htlmbody.style.overflowY = "unset";
        }
      }
    }
  }, [
    displayFormCheck,
    displayModalEditEmailSendData,
    displayFormForgot,
    displayFormLogin,
    displayFormRegister,
    displayModalEditPasswordData,
    displaySendCode,
    displayModalEditEmailData,
    displayModalEditValidEmailData,
    displayModalEditPhoneData,
    displayModalEditPhoneSendData,
    displayModalEditValidPhoneData,
    displayModalTwoFactor,
    displayModalTwoFactorDisable,
    displayModalCancelMeeting,
    displayModalDeleteMeeting,
    displayModalMeeting,
    displayModalDeleteAccount,
    displayModalCloseEmail,
    displayModalClosePhone,
    displayModalEditFirstnameUserData,
    displayModalEditLastnameUserData,
    displayModalEditBirthUserData,
    displayModalEditGenderUserData,
    displayModalFirstMeeting,
    displayModalDeleteFirstMeeting,
    displayModalEditFormule,
    displayModalCancelFormule,
    displayModalAddMeetingAdmin,
    displayModalEditMeeting,
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

  const ClassName = () => {
    if (
      displayFormLogin === true ||
      displayFormForgot ||
      displayFormRegister ||
      displayModalEditFirstnameUserData ||
      displayModalEditLastnameUserData ||
      displayModalEditPasswordData ||
      displayModalEditEmailSendData ||
      displayModalEditEmailData ||
      displayModalEditValidEmailData ||
      displayModalEditPhoneData ||
      displayModalEditPhoneSendData ||
      displayModalEditValidPhoneData ||
      displayModalTwoFactor ||
      displayModalTwoFactorDisable ||
      displayModalCancelMeeting ||
      displayModalDeleteMeeting ||
      displayModalMeeting ||
      displayModalDeleteAccount ||
      displayModalCloseEmail ||
      displayModalClosePhone ||
      displayModalEditBirthUserData ||
      displayModalEditGenderUserData ||
      displayModalFirstMeeting ||
      displayModalDeleteFirstMeeting ||
      displayModalEditFormule ||
      displayModalCancelFormule ||
      displayModalEditMeeting ||
      displayModalAddMeetingAdmin
    ) {
      /* if (displayLogMenu === true) {
        if (flashMessage && flashMessage[1].length > 0) {
          return `${styles.header__login__active} ${styles.header__header__margins}`;
        }
        return `${styles.header__login__active} ${styles.header__header__margin}`;
      }
      if (flashMessage && flashMessage[1].length > 0) {
        return `${styles.header__login__active} ${styles.header__header__margins}`;
      } */
      return `${styles.header} ${styles.header__opacity}`;
    } else {
      /* if (displayLogMenu === true) {
        if (flashMessage && flashMessage[1].length > 0) {
          return `${styles.header} ${styles.header__header__margins}`;
        }
        return `${styles.header} ${styles.header__header__margin}`;
      }
      if (flashMessage && flashMessage[1].length > 0) {
        return `${styles.header} ${styles.header__header__margins}`;
      } */
      return `${styles.header} ${styles.header__noOpacity}`;
    }
  };
  const displayFlash = () => {
    if (flashMessage && flashMessage[1].length > 0) {
      if (
        displayFormLogin === true ||
        displayFormRegister === true ||
        displaySendCode === true ||
        displayFormCheck === true ||
        displayFormForgot === true
      ) {
        if (flashMessage[0] === "error") {
          return (
            <div className={styles.flash__modal__error}>
              <Image
                className={styles.flash__modal__error__img}
                width={25}
                height={25}
                src="/assets/icone/circle-exclamation-solid.svg"
                alt="logo tdss coaching"
                priority={true}
              />
              {flashMessage[1]}
              <span
                onClick={() => {
                  dispatch({
                    type: "flash/clearFlashMessage",
                  });
                }}
                className={styles.flash__modal__error__span}
              >
                &times;
              </span>
            </div>
          );
        } else {
          return (
            <div className={styles.flash__modal__success}>
              <Image
                className={styles.flash__modal__success__img}
                width={20}
                height={20}
                src="/assets/icone/check-solid.svg"
                alt="logo tdss coaching"
                priority={true}
              />
              {flashMessage[1]}
              <span
                onClick={() => {
                  dispatch({
                    type: "flash/clearFlashMessage",
                  });
                }}
                className={styles.flash__modal__success__span}
              >
                &times;
              </span>
            </div>
          );
        }
      }
      if (flashMessage[0] === "error") {
        return (
          <div className={styles.flash__modal__error}>
            <Image
              className={styles.flash__modal__error__img}
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
              className={styles.flash__modal__error__span}
            >
              &times;
            </span>
          </div>
        );
      } else {
        return (
          <div className={styles.flash__modal__success}>
            <Image
              className={styles.flash__modal__success__img}
              width={20}
              height={20}
              src="/assets/icone/check-solid.svg"
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
              className={styles.flash__modal__success__span}
            >
              &times;
            </span>
          </div>
        );
      }
    } else {
      return null;
    }
  };
  /*  useEffect(() => {
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

  return (
    <>
      {displayFormLogin === true && <FormLogin />}
      {displayFormRegister === true && <FormRegister />}
      {displaySendCode === true && <SendCode />}
      {displayFormForgot === true && <Forgot />}
      {displayModalEditFirstnameUserData === true && <ModalUserFirstnameData />}
      {displayModalEditLastnameUserData === true && <ModalUserLastnameData />}
      {displayModalEditPasswordData && <ModalUserPasswordData />}
      {displayModalEditEmailSendData && <ModalUserSendToken />}
      {displayModalEditEmailData === true && <EmailCheck />}
      {displayModalTwoFactor === true && <ModalTwoFactor />}
      {displayModalTwoFactorDisable === true && <ModalTwoFactorDisable />}
      {displayModalCancelMeeting === true && <ModalCancel />}
      {displayModalDeleteMeeting === true && <ModalDeleteMeeting />}
      {displayModalMeeting === true && <ModalAddMeeting />}
      {displayModalFirstMeeting === true && <ModalAddFirstMeeting />}
      {displayModalDeleteAccount === true && <ModalDeleteAccount />}
      {displayModalCloseEmail === true && <ModalCloseEmail />}
      {displayModalDeleteFirstMeeting === true && <ModalDeleteFirstMeeting />}
      {displayModalEditFormule === true && <ModalEditFormuleUser />}
      {displayModalCancelFormule === true && <ModalCancelFormuleUser />}
      {displayModalEditMeeting === true && <ModalEditMeeting />}
      {displayModalAddMeetingAdmin === true && <ModalAddMeetingAdmin />}

      {displayFlash()}

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
                dispatch({
                  type: "menu/toggleMenu",
                });
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
