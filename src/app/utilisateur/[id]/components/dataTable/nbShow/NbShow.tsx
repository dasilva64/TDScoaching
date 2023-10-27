import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./NBShow.module.scss";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

/**
 * React component - Component to change tthe number of items to display
 * @return {JSX.Element}
 */
const NbShow = (): JSX.Element => {
  const dispatch = useDispatch();
  const { nbShow } = useSelector((state: any) => state.ArrayMeetingByUser);
  const handlerChange = (e: any) => {
    dispatch({
      type: "ArrayMeetingByUser/changeNbShow",
      payload: { nbShow: e.target.value },
    });
  };
  return (
    <div className={styles.nbshow}>
      <FormControl variant="standard" sx={{ minWidth: 300, width: "100%" }}>
        <InputLabel id="demo-simple-select-standard-label">
          Nombre d&apos;élements à afficher
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          defaultValue={nbShow}
          onChange={(e) => {
            handlerChange(e);
          }}
          label="Affichage de"
        >
          <MenuItem value={"5"}>5</MenuItem>
          <MenuItem value={"10"}>10</MenuItem>
          <MenuItem value={"20"}>25</MenuItem>
          <MenuItem value={"50"}>50</MenuItem>
        </Select>
      </FormControl>
      {/* <label htmlFor="">Affichage de </label>
      <select
        name="nb"
        id="nb"
        onChange={(e) => {
          handlerChange(e);
        }}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select> 
      <span> entrées</span>*/}
    </div>
  );
};

export default NbShow;
