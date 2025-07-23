import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Search.module.scss";
import { RootState } from "@/app/redux/store/store";
import Image from "@/app/components/image/Image";

/**
 * React component - Component for display search bar and search element
 * @return {JSX.Element}
 */
const Search = (): JSX.Element => {
  const [keyAr, setKeyAr] = useState<string[]>([]);
  const [displayCancel, setDisplayCancel] = useState<boolean>(false);
  const { onSearch, datas, initialDatas } = useSelector(
    (state: RootState) => state.ArrayMeetingByUser
  );
  const [inputValue, setInputValue] = useState<string>("");
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handlerInputSearch = (e: any) => {
    setInputValue(e.target.value);
    if (e.target.value.length === 0) {
      setDisplayCancel(false);
      if (onSearch === true) {
        dispatch({
          type: "ArrayMeetingByUser/storeDataSearchInv",
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
        type: "ArrayMeetingByUser/storeDataSearch",
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
    <div className={styles.search}>
      <div className={styles.div}>
        <label className={`${styles.div__label}`} htmlFor={"id"}>
          Rechercher
        </label>
        <div className={styles.div__div}>
          <input
            ref={inputRef}
            value={inputValue}
            className={styles.div__div__input}
            type={"text"}
            name={"id"}
            id={"id"}
            placeholder={"Rechercher un rendez-vous"}
            onChange={(e) => {
              handlerInputSearch(e);
            }}
          />
          {inputValue.length > 0 && (
            <Image
              className={`${styles.div__div__img}`}
              src={`${`/assets/icone/trash-can-solid.svg`}`}
              alt={"icone supprimer recherche"}
              width={20}
              height={20}
              onClick={() => {
                if (inputRef.current) inputRef.current.value = "";
                setInputValue("");
                if (onSearch === true) {
                  dispatch({
                    type: "ArrayMeetingByUser/storeDataSearchInv",
                    payload: { datas: initialDatas },
                  });
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
