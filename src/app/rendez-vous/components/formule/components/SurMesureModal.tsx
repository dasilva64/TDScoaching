import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import styles from "./DiscoveryModal.module.scss";
import Image from "@/app/components/image/Image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const SurMesureModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [number, setNumber] = React.useState("");
  const [total, setTotal] = React.useState<null | string>(null);

  /* const { displayModalSurMesure } = useSelector(
    (state: RootState) => state.ModalSurMesure
  ); */
  const closeForm = () => {
    dispatch({
      type: "ModalSurMesure/close",
    });
  };
  const handleChange = (event: SelectChangeEvent) => {
    setNumber(event.target.value as string);
    let price: number = Number(event.target.value) * 100;
    setTotal(price.toString());
  };
  return (
    <>
      <AnimatePresence>
        {/* {displayModalSurMesure === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.login}
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{
                y: "-50%",
                x: "-50%",
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                y: 200,
                x: "-50%",
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <button className={styles.login__btn} onClick={() => closeForm()} onMouseDown={(e) => e.preventDefault()}>
                <Image
                  className={styles.login__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.login__h1}>Créer votre pack sur mesure</h1>
              <p>Sélectionner le nombre de séance pour votre pack</p>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Numbre de séance
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={number}
                  onChange={handleChange}
                  label="Nombre de séance"
                >
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={7}>7</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={11}>11</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={13}>13</MenuItem>
                  <MenuItem value={14}>14</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                  <MenuItem value={17}>17</MenuItem>
                  <MenuItem value={18}>18</MenuItem>
                  <MenuItem value={19}>19</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
              {total !== null && <p>Le prix sera de de : {total}</p>}
            </motion.div>
          </>
        )} */}
      </AnimatePresence>
    </>
  );
};

export default SurMesureModal;
