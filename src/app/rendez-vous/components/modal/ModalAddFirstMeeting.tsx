import React, { useEffect } from "react";
import styles from "./ModalAddFirstMeeting.module.scss";
import fetchGetPayment from "@/app/components/fetch/paiement/useGet";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/user/FetchPost";
import { mutate } from "swr";

const ModalAddFirstMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trigger, data } = useSWRMutation("/api/meeting/addFirst", fetchPost);
  const { dataModalFirstMeeting } = useSelector(
    (state: RootState) => state.form
  );
  const closeForm = () => {
    dispatch({
      type: "form/closeModalFirstMeeting",
    });
  };
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "succes", flashMessage: data.message },
        });
        dispatch({
          type: "form/closeModalFirstMeeting",
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
  useEffect(() => {
    const mutateMeetingData = async () => {
      console.log(data);
      mutate(
        "/api/user/getUser",
        {
          ...data,
          body: {
            ...data.body,
            meeting: data.body.meeting,
            meetings: data.body.meetings,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.body) {
      mutateMeetingData();
    }
  }, [data]);
  const handlerClick = () => {
    let startstr = "";
    let endstr = "";
    let copyChoiceDate = dataModalFirstMeeting;
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
        <h1 className={styles.modalComfirm__h1}>
          Prise de rendez-vous de découverte
        </h1>
        <p>Rappel du rendez-vous : {dataModalFirstMeeting}</p>
        <p>
          Pour comfirmer le rendez-vous de découverte aucune autorisation
          bancaire est nécessaire.
        </p>
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

export default ModalAddFirstMeeting;
