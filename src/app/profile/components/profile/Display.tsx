"use client";

import React, { cache, useEffect, useState } from "react";
import styles from "../../page.module.scss";
import { RootState } from "../../../redux/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import useUser from "../../../components/hook/useUserGetRole";
import useEdit from "../../../components/hook/useEdit";
import useUserGet from "../../../components/hook/useUserGet";

/* const fetchEdit = async (url: string, dataInput: string) => {
  console.log('test')
  //const dispatch = useDispatch()

  let response = await fetch(url, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ data: dataInput }),
  });
  let json = await response.json();
  console.log(json);
  dispatch({
    type: "flash/storeFlashMessage",
    payload: { type: "error", flashMessage: json.message },
  });
  if (json.status === 401) {
    throw new Error(json.message);
  }
  return json;
}; */

const Display = () => {
  const { push } = useRouter();
  const { isLog } = useSelector((state: RootState) => state.auth);
  const { emailUser } = useSelector((state: RootState) => state.auth);
  const [dataInput, setDataInput] = useState<string>("");
  const [userClick, setUserClick] = useState<boolean>(false);
  const [urlFetch, setUrlFetch] = useState<string>("");

  const [tesst, setTesst] = useState<boolean>(true);
  const { userData, isLoading, isError, mutate } = useUserGet();
  const [editFirstname, setEditFirstname] = useState<boolean>(false);
  const [editLastname, setEditLastname] = useState<boolean>(false);
  const [editPassword, setEditPassword] = useState<boolean>(false);
  const [editEmail, setEditEmail] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<boolean>(false);

  const [inputFirstname, setInputFirstname] = useState<string>(
    userData?.body.firstname
  );
  const [inputLastname, setInputLastname] = useState<string>(
    userData?.body.lastname
  );
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>(userData?.body.email);
  const [inputPhone, setInputPhone] = useState<string>("");

  const [inputErrorFirstname, setInputErrorFirstname] = useState<string>("");
  const [inputErrorLastname, setInputErrorLastname] = useState<string>("");
  const [inputErrorPassword, setInputErrorPassword] = useState<string>("");
  const [inputErrorEmail, setInputErrorEmail] = useState<string>("");
  const [inputErrorPhone, setInputErrorPhone] = useState<string>("");

  const [inputValidFirstname, setInputValidFirstname] =
    useState<boolean>(false);
  const [inputValidLastname, setInputValidLastname] = useState<boolean>(false);
  const [inputValidPassword, setInputValidPassword] = useState<boolean>(false);
  const [inputValidEmail, setInputValidEmail] = useState<boolean>(false);
  const [inputValidPhone, setInputValidPhone] = useState<boolean>(false);

  useEdit(isLog, dataInput, userClick, setUserClick, urlFetch);

  const [displayModalPassword, setDisplayModalPassword] =
    useState<boolean>(false);

  const handlerInputFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      handler(e, true, "", "firstname");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "firstname");
    } else {
      handler(e, false, "Firstname : need to be not empty", "firstname");
    }
  };

  const handlerInputLastname = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      handler(e, true, "", "lastname");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "lastname");
    } else {
      handler(e, false, "Lastname : need to be not empty", "lastname");
    }
  };

  const handlerInputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      handler(e, true, "", "password");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "password");
    } else {
      handler(e, false, "Password : need to be not empty", "password");
    }
  };

  const handlerInputPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      handler(e, true, "", "phone");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "phone");
    } else {
      handler(e, false, "Phone : need to be not empty", "phone");
    }
  };

  const handlerInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 3) {
      handler(e, true, "", "email");
    } else if (e.target.value.length === 0) {
      handler(e, false, "", "email");
    } else {
      handler(e, false, "Email : need to be not empty", "email");
    }
  };

  const handler = (
    e: React.ChangeEvent<HTMLInputElement>,
    valid: boolean,
    text: string,
    type: string
  ) => {
    if (type === "email") {
      setInputEmail(e.target.value);
      setInputValidEmail(valid);
      setInputErrorEmail(text);
    } else if (type === "firstname") {
      setInputFirstname(e.target.value);
      setInputValidFirstname(valid);
      setInputErrorFirstname(text);
    } else if (type === "lastname") {
      setInputLastname(e.target.value);
      setInputValidLastname(valid);
      setInputErrorLastname(text);
    } else if (type === "password") {
      setInputPassword(e.target.value);
      setInputValidPassword(valid);
      setInputErrorPassword(text);
    } else if (type === "passwordComfirm") {
      /* setPasswordComfirmInput(e.target.value);
      setValidPasswordComfirmInput(valid);
      setPasswordComfirmError(text); */
    } else if (type === "phone") {
      setInputPhone(e.target.value);
      setInputValidPhone(valid);
      setInputErrorPhone(text);
    }

    return valid;
  };
  const editUserMutation = async (
    url: string,
    dataInput: any,
    type: string
  ) => {
    setDataInput(dataInput);
    setUrlFetch(url);
    setUserClick(true);
    setEditPhone(!editPhone);
    //await fetchEdit(url, dataInput);
    if (type === "firstname") {
      setEditFirstname(!editFirstname);
      try {
        console.log("wait");
        await mutate({ ...userData, user: { firstname: dataInput } });
      } catch (error) {
        console.log("error");
      }
    } else if (type === "lastname") {
      console.log("2");
      setEditLastname(!editLastname);
      try {
        await mutate({ ...userData, user: { lastname: dataInput } });
      } catch (error) {
        console.log("error");
      }
    } else if (type === "email") {
      setEditEmail(!editEmail);
      try {
        await mutate({ ...userData, user: { email: dataInput } });
      } catch (error) {
        console.log("error");
      }
    } else if (type === "password") {
      setEditPassword(!editPassword);
      try {
        await mutate({ ...userData, user: { password: dataInput } });
      } catch (error) {
        console.log("error");
      }
    } else if (type === "phone") {
      setEditPhone(!editPhone);
      try {
        await mutate(
          { ...userData, body: { ...userData.body, phone: dataInput } },
          { revalidate: false }
        );
      } catch (error) {
        console.log("error");
      }
    } else if (type === "twoFactor") {
      try {
        await mutate({ ...userData, user: { twoFactor: dataInput } });
      } catch (error) {
        console.log("error");
      }
    }
  };
  console.log(userData);

  const handlerClickFirstname = () => {
    if (inputFirstname.trim() !== userData.body.firstname.trim()) {
      editUserMutation(
        "http://localhost:8080/user/editFirstname",
        inputFirstname,
        "firstname"
      );
    }
  };

  const handlerClickLastname = () => {
    if (inputLastname.trim() !== userData.body.lastname.trim()) {
      editUserMutation(
        "http://localhost:8080/user/editLastname",
        inputLastname,
        "lastname"
      );
    }
  };

  const handlerClickEmail = () => {
    if (inputEmail.trim() !== userData.body.email.trim()) {
      editUserMutation(
        "http://localhost:8080/user/editEmailSendToken",
        inputEmail,
        "email"
      );
    }
  };

  const handlerClickPassword = () => {
    editUserMutation(
      "http://localhost:8080/user/editPassword",
      inputPassword,
      "password"
    );
  };

  const handlerClickPhone = () => {
    editUserMutation(
      "http://localhost:8080/user/editPhone",
      inputPhone,
      "phone"
    );
  };
  const handlerClickTwoFactor = (check: boolean) => {
    editUserMutation(
      "http://localhost:8080/user/editTwoFactor",
      check,
      "twoFactor"
    );
  };
  let content;

  if (isError && isError.message) {
    content = (
      <div className={styles.profile__article__h2}>{isError.message}</div>
    );
  } else if (isLoading) {
    content = <div className={styles.profile__article__h2}>loading...</div>;
  } else {
    content = (
      <>
        {userData && userData.status === 200 && (
          <ul className={styles.profile__article__ul}>
            <li className={styles.profile__article__li}>
              Prénom :{" "}
              <input
                onChange={(e) => {
                  handlerInputFirstname(e);
                }}
                className={styles.login__form__input__remember}
                type="text"
                name="firstname"
                id="firstname"
                defaultValue={userData.body.firstname}
              />
              <span
                onClick={() => {
                  if (inputFirstname && inputFirstname.length > 0) {
                    handlerClickFirstname();
                  }

                  //setMounted(false);
                }}
                className={styles.profile__article__span}
              >
                Modifier
              </span>
            </li>
            <li className={styles.profile__article__li}>
              Nom :{" "}
              <input
                onChange={(e) => {
                  if (inputLastname && inputLastname.length > 0) {
                    handlerInputLastname(e);
                  }
                }}
                className={styles.login__form__input__remember}
                type="text"
                name="lastname"
                id="lastname"
                defaultValue={userData.body.lastname}
              />
              <span
                onClick={() => {
                  handlerClickLastname();
                }}
                className={styles.profile__article__span}
              >
                Modifier
              </span>
            </li>
            <li className={styles.profile__article__li}>
              Email :
              <input
                onChange={(e) => {
                  handlerInputEmail(e);
                }}
                className={styles.login__form__input__remember}
                type="text"
                name="email"
                id="email"
                defaultValue={userData.body.email}
              />
              <span
                onClick={() => {
                  if (inputEmail && inputEmail.length > 0) {
                    handlerClickEmail();
                  }
                }}
                className={styles.profile__article__span}
              >
                Modifier
              </span>
            </li>
            <li className={styles.profile__article__li}>
              Mot de passe :{" "}
              {(editPassword === false && "*".repeat(6)) ||
                (editPassword === true && (
                  <input
                    onChange={(e) => {
                      handlerInputPassword(e);
                    }}
                    className={styles.login__form__input__remember}
                    type="text"
                    name="password"
                    id="password"
                  />
                ))}
              {editPassword === true && <span>{inputErrorPassword}</span>}
              {(editPassword === false && (
                <span
                  onClick={() => {
                    setDisplayModalPassword(true);
                  }}
                  className={styles.profile__article__span}
                >
                  Modifier
                </span>
              )) ||
                (editPassword === true && (
                  <div className={styles.profile__article__div}>
                    <span
                      onClick={() => {
                        handlerClickPassword();
                      }}
                      className={`${styles.profile__article__div__span} ${styles.profile__article__div__span__margin}`}
                    >
                      Sauvegarder
                    </span>
                    <span
                      onClick={() => {
                        setEditPassword(!editPassword);
                      }}
                      className={styles.profile__article__div__span}
                    >
                      Annuler
                    </span>
                  </div>
                ))}
            </li>
            <li className={styles.profile__article__li}>
              Téléphone :{" "}
              {(editPhone === false && userData.body.phone) ||
                (editPhone === true && (
                  <input
                    onChange={(e) => {
                      handlerInputPhone(e);
                    }}
                    className={styles.login__form__input__remember}
                    type="text"
                    name="phone"
                    id="phone"
                    defaultValue={userData.body.phone}
                  />
                ))}
              {editPhone === true && <span>{inputErrorPhone}</span>}
              {(editPhone === false && (
                <span
                  onClick={() => {
                    setEditPhone(!editPhone);
                    //setMounted(false);
                  }}
                  className={styles.profile__article__span}
                >
                  Modifier
                </span>
              )) ||
                (editPhone === true && (
                  <div className={styles.profile__article__div}>
                    <span
                      onClick={() => {
                        handlerClickPhone();
                      }}
                      className={`${styles.profile__article__div__span} ${styles.profile__article__div__span__margin}`}
                    >
                      Sauvegarder
                    </span>
                    <span
                      onClick={() => {
                        setEditPhone(!editPhone);
                      }}
                      className={styles.profile__article__div__span}
                    >
                      Annuler
                    </span>
                  </div>
                ))}
            </li>
            {userData.body.meeting === null && (
              <li className={styles.profile__article__li}>
                Rendez-vous : Aucun rendez-vous programmé
                <span
                  onClick={() => {
                    push("/rendez-vous");
                  }}
                  className={styles.profile__article__span}
                >
                  Ajouter
                </span>
              </li>
            )}

            {userData.body.meeting !== null && (
              <li className={styles.profile__article__li}>
                Rendez-vous : Un rendez-vous programmé
                <span
                  onClick={() => {
                    push("/rendez-vous");
                  }}
                  className={styles.profile__article__span}
                >
                  Voir
                </span>
              </li>
            )}
            <li className={styles.profile__article__li}>
              Two factor : {userData.body.twoFactor ? "Activé" : "Désactivé"}
              <input
                className={styles.profile__article__span}
                onChange={(e) => {
                  handlerClickTwoFactor(e.target.checked);
                }}
                type="checkbox"
                name=""
                id=""
                value={userData.body.twoFactor}
              />
            </li>
          </ul>
        )}
      </>
    );
  }

  const closeForm = () => {
    setDisplayModalPassword(false);
  };
  return (
    <>
      {displayModalPassword === true && (
        <div className={styles.profile__modalPassword}>
          <button
            className={styles.profile__modalPassword__btn}
            onClick={() => closeForm()}
          >
            <span className={styles.profile__modalPassword__btn__cross}>
              &times;
            </span>
          </button>
          <h1 className={styles.profile__modalPassword__h1}>
            Modification du mot de passe
          </h1>
          <form className={styles.profile__modalPassword__form}>
            <div className={styles.profile__modalPassword__form__group}>
              <label
                className={styles.profile__modalPassword__form__group__label}
                htmlFor="password"
              >
                Mot de passe
              </label>
              <input
                className={styles.profile__modalPassword__form__group__input}
                type="password"
                name="password"
                id="password"
              />
            </div>
            <div className={styles.profile__modalPassword__form__group}>
              <label
                className={styles.profile__modalPassword__form__group__label}
                htmlFor="passwordComfirm"
              >
                Comfirmation de mot de passe
              </label>
              <input
                className={styles.profile__modalPassword__form__group__input}
                type="password"
                name="passwordComfirm"
                id="passwordComfirm"
              />
            </div>
            <div className={styles.profile__modalPassword__form__submit}>
              <input
                className={styles.profile__modalPassword__form__submit__btn}
                type="submit"
                value="Modifier"
              />
            </div>
          </form>
        </div>
      )}

      {content}
    </>
  );
};

export default Display;
