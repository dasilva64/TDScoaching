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

const AllMeeting = () => {
  const { data, isLoading, isError } = useGet("/api/meeting/getAllByUser");
  const dispatch = useDispatch();
  const { datas } = useSelector((state: RootState) => state.ArrayHistorique);
  let content;
  if (isError) content = <div>error</div>;
  else if (isLoading) {
    content = (
      <div className={styles.datatable__loadData}>
        Chargement des données
        <div className={styles.datatable__loadData__arc}>
          <div className={styles.datatable__loadData__arc__circle}></div>
        </div>
      </div>
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
        if (p.description === null || p.description === "aucun") {
          newar[index] = {
            ...p,
            startAt: new Date(p.startAt).toLocaleString(),
            description: "aucun",
            status: p.status.toString(),
          };
          delete newar[index].User;
          delete newar[index].endAt;
          delete newar[index].limitDate;
          delete newar[index].id;
          delete newar[index].userId;
        } else {
          newar[index] = {
            ...p,
            startAt: new Date(p.startAt).toLocaleString(),
            status: p.status.toString(),
          };
          delete newar[index].User;
          delete newar[index].endAt;
          delete newar[index].userId;
          delete newar[index].limitDate;
          delete newar[index].id;
        }
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
