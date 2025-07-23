import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./NbShow.module.scss";
import { RootStateHistoriqueRendezVous } from "@/app/redux/store/storeHistoriqueRendezVous";

/**
 * React component - Component to change tthe number of items to display
 * @return {JSX.Element}
 */
const NbShow = (): JSX.Element => {
  const dispatch = useDispatch();
  const { nbShow } = useSelector((state: RootStateHistoriqueRendezVous) => state.Array);
  const handlerChange = (e: any) => {
    dispatch({
      type: "Array/changeNbShow",
      payload: { nbShow: e.target.value },
    });
    dispatch({
      type: "Array/selectPage",
      payload: { page: 1 },
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
            <option disabled value=""></option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default NbShow;
