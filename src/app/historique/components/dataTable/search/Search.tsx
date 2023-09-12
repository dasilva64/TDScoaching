import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Search.module.scss";
import { RootState } from "@/app/redux/store";

/**
 * React component - Component for display search bar and search element
 * @return {JSX.Element}
 */
const Search = (): JSX.Element => {
  const [keyAr, setKeyAr] = useState<string[]>([]);
  const [displayCancel, setDisplayCancel] = useState<boolean>(false);
  const { onSearch, datas, initialDatas } = useSelector(
    (state: RootState) => state.ArrayHistorique
  );
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handlerInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setDisplayCancel(false);
      if (onSearch === true) {
        dispatch({
          type: "ArrayHistorique/storeDataSearchInv",
          payload: { datas: initialDatas },
        });
      }
    } else {
      setDisplayCancel(true);
      let dataSearch: any = [];

      if (initialDatas) {
        initialDatas.filter((data: any) => {
          for (let i = 0; i < keyAr.length; i++) {
            if (
              data[keyAr[i]]
                .toString()
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
            ) {
              dataSearch.push(data);
              continue;
            }
          }
          return null;
        });
      }

      let newar = [...new Set(dataSearch)];

      dispatch({
        type: "ArrayHistorique/storeDataSearch",
        payload: { datas: newar },
      });
    }
  };
  useEffect(() => {
    if (datas && datas.length > 0) {
      setKeyAr(Object.keys(datas[0]));
    }
  }, [datas]);
  return (
    <div>
      <label className={styles.search__label} htmlFor="search">
        Rechercher :{" "}
      </label>
      <input
        ref={inputRef}
        type="text"
        name="search"
        id="search"
        onChange={(e) => handlerInputSearch(e)}
      />
      {displayCancel === true && (
        <span
          onClick={() => {
            if (inputRef.current) inputRef.current.value = "";
            setDisplayCancel(false);
            if (onSearch === true) {
              dispatch({
                type: "ArrayHistorique/storeDataSearchInv",
                payload: { datas: initialDatas },
              });
            }
          }}
          className={styles.search__cancel}
        >
          &times;
        </span>
      )}
    </div>
  );
};

export default Search;
