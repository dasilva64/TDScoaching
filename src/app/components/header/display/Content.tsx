"use client";

import styles from "../header.module.scss";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import EmailCheck from "@/app/profile/components/emailData/EmailData";
import ModalUserSendToken from "@/app/profile/components/emailSendTokenData/modal/ModalUserSendToken";
import ModalUserMainData from "@/app/profile/components/mainData/modal/ModalUserMainData";
import ModalUserPasswordData from "@/app/profile/components/passwordData/modal/ModalUserPasswordData";
import PhoneCheck from "@/app/profile/components/phoneData/PhoneData";
import ModalPhoneSendTokenData from "@/app/profile/components/phoneSendTokenData/modal/ModalPhoneSendTokenData";
import ModalTwoFactorDisable from "@/app/profile/components/twoFactorData/modal/ModalTwoFactorDisable";
import ModalTwoFactor from "@/app/profile/components/twoFactorData/modal/ModalTwoFactorUser";
import ModalCancel from "@/app/rendez-vous/components/meeting/modal/ModalCancel";
import Forgot from "../../forgot/Forgot";
import FormLogin from "../../login/formLogin";
import FormRegister from "../../register/formRegister";
import SendCode from "../../sendCode/SendCode";
import useCheck from "../../hook/user/useCheck";
import ModalAddMeeting from "@/app/rendez-vous/components/modal/ModalAddMeeting";
import ModalDeleteMeeting from "@/app/rendez-vous/components/meeting/modal/ModalDeleteMeeting";
import ModalDeleteAccount from "@/app/profile/components/deleteAccount/modal/ModalDeleteAccount";
import ModalCloseEmail from "@/app/profile/components/emailData/modal/ModalCloseEmail";
import ModalClosePhone from "@/app/profile/components/phoneData/modal/ModalClosePhone";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import Nav from "../components/Nav";

const Content = () => {
  const { isActive } = useSelector((state: RootState) => state.menu);
  const [displayLogMenu, setDisplayLogMenu] = useState<boolean>(false);
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    const fetchCheckUser = async () => {
      let response = await fetch("/api/user/checkDelete");
      let json = await response.json();
    };
    fetchCheckUser();
  }, []);
  const { data, isLoading, isError } = useCheck();
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
        <button className={styles.header__login} onClick={() => handlerClick()}>
          Se connecter
        </button>
      );
    } else {
      if (data.body.role === "ROLE_ADMIN") {
        content = (
          <>
            <div className={styles.header__log}>
              <div
                onClick={() => setDisplayLogMenu(!displayLogMenu)}
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
                onClick={() => setDisplayLogMenu(!displayLogMenu)}
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
  }

  const router = useRouter();
  const [isClick, setIsClick] = useState<boolean>(false);
  const {
    displayFormLogin,
    displayFormRegister,
    displayFormCheck,
    displaySendCode,
    displayModalEditPasswordData,
    displayModalEditMainUserData,
    displayFormForgot,
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
    displayModalDeleteAccount,
    displayModalCloseEmail,
    displayModalClosePhone,
  } = useSelector((state: RootState) => state.form);

  const { flashMessage } = useSelector((state: RootState) => state.flash);
  const handlerClick = () => {
    dispatch({
      type: "form/toggleLogin",
    });
  };

  useEffect(() => {
    if (document) {
      let mainDiv = document.querySelector("main");
      let footerDiv = document.querySelector("footer");
      let htlmElement = document.querySelector("html");
      let htlmbody = document.querySelector("body");

      if (mainDiv && footerDiv && htlmElement && htlmbody) {
        if (
          displayFormLogin === true ||
          displayFormRegister === true ||
          displaySendCode === true ||
          displayFormCheck === true ||
          displayFormForgot === true ||
          displayModalEditMainUserData === true ||
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
          displayModalClosePhone === true
        ) {
          mainDiv.style.opacity = "0.1";
          footerDiv.style.opacity = "0.1";
          htlmElement.style.height = "100%";
          htlmbody.style.height = "100%";
        } else {
          mainDiv.style.opacity = "1";
          footerDiv.style.opacity = "1";
          htlmElement.style.height = "unset";
          htlmbody.style.height = "unset";
        }
      }
    }
  }, [
    displayFormCheck,
    displayModalEditEmailSendData,
    displayFormForgot,
    displayFormLogin,
    displayFormRegister,
    displayModalEditMainUserData,
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
  ]);

  const updateUseState = () => {
    setIsClick(!isClick);
  };

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

  console.log("displayLogMenu", displayLogMenu);
  const handlerCancelNavigation = (e: any) => {
    e.preventDefault();
    return false;
  };

  const ClassName = () => {
    if (
      displayFormLogin === true ||
      displayFormForgot ||
      displayFormRegister ||
      displayModalEditMainUserData ||
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
      displayModalClosePhone
    ) {
      if (displayLogMenu === true) {
        if (flashMessage && flashMessage[1].length > 0) {
          return `${styles.header__login__active} ${styles.header__header__margins}`;
        }
        return `${styles.header__login__active} ${styles.header__header__margin}`;
      }
      if (flashMessage && flashMessage[1].length > 0) {
        return `${styles.header__login__active} ${styles.header__header__margins}`;
      }
      return styles.header__login__active;
    } else {
      if (displayLogMenu === true) {
        if (flashMessage && flashMessage[1].length > 0) {
          return `${styles.header} ${styles.header__header__margins}`;
        }
        return `${styles.header} ${styles.header__header__margin}`;
      }
      if (flashMessage && flashMessage[1].length > 0) {
        return `${styles.header} ${styles.header__header__margins}`;
      }
      return styles.header;
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
  useEffect(() => {
    if (document) {
      let body = document.querySelector("body");
      if (body) {
        if (isActive === true) {
          if (window.innerWidth < 601) {
            body.style.overflow = "hidden";
            body.style.height = "100vh";
          } else {
            body.style.overflow = "unset";
            body.style.height = "unset";
          }
        } else {
          body.style.overflow = "unset";
          body.style.height = "unset";
        }
      }
    }
  }, [isActive]);
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
      {displayModalEditMainUserData === true && <ModalUserMainData />}
      {displayModalEditPasswordData && <ModalUserPasswordData />}
      {displayModalEditEmailSendData && <ModalUserSendToken />}
      {displayModalEditEmailData === true && <EmailCheck />}
      {displayModalEditPhoneSendData === true && <ModalPhoneSendTokenData />}
      {displayModalEditPhoneData === true && <PhoneCheck />}
      {displayModalTwoFactor === true && <ModalTwoFactor />}
      {displayModalTwoFactorDisable === true && <ModalTwoFactorDisable />}
      {displayModalCancelMeeting === true && <ModalCancel />}
      {displayModalDeleteMeeting === true && <ModalDeleteMeeting />}
      {displayModalMeeting === true && <ModalAddMeeting />}
      {displayModalDeleteAccount === true && <ModalDeleteAccount />}
      {displayModalCloseEmail === true && <ModalCloseEmail />}
      {displayModalClosePhone === true && <ModalClosePhone />}

      {displayFlash()}

      <header className={ClassName()}>
        <figure className={styles.header__figure}>
          <Link className="link" href="/" tabIndex={0}>
            <Image
              className={styles.header__logo}
              width={80}
              height={80}
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
              <Link
                className={
                  pathname == "/coaching-de-vie"
                    ? `${styles.header__a} ${styles.active}`
                    : `${styles.header__a}`
                }
                href="/coaching-de-vie"
                onClick={(e) => {
                  displayLogMenu === true ? setDisplayLogMenu(false) : null;
                }}
              >
                Coaching de vie
              </Link>
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
        <div
          className={styles.main}
          style={{ position: "relative", zIndex: "999" }}
        >
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
    </>
  );
};

export default Content;
