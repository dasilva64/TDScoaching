import { RootState } from "@/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Display.module.scss";
import { useRouter } from "next/navigation";

const DisplayOne = ({ i }: any) => {
  /* const { datas, sortBy } = useSelector(
    (state: RootState) => state.ArrayMeeting
  ); */
  const router = useRouter();
  const [keyAr, setKeyAr] = useState<any>([]);
  /* useEffect(() => {
    if (datas && datas.length > 0) {
      setKeyAr(Object.keys(datas[0]));
    }
  }, [datas]); */

  return (
    <>
      {/* {datas && datas.length > 0 && (
        <tr
          className={styles.table__body__tr}
          onClick={() => {
            router.push(`/utilisateur/${datas[i]["UserId"]}`);
          }}
        >
          {keyAr &&
            keyAr.map((p: any, index: any) => {
              if (datas[i] !== undefined) {
                if (sortBy[0] === p) {
                  if (i % 2 === 0) {
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
        </tr>
      )} */}
    </>
  );
};

export default DisplayOne;
