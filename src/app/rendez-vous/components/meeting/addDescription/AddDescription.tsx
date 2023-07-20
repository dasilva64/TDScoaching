import fetchAddDescription from "../../../../components/fetch/meeting/fetchAddDescription";
import { RootState, AppDispatch } from "../../../../redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import styles from "./AddDescription.module.scss";
import useUserGet from "@/app/components/hook/user/useUserGet";
import { TextField } from "@mui/material";

const AddDescription = () => {
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [validDescriptionInput, setValidDescriptionInput] =
    useState<boolean>(false);
  const [errorMessageDescription, setErrorMessageDescription] =
    useState<string>("");

  const { mutate }: any = useUserGet();
  const { trigger, data } = useSWRMutation(
    `/api/meeting/edit`,
    fetchAddDescription
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        const mutateUser = async () => {
          try {
            await mutate({
              ...data,
              body: {
                ...data.body,
                meeting: {
                  ...data.body.meeting,
                  description: data.body.description,
                },
              },
            });
          } catch (error) {
            console.log(error);
          }
        };
        mutateUser();
      }
    }
  }, [data, mutate]);
  const handlerClickAdd = () => {
    if (validDescriptionInput === true) {
      const fetchAddDescription = async () => {
        trigger({ description: descriptionInput });
      };
      fetchAddDescription();
    } else {
      setErrorMessageDescription("Veuillez entrer une description");
    }
  };
  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
    regex: RegExp,
    setValidInput: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    errorMessage: string
  ) => {
    setInput(e.target.value);
    if (regex.test(e.target.value)) {
      setValidInput(true);
      setErrorMessage("");
    } else if (e.target.value.length === 0) {
      setValidInput(false);
      setErrorMessage("");
    } else {
      setValidInput(false);
      setErrorMessage(errorMessage);
    }
  };
  return (
    <>
      <div className={styles.addDescription}>
        <TextField
          value={descriptionInput}
          style={{ margin: "20px 0px" }}
          id={"description"}
          label={"Description"}
          variant="standard"
          type={"text"}
          placeholder={"Entrez votre description"}
          FormHelperTextProps={{ style: { color: "red" } }}
          onChange={(e) => {
            handlerInput(
              e,
              "password",
              /^(?=.*[a-z]).{1,}$/,
              setValidDescriptionInput,
              setErrorMessageDescription,
              setDescriptionInput,
              "Description : 1 caractère minimum"
            );
          }}
          helperText={errorMessageDescription}
        />
        <button
          className={styles.addDescription__btn}
          onClick={() => {
            handlerClickAdd();
          }}
        >
          Ajouter une description pour votre rendez-vous
        </button>
      </div>
    </>
  );
};

export default AddDescription;
