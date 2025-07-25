import TabIndex from '../../tabIndex/TabIndex';
import styles from './Form2FACode.module.scss'
import { AnimatePresence, motion } from "framer-motion";
import Image from '../../image/Image';
import Input from '../../input/Input';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '@/app/redux/store/store';
import useSWRMutation from 'swr/mutation';
import fetchPost from '../../fetch/FetchPost';
import { mutate } from "swr";
import { useRouter } from 'next/navigation';


const Form2FACode = () => {
  const router = useRouter()
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [code, setCode] = useState<string>("")
  const [validCode, setValidCode] = useState<boolean>(false)
  const [errorCode, setErrorCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const clearState = () => {
    setInputPseudo("");
    setCode("")
    setErrorCode("")
    setValidCode(false)
  };

  const dispatch = useDispatch<AppDispatch>()
  const closeForm = () => {
    if (inputPseudo.length === 0) {
      const fetchLoginCancel = async () => {
        if (csrfToken) {
          loginCancel({
            pseudo: inputPseudo.trim(),
            csrfToken: csrfToken
          });
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: {
              type: "error",
              flashMessage: "Une erreur technique est survenue. Merci de recharger la page.",
            },
          });
        }

      };
      if (inputPseudo.length === 0) {
        fetchLoginCancel();
      }
    }
  };
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)

  const { displayModal2FACode, destinationModal2FACode } = useSelector((state: RootState) => state.Modal2FACode)

  const {
    trigger: login,
    data: loginData,
    reset: resetLogin,
  } = useSWRMutation("/components/login/2fa/api", fetchPost);
  useEffect(() => {
    if (loginData) {
      if (loginData.status === 200) {
        mutate("/components/header/api");
        mutate("/components/header/ui/api");
        clearState();
        dispatch({
          type: "Modal2FACode/close",
        });
        dispatch({
          type: "csrfToken/setCsrfToken",
          payload: { token: loginData.csrfToken }
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: loginData.message },
        });
        resetLogin();
        if (destinationModal2FACode !== "") {
          router.push(`/${destinationModal2FACode}`)
        }

      } else if (loginData.status === 400) {
        if (loginData.type === "validation") {
          setTimeout(() => {
            setIsLoading(false);
            setCode("");
            setValidCode(false);
            loginData.message.forEach((element: string) => {
              if (element[0] === "code") {
                setErrorCode(element[1]);
              }
            });
            resetLogin();
          }, 1000);
        } else {
          setTimeout(() => {
            setIsLoading(false);
            setCode("");
            setValidCode(false);
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: loginData.message },
            });
            resetLogin();
          }, 1000);

        }
      } else if (loginData.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: loginData.message },
        });
        mutate("/components/header/api");
        mutate("/components/header/ui/api");
        resetLogin();
        dispatch({
          type: "Modal2FACode/close",
        });
        router.push('/')
      } else {
        setIsLoading(false);
        setCode("");
        setValidCode(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: loginData.message },
        });
        resetLogin();
      }
    }
  }, [dispatch, loginData, resetLogin, router]);
  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validCode === true) {
      if (inputPseudo.length === 0) {
        setIsLoading(true);
        const fetchLogin = async () => {
          if (csrfToken) {
            login({
              code: code.trim(),
              pseudo: inputPseudo.trim(),
              csrfToken: csrfToken
            });
          } else {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: {
                type: "error",
                flashMessage: "Une erreur technique est survenue. Merci de recharger la page.",
              },
            });
          }

        };
        if (inputPseudo.length === 0) {
          fetchLogin();
        }
      }
    } else {
      if (code.length === 0) {
        setErrorCode("Code : ne peut pas être vide");
      } else {
        setErrorCode("");
      }
    }
  };
  const {
    trigger: loginResend,
    data: loginDataResend,
    reset: resetLoginResend,
  } = useSWRMutation("/components/login/2fa/api/resend", fetchPost);
  const handleResendCode = async () => {

    setCanResend(false); // Désactiver le bouton temporairement
    if (inputPseudo.length === 0) {
      if (csrfToken) {
        loginResend({ csrfToken: csrfToken, pseudo: inputPseudo.trim(), })

      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: "Une erreur technique est survenue. Merci de recharger la page.",
          },
        });
      }

    }

    /* try {
      const res = await fetch("/api/2fa/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csrfToken }), // Ajoute protection CSRF
      });
  
      const data = await res.json();
      if (data.status === 200) {
        alert("Un nouveau code a été envoyé !");
        setTimer(30); // Réactive le bouton après X secondes
      } else {
        alert("Erreur lors de l'envoi du code !");
      }
    } catch (error) {
      alert("Échec du renvoi du code.");
    } */
  };
  useEffect(() => {
    if (loginDataResend) {
      if (loginDataResend.status === 200) {
        mutate("/components/header/api");
        setTimer(30);
        setCode("");
        setValidCode(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: loginDataResend.message },
        });
      }
      else if (loginDataResend.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: loginDataResend.message },
        });
        mutate("/components/header/api");
        mutate("/components/header/ui/api");
        dispatch({
          type: "Modal2FACode/close",
        });
        router.push('/')
      }
      else {
        setTimer(30);
        setCode("");
        setValidCode(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: loginDataResend.message },
        });


      }
      resetLoginResend()
    }
  }, [loginDataResend, resetLoginResend, dispatch, router])
  const {
    trigger: loginCancel,
    data: loginDataCancel,
    reset: resetLoginCancel,
  } = useSWRMutation("/components/login/2fa/api/cancel", fetchPost)
  useEffect(() => {
    if (loginDataCancel) {
      if (loginDataCancel.status === 200) {
        mutate("/components/header/api");
        mutate("/components/header/ui/api");
        setCode("");
        setValidCode(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: loginDataCancel.message },
        });
        clearState()
        dispatch({
          type: "Modal2FACode/close",
        });

      } else if (loginDataCancel.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: loginDataCancel.message },
        });
        mutate("/components/header/api");
        mutate("/components/header/ui/api");
        setCode("");
        setValidCode(false);
        dispatch({
          type: "Modal2FACode/close",
        });
        router.push('/')
      }
      else {
        setCode("");
        setValidCode(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: loginDataCancel.message },
        });


      }
      resetLoginCancel()
    }
  }, [loginDataCancel, resetLoginCancel, dispatch, router])
  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
    regex: RegExp,
    setValidInput: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    errorMessage: string
  ) => {
    let removeSpace = "";
    if (e.target.value.charAt(0) === " ") {
      removeSpace = e.target.value.replace(/\s/, "");
      setInput(removeSpace);
    } else {
      removeSpace = e.target.value.replace(/\s\s+/g, " ");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      setValidInput(true);
      setErrorMessage("");
    } else if (removeSpace.length === 0) {
      setValidInput(false);
      setErrorMessage("");
    } else {
      setValidInput(false);
      setErrorMessage(errorMessage);
    }
  };
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(30); // Exemple : attente de 30s

  useEffect(() => {
    if (displayModal2FACode) {
      if (timer > 0) {
        const interval = setInterval(() => setTimer(timer - 1), 1000);
        return () => clearInterval(interval);
      } else {
        setCanResend(true);
      }
    }

  }, [timer, displayModal2FACode]);
  return (
    <>
      <TabIndex displayModal={displayModal2FACode} />
      <AnimatePresence>
        {displayModal2FACode === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.login}
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{
                y: "-50%",
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
              <button
                className={styles.login__btn}
                type="button"
                onClick={() => closeForm()}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="button pour fermer la modal de connexion"
              >
                <Image
                  className={styles.login__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="icone fermer modal"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2 className={`${styles.login__h1}`}>Se connecter</h2>
              <p>Veuillez entrez votre code reçu par mail pour vous connecter</p>
              <form
                action=""
                method="POST"
                className={styles.login__form}
                onSubmit={(e) => {
                  if (isLoading === false) {
                    handlerSubmit(e);
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                <Input
                  label={"Code"}
                  value={code}
                  id={"code"}
                  type={"text"}
                  placeholder={"Entrez votre code"}
                  regex={/^\d{8}$/}
                  onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlerInput(
                      e,
                      "code",
                      /^\d{8}$/,
                      setValidCode,
                      setErrorCode,
                      setCode,
                      "Code : 8 chiffre"
                    );
                  }}
                  validInput={validCode}
                  errorMessage={errorCode}
                  image={"at-solid"}
                  alt={"icone utilisateur"}
                  position={"first"}
                  tab={true}
                />
                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  className={styles.login__form__hidden}
                  /* style={{ display: "none" }} */
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setInputPseudo(e.target.value);
                  }}
                />
                <div className={styles.login__form__submit}>
                  {isLoading === false && (
                    <input
                      className={styles.login__form__submit__btn}
                      type="submit"
                      value="Se connecter"
                    />
                  )}
                  {isLoading === true && (
                    <button
                      disabled
                      className={styles.login__form__submit__btn__load}
                    >
                      <span
                        className={
                          styles.login__form__submit__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={styles.login__form__submit__btn__load__arc}
                      >
                        <div
                          className={
                            styles.login__form__submit__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  )}
                </div>
              </form>
              <div className={styles.login__cancel}>
                <button className={`${styles.login__cancel__btn}`} onClick={closeForm}>
                  Quitter
                </button>
              </div>
              <div className={styles.login__resend}>
                <button className={`${canResend ? styles.login__resend__btn__active : styles.login__resend__btn__disable} ${styles.login__resend__btn}`} disabled={!canResend} onClick={handleResendCode}>
                  {canResend ? "Renvoyer un code" : `Attendez ${timer}s pour renvoyer un code`}
                </button>
              </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Form2FACode