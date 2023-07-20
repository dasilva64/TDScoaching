"use client";

import React from "react";
import styles from "../page.module.scss";
import { RootState, AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePickerDesktop from "./datePicker/DatePickerDesktop";
import DatePickerMobile from "./datePicker/DatePickerMobile";
import useDelete from "../../components/fetch/meeting/fetchDeleteMeeting";
import useAll from "../../components/hook/meeting/useAllAfterNow";
import fetchGetPayment from "../../components/fetch/paiement/useGet";
import useSWRMutation from "swr/mutation";
import fetchAddDescription from "../../components/fetch/meeting/fetchAddDescription";
import fetchDeleteMeeting from "../../components/fetch/meeting/fetchDeleteMeeting";
import fetchDeleteDescription from "../../components/fetch/meeting/fetchDeleteDescription";
import useUserGet from "@/app/components/hook/user/useUserGet";
import useAllAfterNow from "../../components/hook/meeting/useAllAfterNow";

/* const fetchEdit = async (id: any) => {
  //const dispatch = useDispatch()

  let response = await fetch(`http://localhost:8080/meeting/${id}`, {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  let json = await response.json();
  return json;
}; */

const Display = () => {
  var options: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const { push } = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [displayEditMeeting, setDisplayEditMeeting] = useState<boolean>(false);
  const [dateMeeting, setDateMeeting] = useState<string>("");

  const [description, setDescription] = useState<string>("");
  const [mobile, setMobile] = useState<boolean | null>(null);
  const [events, setEvents] = useState<any>([]);
  const { displayModalDeleteMeeting } = useSelector(
    (state: RootState) => state.form
  );

  const { userData, isLoading, isError } = useUserGet();

  const { allMeeting, mutateMeeting } = useAllAfterNow();
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
        
        <div className={styles.meet__article}>
          {userData &&
            !userData.body.meeting &&
            allMeeting &&
            mobile === false && (
              <>
                <DatePickerDesktop
                  user={userData}
                  events={allMeeting.body}
                  setDisplayModal={setDisplayModal}
                  setDateMeeting={setDateMeeting}
                />
              </>
            )}
          {userData && !userData.body.meeting && mobile === true && (
            <DatePickerMobile
              user={userData}
              events={allMeeting}
              setDisplayModal={setDisplayModal}
              setDateMeeting={setDateMeeting}
            />
          )}
        </div>
      </>
    );
  }

  return <>{content}</>;
};

export default Display;
