"use client";

import React, { use, useEffect } from "react";
import { usePathname } from "next/navigation";
import useGetById from "@/app/components/hook/user/useGetById";
import styles from "./Content.module.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import NbShow from "./dataTable/nbShow/NbShow";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import Paging from "./dataTable/paging/Paging";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetchCancelByAdmin from "@/app/components/fetch/paiement/fetchCancelByAdmin";

const Content = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: dataCancel, trigger } = useSWRMutation(
    "/api/paiement/cancelByAdmin",
    fetchCancelByAdmin
  );
  useEffect(() => {
    if (dataCancel) {
      if (dataCancel.status !== 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataCancel.message },
        });
      } else {
        mutate("/api/user/getById", {
          ...dataCancel,
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataCancel.message },
        });
      }
    }
  }, [dataCancel, dispatch]);
  const router = useRouter();
  const queryParam: any = usePathname();
  let id = queryParam.toString().split("/");
  const { data, isLoading, isError } = useGetById(id[2]);
  console.log(data);
  useEffect(() => {
    if (data) {
      if (data.status !== 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        router.push("/tous-les-utilisateurs");
      }
    }
  }, [data, dispatch, router]);
  let content;
  if (isError) content = <div>error</div>;
  else if (isLoading) {
    content = (
      <div className={styles.loadData}>
        Chargement des données
        <div className={styles.loadData__arc}>
          <div className={styles.loadData__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    if (data.status === 200) {
      content = (
        <>
          <div className={styles.content__flex}>
            <div className={styles.content__flex__div__left}>
              <h2 className={styles.content__flex__div__left__h2}>
                Information de l&apos;utilisateur
              </h2>
              <ul className={styles.content__flex__div__left__ul}>
                <li className={styles.content__flex__div__left__ul__li}>
                  <strong>Prénom</strong> : {data.body.firstname}
                </li>
                <li className={styles.content__flex__div__left__ul__li}>
                  <strong>Nom de famille</strong> : {data.body.lastname}
                </li>
                <li className={styles.content__flex__div__left__ul__li}>
                  <strong>Mail</strong> : {data.body.mail}
                </li>
                <li className={styles.content__flex__div__left__ul__li}>
                  <strong>Téléphone</strong> : {data.body.phone}
                </li>
                <li className={styles.content__flex__div__left__ul__li}>
                  <strong>Deux facteur</strong> :{" "}
                  {data.body.twoFactor.toString()}
                </li>
                <li className={styles.content__flex__div__left__ul__li}>
                  <strong>Status</strong> : {data.body.status.toString()}
                </li>
                <li className={styles.content__flex__div__left__ul__li}>
                  <strong>Role</strong> : {data.body.role}
                </li>
                {data.body.meeting === null && (
                  <li className={styles.content__flex__div__left__ul__li}>
                    <strong>Rendez-vous en cours</strong> : aucun
                  </li>
                )}
                {data.body.meeting !== null && (
                  <>
                    <ul className={styles.content__flex__div__left__ul__ul}>
                      <strong>Rendez-vous en cours</strong> :
                      <li
                        className={styles.content__flex__div__left__ul__ul__li}
                      >
                        <strong>Description</strong> :{" "}
                        {data.body.meeting.description}
                      </li>
                      <li
                        className={styles.content__flex__div__left__ul__ul__li}
                      >
                        <strong>Start</strong> :{" "}
                        {new Date(data.body.meeting.startAt).toLocaleString()}
                      </li>
                      <li
                        className={styles.content__flex__div__left__ul__ul__li}
                      >
                        <strong>End</strong> :{" "}
                        {new Date(data.body.meeting.endAt).toLocaleString()}
                      </li>
                      <li
                        className={styles.content__flex__div__left__ul__ul__li}
                      >
                        <strong>Status</strong> :{" "}
                        {data.body.meeting.status.toString()}
                      </li>
                    </ul>
                    <div>
                      <button>Accepter</button>
                      <button
                        onClick={() => {
                          trigger({
                            meetingId: data.body.meeting.id,
                            userId: data.body.id,
                          });
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </>
                )}
              </ul>
            </div>
            <div className={styles.content__flex__div__right}>
              <h2 className={styles.content__flex__div__right__h2}>
                historique rendez-vous
              </h2>
              {data.body.allMeetings.length === 0 && <p>Aucun rendez-vous</p>}
              {data.body.allMeetings.length > 0 && (
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
    } else {
      content = <div>Vous allez être rediriger vers le dashboard</div>;
    }
  }

  useEffect(() => {
    if (data && data.status === 200) {
      let copyOfItems = [...data.body.allMeetings];

      copyOfItems.map((p: any, index: any) => {
        if (p.description === null || p.description === "aucun") {
          copyOfItems[index] = {
            ...p,
            description: "aucun",
            status: p.status.toString(),
            startAt: new Date(p.startAt).toLocaleString(),
          };
        } else
          copyOfItems[index] = {
            ...p,
            description: p.description.toString(),
            startAt: new Date(p.startAt).toLocaleString(),
          };
      });
      dispatch({
        type: "ArrayMeetingByUser/storeData",
        payload: { datas: copyOfItems },
      });
    }
  }, [data, dispatch]);
  return (
    <>
      <div className={styles.content}>{content}</div>
    </>
  );
};

export default Content;
