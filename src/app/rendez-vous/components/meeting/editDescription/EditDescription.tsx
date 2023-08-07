import React, { useEffect, useState } from "react";
import styles from "../../../page.module.scss";
import fetchAddDescription from "../../../../components/fetch/meeting/fetchAddDescription";
import useSWRMutation from "swr/mutation";
import useUserGet from "@/app/components/hook/user/useUserGet";

const EditDescription = () => {
  const [displayEditMeeting, setDisplayEditMeeting] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const { userData, mutate }: any = useUserGet();

  const { trigger, data } = useSWRMutation(
    `/api/meeting/editDescription`,
    fetchAddDescription
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        const mutateUser = async () => {
          try {
            await mutate({
              ...userData,
              body: {
                ...userData.body,
                meeting: {
                  ...userData.body.meeting,
                  description: data.body,
                },
              },
            });
          } catch (error) {
            console.log(error);
          }
        };
        if (userData.body.meeting.description !== data.body) {
          mutateUser();
        }
      }
    }
  }, [data, mutate, userData]);
  const handlerClickAdd = () => {
    const fetchAddDescription = async () => {
      trigger({ description: description });
    };
    fetchAddDescription();
  };
  return (
    <>
      {displayEditMeeting === true && (
        <div className={styles.meet__comfirm}>
          <button
            className={styles.meet__comfirm__btn}
            onClick={() => setDisplayEditMeeting(false)}
          >
            <span className={styles.meet__comfirm__btn__cross}>&times;</span>
          </button>
          <h1 className={styles.meet__comfirm__h1}>
            Modification de la description
          </h1>
          <div>
            <label
              className={styles.meet__meet__div__label}
              htmlFor="description"
            >
              Description :{" "}
            </label>
            <textarea
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              name="description"
              id="description"
              className={styles.meet__meet__div__input}
              defaultValue={userData.body.meeting.description}
            ></textarea>
          </div>
          <div className={styles.meet__comfirm__div}>
            <button
              className={styles.meet__comfirm__div__btn}
              onClick={() => {
                handlerClickAdd();
                setDisplayEditMeeting(false);
              }}
            >
              Modifier la description
            </button>
          </div>
        </div>
      )}
      <div>
        <button
          className={styles.meet__meet__div__btn}
          onClick={() => {
            setDisplayEditMeeting(true);
          }}
        >
          Modifier la description
        </button>
      </div>
    </>
  );
};

export default EditDescription;
