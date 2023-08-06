import React from "react";
import { useDispatch } from "react-redux";

/**
 * React component - Component to change tthe number of items to display
 * @return {JSX.Element}
 */
const NbShow = (): JSX.Element => {
  const dispatch = useDispatch();
  const handlerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: "ArrayHistorique/changeNbShow",
      payload: { nbShow: e.target.value },
    });
  };
  return (
    <div>
      <label htmlFor="">Show </label>
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
      <span> entries</span>
    </div>
  );
};

export default NbShow;
