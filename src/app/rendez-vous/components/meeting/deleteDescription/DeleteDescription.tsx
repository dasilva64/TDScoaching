import React, { useEffect } from "react";
import styles from "../../../page.module.scss";
import fetchDeleteDescription from "../../../../components/fetch/meeting/fetchDeleteDescription";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import useUserGet from "@/app/components/hook/user/useUserGet";

const DeleteDescription = () => {
  const { userData, isLoading, isError, mutate }: any = useUserGet();

  const { trigger, data } = useSWRMutation(
    `/api/meeting/deleteDescription`,
    fetchDeleteDescription
  );

  /* useEffect(() => {
    if (data) {
      if (data.status === 200) {
        console.log(data);
        const mutateUser = async () => {
          try {
            await mutate({
              ...data,
              body: {
                ...data.body,
                meeting: { ...data.body.meeting, description: null },
              },
            });
          } catch (error) {
            console.log(error);
          }
        };
          mutateUser();
      }
    }
  }, [data, mutate]); */
  const handlerClickDeleteDescription = () => {
    const fetchDeleteMeeting = async () => {
      trigger();
    };
    fetchDeleteMeeting();
  };
  return (
    <>
      <div>
        <button
          className={styles.meet__meet__div__btn}
          onClick={() => {
            handlerClickDeleteDescription();
          }}
        >
          Supprimer la description
        </button>
      </div>
    </>
  );
};

export default DeleteDescription;
