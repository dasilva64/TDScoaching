import React, { useEffect, useState } from "react";
import styles from "../../../page.module.scss";
import fetchAddDescription from "../../../../components/hook/meeting/useAddDescription";
import useUser from "../../../../components/hook/useUserGetRole";
import useSWRMutation from "swr/mutation";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

const EditDescription = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);

  const [displayEditMeeting, setDisplayEditMeeting] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const { user, isLoading, isError, mutate }: any = useUser();

  const { trigger: triggerAddDescription, data: dataAddDescription } =
    useSWRMutation(
      `http://localhost:8080/meeting/${user ? user.body.meetingId : null}`,
      fetchAddDescription,
      { revalidate: false }
    );
  useEffect(() => {
    if (dataAddDescription) {
      if (dataAddDescription.status === 200) {
        console.log(dataAddDescription);

        const mutateUser = async () => {
          try {
            await mutate({
              ...user,
              body: {
                ...user.body,
                meeting: {
                  ...user.body.meeting,
                  description: dataAddDescription.body,
                },
              },
            });
          } catch (error) {
            console.log(error);
          }
        };
        if (user.body.meeting.description !== dataAddDescription.body) {
          mutateUser();
        }
      }
    }
  }, [dataAddDescription, mutate, user]);
  const handlerClickAdd = () => {
    const fetchAddDescription = async () => {
      console.log(user);
      triggerAddDescription({ description: description });
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
              defaultValue={user.body.meeting.description}
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
