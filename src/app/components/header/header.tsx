"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./header.module.scss";
import FormLogin from "../login/formLogin";
import FormRegister from "../register/formRegister";
import FormCheck from "../check/FormCheck";
import SendCode from "../sendCode/SendCode";
import Forgot from "../forgot/Forgot";
import { RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useLogout from "../hook/useLogout";
import useUser from "../hook/useUser";
import Modal from "@/app/profile/components/mainData/modal/ModalUserMainData";
import ModalUserMainData from "@/app/profile/components/mainData/modal/ModalUserMainData";
import ModalUserPasswordData from "@/app/profile/components/passwordData/modal/ModalUserPasswordData";
import ModalUserSendToken from "@/app/profile/components/emailSendTokenData/modal/ModalUserSendToken";
import EmailCheck from "@/app/profile/components/emailData/EmailData";
import EmailValidData from "@/app/profile/components/emailValidData/EmailValidData";
import ModalUserPhoneData from "@/app/profile/components/phoneData/modal/ModalUserPhoneData";
import { headers } from "next/headers";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [displayLogMenu, setDisplayLogMenu] = useState<boolean>(false);
  const [isClick, setIsClick] = useState<boolean>(false);
  const dispatch = useDispatch();
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
  } = useSelector((state: RootState) => state.form);

  const { isLog, role } = useSelector((state: RootState) => state.auth);
  const [userLogout, setUserLogout] = useState(false);

  const { flashMessage } = useSelector((state: RootState) => state.flash);
  const handlerClick = () => {
    dispatch({
      type: "form/toggleLogin",
    });
  };

  useLogout(userLogout, setUserLogout);
  const { userData } = useUser();
  useEffect(() => {
    if (userData) {
      let userDataParsed = JSON.parse(userData);
      if (userDataParsed.status === 200) {
        let ar;
        if (userDataParsed.body.editEmail) {
          ar = [
            userDataParsed.body.editEmail.newEmail,
            userDataParsed.body.editEmail.limitDate,
          ];
        } else {
          ar = null;
        }

        dispatch({
          type: "auth/login",
          payload: {
            email: userDataParsed.body.email,
            role: userDataParsed.body.role,
            id: userDataParsed.body.id,
            firstname: userDataParsed.body.firstname,
            lastname: userDataParsed.body.lastname,
            phone: userDataParsed.body.phone,
            editEmail: ar,
          },
        });
      } else {
        if (pathname === "/rendez-vous" || pathname === "/profile") {
          router.push("/");
        }
        dispatch({
          type: "auth/logout",
        });
      }
    }
  }, [dispatch, pathname, router, userData]);

  useEffect(() => {
    if (document) {
      let mainDiv = document.querySelector("main");
      let footerDiv = document.querySelector("footer");

      if (mainDiv && footerDiv) {
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
          displayModalEditPhoneData === true
        ) {
          mainDiv.style.opacity = "0.1";
          footerDiv.style.opacity = "0.1";
        } else {
          mainDiv.style.opacity = "1";
          footerDiv.style.opacity = "1";
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
  ]);

  const updateUseState = () => {
    setIsClick(!isClick);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1201) {
      } else {
        setIsClick(false);
      }
    });
  }

  /* const handlerCancelNavigation = (e: any) => {
    e.preventDefault();
    return false;
  }; */

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
      displayModalEditPhoneData
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
            <div className={styles.flash__modal__error}>{flashMessage[1]}</div>
          );
        } else {
          return (
            <div className={styles.flash__modal__success}>
              {flashMessage[1]}
            </div>
          );
        }
      }
      if (flashMessage[0] === "error") {
        return <div className={styles.flash__error}>{flashMessage[1]}</div>;
      } else {
        return <div className={styles.flash__success}>{flashMessage[1]}</div>;
      }
    } else {
      return null;
    }
  };

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
      {displayFormCheck === true && <FormCheck />}
      {displayFormForgot === true && <Forgot />}
      {displayModalEditMainUserData === true && <ModalUserMainData />}
      {displayModalEditPasswordData && <ModalUserPasswordData />}
      {displayModalEditEmailSendData && <ModalUserSendToken />}
      {displayModalEditEmailData === true && <EmailCheck />}
      {displayModalEditValidEmailData === true && <EmailValidData />}
      {displayModalEditPhoneData === true && <ModalUserPhoneData />}
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
                  isClick === true ? setIsClick(false) : null;
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
                  isClick === true ? setIsClick(false) : null;
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
                  isClick === true ? setIsClick(false) : null;
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
                      isClick === true ? setIsClick(false) : null;
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
                      isClick === true ? setIsClick(false) : null;
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
                      isClick === true ? setIsClick(false) : null;
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
                      isClick === true ? setIsClick(false) : null;
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
                      isClick === true ? setIsClick(false) : null;
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
                      isClick === true ? setIsClick(false) : null;
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
                  isClick === true ? setIsClick(false) : null;
                }}
              >
                Contact
              </Link>
            </li>
          </ul>
          {(!isLog && (
            <button
              className={styles.header__login}
              onClick={() => handlerClick()}
            >
              Se connecter
            </button>
          )) ||
            (isLog && (
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
                        {role === "ROLE_ADMIN" && (
                          <>
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
                                Tous les rendez-vous
                              </Link>
                            </li>
                            <li className={styles.header__log__li}>
                              <Link
                                href="/tous-les-utilisateurs"
                                onClick={() => setDisplayLogMenu(false)}
                              >
                                Tous les utilisateurs
                              </Link>
                            </li>
                          </>
                        )}
                        {role === "ROLE_USER" && (
                          <>
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
                          </>
                        )}
                        <li className={styles.header__log__li}>
                          <Link
                            href=""
                            onClick={() => {
                              setUserLogout(true);
                            }}
                          >
                            Déconnection
                          </Link>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </>
            ))}
        </nav>
        <div className={styles.header__burger}>
          <button
            className={styles.header__burger__btn}
            onClick={() => updateUseState()}
          >
            <div className={styles.header__burger__line}>
              <span
                className={
                  isClick
                    ? `${styles.header__cross} ${styles.header__bar1__rotate}`
                    : `${styles.header__bar} ${styles.header__bar1}`
                }
              ></span>
              <span
                className={
                  isClick ? "" : `${styles.header__bar} ${styles.header__bar2}`
                }
              ></span>
              <span
                className={
                  isClick
                    ? `${styles.header__cross} ${styles.header__bar2__rotate}`
                    : `${styles.header__bar} ${styles.header__bar3}`
                }
              ></span>
            </div>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
