import fetchGetPayment from "@/app/components/fetch/paiement/useGet";
import { AppDispatch, RootState } from "@/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import styles from "./ModalAddMeeting.module.scss";

const ModalAddMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dataModalMeeting } = useSelector((state: RootState) => state.form);
  const { isLog } = useSelector((state: RootState) => state.auth);
  const [userClickOnButton, setUserClickOnButton] = useState<boolean>(false);

  const closeForm = () => {
    dispatch({
      type: "form/closeModalMeeting",
    });
  };
  const { trigger: triggerGet, data: dataGet } = useSWRMutation(
    "http://localhost:8080/payment/get",
    fetchGetPayment
  );
  useEffect(() => {
    if (dataGet) {
      window.location.href = dataGet.url;
    }
  }, [dataGet]);
  const handlerPayment = () => {
    let startstr = "";
    let endstr = "";
    let copyChoiceDate = dataModalMeeting;
    copyChoiceDate.split(" ").map((el: any, index: any) => {
      if (index === 0) {
        el.split("/")
          .reverse()
          .map((el: any) => {
            startstr = startstr + el + "-";
          });
      } else {
        el.split(":").map((el: any) => {
          endstr = endstr + el + ":";
        });
      }
    });
    let formatDate =
      startstr.slice(0, startstr.length - 1) +
      "T" +
      endstr.slice(0, endstr.length - 1) +
      ".000Z";
    const fetchAddMeeting = async () => {
      triggerGet({ start: formatDate });
    };
    fetchAddMeeting();
  };
  return (
    <>
      <div className={styles.modalComfirm}>
        <button
          className={styles.modalComfirm__btn}
          onClick={() => closeForm()}
        >
          <span className={styles.modalComfirm__btn__cross}>&times;</span>
        </button>
        <h1 className={styles.modalComfirm__h1}>Comfirmation de rendez-vous</h1>
        <p>Rappel du rendez-vous : {dataModalMeeting}</p>
        <p>
          Pour comfirmer le rendez-vous une autorisation bancaire est
          nécessaire. Aucune somme ne sera débitée avant la fin de la
          consultation vidéo.
        </p>
        <div className={styles.modalComfirm__div}>
          <button
            className={styles.modalComfirm__div__btn}
            onClick={() => {
              handlerPayment();
            }}
          >
            Payer pour comfirmer
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalAddMeeting;
