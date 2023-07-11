import React, { useEffect, useState } from "react";
import styles from "./ModalUserMainData.module.scss";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetchEditMainData from "../../../../../components/hook/user/useEditMainData";

const ModalUserMainData = () => {

  const [firstnameInput, setFirstnameInput] = useState<string>("firstname");
  const [lastnameInput, setLastnameInput] = useState<string>("lastname");
  const [validFirstnameInput, setValidFirstnameInput] =
    useState<boolean>(false);
  const [validLastnameInput, setValidLastnameInput] = useState<boolean>(false);
  const [errorMessageFirstname, setErrorMessageFirstname] =
    useState<string>("");
  const [errorMessageLastname, setErrorMessageLastname] = useState<string>("");

  const { trigger, data } = useSWRMutation(
    "http://localhost:8080/user/editMainData",
    fetchEditMainData
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
      } else {
      }
    }
  }, [data]);

  useEffect(() => {
    const mutateMainData = async () => {
      mutate(
        "/api/user/get",
        {
          ...data,
          body: {
            ...data.body,
            firstname: firstnameInput,
            lastname: lastnameInput,
          },
        },
        { revalidate: false }
      );
    };
    if (data) {
      mutateMainData();
    }
  });

  const closeForm = () => {
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validFirstnameInput === true || validLastnameInput === true) {
      const fetchLogin = async () => {
        trigger({ firstname: firstnameInput, lastname: lastnameInput });
      };
      fetchLogin();
    } else {
      if (validFirstnameInput === false) {
        setErrorMessageFirstname("Prénom : ne doit pas être vide");
      }
      if (validLastnameInput === false) {
        setErrorMessageLastname("Nom de famille : ne doit pas être vide");
      }
    }
  };
  return (
    <>
      <div className={styles.modalEditMainUserData}>
        <button
          className={styles.modalEditMainUserData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditMainUserData__btn__cross}>
            &times;
          </span>
        </button>
        <h1 className={styles.modalEditMainUserData__h1}>
          Modification des informations principales
        </h1>
        <form
          className={styles.modalEditMainUserData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <div className={styles.modalEditMainUserData__form__submit}>
            <input
              className={styles.modalEditMainUserData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUserMainData;
