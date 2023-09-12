import React, { useEffect, useState } from "react";
import styles from "./ModalTwoFactorSendToken.module.scss";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useGet from "@/app/components/hook/useGet";
import Switch from "@mui/material/Switch";
import fetchGet from "@/app/components/fetch/fetchGet";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import fetchPost from "@/app/components/fetch/FetchPost";
import { AnimatePresence, motion } from "framer-motion";

const ModalTwoFactorSendToken = () => {
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const { displayModalSendTokenTwoFactor } = useSelector(
    (state: RootState) => state.ModalSendTokenTwoFactor
  );
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/api/user/getUserProfile");
  const [displayInput, setdisplayInput] = useState(false);
  const { data, trigger, reset } = useSWRMutation(
    "/api/user/sendTokenTwoFactor",
    fetchGet
  );

  const {
    data: dataDisable,
    trigger: triggerDisable,
    reset: resetDisable,
  } = useSWRMutation("/api/user/disableTwoFactor", fetchGet);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (dataDisable) {
      if (dataDisable.status === 200) {
        dispatch({
          type: "ModalSendTokenTwoFactor/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataDisable.message },
        });
        resetDisable();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataDisable.message },
        });
      }
    }
  }, [dataDisable, dispatch, resetDisable]);
  useEffect(() => {
    const mutateMainData = async () => {
      mutate(
        {
          ...dataDisable,
        },
        { revalidate: false }
      );
      resetDisable();
    };
    if (dataDisable && dataDisable.body) {
      mutateMainData();
    }
  }, [dataDisable, mutate, resetDisable]);
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "ModalEditTwoFactor/open",
        });
        dispatch({
          type: "ModalSendTokenTwoFactor/close",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        reset();
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
        reset();
      }
    }
  }, [data, dispatch, reset]);

  const closeForm = () => {
    dispatch({
      type: "ModalSendTokenTwoFactor/close",
    });
  };
  return (
    <>
      <AnimatePresence>
        {displayModalSendTokenTwoFactor === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.modalTwoFactor}
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
              <button
                className={styles.modalTwoFactor__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.modalTwoFactor__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.modalTwoFactor__h1}>
                Modifier l&apos;authentification à deux facteurs
              </h1>
              <Switch
                checked={userData.body.twoFactor}
                onChange={(e) => {
                  if (e.target.checked === true) {
                    trigger();
                  } else {
                    triggerDisable();
                  }
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalTwoFactorSendToken;
