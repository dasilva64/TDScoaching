import fetchAddDescription from "../../../../components/hook/meeting/useAddDescription";
import useUser from "../../../../components/hook/useUserGetRole";
import { RootState, AppDispatch } from "../../../../redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import styles from "../../../page.module.scss";

const AddDescription = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useRouter();
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
      <div className={styles.meet__meet__div}>
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
          ></textarea>
        </div>
      </div>
      <button
        className={styles.meet__meet__div__btn}
        onClick={() => {
          handlerClickAdd();
        }}
      >
        Ajouter une description pour votre rendez-vous
      </button>
    </>
  );
};

export default AddDescription;
