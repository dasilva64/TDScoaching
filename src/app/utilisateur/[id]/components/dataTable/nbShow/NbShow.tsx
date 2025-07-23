import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./NBShow.module.scss";
import { RootStateUtilisateur } from "@/app/redux/store/storeUtilisateur";

/**
 * React component - Component to change tthe number of items to display
 * @return {JSX.Element}
 */
const NbShow = (): JSX.Element => {
  const dispatch = useDispatch();
  const { nbShow } = useSelector((state: RootStateUtilisateur) => state.ArrayMeetingByUser);
  const handlerChange = (e: any) => {
    dispatch({
      type: "ArrayMeetingByUser/changeNbShow",
      payload: { nbShow: e.target.value },
    });
  };
  return (
    <div className={styles.nbshow}>
      <div className={styles.nbshow__div}>
        <label
          className={`${
            nbShow > 0
              ? styles.nbshow__div__label__value
              : styles.nbshow__div__label
          }`}
          htmlFor=""
        >
          Nombre d&apos;élements à afficher
        </label>
        <div className={styles.nbshow__div__div}>
          <select
            className={styles.nbshow__div__div__select}
            name=""
            defaultValue={nbShow}
            id=""
            onChange={(e) => {
              handlerChange(e);
            }}
          >
            <option hidden disabled value=""></option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default NbShow;
