import React from "react";
import { useDispatch } from "react-redux";
import styles from "./NbShow.module.scss"

/**
 * React component - Component to change tthe number of items to display
 * @return {JSX.Element}
 */
const NbShow = (): JSX.Element => {
  const dispatch = useDispatch();
  const handlerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: "Array/changeNbShow",
      payload: { nbShow: e.target.value },
    });
  };
  return (
    <div className={styles.nbShow}>
      <label className={styles.nbShow__label} htmlFor="">Show </label>
      <select
        name="nb"
        id="nb"
        onChange={(e) => {
          handlerChange(e);
        }}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <span className={styles.nbShow__span}> entries</span>
    </div>
  );
};

export default NbShow;