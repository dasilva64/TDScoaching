import React, { useEffect, useState } from "react";
import styles from "./DeleteMeeting.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import fetchDeleteMeeting from "@/app/components/hook/meeting/useDeleteMeeting";
import useSWRMutation from "swr/mutation";
import useUser from "@/app/components/hook/useUser";
import useAll from "@/app/components/hook/meeting/useAll";

const DeleteMeeting = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);

  const { user, isLoading, isError, mutate }: any = useUser();
  const { allMeeting, mutateMeeting } = useAll(isLog);

  const dispatch = useDispatch<AppDispatch>();
  const [userClickOnButton, setUserClickOnButton] = useState<boolean>(false);

  const { displayModalDeleteMeeting } = useSelector(
    (state: RootState) => state.form
  );
  console.log(user);
  const { trigger: triggerDeleteMeeting, data: dataDeleteMeeting } =
    useSWRMutation(
      `http://localhost:8080/meeting/${user.body.meetingId}`,
      fetchDeleteMeeting
    );

  useEffect(() => {
    if (dataDeleteMeeting) {
      if (dataDeleteMeeting.status === 200) {
        setUserClickOnButton(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataDeleteMeeting.message },
        });
        dispatch({
          type: "form/closeModalDeleteMeeting",
        });
      } else {
        setUserClickOnButton(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataDeleteMeeting.message },
        });
      }
    }
  }, [dataDeleteMeeting, dispatch]);
  const handlerClick = async () => {
    triggerDeleteMeeting();
    try {
      let index;
      let test = user.body.meetingId;
      for (let i = 0; i < allMeeting.length; i++) {
        if (allMeeting[i].id === test) {
          index = i;
        }
      }

      if (index) {
        await mutateMeeting([
          ...allMeeting.splice(0, index),
          ...allMeeting.slice(index + 1),
        ]);
      }
      await mutate({
        ...user,
        body: { ...user.body, meetingId: null, meeting: null },
      });

      console.log("wait");
    } catch (error) {
      console.log("error");
    }
  };
  const closeFormDelete = () => {
    dispatch({
      type: "form/closeModalDeleteMeeting",
    });
  };
  return (
    <>
      {displayModalDeleteMeeting === true && (
        <>
          <div className={styles.modalDeleteMeeting__modal}>
            <button
              className={styles.modalDeleteMeeting__modal__btn}
              onClick={() => closeFormDelete()}
            >
              <span className={styles.modalDeleteMeeting__modal__btn__cross}>
                &times;
              </span>
            </button>
            <h1 className={styles.modalDeleteMeeting__modal__h1}>
              Voulez vous vraiment supprimer ce rendez-vous
            </h1>

            <p>
              Si vous supprimer ce rendez-vous le paiement que vous avez
              effectué ne sera pas validé et aucun argent ne sera débité de
              votre compte.
            </p>
            <div className={styles.modalDeleteMeeting__modal__remove}>
              <button
                className={styles.modalDeleteMeeting__modal__remove__btn}
                onClick={() => {
                  handlerClick();
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </>
      )}
      <div className={styles.modalDeleteMeeting__div}>
        <div>
          <button
            className={styles.modalDeleteMeeting__div__btn__delete}
            onClick={() => {
              dispatch({
                type: "form/openModalDeleteMeeting",
              });
            }}
          >
            Supprimer votre rendez-vous
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteMeeting;
