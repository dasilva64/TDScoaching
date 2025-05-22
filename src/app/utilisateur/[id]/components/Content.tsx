"use client";

import React, { use, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Content.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import NbShow from "./dataTable/nbShow/NbShow";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import Paging from "./dataTable/paging/Paging";
import useSWRMutation from "swr/mutation";
import DisplayLoad from "./dataTable/display/DisplayLoad";
import DisplayError from "./dataTable/display/DisplayError";
import useGetById from "@/app/components/hook/user/useGetById";
import fetchPost from "@/app/components/fetch/FetchPost";
import localFont from "next/font/local";
const Parisienne = localFont({
  src: "../../../Parisienne-Regular.ttf",
  display: "swap",
});

const Content = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { datas } = useSelector((state: RootState) => state.ArrayMeetingByUser);
  const queryParam: any = usePathname();
  const [content, setContent] = useState<null | any>(null);
  let id = queryParam.toString().split("/");
  const { data, isLoading, isError, mutate } = useGetById(id[2]);
  useEffect(() => {
    if (data) {
      if (data.status === 401 || data.status === 403) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
        router.push("/");
      } else if (data.status === 404) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
        router.push("/utilisateurs");
      } else if (data.status === 400) {
        data.message.forEach((element: string) => {
          if (element[0] === "id") {
            dispatch({
              type: "flash/storeFlashMessage",
              payload: {
                type: "error",
                flashMessage: "L'id de l'utilisateur n'as pas un format valide",
              },
            });
          }
        });
        router.push("/utilisateurs");
      } else if (data.status === 405) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
      }
    }
  }, [data, dispatch, router]);

  const { data: dataCancel, reset } = useSWRMutation(
    "/api/paiement/cancelByAdmin",
    fetchPost
  );
  useEffect(() => {
    if (dataCancel) {
      if (dataCancel.status !== 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataCancel.message },
        });
      } else {
        mutate({
          ...dataCancel,
        });
        reset();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataCancel.message },
        });
      }
    }
  }, [dataCancel, dispatch, mutate, reset]);

  const {
    data: dataAccept,
    trigger: triggerAccept,
    reset: resetAccept,
  } = useSWRMutation("/api/paiement/acceptByAdmin", fetchPost);
  useEffect(() => {
    if (dataAccept) {
      if (dataAccept.status !== 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataAccept.message },
        });
      } else {
        mutate({
          ...dataAccept,
        });
        resetAccept();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataAccept.message },
        });
      }
    }
  }, [dataAccept, dispatch, mutate, resetAccept]);

  const {
    data: dataAcceptOther,
    trigger: triggerAcceptOther,
    reset: resetAcceptOther,
  } = useSWRMutation("/api/paiement/acceptOtherByAdmin", fetchPost);
  useEffect(() => {
    if (dataAcceptOther) {
      if (dataAcceptOther.status !== 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataAcceptOther.message },
        });
      } else {
        mutate({
          ...dataAcceptOther,
        });
        resetAcceptOther();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataAcceptOther.message },
        });
      }
    }
  }, [dataAcceptOther, dispatch, mutate, resetAcceptOther]);

  const {
    data: dataFinishMeeting,
    trigger: triggerFinishMeeting,
    reset: resetFinisMeeting,
    isMutating: isMutatingFinishMeeting,
  } = useSWRMutation("/utilisateur/[id]/components/api/finish", fetchPost);

  useEffect(() => {
    if (dataFinishMeeting) {
      if (dataFinishMeeting.status !== 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataFinishMeeting.message },
        });
      } else {
        mutate(
          {
            ...dataFinishMeeting,
          },
          { revalidate: false }
        );
        resetFinisMeeting();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataFinishMeeting.message },
        });
      }
    }
  }, [dataFinishMeeting, dispatch, mutate, resetFinisMeeting]);

  /* useEffect(() => {
    const mutateFinishMeeting = () => {
      mutate(
        {
          ...dataFinishMeeting,
        },
        { revalidate: false }
      );
      resetFinisMeeting();
    };
    if (dataFinishMeeting && dataFinishMeeting.body) {
      mutateFinishMeeting();
    }
  }, [dataFinishMeeting, mutate, resetFinisMeeting]); */

  useEffect(() => {
    if (isError) {
      setContent(
        <div className={styles.content__flex}>
          <div className={styles.content__flex__div__left}>
            <h2 className={styles.content__flex__div__left__h2}>
              Information de l&apos;utilisateur
            </h2>
            <ul className={styles.content__flex__div__left__ul}>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Prénom</strong>&nbsp;: Erreur de chargement des données
              </li>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Nom de famille</strong>&nbsp;: Erreur de chargement des
                données
              </li>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Mail</strong>&nbsp;: Erreur de chargement des données
              </li>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Formule</strong>&nbsp;: Erreur de chargement des données
              </li>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Rendez-vous en cours</strong>&nbsp;: Erreur de
                chargement des
              </li>
            </ul>
          </div>
          <div className={styles.content__flex__div__right}>
            <h2 className={styles.content__flex__div__right__h2}>
              historique rendez-vous
            </h2>
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
      );
    } else if (isLoading) {
      setContent(
        <div className={styles.content__flex}>
          <div className={styles.content__flex__div__left}>
            <h2 className={styles.content__flex__div__left__h2}>
              Information de l&apos;utilisateur
            </h2>
            <ul className={styles.content__flex__div__left__ul}>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Prénom </strong>&nbsp;: Chargement
                <div className={styles.arc}>
                  <div className={styles.arc__circle}></div>
                </div>
              </li>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Nom de famille</strong>&nbsp;: Chargement
                <div className={styles.arc}>
                  <div className={styles.arc__circle}></div>
                </div>
              </li>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Mail</strong>&nbsp;: Chargement
                <div className={styles.arc}>
                  <div className={styles.arc__circle}></div>
                </div>
              </li>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Offre en cours</strong>&nbsp;: Chargement
                <div className={styles.arc}>
                  <div className={styles.arc__circle}></div>
                </div>
              </li>
              <li
                className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
              >
                <strong>Rendez-vous en cours</strong>&nbsp;: Chargement
                <div className={styles.arc}>
                  <div className={styles.arc__circle}></div>
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.content__flex__div__right}>
            <h2 className={styles.content__flex__div__right__h2}>
              historique rendez-vous
            </h2>
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
      );
    } else {
      if (data.status === 200) {
        setContent(
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
                  {data.body.offre === null && data.body.discovery === true && (
                    <li className={styles.content__flex__div__left__ul__li}>
                      <strong>Offre en cours</strong> : découverte
                    </li>
                  )}
                  {data.body.meeting === null &&
              data.body.discovery === false &&
              data.body.offre === null && (
                <li className={styles.content__flex__div__left__ul__li}>
                      <strong>Offre en cours</strong> : choix en cours
                    </li>
              )}
                  {data.body.offre !== null && (
                    <>
                      <ul className={styles.content__flex__div__left__ul__ul}>
                        <strong>Offre en cours</strong> :
                        <li
                          className={
                            styles.content__flex__div__left__ul__ul__li
                          }
                        >
                          <strong>Type</strong> : {data.body.offre.type}
                        </li>
                        <li
                          className={
                            styles.content__flex__div__left__ul__ul__li
                          }
                        >
                          <strong>Nombre actuel de rendez-vous</strong> :{" "}
                          {data.body.offre.currentNumberOfMeeting === null
                            ? 0
                            : data.body.offre.currentNumberOfMeeting}
                        </li>
                        <li
                          className={
                            styles.content__flex__div__left__ul__ul__li
                          }
                        >
                          <strong>Date</strong> :{" "}
                          {new Date(data.body.meeting.startAt).toLocaleString(
                            "fr-FR"
                          )}
                        </li>
                      </ul>
                    </>
                  )}

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
                          className={
                            styles.content__flex__div__left__ul__ul__li
                          }
                        >
                          <strong>Coaching</strong> :{" "}
                          {data.body.meeting.coaching}
                        </li>
                        <li
                          className={
                            styles.content__flex__div__left__ul__ul__li
                          }
                        >
                          <strong>Confirmé</strong> :{" "}
                          {data.body.meeting.confirm ? "oui" : "non"}
                        </li>
                        <li
                          className={
                            styles.content__flex__div__left__ul__ul__li
                          }
                        >
                          <strong>Date</strong> :{" "}
                          {new Date(data.body.meeting.startAt).toLocaleString(
                            "fr-FR"
                          )}
                        </li>
                      </ul>
                      {/* {!data.body.discovery === false && (
                        <div
                          className={styles.content__flex__div__left__ul__div}
                        >
                          {data.body.typeMeeting.type !== "unique" &&
                            data.body.typeMeeting.number === 1 && (
                              <button
                                onClick={() => {
                                  if (
                                    (data.body.typeMeeting.type === "flash" &&
                                      data.body.typeMeeting.number === 1) ||
                                    (data.body.typeMeeting.type === "longue" &&
                                      data.body.typeMeeting.number === 1) ||
                                    data.body.typeMeeting.type === "unique"
                                  ) {
                                    if (data.body.typeMeeting.number === 1) {
                                      triggerAccept({
                                        meetingId: data.body.meeting.id,
                                        userId: data.body.id,
                                      });
                                    }
                                  } else {
                                    dispatch({
                                      type: "flash/storeFlashMessage",
                                      payload: {
                                        type: "error",
                                        flashMessage:
                                          "Vous ne pouvez pas accepter ce rendez-vous",
                                      },
                                    });
                                  }
                                }}
                              >
                                Accepter
                              </button>
                            )}
                          {data.body.typeMeeting.type === "unique" && (
                            <button
                              className={
                                styles.content__flex__div__left__ul__div__btn
                              }
                              onClick={() => {
                                if (data.body.typeMeeting.type === "flash") {
                                  if (data.body.typeMeeting.number === 3) {
                                    triggerAccept({
                                      meetingId: data.body.meeting.id,
                                      userId: data.body.id,
                                    });
                                  } else {
                                    triggerAcceptOther({
                                      meetingId: data.body.meeting.id,
                                      userId: data.body.id,
                                    });
                                  }
                                } else if (
                                  data.body.typeMeeting.type === "longue"
                                ) {
                                  if (data.body.typeMeeting.number === 10) {
                                    triggerAccept({
                                      meetingId: data.body.meeting.id,
                                      userId: data.body.id,
                                    });
                                  } else {
                                    triggerAcceptOther({
                                      meetingId: data.body.meeting.id,
                                      userId: data.body.id,
                                    });
                                  }
                                } else {
                                  triggerAccept({
                                    userId: data.body.id,
                                  });
                                }
                              }}
                            >
                              Accepter
                            </button>
                          )}
                        </div>
                      )} */}
                      {data.body.discovery === true && (
                        <div
                          className={styles.content__flex__div__left__ul__div}
                        >
                          {isMutatingFinishMeeting === false && (
                            <button
                              className={
                                styles.content__flex__div__left__ul__div__btn
                              }
                              onClick={() => {
                                dispatch({
                                  type: "flash/clearFlashMessage",
                                });
                                triggerFinishMeeting({
                                  id: data.body.id,
                                  csrfToken: data.csrfToken
                                });
                              }}
                            >
                              Terminer
                            </button>
                          )}
                          {isMutatingFinishMeeting === true && (
                            <>
                              <button
                                disabled
                                className={
                                  styles.content__flex__div__left__ul__div__btn__load
                                }
                              >
                                <span
                                  className={
                                    styles.content__flex__div__left__ul__div__btn__load__span
                                  }
                                >
                                  Chargement
                                </span>

                                <div
                                  className={
                                    styles.content__flex__div__left__ul__div__btn__load__arc
                                  }
                                >
                                  <div
                                    className={
                                      styles.content__flex__div__left__ul__div__btn__load__arc__circle
                                    }
                                  ></div>
                                </div>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </ul>
              </div>
              <div className={styles.content__flex__div__right}>
                <h2
                  className={`${styles.content__flex__div__right__h2} ${Parisienne.className}`}
                >
                  historique rendez-vous
                </h2>
                {data.body.allMeetings.length === 0 && (
                  <>
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
                  </>
                )}
                {data.body.allMeetings.length > 0 && datas !== null && (
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
  }, [
    data,
    datas,
    dispatch,
    isError,
    isLoading,
    isMutatingFinishMeeting,
    router,
    triggerAccept,
    triggerAcceptOther,
    triggerFinishMeeting,
  ]);

  useEffect(() => {
    if (data && data.status === 200) {
      let copyOfItems = [...data.body.allMeetings];
      copyOfItems.map((p: any, index: any) => {
        if (p.type === "unique" || p.type === "discovery") {
          copyOfItems[index] = {
            ...p,
            Début: new Date(p.startAt).toLocaleString(),
            Coaching: p.coaching,
          };
        } else {
          copyOfItems[index] = {
            ...p,
            Début: new Date(p.startAt).toLocaleString(),
            Coaching: p.coaching,
          };
        }

        delete copyOfItems[index].startAt;
        delete copyOfItems[index].typeMeeting;
        delete copyOfItems[index].coaching;
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
