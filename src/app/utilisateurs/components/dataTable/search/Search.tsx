import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Search.module.scss";
import { RootState } from "../../../../redux/store";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FormControl from "@mui/material/FormControl";

/**
 * React component - Component for display search bar and search element
 * @return {JSX.Element}
 */
const Search = (): JSX.Element => {
  const [keyAr, setKeyAr] = useState<string[]>([]);
  const [displayCancel, setDisplayCancel] = useState<boolean>(false);
  const { onSearch, datas, initialDatas } = useSelector(
    (state: RootState) => state.Array
  );
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handlerInputSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setDisplayCancel(false);
      if (onSearch === true) {
        dispatch({
          type: "Array/storeDataSearchInv",
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
        type: "Array/storeDataSearch",
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
      <FormControl
        variant="standard"
        style={{ width: "100%", minWidth: "200px" }}
      >
        <InputLabel
          sx={{
            color: "black",
            "&.Mui-focused": {
              color: "#1976d2",
            },
          }}
          htmlFor="standard-adornment-password"
        >
          Rechercher
        </InputLabel>
        <Input
          id="standard-adornment-password"
          placeholder={"Rechercher un utilisateur"}
          type={"text"}
          inputRef={inputRef}
          onChange={(e) => handlerInputSearch(e)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                sx={
                  displayCancel
                    ? {
                        color: "black",
                      }
                    : {
                        display: "none",
                      }
                }
                aria-label="toggle password visibility"
                onClick={() => {
                  if (inputRef.current) inputRef.current.value = "";
                  setDisplayCancel(false);
                  if (onSearch === true) {
                    dispatch({
                      type: "Array/storeDataSearchInv",
                      payload: { datas: initialDatas },
                    });
                  }
                }}
              >
                {displayCancel ? <DeleteForeverIcon /> : ""}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      {/* <label className={styles.search__label} htmlFor="search">
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
                type: "Array/storeDataSearchInv",
                payload: { datas: initialDatas },
              });
            }
          }}
          className={styles.search__cancel}
        >
          &times;
        </span> 
      )}*/}
    </div>
  );
};

export default Search;
