import { AppDispatch, RootState } from "@/app/redux/store";
import React, { useEffect } from "react";
import styles from "./ModalAddOtherMeeting.module.scss";
import { useDispatch, useSelector } from "react-redux";
import fetchPost from "@/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";

const ModalAddOtherMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dataModalOtherMeeting } = useSelector(
    (state: RootState) => state.form
  );
  const closeForm = () => {
    dispatch({
      type: "form/closeModalOtherMeeting",
    });
  };
  const { trigger, data } = useSWRMutation("/api/meeting/addOther", fetchPost);
  /* useEffect(() => {
    if (data) {
      window.location.href = data.url;
    }
  }, [data]); */
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalOtherMeeting",
        });
      } else if (data.status === 400) {
        /* data.message.forEach((element: string) => {
          if (element[0] === "firstname") {
            setErrorMessageFirstname(element[1]);
          }
        }); */
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch]);
  const handlerClick = () => {
    let startstr = "";
    let endstr = "";
    let copyChoiceDate = dataModalOtherMeeting;
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
      trigger({ start: formatDate });
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
        <h1 className={styles.modalComfirm__h1}>Prise de rendez-vous</h1>
        <p>Rappel du rendez-vous : {dataModalOtherMeeting}</p>

        <div className={styles.modalComfirm__div}>
          <button
            className={styles.modalComfirm__div__btn}
            onClick={() => {
              handlerClick();
            }}
          >
            Comfirmer
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalAddOtherMeeting;
