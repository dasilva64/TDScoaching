"use client";

import { RootState } from "../../redux/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NbShow from "./dataTable/nbShow/NbShow";
import Paging from "./dataTable/paging/Paging";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import styles from "./AllUser.module.scss";
import DisplayLoad from "./dataTable/display/DisplayLoad";
import useGet from "../../components/hook/useGet";
import DisplayError from "./dataTable/display/DisplayError";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const AllUser = () => {
  const { datas } = useSelector((state: RootState) => state.Array);
  const dispatch = useDispatch();
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const { data, isLoading, isError } = useGet("/utilisateurs/components/api");
  useEffect(() => {
    if (isError) {
      dispatch({
        type: "flash/storeFlashMessage",
        payload: {
          type: "error",
          flashMessage: "Erreur lors du chargement, veuillez réessayer",
        },
      });
      setContent(
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
      setContent(
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
        setContent(
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
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
        mutate("/components/header/api");
        mutate("/components/header/ui/api");
        router.push("/");
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
      }
    }
  }, [data, datas, dispatch, isError, isLoading, router]);

  useEffect(() => {
    if (data && data.status === 200) {
      let copyOfItems = [...data.body];

      copyOfItems.map((p: any, index: any) => {
        if (p.idMeeting === null || p.meeting === "aucun") {
          if (p.idMeeting === null) {
            copyOfItems[index] = {
              ...p,
              Id: p.id,
              Prénom: p.firstName,
              Nom: p.lastName,
              Mail: p.mail,
              RendezVous: "aucun",
            };
            delete copyOfItems[index].id;
            delete copyOfItems[index].allMeeting;
            delete copyOfItems[index].idMeeting;
            delete copyOfItems[index].firstName;
            delete copyOfItems[index].lastName;
            delete copyOfItems[index].mail;
          }
        } else if (p.idMeeting !== null) {
          let date = null;
          /* for (let i = 0; i < p.allMeeting.length; i++) {
            if (p.allMeeting[i].id === p.idMeeting) {
              date = p.allMeeting[i].startAt;
            }
          } */
          copyOfItems[index] = {
            ...p,
            Id: p.id,
            Prénom: p.firstName,
            Nom: p.lastName,
            Mail: p.mail,
            //RendezVous: new Date(date).toLocaleString("fr-FR"),
          };
          delete copyOfItems[index].id;
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
