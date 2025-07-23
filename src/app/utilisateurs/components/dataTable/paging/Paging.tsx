import React, { useEffect, useState } from "react";
import styles from "./Paging.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { RootStateUtilisateurs } from "@/app/redux/store/storeUtilisateurs";

const Paging = () => {
  /* const dispatch = useDispatch();
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
                key={i}
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
                key={i}
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
    if (countPage > 7) {
      if (currentPage <= 4) {
        ar = [];
        push(ar, 1, 6, "for", null, null);
        push(ar, null, null, "point", null, nbShow + 1);
        push(ar, null, null, "end", countPage, nbShow + 2);
      } else if (currentPage >= countPage - 3) {
        ar = [];
        push(ar, null, null, "start", 1, nbShow + 1);
        push(ar, null, null, "point", null, nbShow + 2);
        push(ar, countPage - 4, countPage + 1, "for", null, null);
      } else {
        ar = [];
        push(ar, null, null, "start", 1, nbShow + 1);
        push(ar, null, null, "point", null, nbShow + 2);
        push(ar, currentPage - 1, currentPage + 2, "for", null, null);
        push(ar, null, null, "point", null, 2);
        push(ar, null, null, "end", countPage, nbShow + 3);
      }
    } else {
      push(ar, 1, countPage + 1, "for", null, null);
    }

    setSee(ar);
  }, [countPage, currentPage, dispatch, nbShow]);
  return (
    <div className={styles.paging}>
      {datas && datas.length === 0 && <p>Affichage de 0 to 0 of 0 entries </p>}
      {datas && datas.length > 0 && (
        <>
          <p className={styles.paging__p}>
            Affichage de {(currentPage - 1) * nbShow + 1} to{" "}
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
            Affichage de 0 to{" "}
            {datas?.length! < currentPage * nbShow
              ? datas?.length
              : currentPage * nbShow}{" "}
            of {datas?.length} entries
          </p>
        </>
      )}
    </div>
  ); */
  const dispatch = useDispatch();
  const [displayPagingElement, setDisplayPagingElement] = useState<any[]>([]);
  const { currentPage, nbShow, datas } = useSelector(
    (state: RootStateUtilisateurs) => state.Array
  );
  let countPage = datas ? Math.ceil(datas.length / nbShow) : 0;

  useEffect(() => {
    const push = (
      array: any[],
      start: number | null,
      end: number | null,
      type: string,
      page: number | null,
      key: number | null
    ) => {
      if (type === "for") {
        if (start && end) {
          for (let i = start; i < end; i++) {
            if (i === currentPage) {
              array.push(
                <span
                  className={styles.paging__div__div__span__current}
                  onClick={() => {
                    dispatch({
                      type: "Array/selectPage",
                      payload: { page: i },
                    });
                  }}
                  key={i}
                >
                  {i}
                </span>
              );
            } else {
              array.push(
                <span
                  className={styles.paging__div__div__span}
                  onClick={() => {
                    dispatch({
                      type: "Array/selectPage",
                      payload: { page: i },
                    });
                  }}
                  key={i}
                >
                  {i}
                </span>
              );
            }
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
    let arPaging: any[] = [];
    if (countPage > 7) {
      if (currentPage <= 4) {
        push(arPaging, 1, 6, "for", null, null);
        push(arPaging, null, null, "point", null, nbShow + 1);
        push(arPaging, null, null, "end", countPage, nbShow + 2);
      } else if (currentPage >= countPage - 3) {
        push(arPaging, null, null, "start", 1, nbShow + 3);
        push(arPaging, null, null, "point", null, nbShow + 2);
        push(arPaging, countPage - 4, countPage + 1, "for", null, null);
      } else {
        push(arPaging, null, null, "start", 1, nbShow * currentPage + 1);
        push(arPaging, null, null, "point", null, nbShow * currentPage + 2);
        push(arPaging, currentPage - 1, currentPage + 2, "for", null, null);
        push(arPaging, null, null, "point", null, 2);
        push(arPaging, null, null, "end", countPage, nbShow * currentPage + 3);
      }
    } else {
      push(arPaging, 1, countPage + 1, "for", null, null);
    }
    setDisplayPagingElement(arPaging);
  }, [countPage, currentPage, dispatch, nbShow]);

  return (
    <div className={styles.paging}>
      {datas && datas.length === 0 && (
        <p className={styles.paging__p}>Affichage de 0 à 0 sur 0 entrées </p>
      )}
      {datas && datas.length > 0 && (
        <>
          <p className={styles.paging__p}>
            Affichage de {(currentPage - 1) * nbShow + 1} à{" "}
            {datas?.length! < currentPage * nbShow
              ? datas?.length
              : currentPage * nbShow}{" "}
            sur {datas?.length} entrées
          </p>
          <div className={styles.paging__div}>
            <span
              className={styles.paging__div__span}
              onClick={() => {
                if (currentPage > 1) dispatch({ type: "Array/previousPage" });
              }}
            >
              Précédent
            </span>
            <div className={styles.paging__div__div}>
              {displayPagingElement}
            </div>
            <span
              className={styles.paging__div__span}
              onClick={() => {
                if (currentPage < Math.ceil(datas?.length! / nbShow))
                  dispatch({ type: "Array/nextPage" });
              }}
            >
              Suivant
            </span>
          </div>
        </>
      )}
      {/* {datas && datas.length === 0 && (
        <>
          <p className={styles.paging__p}>
            Affichage de 0 à{" "}
            {datas?.length! < currentPage * nbShow
              ? datas?.length
              : currentPage * nbShow}{" "}
            sur {datas?.length} entrées
          </p>
        </>
      )} */}
    </div>
  );
};

export default Paging;
