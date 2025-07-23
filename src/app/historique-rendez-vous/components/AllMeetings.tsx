"use client"

import useGet from "@/app/components/hook/useGet";
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
import { mutate as globalMutate } from "swr";
import ModalOffreDetail from "./dataTable/modal/ModalOffreDetail";
import NoScript from "@/app/components/noscript/NoScript";
import { RootStateHistoriqueRendezVous } from "@/app/redux/store/storeHistoriqueRendezVous";

const AllMeetings = () => {
  const { datas } = useSelector((state: RootStateHistoriqueRendezVous) => state.Array);
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
      } else if (data.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: data.message,
          },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
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
      let copyOfItems: any = [...data.body];
      dispatch({
        type: "Array/storeData",
        payload: { datas: copyOfItems },
      });
    }
  }, [data, dispatch]);
  return (
    <>
      <NoScript />
      {data && data.status === 200 && (
        <>
          <ModalOffreDetail />
        </>
      )}
      <main className={styles.allMeetings}>
        <h1 className={`${styles.allMeetings__h1}`}>Historique de mes rendez-vous</h1>
        <div className={styles.allMeetings__container}>
          <div className={styles.allMeetings__article}>
            <div>
              {content}
            </div>
          </div>
        </div>
      </main>

    </>);
}

export default AllMeetings