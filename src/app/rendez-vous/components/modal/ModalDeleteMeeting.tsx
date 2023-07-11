import React, { useEffect, useState } from "react";
import styles from "./ModalDeleteMeeting.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import useDelete from "@/app/components/hook/meeting/useDeleteMeeting";
import { mutate } from "swr";

const ModalDeleteMeeting = ({ id, setDataTest }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLog } = useSelector((state: RootState) => state.auth);
  const [userClickOnButton, setUserClickOnButton] = useState<boolean>(false);

  const closeForm = () => {
    dispatch({
      type: "form/closeModalDeleteMeeting",
    });
  };
/*   const { data } = useDelete(
    isLog,
    userClickOnButton,
    setUserClickOnButton,
    id
  ); */
 /*  useEffect(() => {
    console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
    if (data && data.status === 200) {
      mutate("/api/get");
      setUserClickOnButton(false);
    }
  }, [data, setDataTest]); */
  return (
    <>
      <div className={styles.modalDeleteMeeting}>
        <button
          className={styles.modalDeleteMeeting__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalDeleteMeeting__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalDeleteMeeting__h1}>
          Voulez vous vraiment supprimer ce rendez-vous
        </h1>

        <p>
          Si vous supprimer ce rendez-vous le paiement que vous avez effectué ne
          sera pas validé et aucun argent ne sera débité de votre compte.
        </p>
        <div className={styles.modalDeleteMeeting__register}>
          <button
            className={styles.modalDeleteMeeting__register__btn}
            onClick={() => {
              setUserClickOnButton(true);
            }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalDeleteMeeting;
