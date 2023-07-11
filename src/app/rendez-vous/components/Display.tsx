"use client";

import React from "react";
import styles from "../page.module.scss";
import { RootState, AppDispatch } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePickerDesktop from "./datePicker/DatePickerDesktop";
import DatePickerMobile from "./datePicker/DatePickerMobile";
import useUser from "@/app/components/hook/useUser";
import ModalDeleteMeeting from "./modal/ModalDeleteMeeting";
import useDelete from "@/app/components/hook/meeting/useDeleteMeeting";
import useAll from "@/app/components/hook/meeting/useAll";
import fetchGetPayment from "@/app/components/hook/paiement/useGet";
import useSWRMutation from "swr/mutation";
import fetchAddDescription from "@/app/components/hook/meeting/useAddDescription";
import fetchEditDescription from "@/app/components/hook/meeting/useEditDescription";
import fetchDeleteMeeting from "@/app/components/hook/meeting/useDeleteMeeting";
import fetchDeleteDescription from "@/app/components/hook/meeting/useDeleteDescription";
import DisplayMeeting from "./meeting/DisplayMeeting";

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
  const { isLog } = useSelector((state: RootState) => state.auth);
  const { user, isLoading, isError, mutate }: any = useUser();
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
  /* 
  const { trigger: triggerGet, data: dataGet } = useSWRMutation(
    "http://localhost:8080/payment/get",
    fetchGetPayment
  );
  useEffect(() => {
    if (dataGet) {
      window.location.href = dataGet.url;
    }
  }, [dataGet]);

  const { trigger: triggerAddDescription, data: dataAddDescription } =
    useSWRMutation(
      `http://localhost:8080/meeting/${user ? user.body.meetingId : null}`,
      fetchAddDescription, {revalidate: false}
    );
  useEffect(() => {
    if (dataAddDescription) {
      if (dataAddDescription.status === 200) {
        console.log(dataAddDescription);

        const mutateUser = async () => {
          try {
            await mutate({
              ...user,
              body: {
                ...user.body,
                meeting: {
                  ...user.body.meeting,
                  description: dataAddDescription.body,
                },
              },
            });
          } catch (error) {
            console.log(error);
          }
        };
        if (user.body.meeting.description !== dataAddDescription.body) {
          mutateUser();
        }
      }
    }
  }, [dataAddDescription, mutate, user]);

  const { trigger: triggerEditDescription, data: dataEditDescription } =
    useSWRMutation(
      `http://localhost:8080/meeting/${user ? user.body.meetingId : null}`,
      fetchEditDescription
    );
  useEffect(() => {
    if (dataEditDescription) {
      if (dataEditDescription.status === 200) {
      }
    }
  }, [dataEditDescription, dispatch]);

  const { trigger: triggerDeleteMeeting, data: dataDeleteMeeting } =
    useSWRMutation(
      `http://localhost:8080/meeting/${user ? user.body.meetingId : null}`,
      fetchDeleteMeeting
    );
  useEffect(() => {
    if (dataDeleteMeeting) {
      if (dataDeleteMeeting.status === 200) {
        setUserClickOnButton(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataDeleteMeeting.message },
        });
        dispatch({
          type: "form/closeModalDeleteMeeting",
        });
      } else {
        setUserClickOnButton(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataDeleteMeeting.message },
        });
      }
    }
  }, [dataDeleteMeeting, dispatch]);

  const { trigger: triggerDeleteDescription, data: dataDeleteDescription } =
    useSWRMutation(
      `http://localhost:8080/meeting/${user ? user.body.meetingId : null}`,
      fetchDeleteDescription, {revalidate: false}
    );

    

  useEffect(() => {
    if (dataDeleteDescription) {
      if (dataDeleteDescription.status === 200) {
        console.log(dataDeleteDescription);
        const mutateUser = async () => {
          try {
            await mutate({
              ...user,
              body: {
                ...user.body,
                meeting: { ...user.body.meeting, description: null },
              },
            });
          } catch (error) {
            console.log(error);
          }
        };
        if (user.body.meeting.description !== null) {
          mutateUser();
        }
      }
    }
  }, [dataDeleteDescription, mutate, user]);
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

  useEffect(() => {
    if (document) {
      let mainDiv = document.querySelector("main");
      let footerDiv = document.querySelector("footer");
      if (mainDiv && footerDiv) {
        if (displayModal === true) {
          mainDiv.style.opacity = "0.2";
          footerDiv.style.opacity = "0.2";
        } else {
          mainDiv.style.opacity = "1";
          footerDiv.style.opacity = "1";
        }
      }
    }
  }, [displayModal]);

  const handlerClickAdd = () => {
    const fetchAddDescription = async () => {
      console.log(user)
      triggerAddDescription({ description: description });
    };
    fetchAddDescription();
  };

  const handlerClickDeleteDescription = () => {
    const fetchDeleteMeeting = async () => {
      console.log("ttt");
      triggerDeleteDescription();
    };
    fetchDeleteMeeting();
  };

  const { allMeeting, mutateMeeting } = useAll(isLog);
  const closeForm = () => {
    setDisplayModal(false);
  };

  const handlerPayment = () => {
    setDisplayModal(false);
    const fetchAddMeeting = async () => {
      triggerGet({ start: dateMeeting });
    };
    fetchAddMeeting();
  };

  const [userClickOnButton, setUserClickOnButton] = useState<boolean>(false);
  const closeFormDelete = () => {
    dispatch({
      type: "form/closeModalDeleteMeeting",
    });
  };
  const tesecall = async () => {
    triggerDeleteMeeting();
    try {
      let index;
      let test = user.body.meetingId;
      for (let i = 0; i < allMeeting.length; i++) {
        if (allMeeting[i].id === test) {
          index = i;
        }
      }

      if (index) {
        await mutateMeeting([
          ...allMeeting.splice(0, index),
          ...allMeeting.slice(index + 1),
        ]);
      }
      await mutate({
        ...user,
        body: { ...user.body, meetingId: null, meeting: null },
      });

      console.log("wait");
    } catch (error) {
      console.log("error");
    }
  }; */
  const [userClickOnButton, setUserClickOnButton] = useState<boolean>(false);
  const { allMeeting, mutateMeeting } = useAll(isLog);

  const { trigger: triggerGet, data: dataGet } = useSWRMutation(
    "http://localhost:8080/payment/get",
    fetchGetPayment
  );
  useEffect(() => {
    if (dataGet) {
      window.location.href = dataGet.url;
    }
  }, [dataGet]);

  const { trigger: triggerDeleteMeeting, data: dataDeleteMeeting } =
    useSWRMutation(
      `http://localhost:8080/meeting/${user ? user.body.meetingId : null}`,
      fetchDeleteMeeting
    );
  useEffect(() => {
    if (dataDeleteMeeting) {
      if (dataDeleteMeeting.status === 200) {
        setUserClickOnButton(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataDeleteMeeting.message },
        });
        dispatch({
          type: "form/closeModalDeleteMeeting",
        });
      } else {
        setUserClickOnButton(false);
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataDeleteMeeting.message },
        });
      }
    }
  }, [dataDeleteMeeting, dispatch]);
  const handlerPayment = () => {
    setDisplayModal(false);
    const fetchAddMeeting = async () => {
      triggerGet({ start: dateMeeting });
    };
    fetchAddMeeting();
  };
  const closeFormDelete = () => {
    dispatch({
      type: "form/closeModalDeleteMeeting",
    });
  };
  const tesecall = async () => {
    triggerDeleteMeeting();
    try {
      let index;
      let test = user.body.meetingId;
      for (let i = 0; i < allMeeting.length; i++) {
        if (allMeeting[i].id === test) {
          index = i;
        }
      }

      if (index) {
        await mutateMeeting([
          ...allMeeting.splice(0, index),
          ...allMeeting.slice(index + 1),
        ]);
      }
      await mutate({
        ...user,
        body: { ...user.body, meetingId: null, meeting: null },
      });

      console.log("wait");
    } catch (error) {
      console.log("error");
    }
  };
  const closeForm = () => {
    setDisplayModal(false);
  };
  let content;
  if (isError && isError.message) {
    content = (
      <div className={styles.profile__article__h2}>{isError.message}</div>
    );
  } else if (isLoading) {
    content = <div className={styles.profile__article__h2}>loading...</div>;
  } else {
    content = (
      <>
        {/* {displayModal === true && (
          <div className={styles.meet__comfirm}>
            <button
              className={styles.meet__comfirm__btn}
              onClick={() => closeForm()}
            >
              <span className={styles.meet__comfirm__btn__cross}>&times;</span>
            </button>
            <h1 className={styles.meet__comfirm__h1}>
              Comfirmation de rendez-vous
            </h1>
            <p>
              Pour comfirmer le rendez-vous une autorisation bancaire est
              nécessaire. Aucune somme ne sera débitée avant la fin de la
              consultation vidéo.
            </p>
            <div className={styles.meet__comfirm__div}>
              <button
                className={styles.meet__comfirm__div__btn}
                onClick={() => {
                  handlerPayment();
                }}
              >
                Payer pour comfirmer
              </button>
            </div>
          </div>
        )} */}
        <div className={styles.meet__article}>
          {user && !user.body.meeting && mobile === false && (
            <>
              <DatePickerDesktop
                user={user}
                events={allMeeting}
                setDisplayModal={setDisplayModal}
                setDateMeeting={setDateMeeting}
              />
            </>
          )}
          {user && !user.body.meeting && mobile === true && (
            <DatePickerMobile
              user={user}
              events={allMeeting}
              setDisplayModal={setDisplayModal}
              setDateMeeting={setDateMeeting}
            />
          )}
          <DisplayMeeting />
        </div>
      </>
    );
  }

  return <>{content}</>;
};

export default Display;
