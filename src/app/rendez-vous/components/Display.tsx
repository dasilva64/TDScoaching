"use client";

import React from "react";
import styles from "../page.module.scss";
import { RootState, AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePickerDesktop from "./datePicker/DatePickerDesktop";
import DisplayMeeting from "./meeting/DisplayMeeting";
import useUserGet from "@/app/components/hook/user/useUserGet";

const Display = () => {
  const [mobile, setMobile] = useState<boolean | null>(null);
  const { userData, isLoading, isError } = useUserGet();

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
          {mobile === false && userData && userData.body.meeting === null && (
            <>
              <DatePickerDesktop events={userData?.body.meetings} />
            </>
          )}
          {userData &&
            !userData.body.meeting &&
            mobile === true &&
            {
              /* <DatePickerMobile
              user={userData}
              events={allMeeting}
              setDisplayModal={setDisplayModal}
              setDateMeeting={setDateMeeting}
            /> */
            }}
          <DisplayMeeting />
        </div>
      </>
    );
  }

  return <>{content}</>;
};

export default Display;
