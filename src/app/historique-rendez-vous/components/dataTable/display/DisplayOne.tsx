import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Display.module.scss";
import { useRouter } from "next/navigation";
import { RootStateHistoriqueRendezVous } from "@/app/redux/store/storeHistoriqueRendezVous";

const DisplayOne = ({ i }: any) => {
  const { datas, sortBy } = useSelector((state: RootStateHistoriqueRendezVous) => state.Array);
  const [keyAr, setKeyAr] = useState<any>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (datas && datas.length > 0) {
      setKeyAr(Object.keys(datas[0]));
    }
  }, [datas]);
  return (
    <>
      {datas && datas.length > 0 && (
        <tr
          className={i === 0 ? styles.table__body__tr : styles.table__body__tr}
          onClick={() => (
            dispatch({
              type: "ModalOffreDetail/open",
              payload: { meet: datas[i] }
            })
          )}
        >
      {keyAr &&
        keyAr.map((p: any, index: any) => {
          if (datas[i] !== undefined) {
            if (p === "meetings") {
              return
            }
            if (sortBy[0] === p) {
              if (i % 2 === 0) {
                if (p === "Id") {
                  return (
                    <td
                      className={`${styles.table__body__tr__td__even__first} ${styles.table__body__tr__td}`}
                      key={index}
                    >
                      {" "}
                      <div className={styles.table__body__tr__td__div__id}>
                        {datas[i][p]}
                      </div>
                    </td>
                  );
                }
                return (
                  <td
                    className={`${styles.table__body__tr__td__even__first} ${styles.table__body__tr__td}`}
                    key={index}
                  >
                    {" "}
                    <div className={styles.table__body__tr__td__div}>
                      {datas[i][p]}
                    </div>
                  </td>
                );
              } else {
                if (p === "Id") {
                  return (
                    <td
                      className={`${styles.table__body__tr__td__even__first} ${styles.table__body__tr__td}`}
                      key={index}
                    >
                      {" "}
                      <div className={styles.table__body__tr__td__div__id}>
                        {datas[i][p]}
                      </div>
                    </td>
                  );
                }
                return (
                  <td
                    className={`${styles.table__body__tr__td__even__first} ${styles.table__body__tr__td}`}
                    key={index}
                  >
                    <div className={styles.table__body__tr__td__div}>
                      {datas[i][p]}
                    </div>
                  </td>
                );
              }
            }
            if (i % 2 === 0) {
              if (i === 0) {
                if (p === "Id") {
                  return (
                    <td
                      className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td}`}
                      key={index}
                    >
                      {" "}
                      <div className={styles.table__body__tr__td__div__id}>
                        {datas[i][p]}
                      </div>
                    </td>
                  );
                }
                return (
                  <td
                    className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td}`}
                    key={index}
                  >
                    <div className={styles.table__body__tr__td__div}>
                      {datas[i][p]}
                    </div>
                  </td>
                );
              } else {
                if (p === "Id") {
                  return (
                    <td
                      className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td}`}
                      key={index}
                    >
                      {" "}
                      <div className={styles.table__body__tr__td__div__id}>
                        {datas[i][p]}
                      </div>
                    </td>
                  );
                }
                return (
                  <td
                    className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td}`}
                    key={index}
                  >
                    <div className={styles.table__body__tr__td__div}>
                      {datas[i][p]}
                    </div>
                  </td>
                );
              }
            } else {
              if (p === "Id") {
                return (
                  <td
                    className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td}`}
                    key={index}
                  >
                    {" "}
                    <div className={styles.table__body__tr__td__div__id}>
                      {datas[i][p]}
                    </div>
                  </td>
                );
              }
              return (
                <td
                  className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td}`}
                  key={index}
                >
                  <div className={styles.table__body__tr__td__div}>
                    {datas[i][p]}
                  </div>
                </td>
              );
            }
          } else {
            return null;
          }
        })}
    </tr >
      )}
    </>
  );
};

export default DisplayOne;
