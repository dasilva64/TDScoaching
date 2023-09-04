"use client";

import React, { use, useEffect } from "react";
import { usePathname } from "next/navigation";
import useGetById from "@/app/components/hook/user/useGetById";
import styles from "./Content.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import NbShow from "./dataTable/nbShow/NbShow";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import Paging from "./dataTable/paging/Paging";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import DisplayLoad from "./dataTable/display/DisplayLoad";

const Content = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { datas } = useSelector((state: RootState) => state.ArrayMeetingByUser);
  const queryParam: any = usePathname();
  let id = queryParam.toString().split("/");
  const { data, isLoading, isError, mutate } = useGetById(id[2]);
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

  const { data: dataCancel, trigger } = useSWRMutation(
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
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataCancel.message },
        });
      }
    }
  }, [dataCancel, dispatch, mutate]);

  const { data: dataAccept, trigger: triggerAccept } = useSWRMutation(
    "/api/paiement/acceptByAdmin",
    fetchPost
  );
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
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataAccept.message },
        });
      }
    }
  }, [dataAccept, dispatch, mutate]);

  const { data: dataAcceptOther, trigger: triggerAcceptOther } = useSWRMutation(
    "/api/paiement/acceptOtherByAdmin",
    fetchPost
  );
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
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataAcceptOther.message },
        });
      }
    }
  }, [dataAcceptOther, dispatch, mutate]);

  const { data: dataFinishMeeting, trigger: triggerFinishMeeting } =
    useSWRMutation("/api/meeting/finish", fetchPost);

  useEffect(() => {
    if (dataFinishMeeting) {
      if (dataFinishMeeting.status !== 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataFinishMeeting.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataFinishMeeting.message },
        });
      }
    }
  }, [dataFinishMeeting, dispatch, mutate]);

  useEffect(() => {
    const mutateFinishMeeting = () => {
      mutate(
        {
          ...dataFinishMeeting,
          body: {
            ...dataFinishMeeting.body,
            meeting: null,
          },
        },
        { revalidate: false }
      );
    };
    if (dataFinishMeeting && dataFinishMeeting.body) {
      mutateFinishMeeting();
    }
  }, [dataFinishMeeting, mutate]);

  let content;
  if (isError) content = <div>error</div>;
  else if (isLoading) {
    content = (
      <div className={styles.content__flex}>
        <div className={styles.content__flex__div__left}>
          <h2 className={styles.content__flex__div__left__h2}>
            Information de l&apos;utilisateur
          </h2>
          <ul className={styles.content__flex__div__left__ul}>
            <li
              className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
            >
              <strong>Prénom</strong> :
              <div className={styles.arc}>
                <div className={styles.arc__circle}></div>
              </div>
            </li>
            <li
              className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
            >
              <strong>Nom de famille</strong> :
              <div className={styles.arc}>
                <div className={styles.arc__circle}></div>
              </div>
            </li>
            <li
              className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
            >
              <strong>Mail</strong> :
              <div className={styles.arc}>
                <div className={styles.arc__circle}></div>
              </div>
            </li>
            <li
              className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
            >
              <strong>Formule</strong> :
              <div className={styles.arc}>
                <div className={styles.arc__circle}></div>
              </div>
            </li>
            <li
              className={`${styles.content__flex__div__left__ul__li} ${styles.content__flex__div__left__ul__li__flex}`}
            >
              <strong>Rendez-vous en cours</strong> :
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
      let copyTypeMeeting = { ...data.body.typeMeeting };
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
                  <strong>Formule</strong> : {copyTypeMeeting.type}
                </li>
                {copyTypeMeeting.type === "flash" && (
                  <li className={styles.content__flex__div__left__ul__li}>
                    <strong>Nombre de rendez-vous restant</strong> :{" "}
                    {copyTypeMeeting.number}
                  </li>
                )}
                {copyTypeMeeting.type === "longue" && (
                  <li className={styles.content__flex__div__left__ul__li}>
                    <strong>Nombre de rendez-vous restant</strong> :{" "}
                    {copyTypeMeeting.number}
                  </li>
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
                        className={styles.content__flex__div__left__ul__ul__li}
                      >
                        <strong>Type</strong> : {copyTypeMeeting.coaching}
                      </li>
                      <li
                        className={styles.content__flex__div__left__ul__ul__li}
                      >
                        <strong>Start</strong> :{" "}
                        {new Date(data.body.meeting.startAt).toLocaleString(
                          "fr-FR"
                        )}
                      </li>
                      <li
                        className={styles.content__flex__div__left__ul__ul__li}
                      >
                        <strong>Status</strong> :{" "}
                        {data.body.meeting.status.toString()}
                      </li>
                    </ul>
                    {!data.body.discovery === false && (
                      <div>
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
                    )}
                    {data.body.discovery === false && (
                      <div>
                        <button
                          onClick={() => {
                            triggerFinishMeeting({
                              id: data.body.id,
                            });
                          }}
                        >
                          Terminer
                        </button>
                      </div>
                    )}
                  </>
                )}
              </ul>
            </div>
            <div className={styles.content__flex__div__right}>
              <h2 className={styles.content__flex__div__right__h2}>
                historique rendez-vous
              </h2>
              {data.body.allMeetings.length === 0 && <p>Aucun rendez-vous</p>}
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
    } else {
      content = <div>Vous allez être rediriger vers le dashboard</div>;
    }
  }
  useEffect(() => {
    if (data && data.status === 200) {
      let copyOfItems = [...data.body.allMeetings];

      copyOfItems.map((p: any, index: any) => {
        copyOfItems[index] = {
          ...p,
          Début: new Date(p.startAt).toLocaleString(),
          Status: p.status.toString(),
        };
        delete copyOfItems[index].startAt;
        delete copyOfItems[index].status;
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
