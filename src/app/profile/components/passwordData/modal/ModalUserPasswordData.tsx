import { AppDispatch, RootState } from "../../../../../../src/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalUserPasswordData.module.scss";
import useSWRMutation from "swr/mutation";
import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import fetchPost from "../../../../../../src/app/components/fetch/FetchPost";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../../../Parisienne-Regular.ttf",
  display: "swap",
});

const ModalUserPasswordData = () => {
  const { displayModalEditPassword } = useSelector(
    (state: RootState) => state.ModalEditPassword
  );
  const dispatch = useDispatch<AppDispatch>();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordComfirmInput, setPasswordComfirmInput] = useState<string>("");
  const [validPasswordInput, setValidPasswordInput] = useState<boolean>(false);
  const [validPasswordComfirmInput, setValidPasswordComfirmInput] =
    useState<boolean>(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>("");
  const [errorMessagePasswordComfirm, setErrorMessagePasswordComfirm] =
    useState<string>("");
  const router = useRouter();

  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/profile/components/passwordData/modal/api",
    fetchPost
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "ModalEditPassword/close",
        });
        reset();
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push("/");
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "password") {
              setErrorMessagePassword(element[1]);
            }
          });
          reset();
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push("/");
      }
    }
  }, [data, dispatch, reset, router]);

  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalEditPassword/close",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validPasswordInput === true && validPasswordComfirmInput === true) {
      if (passwordInput === passwordComfirmInput) {
        if (inputPseudo.length === 0) {
          const fetchLogin = async () => {
            trigger({
              password: passwordInput,
              passwordComfirm: passwordComfirmInput,
              pseudo: inputPseudo,
            });
          };
          fetchLogin();
        }
      } else {
        setValidPasswordInput(false);
        setValidPasswordComfirmInput(false);
        setErrorMessagePasswordComfirm(
          "Confirmation mot de passe : les mots de passe sont identiques"
        );
      }
    } else {
      if (validPasswordInput === false) {
        if (passwordInput.length === 0) {
          setErrorMessagePassword("Mot de passe : ne peut pas être vide");
        }
      }
      if (validPasswordComfirmInput === false) {
        if (passwordComfirmInput.length === 0) {
          setErrorMessagePasswordComfirm(
            "Confirmation mot de passe : ne peut pas être vide"
          );
        }
      }
    }
  };
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
      removeSpace = e.target.value.replace(/\s+/g, "");
      setInput(removeSpace);
    }
    setInput(removeSpace);
    /* if (regex.test(removeSpace)) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else if (
        passwordComfirmInput.length > 0 &&
        removeSpace === passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
      } else {
        setValidInput(true);
        setErrorMessage("");
      }
    } else if (removeSpace.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
        setValidInput(false);
        setErrorMessage("");
      }
    } else {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setErrorMessagePasswordComfirm(
          "Comfirmation mot de passe : les mots de passe doivent être identique"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
        setValidInput(false);
        setErrorMessage(errorMessage);
      }
    } */
    if (regex.test(removeSpace)) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else if (
        passwordComfirmInput.length > 0 &&
        removeSpace === passwordComfirmInput
      ) {
        setValidInput(true);
        setErrorMessage("");
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
      } else {
        setValidInput(true);
        setErrorMessage("");
      }
    } else if (removeSpace.length === 0) {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage("");
        setErrorMessagePasswordComfirm(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage("");
        setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(true);
      }
    } else {
      if (
        passwordComfirmInput.length > 0 &&
        removeSpace !== passwordComfirmInput
      ) {
        setValidInput(false);
        setErrorMessage(errorMessage);
        setErrorMessagePasswordComfirm(
          "Confirmation mot de passe : les mots de passe doivent être identiques"
        );
        setValidPasswordComfirmInput(false);
      } else {
        setValidInput(false);
        setErrorMessage(errorMessage);
        //setErrorMessagePasswordComfirm("");
        setValidPasswordComfirmInput(false);
      }
    }
  };
  const clearState = () => {
    setShowPassword(false);
    setShowPasswordComfirm(false);
    setErrorMessagePassword("");
    setErrorMessagePasswordComfirm("");
    setValidPasswordInput(false);
    setValidPasswordComfirmInput(false);
    setPasswordInput("");
    setPasswordComfirmInput("");
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordComfirm, setShowPasswordComfirm] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowPasswordComfirm = () =>
    setShowPasswordComfirm((show) => !show);

  return (
    <>
      <AnimatePresence>
        {displayModalEditPassword === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.modalEditPasswordData}
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
                type="button"
                className={styles.modalEditPasswordData__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalEditPasswordData__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h2
                className={`${styles.modalEditPasswordData__h1} ${Parisienne.className}`}
              >
                Modifier votre mot de passe
              </h2>
              <form
                className={styles.modalEditPasswordData__form}
                action=""
                onSubmit={(e) => {
                  handlerSubmit(e);
                }}
              >
                <FormControl
                  style={{ margin: "20px 0px 0px 0px" }}
                  variant="standard"
                >
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
                    autoFocus={displayModalEditPassword === true ? true : false}
                    value={passwordInput}
                    placeholder={"Entrez votre mot de passe"}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      handlerInput(
                        e,
                        "password",
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-?!*:@~%.;+|$#=&,_])[A-Za-z\d-?!*:@~%.;+|$#=&,_]{8,}$/,
                        setValidPasswordInput,
                        setErrorMessagePassword,
                        setPasswordInput,
                        "Mot de passe : doit avoir une lettre en minuscule, majuscule, un nombre, un caractère spécial (-?!*:@~%)(.;+{\"|$#}=['&,_) et 8 caractères minimum"
                      );
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {errorMessagePassword}
                  </FormHelperText>
                </FormControl>
                {/* <TextField
                  autoFocus
                  value={passwordInput}
                  style={{ margin: "20px 0px 0px 0px" }}
                  id={"password"}
                  label={"Mot de passe"}
                  variant="standard"
                  type={"password"}
                  placeholder={"Entrez votre mot de passe"}
                  FormHelperTextProps={{ style: { color: "red" } }}
                  onChange={(e) => {
                    handlerInput(
                      e,
                      "password",
                      /^(?=.*[a-zéèàùâûîiïüäÀÂÆÁÄÃÅĀÉÈÊËĘĖĒÎÏÌÍĮĪÔŒºÖÒÓÕØŌŸÿªæáãåāëęėēúūīįíìi]).{2,}$/,
                      setValidPasswordInput,
                      setErrorMessagePassword,
                      setPasswordInput,
                      "Mot de passe : doit avoir une lettre en minuscule, un nombre et 8 caractères minimum"
                    );
                  }}
                  helperText={errorMessagePassword}
                /> */}
                <FormControl variant="standard" style={{ margin: "20px 0px" }}>
                  <InputLabel
                    sx={{
                      color: "black",
                      "&.Mui-focused": {
                        color: "#1976d2",
                      },
                    }}
                    htmlFor="standard-adornment-password-comfirm"
                  >
                    Confirmation de mot de passe
                  </InputLabel>
                  <Input
                    id="standard-adornment-password-comfirm"
                    value={passwordComfirmInput}
                    placeholder={"Entrez votre confirmation de mot de passe"}
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
                        setErrorMessagePasswordComfirm(
                          "Confirmation mot de passe : les mots de passe doivent être identiques"
                        );
                      } else {
                        setValidPasswordComfirmInput(true);

                        setErrorMessagePasswordComfirm("");
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordComfirm}
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
                    {errorMessagePasswordComfirm}
                  </FormHelperText>
                </FormControl>
                {/* <TextField
                  value={passwordComfirmInput}
                  style={{ margin: "20px 0px" }}
                  id={"comfirmPassword"}
                  label={"Comfirmation mot de passe"}
                  variant="standard"
                  type={"password"}
                  placeholder={"Entrez votre comfirmation mot de passe"}
                  FormHelperTextProps={{ style: { color: "red" } }}
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
                      setErrorMessagePasswordComfirm(
                        "Comfirmation mot de passe : les mots de passe doivent être identique"
                      );
                    } else {
                      setValidPasswordComfirmInput(true);

                      setErrorMessagePasswordComfirm("");
                    }
                  }}
                  helperText={errorMessagePasswordComfirm}
                /> */}
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
                <div className={styles.modalEditPasswordData__form__submit}>
                  {isMutating && (
                    <>
                      <button
                        disabled
                        className={
                          styles.modalEditPasswordData__form__submit__btn__load
                        }
                      >
                        <span
                          className={
                            styles.modalEditPasswordData__form__submit__btn__load__span
                          }
                        >
                          Chargement
                        </span>

                        <div
                          className={
                            styles.modalEditPasswordData__form__submit__btn__load__arc
                          }
                        >
                          <div
                            className={
                              styles.modalEditPasswordData__form__submit__btn__load__arc__circle
                            }
                          ></div>
                        </div>
                      </button>
                    </>
                  )}
                  {isMutating === false && (
                    <>
                      <input
                        className={
                          styles.modalEditPasswordData__form__submit__btn
                        }
                        type="submit"
                        value="Modifier"
                      />
                    </>
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

export default ModalUserPasswordData;
