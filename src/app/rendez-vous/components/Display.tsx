"use client";

import React from "react";
import styles from "../page.module.scss";
import { useEffect, useState } from "react";
import DatePickerDesktop from "./datePicker/DatePickerDesktop";
import DisplayMeeting from "./meeting/DisplayMeeting";
import useUserGet from "@/app/components/hook/user/useUserGet";
import { FormControl } from "@mui/base";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import Link from "next/link";
import fetchPost from "@/app/components/fetch/user/FetchPost";
import useSWRMutation from "swr/mutation";
import { useDispatch } from "react-redux";
import form from "@/app/redux/feature/form";
import DisplayDiscoveryMeeting from "./meeting/DisplayDiscoveryMeeting";

const Display = () => {
  const [mobile, setMobile] = useState<boolean | null>(null);
  const { userData, isLoading, isError, mutate } = useUserGet();
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const dispatch = useDispatch();
  const [inputFormule, setInputFormule] = useState<string>("");
  const [validFormuleInput, setValidFormuleInput] = useState<boolean>(false);
  const [errorMessageFormule, setErrorMessageFormule] = useState<string>("");
  const { trigger, data } = useSWRMutation(
    "/api/user/editFormuleUser",
    fetchPost
  );

  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate(
          {
            ...data,
            body: {
              ...data.body,
              typeMeeting: inputFormule,
            },
          },
          { revalidate: false }
        );
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "formule") {
            setErrorMessageFormule(element[1]);
          }
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch, inputFormule, mutate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validFormuleInput === true) {
      if (inputPseudo.length === 0) {
        const fetchEdit = async () => {
          trigger({
            pseudo: inputPseudo,
            formule: inputFormule,
          });
        };
        fetchEdit();
      }
    } else {
      setErrorMessageFormule("Veuillez choisir une formule");
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 600) {
        if (mobile === false || mobile === null) {
          setMobile(true);
        }
      } else {
        if (mobile === true || mobile === null) {
          setMobile(false);
        }
      }
    }
  }, [mobile]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        if (window.innerWidth < 600) {
          if (mobile === false || mobile === null) {
            setMobile(true);
          }
        } else {
          if (mobile === true || mobile === null) {
            setMobile(false);
          }
        }
      });
    }
  }, [mobile]);
  let content;
  if (isError && isError.message) {
    content = (
      <div className={styles.profile__article__h2}>{isError.message}</div>
    );
  } else if (isLoading) {
    content = (
      <div className={styles.loadData}>
        <div className={styles.loadData__div}>
          Chargement des données
          <div className={styles.loadData__div__arc}>
            <div className={styles.loadData__div__arc__circle}></div>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <>
        {/* {mobile === false &&
          userData &&
          userData.body.meeting === null &&
          userData.body.typeMeeting !== null && (
            
          )} */}
        {userData &&
          !userData.body.meeting &&
          userData.body.typeMeeting !== null &&
          mobile === true &&
          {
            /* <DatePickerMobile
              user={userData}
              events={allMeeting}
              setDisplayModal={setDisplayModal}
              setDateMeeting={setDateMeeting}
            /> */
          }}
        {userData.body.typeMeeting.type === "découverte" && (
          <>
            {userData.body.meeting === null &&
              userData.body.discovery === false && (
                <DatePickerDesktop
                  events={userData?.body.meetings}
                  discovery={userData?.body.discovery}
                />
              )}

            <DisplayDiscoveryMeeting />
          </>
        )}
        {userData.body.typeMeeting.type !== "découverte" && (
          <>
            <>
              <DatePickerDesktop
                events={userData?.body.meetings}
                discovery={userData?.body.discovery}
              />
            </>
            <DisplayMeeting />
          </>
        )}
        {userData.body.typeMeeting.type === "découverte" &&
          userData.body.discovery === true && (
            <div
              style={{ width: "100%" }}
              className={styles.meet__container__formule}
            >
              <h3 className={styles.meet__container__formule__h3}>
                Choisir une formule pour pouvoir prendre un rendez-vous
              </h3>
              <div className={styles.meet__container__formule__content}>
                <div className={styles.meet__container__formule__content__card}>
                  <h2>Formule 1</h2>
                  <p>test</p>
                </div>
                <div className={styles.meet__container__formule__content__card}>
                  <h2>Formule 2</h2>
                  <p>test</p>
                </div>
                <div className={styles.meet__container__formule__content__card}>
                  <h2>Formule 3</h2>
                  <p>test</p>
                </div>
              </div>
              <p>
                Si vous voulez plus de renseignement sur les formules vous
                pouvez cliquez ici
              </p>
              <Link href={"/tarif"}>Voir les offres</Link>
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Formule
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    onChange={(e) => {
                      setInputFormule(e.target.value);
                      setValidFormuleInput(true);
                      setErrorMessageFormule("");
                    }}
                  >
                    <FormControlLabel
                      value="formule1"
                      control={<Radio />}
                      label="Formule 1"
                    />
                    <FormControlLabel
                      value="formule2"
                      control={<Radio />}
                      label="Formule 2"
                    />
                    <FormControlLabel
                      value="formule3"
                      control={<Radio />}
                      label="Formule 3"
                    />
                  </RadioGroup>
                  <FormHelperText style={{ color: "red", margin: "0px" }}>
                    {errorMessageFormule}
                  </FormHelperText>
                </FormControl>
                <input
                  type="text"
                  name="pseudo"
                  id="pseudo"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => {
                    setInputPseudo(e.target.value);
                  }}
                />
                <input type="submit" value="Envoyer" />
              </form>
            </div>
          )}
      </>
    );
  }

  return <>{content}</>;
};

export default Display;
