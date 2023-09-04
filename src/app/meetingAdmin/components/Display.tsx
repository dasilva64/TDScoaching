"use client";

import React from "react";
import styles from "../page.module.scss";
import { useEffect, useState } from "react";
import DatePickerDesktop from "./datePicker/DatePickerDesktop";
import DatePickerMobile from "./datePicker/DatePickerMobile";
import useGet from "@/app/components/hook/useGet";

const Display = () => {
  const [mobile, setMobile] = useState<boolean | null>(null);

  const {
    data: allMeeting,
    isLoading,
    isError,
  } = useGet("/api/meeting/getAllAfterNow");
  console.log(allMeeting);
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
          {mobile === false && <DatePickerDesktop events={allMeeting.body} />}
          {mobile === true && <DatePickerMobile events={allMeeting.body} />}
        </div>
      </>
    );
  }
  return <>{content}</>;
};

export default Display;
