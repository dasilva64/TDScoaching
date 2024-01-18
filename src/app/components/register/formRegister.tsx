import React, { useEffect, useState } from "react";
import styles from "./formRegister.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../src/app/redux/store";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import validator from "validator";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import useSWRMutation from "swr/mutation";
import fetchPost from "../fetch/FetchPost";

const FormRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [firstnameInput, setFirstnameInput] = useState<string>("");
  const [lastnameInput, setLastnameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>("");
  const [majorInput, setMajorInput] = useState<string>("");
  const [validEmailInput, setValidEmailInput] = useState<boolean>(false);
  const [validFirstnameInput, setValidFirstnameInput] =
    useState<boolean>(false);
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(false);
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [validMajorInput, setValidMajorInput] = useState<boolean>(false);
  const [firstnameInputError, setFirstnameInputError] = useState<string>("");
  const [lastnameInputError, setLastnameInputError] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<string>("");
  const [passwordComfirmInputError, setPasswordComfirmError] =
    useState<string>("");
  const [emailInputError, setEmailInputError] = useState<string>("");
  const [majorInputError, setMajorInputError] = useState<string>("");
  const { displayModalRegister } = useSelector(
    (state: RootState) => state.ModalRegister
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, trigger } = useSWRMutation(
    "/components/register/api",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        clearState();
        dispatch({ type: "ModalRegister/close" });
      } else if (data.status === 400 && data.type === "validation") {
        setTimeout(() => {
          setIsLoading(false);
          data.message.forEach((element: string) => {
            if (element[0] === "email") {
              setEmailInputError(element[1]);
            }
            if (element[0] === "password") {
              setPasswordInputError(element[1]);
            }
            if (element[0] === "firstname") {
              setFirstnameInputError(element[1]);
            }
            if (element[0] === "lastname") {
              setLastnameInputError(element[1]);
            }
          });
        }, 2000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { flashMessage: data.message, type: "error" },
          });
        }, 2000);
      }
    }
  }, [data, dispatch]);
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (
      validEmailInput === true &&
      validFirstnameInput === true &&
      validLastnameInput === true &&
      validPasswordInput === true &&
      validPasswordComfirmInput === true &&
      validMajorInput === true
    ) {
      if (inputPseudo.length === 0) {
        setIsLoading(true);
        const fetchRegister = async () => {
          trigger({
            email: validator.escape(emailInput.trim()),
            password: validator.escape(passwordInput.trim()),
            firstname: validator.escape(firstnameInput.trim()),
            lastname: validator.escape(lastnameInput.trim()),
            pseudo: validator.escape(inputPseudo.trim()),
          });

          /* let response = await fetch("/components/register/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: validator.escape(emailInput.trim()),
              password: validator.escape(passwordInput.trim()),
              firstname: validator.escape(firstnameInput.trim()),
              lastname: validator.escape(lastnameInput.trim()),
              pseudo: validator.escape(inputPseudo.trim()),
            }),
          });
          let json = await response.json();
          console.log(json);
          if (json.status === 200) {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { flashMessage: json.message, type: "success" },
            });
            clearState();
            dispatch({ type: "ModalRegister/close" });
          } else if (json.status === 400) {
            setTimeout(() => {
              setIsLoading(false);
              json.message.forEach((element: string) => {
                if (element[0] === "email") {
                  setEmailInputError(element[1]);
                }
                if (element[0] === "password") {
                  setPasswordInputError(element[1]);
                }
                if (element[0] === "firstname") {
                  setFirstnameInputError(element[1]);
                }
                if (element[0] === "lastname") {
                  setLastnameInputError(element[1]);
                }
              });
            }, 2000);
          } else {
            setTimeout(() => {
              setIsLoading(false);
              dispatch({
                type: "flash/storeFlashMessage",
                payload: { flashMessage: json.message, type: "error" },
              });
            }, 2000);
          } */
        };
        fetchRegister();
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      if (validEmailInput === false) {
        setEmailInputError("Email : doit avoir un format valide");
      }
      if (validFirstnameInput === false) {
        setFirstnameInputError("Prénom : 3 lettres minimum");
      }
      if (validLastnameInput === false) {
        setLastnameInputError("Nom de famille : 3 lettres minimum");
      }
      if (validPasswordInput === false) {
        setPasswordInputError(
          "Mot de passe : doit avoir une lettre en minuscule, un nombre et 8 caractères minimum"
        );
      }
      if (validPasswordComfirmInput === false) {
        setPasswordComfirmError(
          "Comfirmation mot de passe : doit être identique au mot de passe"
        );
      }
      if (validMajorInput === false) {
        setMajorInputError("Vous devez être majeur pour vous inscrire");
      }
    }
  };

  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
  const handlerInputPassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      removeSpace = e.target.value.replace(/\s+/g, "");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    if (regex.test(removeSpace)) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setPasswordComfirmError(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(true);
        setErrorMessage("");
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      }
    } else if (removeSpace.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage("");
        setPasswordComfirmError(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage("");
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      }
    } else {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setPasswordComfirmError(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setPasswordComfirmError("");
        setValidPasswordComfirmInput(true);
      }
    }
  };

  const clearState = () => {
    setValidEmailInput(false);
    setValidFirstnameInput(false);
    setValidLastnameInput(false);
    setValidPasswordInput(false);
    setValidPasswordComfirmInput(false);
    setValidMajorInput(false);
    setEmailInput("");
    setFirstnameInput("");
    setLastnameInput("");
    setPasswordInput("");
    setPasswordComfirmInput("");
    setMajorInput("");
    setEmailInputError("");
    setFirstnameInputError("");
    setShowPassword(false);
    setShowPasswordComfirm(false);
    setLastnameInputError("");
    setIsLoading(false);
    setPasswordInputError("");
    setPasswordComfirmError("");
    setMajorInputError("");
    setInputPseudo("");
  };
  const backLogin = () => {
    clearState();
    dispatch({ type: "ModalRegister/close" });
    dispatch({ type: "ModalLogin/open" });
  };
  const closeForm = () => {
    clearState();
    dispatch({ type: "ModalRegister/close" });
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordComfirm, setShowPasswordComfirm] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleClickShowPasswordComfirm = () =>
    setShowPasswordComfirm((show) => !show);

  const handleMouseDownPasswordComfirm = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <>
      <AnimatePresence>
        {displayModalRegister && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
            />
            <motion.div
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
              className={styles.register}
            >
              <div className={styles.register__top}>
                <button
                  className={styles.register__top__back}
                  onClick={() => {
                    backLogin();
                  }}
                >
                  Retour à la connection
                </button>
                <button
                  className={styles.register__top__close}
                  onClick={() => closeForm()}
                >
                  <Image
                    className={styles.register__top__close__img}
                    src="/assets/icone/xmark-solid.svg"
                    alt="arrow-left"
                    width={30}
                    height={30}
                  ></Image>
                </button>
              </div>

              <h1 className={styles.register__h1}>Création de compte</h1>
              <form
                className={styles.register__form}
                action=""
                onSubmit={(e) => {
                  if (isLoading === false) {
                    handlerSubmit(e);
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                {/* 
 <TextField
                  autoFocus
                  value={firstnameInput}
                  style={{ margin: "10px 0px" }}
                  id={"firstname"}
                  label={"Prénom"}
                  variant="standard"
                  type={"text"}
                  sx={{
                    "& label": {
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    },
                  }}
                  placeholder={"Entrez votre prénom"}
                  FormHelperTextProps={{ style: { color: "red" } }}
                  onChange={(e) => {
                    handlerInput(
                      e,
                      /^[A-Za-z][A-Za-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi ]{2,}$/,
                      setValidFirstnameInput,
                      setFirstnameInputError,
                      setFirstnameInput,
                      "Prénom : 3 lettres minimum"
                    );
                  }}
                  helperText={firstnameInputError}
                /> 
 */}

                <FormControl variant="standard" style={{ margin: "10px 0px" }}>
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-firstname"
                  >
                    Prénom
                  </InputLabel>
                  <Input
                    autoFocus
                    id="standard-adornment-firstname"
                    value={firstnameInput}
                    placeholder={"Entrez votre prénom"}
                    type={"text"}
                    onChange={(e) => {
                      handlerInput(
                        e,
                        /^[A-Za-z][A-Za-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi ]{2,}$/,
                        setValidFirstnameInput,
                        setFirstnameInputError,
                        setFirstnameInput,
                        "Prénom : 3 lettres minimum"
                      );
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <PersonIcon
                          aria-label="toggle firstname visibility"
                          sx={{ padding: "0px", color: "black" }}
                        >
                          <Visibility />
                        </PersonIcon>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {firstnameInputError}
                  </FormHelperText>
                </FormControl>

                {/*  <TextField
                  value={lastnameInput}
                  style={{ margin: "10px 0px" }}
                  id={"lastname"}
                  label={"Nom de famille"}
                  variant="standard"
                  type={"text"}
                  sx={{
                    "& label": {
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    },
                  }}
                  placeholder={"Entrez votre nom de famille"}
                  FormHelperTextProps={{ style: { color: "red" } }}
                  onChange={(e) => {
                    handlerInput(
                      e,
                      /^[A-Za-z][A-Za-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi ]{2,}$/,
                      setValidLastnameInput,
                      setLastnameInputError,
                      setLastnameInput,
                      "Nom de famille : 3 lettres minimum"
                    );
                  }}
                  helperText={lastnameInputError}
                />  */}

                <FormControl variant="standard" style={{ margin: "10px 0px" }}>
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-lastname"
                  >
                    Nom de famille
                  </InputLabel>
                  <Input
                    id="standard-adornment-lastname"
                    value={lastnameInput}
                    placeholder={"Entrez votre nom de famille"}
                    type={"text"}
                    onChange={(e) => {
                      handlerInput(
                        e,
                        /^[A-Za-z][A-Za-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi ]{2,}$/,
                        setValidLastnameInput,
                        setLastnameInputError,
                        setLastnameInput,
                        "Nom de famille : 3 lettres minimum"
                      );
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <PersonIcon
                          aria-label="toggle lastname visibility"
                          sx={{ padding: "0px", color: "black" }}
                        >
                          <Visibility />
                        </PersonIcon>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {lastnameInputError}
                  </FormHelperText>
                </FormControl>

                <FormControl variant="standard" style={{ margin: "10px 0px" }}>
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-password"
                  >
                    Mot de passe
                  </InputLabel>
                  <Input
                    id="standard-adornment-password"
                    value={passwordInput}
                    placeholder={"Entrez votre mot de passe"}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      handlerInputPassword(
                        e,
                        /^(?=.*[a-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi]).{1,}$/,
                        setValidPasswordInput,
                        setPasswordInputError,
                        setPasswordInput,
                        "Mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
                      );
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          sx={{ padding: "0px", color: "black" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {passwordInputError}
                  </FormHelperText>
                </FormControl>

                <FormControl variant="standard" style={{ margin: "10px 0px" }}>
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-password-comfirm"
                  >
                    Comfirmation mot de passe
                  </InputLabel>
                  <Input
                    id="standard-adornment-password-comfirm"
                    value={passwordComfirmInput}
                    placeholder={"Entrez comfirmation de votre mot de passe"}
                    type={showPasswordComfirm ? "text" : "password"}
                    onChange={(e) => {
                      let removeSpace = "";
                      if (e.target.value.charAt(0) === " ") {
                        removeSpace = e.target.value.replace(/\s/, "");
                        setPasswordComfirmInput(removeSpace);
                      } else {
                        removeSpace = e.target.value.replace(/\s+/g, "");
                        setPasswordComfirmInput(removeSpace);
                      }
                      if (
                        passwordInput.length > 0 &&
                        removeSpace !== passwordInput
                      ) {
                        setValidPasswordComfirmInput(false);
                        setPasswordComfirmError(
                          "Comfirmation mot de passe : les mots de passe doivent être identique"
                        );
                      } else {
                        setValidPasswordComfirmInput(true);

                        setPasswordComfirmError("");
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordComfirm}
                          sx={{ padding: "0px", color: "black" }}
                        >
                          {showPasswordComfirm ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {passwordComfirmInputError}
                  </FormHelperText>
                </FormControl>

                <FormControl variant="standard">
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-email"
                  >
                    Email
                  </InputLabel>
                  <Input
                    id="standard-adornment-email"
                    value={emailInput}
                    placeholder={"Entrez votre mail"}
                    type={"text"}
                    onChange={(e) => {
                      handlerInput(
                        e,
                        /^([\w.-]+)@([\w-]+)((\.(\w){2,})+)$/,
                        setValidEmailInput,
                        setEmailInputError,
                        setEmailInput,
                        "Email : doit être un email valide"
                      );
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <AlternateEmailIcon
                          sx={{ color: "black" }}
                          aria-label="toggle email visibility"
                        >
                          <Visibility />
                        </AlternateEmailIcon>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {emailInputError}
                  </FormHelperText>
                </FormControl>

                <FormControl
                  style={{ margin: "20px 0px 10px 0px" }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormLabel style={{ color: "black" }} component="legend">
                    Êtes vous majeur ?
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => {
                            if (e.target.checked === true) {
                              setMajorInput("true");
                              setValidMajorInput(true);
                              setMajorInputError("");
                            } else {
                              setMajorInput("false");
                              setValidMajorInput(false);
                              setMajorInputError(
                                "Vous devez être majeur pour vous inscrire"
                              );
                            }
                          }}
                          name="gilad"
                        />
                      }
                      label={validMajorInput ? "Oui" : "Non"}
                    />
                  </FormGroup>
                  <FormHelperText>{majorInputError}</FormHelperText>
                </FormControl>
                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setInputPseudo(e.target.value);
                  }}
                />
                <p>
                  En vous inscrivant, vous acceptez nos{" "}
                  <Link
                    className={styles.register__form__link}
                    target="_blank"
                    href={"/conditions-generales-utilisations"}
                  >
                    conditions générales d&apos;utilisations
                  </Link>{" "}
                  de notre site
                </p>
                <div className={styles.register__form__submit}>
                  {isLoading === false && (
                    <input
                      className={styles.register__form__submit__btn}
                      type="submit"
                      value="S'inscrire"
                    />
                  )}
                  {isLoading === true && (
                    <button
                      disabled
                      className={styles.register__form__submit__btn__load}
                    >
                      <span
                        className={
                          styles.register__form__submit__btn__load__span
                        }
                      >
                        Chargement
                      </span>

                      <div
                        className={
                          styles.register__form__submit__btn__load__arc
                        }
                      >
                        <div
                          className={
                            styles.register__form__submit__btn__load__arc__circle
                          }
                        ></div>
                      </div>
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormRegister;

// /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
