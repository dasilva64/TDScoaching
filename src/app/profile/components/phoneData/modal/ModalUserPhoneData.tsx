import React, { useEffect, useState } from "react";
import styles from "./ModalUserPhoneData.module.scss";
import GroupForm from "../../../../components/form/group";
import useUser from "../../../../components/hook/useUserGetRole";
import fetchEditPasswordData from "../../../../components/hook/user/useEditPasswordData";
import { RootState, AppDispatch } from "../../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";

const ModalUserPhoneData = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [validPhoneInput, setValidPhoneInput] = useState<boolean>(false);
  const [errorMessagePhone, setErrorMessagePhone] = useState<string>("");
  const [userClickForm, setUserClickForm] = useState<boolean>(false);

  const { trigger, data } = useSWRMutation(
    "http://localhost:8080/user/editPassword",
    fetchEditPasswordData
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalEditPasswordData",
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch]);

  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditPhoneData",
    });
  };

  const handlerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validPhoneInput === true) {
      const fetchLogin = async () => {};
      fetchLogin();
    } else {
      if (validPhoneInput === false) {
        setErrorMessagePhone("Mot de passe : ne doit pas être vide");
      }
    }
  };
  return (
    <>
      <div className={styles.modalEditPhoneData}>
        <button
          className={styles.modalEditPhoneData__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalEditPhoneData__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalEditPhoneData__h1}>
          Modification du numéro de téléphone
        </h1>
        <form
          className={styles.modalEditPhoneData__form}
          action=""
          onSubmit={(e) => {
            handlerSubmit(e);
          }}
        >
          <GroupForm
            nameLabel={"Numéro de téléphone"}
            typeInput={"number"}
            nameInput={"phone"}
            errorMessageInput={
              "Comfirmation mot de passe : doit avoir une lettre ne minuscule, un nombre et 8 caractères minimum"
            }
            regex={/^(?=.*[a-z]).{1,}$/}
            inputValue={phoneInput}
            setInputValue={setPhoneInput}
            setValidInput={setValidPhoneInput}
            errorMessage={errorMessagePhone}
            setErrorMessage={setErrorMessagePhone}
          />
          <div className={styles.modalEditPhoneData__form__submit}>
            <input
              className={styles.modalEditPhoneData__form__submit__btn}
              type="submit"
              value="Modifier"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUserPhoneData;
