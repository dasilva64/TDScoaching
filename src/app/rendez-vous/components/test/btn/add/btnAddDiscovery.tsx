"use client";

import React, { useEffect } from "react";
import styles from "./btnAddDiscovery.module.scss";
import fetchPost from "@/app/components/fetch/FetchPost";
import useSWRMutation from "swr/mutation";
import router from "next/router";
import { mutate } from "swr";
import { useDispatch } from "react-redux";

const BtnAddDiscovery = ({
  mutate,
  setTypeCoaching,
  setTypeCoachingErrorMessage,
  setTypeCoachingValid,
  setPseudo,
  typeCoachingValid,
  pseudo,
  typeCoaching,
  dateModalAddMeetingRendezVous,
}: any) => {
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/discovery/take/api/",
    fetchPost
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        setTypeCoaching("");
        setTypeCoachingErrorMessage("");
        setTypeCoachingValid(false);
        setPseudo("");
        dispatch({ type: "ModalAddMeetingRendezVous/close" });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        mutate();
        reset();
      } else if (data.status === 400) {
        if (data.type === "validation") {
          data.message.forEach((element: string) => {
            if (element[0] === "typeCoaching") {
              setTypeCoachingErrorMessage(element[1]);
            }
            if (element[0] === "start") {
              dispatch({
                type: "flash/storeFlashMessage",
                payload: { type: "error", flashMessage: element[1] },
              });
            }
          });
          reset();
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          setTypeCoachingErrorMessage("");
          setTypeCoachingValid(false);
          setTypeCoaching("");
          dispatch({ type: "ModalAddDiscovery/close" });
          reset();
        }
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
        router.push(`/acces-refuse?destination=rendez-vous`)
      }
    }
  }, [
    data,
    dispatch,
    mutate,
    reset,
    setPseudo,
    setTypeCoaching,
    setTypeCoachingErrorMessage,
    setTypeCoachingValid,
  ]);
  return (
    <>
      {isMutating && (
        <>
          <button disabled className={styles.btn__load}>
            <span className={styles.btn__load__span}>Chargement</span>

            <div className={styles.btn__load__arc}>
              <div className={styles.btn__load__arc__circle}></div>
            </div>
          </button>
        </>
      )}
      {!isMutating && (
        <button
          className={styles.btn}
          onClick={(e) => {
            if (typeCoachingValid) {
              if (pseudo.length === 0) {
                trigger({
                  typeCoaching: typeCoaching,
                  start: dateModalAddMeetingRendezVous,
                });
              }
              e.preventDefault();
            } else {
              e.preventDefault();
              if (typeCoaching.length === 0) {
                setTypeCoachingErrorMessage(
                  "Veuillez selectionner un type de coaching"
                );
              }
            }
          }}
        >
          Ajouter le rendez-vous
        </button>
      )}
    </>
  );
};

export default BtnAddDiscovery;
