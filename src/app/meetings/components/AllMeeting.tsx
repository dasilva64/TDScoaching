"use client";

import useAll from "@/app/components/hook/meeting/useAll";
import React, { use, useEffect } from "react";
import styles from "./AllMeeting.module.scss";
import { RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import NbShow from "./dataTable/nbShow/NbShow";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import Paging from "./dataTable/paging/Paging";

const AllMeeting = () => {
  const { datas, displayModal } = useSelector(
    (state: RootState) => state.ArrayMeeting
  );
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useAll();
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
        let copyUser = { ...p.User };
        console.log(copyUser);
        if (p.description === null || p.description === "aucun") {
          newar[index] = {
            ...p,
            startAt: new Date(p.startAt).toLocaleString(),
            endAt: new Date(p.endAt).toLocaleString(),
            description: "aucun",
            status: p.status.toString(),
            prenom: copyUser.firstname,
            nom: copyUser.lastname,
          };
          delete newar[index].User;
          delete newar[index].limitDate;
        } else {
          newar[index] = {
            ...p,
            startAt: new Date(p.startAt).toLocaleString(),
            endAt: new Date(p.endAt).toLocaleString(),
            status: p.status.toString(),
            prenom: copyUser.firstname,
            nom: copyUser.lastname,
          };
          delete newar[index].User;
          delete newar[index].limitDate;

        }
      });
      dispatch({
        type: "ArrayMeeting/storeData",
        payload: { datas: newar },
      });
    }
  }, [data, dispatch]);
  return <>{content}</>;
};

export default AllMeeting;
