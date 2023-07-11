import React, { useEffect, useState } from "react";
import styles from "./Paging.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

const Paging = () => {
  const dispatch = useDispatch();
  const [see, setSee] = useState([]);
  const { datas, currentPage, nbShow } = useSelector(
    (state: RootState) => state.Array
  );
  let countPage = Math.ceil(datas.length / nbShow);

  useEffect(() => {
    const push = (
      array: any,
      start: any,
      end: any,
      type: any,
      page: any,
      key: any
    ) => {
      if (type === "for") {
        for (let i = start; i < end; i++) {
          if (i === currentPage) {
            array.push(
              <span
                className={styles.paging__div__div__span__current}
                onClick={() => {
                  dispatch({ type: "Array/selectPage", payload: { page: i } });
                }}
                key={i + 30}
              >
                {i}
              </span>
            );
          } else {
            array.push(
              <span
                className={styles.paging__div__div__span}
                onClick={() => {
                  dispatch({ type: "Array/selectPage", payload: { page: i } });
                }}
                key={i + 60}
              >
                {i}
              </span>
            );
          }
        }
      } else if (type === "point") {
        array.push(
          <span key={key} className={styles.paging__div__div__span__point}>
            ...
          </span>
        );
      } else {
        array.push(
          <span
            key={key}
            className={styles.paging__div__div__span}
            onClick={() => {
              dispatch({
                type: "Array/selectPage",
                payload: { page: page },
              });
            }}
          >
            {page}
          </span>
        );
      }
    };
    let ar: any = [];
    if (countPage > 8) {
      if (currentPage <= 4) {
        ar = [];
        push(ar, 1, 6, "for", null, null);
        push(ar, null, null, "point", null, 7);
      } else if (currentPage >= countPage - 3) {
        ar = [];
        push(ar, null, null, "start", 1, 8);
        push(ar, null, null, "point", null, 9);
        push(ar, countPage - 4, countPage + 1, "for", null, null);
      } else {
        ar = [];
        push(ar, null, null, "start", 1, 3);
        push(ar, null, null, "point", null, 1);
        push(ar, currentPage - 1, currentPage + 2, "for", null, null);
        push(ar, null, null, "point", null, 2);
        push(ar, null, null, "end", countPage, 100);
      }
    } else {
      push(ar, 1, countPage + 1, "for", null, null);
    }

    setSee(ar);
  }, [countPage, currentPage, dispatch]);
  return (
    <div className={styles.paging}>
      {datas && datas.length > 0 && (
        <>
          <p className={styles.paging__p}>
            Showing {(currentPage - 1) * nbShow + 1} to{" "}
            {datas?.length! < currentPage * nbShow
              ? datas?.length
              : currentPage * nbShow}{" "}
            of {datas?.length} entries
          </p>
          <div className={styles.paging__div}>
            <span
              className={styles.paging__div__span}
              onClick={() => {
                if (currentPage > 1) dispatch({ type: "Array/previousPage" });
              }}
            >
              previous
            </span>
            <div className={styles.paging__div__div}>{see}</div>
            <span
              className={styles.paging__div__span}
              onClick={() => {
                if (currentPage < Math.ceil(datas?.length! / nbShow))
                  dispatch({ type: "Array/nextPage" });
              }}
            >
              next
            </span>
          </div>
        </>
      )}
      {datas && datas.length === 0 && (
        <>
          <p className={styles.paging__p}>
            Showing 0 to{" "}
            {datas?.length! < currentPage * nbShow
              ? datas?.length
              : currentPage * nbShow}{" "}
            of {datas?.length} entries
          </p>
        </>
      )}
    </div>
  );
};

export default Paging;
