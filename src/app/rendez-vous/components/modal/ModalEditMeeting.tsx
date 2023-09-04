import React, { useEffect } from "react";
import styles from "./ModalEditMeeting.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import fetchPost from "@/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";

const ModalEditMeeting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dataModalEditMeeting } = useSelector(
    (state: RootState) => state.form
  );
  const { data, trigger } = useSWRMutation("/api/meeting/edit", fetchPost);
  const closeForm = () => {
    dispatch({
      type: "form/closeModalEditMeeting",
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
          type: "form/closeModalEditMeeting",
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "start") {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: { type: "error", flashMessage: element[1] },
            });
          }
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
    const mutateMeetingData = async () => {
      mutate(
        "/api/user/getUserMeeting",
        {
          ...data,
        },
        { revalidate: false }
      );
    };
    if (data && data.body) {
      mutateMeetingData();
    }
  }, [data]);
  const handlerClick = () => {
    const fetchEditMeeting = async () => {
      trigger({
        start: new Date(dataModalEditMeeting).toLocaleString("en-US"),
      });
    };
    fetchEditMeeting();
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
        <h1 className={styles.modalComfirm__h1}>Modification du rendez-vous</h1>
        <p>
          Rappel du rendez-vous :{" "}
          {new Date(dataModalEditMeeting).toLocaleString("fr-FR")}
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

export default ModalEditMeeting;
