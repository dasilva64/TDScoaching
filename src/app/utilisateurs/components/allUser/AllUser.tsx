"use client";

import { RootState } from "../../../redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NbShow from "./dataTable/nbShow/NbShow";
import Paging from "./dataTable/paging/Paging";
import Search from "./dataTable/search/Search";
import Display from "./dataTable/display/Display";
import styles from "./AllUser.module.scss";
import DisplayLoad from "./dataTable/display/DisplayLoad";
import useGet from "@/app/components/hook/useGet";

const AllUser = () => {
  const { datas } = useSelector((state: RootState) => state.Array);
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGet("/api/user/getAll");
  let content;
  if (isError) {
    content = <div>error</div>;
  } else if (isLoading) {
    content = (
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
              Prénom: p.firstName,
              Nom: p.lastName,
              Mail: p.mail,
              Téléphone: p.phone,
              RendezVous: "aucun",
              Status: p.status.toString(),
            };
            delete copyOfItems[index].meeting;
            delete copyOfItems[index].status;
            delete copyOfItems[index].firstName;
            delete copyOfItems[index].lastName;
            delete copyOfItems[index].phone;
            delete copyOfItems[index].mail;
          }
        } else if (p.meeting !== null) {
          copyOfItems[index] = {
            ...p,
            Prénom: p.firstName,
            Nom: p.lastName,
            Mail: p.mail,
            Téléphone: p.phone,
            Status: p.status.toString(),
            RendezVous: p.meeting,
          };
          delete copyOfItems[index].status;
          delete copyOfItems[index].meeting;
          delete copyOfItems[index].firstName;
          delete copyOfItems[index].lastName;
          delete copyOfItems[index].phone;
          delete copyOfItems[index].mail;
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
