"use client";

import { RootState } from "@/app/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Display from "./dataTable/display/Display";
import NbShow from "./dataTable/nbShow/NbShow";
import Paging from "./dataTable/paging/Paging";
import styles from "./AllMeeting.module.scss";
import Search from "./dataTable/search/Search";
import useGet from "@/app/components/hook/useGet";
import DisplayLoad from "./dataTable/display/DisplayLoad";
import { useRouter } from "next/navigation";
import DisplayError from "./dataTable/display/DisplayError";

const AllMeeting = () => {
  const { data, isLoading, isError } = useGet("/api/meeting/getAllByUser");
  const dispatch = useDispatch();
  const router = useRouter();
  const { datas } = useSelector((state: RootState) => state.ArrayHistorique);
  let content;
  if (isError) {
    dispatch({
      type: "flash/storeFlashMessage",
      payload: {
        type: "error",
        flashMessage: "Erreur lors du chargement, veuillez réessayer",
      },
    });
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
    } else if (data.status === 401) {
      setTimeout(() => {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
      }, 2000);
      router.push("/");
    } else {
      setTimeout(() => {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
      }, 2000);
      router.refresh();
    }
  }
  useEffect(() => {
    if (data && data.status === 200) {
      let newar = [...data.body];
      newar.map((p: any, index: any) => {
        let formule;
        if (p.typeMeeting.type === "flash" || p.typeMeeting.type === "longue") {
          if (p.typeMeeting.type === "flash") {
            formule =
              p.typeMeeting.type[0].toUpperCase() +
              p.typeMeeting.type.slice(1) +
              " " +
              p.typeMeeting.number +
              "/3";
          } else {
            formule =
              p.typeMeeting.type[0].toUpperCase() +
              p.typeMeeting.type.slice(1) +
              " " +
              p.typeMeeting.number +
              "/10";
          }
        } else {
          formule =
            p.typeMeeting.type[0].toUpperCase() + p.typeMeeting.type.slice(1);
        }
        newar[index] = {
          ...p,
          Date: new Date(p.startAt).toLocaleString("fr-FR", {
            timeZone: "Europe/Paris",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          Coaching:
            p.typeMeeting.coaching[0].toUpperCase() +
            p.typeMeeting.coaching.slice(1),
          Formule: formule,
        };
        delete newar[index].User;
        delete newar[index].startAt;
        delete newar[index].userId;
        delete newar[index].limitDate;
        delete newar[index].id;
        delete newar[index].paymentId;
        delete newar[index].typeMeeting;
        delete newar[index].status;
      });
      dispatch({
        type: "ArrayHistorique/storeData",
        payload: { datas: newar },
      });
    }
  }, [data, dispatch]);

  return <>{content}</>;
};

export default AllMeeting;
