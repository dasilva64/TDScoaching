"use client"

import useGet from "@/app/components/hook/useGet";
import { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from './AllMeetings.module.scss'
import Display from "./dataTable/display/Display";
import DisplayError from "./dataTable/display/DisplayError";
import DisplayLoad from "./dataTable/display/DisplayLoad";
import NbShow from "./dataTable/nbShow/NbShow";
import Paging from "./dataTable/paging/Paging";
import Search from "./dataTable/search/Search";

const AllMeetings = () => {
    const { datas } = useSelector((state: RootState) => state.Array);
  const dispatch = useDispatch();
  const [content, setContent] = useState<any>(null);
  const router = useRouter()
   const { data, isLoading, isError } = useGet("/historique-rendez-vous/components/api");
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
  }, [data, datas, dispatch, isError, isLoading, router]);

  useEffect(() => {
    if (data && data.status === 200) {
      let copyOfItems = [...data.body];
      copyOfItems.map((p: any, index: any) => {
        if (p.idMeeting === null || p.meeting === "aucun") {
          if (p.idMeeting === null) {
            copyOfItems[index] = {
              ...p,
              Début: new Date(p.start).toLocaleString(),
              Coaching: p.coaching,
              Confirmation: p.confirm ? "Oui" : "Non",
              Status: p.confirm === "pending" ? "En cours" : "Finit"
            };
            delete copyOfItems[index].start;
            delete copyOfItems[index].coaching;
            delete copyOfItems[index].confirm;
            delete copyOfItems[index].status;
          }
        } else if (p.idMeeting !== null) {
          let date = null;
          copyOfItems[index] = {
            ...p,
            Début: new Date(p.start).toLocaleString(),
            Coaching: p.coaching,
            Confirmation: p.confirm ? "Oui" : "Non",
            Status: p.confirm === "pending" ? "En cours" : "Finit"
          };
          delete copyOfItems[index].start;
          delete copyOfItems[index].coaching;
          delete copyOfItems[index].confirm;
          delete copyOfItems[index].status;
        }
      });
      dispatch({
        type: "Array/storeData",
        payload: { datas: copyOfItems },
      });
    }
  }, [data, dispatch]); 
  return <>{content}</>;
}

export default AllMeetings