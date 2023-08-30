"use client";

import React from "react";
import styles from "../page.module.scss";
import { useEffect, useState } from "react";
import DatePickerDesktop from "./datePicker/DatePickerDesktop";
import DisplayMeeting from "./meeting/DisplayMeeting";
import useUserGet from "@/app/components/hook/user/useUserGet";
import { FormControl } from "@mui/base";
import { FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import Link from "next/link";

const Display = () => {
  const [mobile, setMobile] = useState<boolean | null>(null);
  const { userData, isLoading, isError } = useUserGet();
  const [inputPseudo, setInputPseudo] = useState<string>("");

  const [inputFormule, setInputFormule] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputFormule);
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
        {mobile === false &&
          userData &&
          userData.body.meeting === null &&
          userData.body.typeMeeting !== null && (
            <>
              <DatePickerDesktop
                events={userData?.body.meetings}
                discovery={userData?.body.discovery}
              />
            </>
          )}
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
        {userData.body.typeMeeting !== null && <DisplayMeeting />}
        {userData.body.typeMeeting === null && (
          <div
            style={{ width: "100%" }}
            className={styles.meet__container__text}
          >
            <h3 className={styles.meet__container__text__h3}>
              Choisir une formule pour pouvoir prendre un rendez-vous
            </h3>
            <div>
              <div>
                <h2>Formule 1</h2>
                <p>test</p>
              </div>
              <div>
                <h2>Formule 2</h2>
                <p>test</p>
              </div>
              <div>
                <h2>Formule 3</h2>
                <p>test</p>
              </div>
            </div>
            <p>
              Si vous voulez plus de renseignement sur les formules vous pouvez
              cliquez ici
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
