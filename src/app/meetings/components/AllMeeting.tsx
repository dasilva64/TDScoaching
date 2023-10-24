"use client";

import React, { useEffect } from "react";
import styles from "./AllMeeting.module.scss";
import { RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import NbShow from "./dataTable/nbShow/NbShow";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import Paging from "./dataTable/paging/Paging";
import DisplayLoad from "./dataTable/display/DisplayLoad";
import useGet from "@/app/components/hook/useGet";
import DisplayError from "./dataTable/display/DisplayError";

const AllMeeting = () => {
  const { datas } = useSelector((state: RootState) => state.ArrayMeeting);
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGet("/api/meeting/getAll");
  let content;
  if (isError) {
    content = (
      <>
        <div className={styles.datatable}>
          <div className={styles.datatable__container}>
            <>
              <div>
                <div className={styles.datatable__container__div}>
                  <NbShow />
                  <Search />
                </div>
              </div>
              <DisplayError />
              <Paging />
            </>
          </div>
        </div>
      </>
    );
  } else if (isLoading) {
    content = (
      <>
        <div className={styles.datatable}>
          <div className={styles.datatable__container}>
            <>
              <div>
                <div className={styles.datatable__container__div}>
                  <NbShow />
                  <Search />
                </div>
              </div>
              <DisplayLoad />
              <Paging />
            </>
          </div>
        </div>
      </>
    );
  } else {
    if (data.status === 200) {
      content = (
        <>
          <div className={styles.datatable}>
            <div className={styles.datatable__container}>
              {datas && (
                <>
                  <div>
                    <div className={styles.datatable__container__div}>
                      <NbShow />
                      <Search />
                    </div>
                  </div>
                  <Display />
                  <Paging />
                </>
              )}
            </div>
          </div>
        </>
      );
    }
  }

  useEffect(() => {
    if (data && data.status === 200) {
      let newar = [...data.body];
      newar.map((p: any, index: any) => {
        let copyUser = { ...p.User };
        newar[index] = {
          ...p,
          Id: p.id,
          UserId: copyUser.id,
          Prénom: copyUser.firstname,
          Nom: copyUser.lastname,
          Date: new Date(p.startAt).toLocaleString("fr-FR", {
            timeZone: "Europe/Paris",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
          }),
        };
        delete newar[index].User;
        delete newar[index].status;
        delete newar[index].limitDate;
        delete newar[index].paymentId;
        delete newar[index].endAt;
        delete newar[index].startAt;
        delete newar[index].typeMeeting;
        delete newar[index].id;
        delete newar[index].userId;
      });
      dispatch({
        type: "ArrayMeeting/storeData",
        payload: { datas: newar },
      });
    }
  }, [data, dispatch]);
  return <>{content}</>;
};

export default AllMeeting;
