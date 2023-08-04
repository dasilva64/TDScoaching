"use client";

import { RootState } from "../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NbShow from "./dataTable/nbShow/NbShow";
import Paging from "./dataTable/paging/Paging";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import styles from "./AllUser.module.scss";
import useGetAll from "@/app/components/hook/user/useGetAll";

const AllUser = () => {
  const { datas, displayModal } = useSelector(
    (state: RootState) => state.Array
  );
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetAll();
  let content;
  if (isError) {
    content = <div>error</div>;
  } else if (isLoading) {
    content = (
      <div className={styles.datatable__loadData}>
        Chargement des données
        <div className={styles.datatable__loadData__arc}>
          <div className={styles.datatable__loadData__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    if (data) {
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
      let copyOfItems = [...data.body];

      copyOfItems.map((p: any, index: any) => {
        if (p.meeting === null || p.meeting === "aucun") {
          if (p.meeting === null) {
            copyOfItems[index] = {
              ...p,
              meeting: "aucun",
              status: p.status.toString(),
            };
          }
        } else if (p.meeting !== null) {
          copyOfItems[index] = { ...p, status: p.status.toString() };
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
