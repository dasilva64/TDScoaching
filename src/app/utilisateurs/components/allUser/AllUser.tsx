"use client";

import { RootState } from "../../../redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NbShow from "./dataTable/nbShow/NbShow";
import Paging from "./dataTable/paging/Paging";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import styles from "./AllUser.module.scss";
import DisplayLoad from "./dataTable/display/DisplayLoad";
import useGet from "@/app/components/hook/useGet";
import DisplayError from "./dataTable/display/DisplayError";
import { useRouter } from "next/navigation";

const AllUser = () => {
  const { datas } = useSelector((state: RootState) => state.Array);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isLoading, isError } = useGet("/api/user/getAll");
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
    } else if (data.status === 401 || data.status === 403) {
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
      let copyOfItems = [...data.body];

      copyOfItems.map((p: any, index: any) => {
        if (p.idMeeting === null || p.meeting === "aucun") {
          if (p.idMeeting === null) {
            copyOfItems[index] = {
              ...p,
              Prénom: p.firstName,
              Nom: p.lastName,
              Mail: p.mail,
              RendezVous: "aucun",
            };
            delete copyOfItems[index].allMeeting;
            delete copyOfItems[index].idMeeting;
            delete copyOfItems[index].firstName;
            delete copyOfItems[index].lastName;
            delete copyOfItems[index].mail;
          }
        } else if (p.idMeeting !== null) {
          let date = null;
          for (let i = 0; i < p.allMeeting.length; i++) {
            if (p.allMeeting[i].id === p.idMeeting) {
              date = p.allMeeting[i].startAt;
            }
          }
          copyOfItems[index] = {
            ...p,
            Prénom: p.firstName,
            Nom: p.lastName,
            Mail: p.mail,
            RendezVous: new Date(date).toLocaleString("fr-FR"),
          };
          delete copyOfItems[index].allMeeting;
          delete copyOfItems[index].idMeeting;
          delete copyOfItems[index].firstName;
          delete copyOfItems[index].lastName;
          delete copyOfItems[index].mail;
        }
      });
      dispatch({
        type: "Array/storeData",
        payload: { datas: copyOfItems },
      });
    }
  }, [data, dispatch]);
  return <>{content}</>;
};

export default AllUser;
