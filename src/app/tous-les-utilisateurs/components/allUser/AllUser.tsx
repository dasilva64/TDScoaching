"use client";

import { RootState } from "@/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NbShow from "./dataTable/nbShow/NbShow";
import Paging from "./dataTable/paging/Paging";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import Modal from "./dataTable/modal/Modal";
import styles from './AllUser.module.scss'
import { useRouter } from "next/navigation";

const fetchWithToken = async (url: string, token: string) => {
  let response = await fetch("http://localhost:8080/user/getall", {
    credentials: "include",
  });
  let json = await response.json();
  if (json.status === 401) {
    throw new Error(json.message);
  }
  return json;
};

const AllUser = () => {
  const router = useRouter();
  const { emailUser } = useSelector((state: RootState) => state.auth);
  const { onSearch, datas, displayModal } = useSelector(
    (state: RootState) => state.Array
  );
  const dispatch = useDispatch();
  /* const { data, error, isLoading, mutate } = useSWR(
    ["/api/user/all", token],
    ([url, token]) => fetchWithToken(url, token)
  ); */
  useEffect(() => {
    const fetchTest = async () => {
      let response = await fetch("http://localhost:8080/user/getall", {
        credentials: "include",
      });
      let json = await response.json();
      console.log(json);
      if (json.status === 401) {
        dispatch({
          type: "auth/logout",
        });
        router.push("/");
      } else if (json.status === 200) {
        if (json) {
          let newar = json.body;
          newar.map((p: any, index: any) => {
            if (p.meetingId === null && p.meeting === null) {
              newar[index] = { ...p, meetingId: "aucun", meeting: "aucun" };
            } else {
              let date = new Date(p.meeting.startAt);
              newar[index] = { ...p, meeting: date.toLocaleString() };
            }
          });

          dispatch({
            type: "Array/storeData",
            payload: { datas: newar },
          });
        }
      }
    };
    if (datas === null && onSearch === false) {
      fetchTest();
    }
  }, [datas, dispatch, onSearch, router]);
  return (
    <>
      {displayModal === true && <Modal />}
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
};

export default AllUser;
