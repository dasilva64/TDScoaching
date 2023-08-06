import { RootState } from "@/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Display.module.scss";
import Link from "next/link";

const DisplayOne = ({ i }: any) => {
  const dispatch = useDispatch();
  const { datas, sortBy } = useSelector(
    (state: RootState) => state.ArrayHistorique
  );
  const [keyAr, setKeyAr] = useState<any>([]);
  useEffect(() => {
    if (datas && datas.length > 0) {
      setKeyAr(Object.keys(datas[0]));
    }
  }, [datas]);

  return (
    <>
      {datas && datas.length > 0 && (
        <tr
          className={
            i === 0 ? styles.table__body__tr : styles.table__body__tr__border
          }
        >
          {keyAr &&
            keyAr.map((p: any, index: any) => {
              if (datas[i] !== undefined) {
                if (sortBy[0] === p) {
                  if (i % 2 === 0) {
                    return (
                      <td
                        className={`${styles.table__body__tr__td__even__first} ${styles.table__body__tr__td__border}`}
                        key={index}
                      >
                        {" "}
                        <Link href={`/utilisateur/${datas[i]["userId"]}`}>
                          <div className={styles.table__body__tr__td__div}>
                            {datas[i][p]}
                          </div>
                        </Link>
                      </td>
                    );
                  } else {
                    return (
                      <td
                        className={`${styles.table__body__tr__td__odd__first} ${styles.table__body__tr__td}`}
                        key={index}
                      >
                        <Link href={`/utilisateur/${datas[i]["userId"]}`}>
                          <div className={styles.table__body__tr__td__div}>
                            {datas[i][p]}
                          </div>
                        </Link>
                      </td>
                    );
                  }
                }
                if (i % 2 === 0) {
                  if (i === 0) {
                    return (
                      <td
                        className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td__border}`}
                        key={index}
                      >
                        <Link href={`/utilisateur/${datas[i]["userId"]}`}>
                          <div className={styles.table__body__tr__td__div}>
                            {datas[i][p]}
                          </div>
                        </Link>
                      </td>
                    );
                  } else {
                    return (
                      <td
                        className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td}`}
                        key={index}
                      >
                        <Link href={`/utilisateur/${datas[i]["userId"]}`}>
                          <div className={styles.table__body__tr__td__div}>
                            {datas[i][p]}
                          </div>
                        </Link>
                      </td>
                    );
                  }
                } else {
                  return (
                    <td
                      className={`${styles.table__body__tr__td__odd} ${styles.table__body__tr__td}`}
                      key={index}
                    >
                      <Link href={`/utilisateur/${datas[i]["userId"]}`}>
                        <div className={styles.table__body__tr__td__div}>
                          {datas[i][p]}
                        </div>
                      </Link>
                    </td>
                  );
                }
              } else {
                return null;
              }
            })}
        </tr>
      )}
    </>
  );
};

export default DisplayOne;
