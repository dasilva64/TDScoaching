import GroupForm from '@/app/components/form/group';
import { AppDispatch, RootState } from '@/app/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import useSWRMutation from "swr/mutation";
import styles from "./EmailValidData.module.scss"
import { mutate } from "swr";
import fetchEditEmailData from '@/app/components/hook/user/useEditEmailData';

const EmailValidData = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [codeInput, setCodeInput] = useState<string>("");
    const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
    const [errorMessageCode, setErrorMessageCode] = useState<string>("");
    const { displayModalEditValidEmailData } = useSelector(
        (state: RootState) => state.form
      );
      const closeForm = () => {
        dispatch({
          type: "form/closeModalEditValidEmailData",
        });
      };
      const {trigger, data} = useSWRMutation('http://localhost:8080/user/editEmail', fetchEditEmailData)

      useEffect(() => {
        if (data) {
          if (data.status === 200) {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "success", flashMessage: data.message },
            });
            dispatch({
              type: "form/closeModalEditEmailData",
            });
          } else {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: data.message },
            });
          }
        }
      }, [data, dispatch]);
      useEffect(() => {
        const mutateMainData = async () => {
          mutate(
            "/api/user/get",
            {
              ...data,
              body: {
                ...data.body,
                editEmail: null
              },
            },
            { revalidate: false }
          );
        };
        if (data) {
          mutateMainData();
        }
      }, [data])
      const handlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validCodeInput === true) {
          const fetchLogin = async () => {
            trigger({code: codeInput})
          };
          fetchLogin();
        } else {
          if (validCodeInput === false) {
            setErrorMessageCode("Code : doit contenir 8 chiffres");
          }
        }
      };
  return (
    <>
      {displayModalEditValidEmailData === true && (
        <div className={styles.modalEditEmailValidData}>
          <button
            className={styles.modalEditEmailValidData__btn}
            onClick={() => {closeForm()}}
          >
            <span className={styles.modalEditEmailValidData__btn__cross}>
              &times;
            </span>
          </button>
          <h1 className={styles.modalEditEmailValidData__h1}>
            Validation de votre email
          </h1>
          <form
            className={styles.modalEditEmailValidData__form}
            action=""
            onSubmit={(e) => {
              handlerSubmit(e);
            }}
          >
            <GroupForm
              nameLabel={"Code"}
              typeInput={"number"}
              nameInput={"code"}
              errorMessageInput={"Code : doit contenir 8 chiffres"}
              regex={/[0-9]{8,8}/}
              inputValue={codeInput}
              setInputValue={setCodeInput}
              setValidInput={setValidCodeInput}
              errorMessage={errorMessageCode}
              setErrorMessage={setErrorMessageCode}
            />
            <div className={styles.modalEditEmailValidData__form__submit}>
              <input
                className={styles.modalEditEmailValidData__form__submit__btn}
                type="submit"
                value="Valider votre mail"
              />
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default EmailValidData