import React from "react";
import styles from "./SendCode.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";

const SendCode = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const closeForm = () => {
    dispatch({
      type: "form/toggleLogin",
    });
  };
  const handlerSendCode = () => {
    const fetchSendCode = async () => {
      let response = await fetch("http://localhost:8080/user/sendcode", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      let json = await response.json();
      dispatch({
        type: "form/openCheck",
      });
    };
    fetchSendCode();
  };
  return (
    <>
      <div className={styles.sendCode}>
        <button className={styles.sendCode__btn} onClick={() => closeForm()}>
          <span className={styles.sendCode__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.sendCode__h1}>Envoyer un code de vérification</h1>
        <button
          onClick={() => {
            handlerSendCode();
          }}
        >
          Envoyer
        </button>
      </div>
    </>
  );
};

export default SendCode;
