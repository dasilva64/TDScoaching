import React, { useEffect, useState } from "react";
import styles from "./DeleteMeeting.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import fetchDeleteMeeting from "../../../../components/fetch/meeting/fetchDeleteMeeting";
import useSWRMutation from "swr/mutation";
import useAll from "../../../../components/hook/meeting/useAllAfterNow";
import useUserGet from "@/app/components/hook/user/useUserGet";

const DeleteMeeting = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);

  const { userData, isLoading, isError, mutate }: any = useUserGet();
  const { allMeeting, mutateMeeting } = useAll();

  const dispatch = useDispatch<AppDispatch>();
  const [userClickOnButton, setUserClickOnButton] = useState<boolean>(false);

  const { displayModalDeleteMeeting } = useSelector(
    (state: RootState) => state.form
  );
  console.log(userData);
  const { trigger: triggerDeleteMeeting, data: dataDeleteMeeting } =
    useSWRMutation(
      `http://localhost:8080/meeting/${userData.body.meetingId}`,
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
      let test = userData.body.meetingId;
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
        ...userData,
        body: { ...userData.body, meetingId: null, meeting: null },
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
