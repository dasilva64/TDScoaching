import React, { useEffect, useState } from "react";
import styles from "./ModalTwoFactorSendToken.module.scss";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import useGet from "../../../../../components/hook/useGet";
import Switch from "@mui/material/Switch";
import fetchGet from "../../../../../components/fetch/fetchGet";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import fetchPost from "../../../../../components/fetch/FetchPost";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ModalTwoFactorSendToken = () => {
  const [inputPseudo, setInputPseudo] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { displayModalSendTokenTwoFactor } = useSelector(
    (state: RootState) => state.ModalSendTokenTwoFactor
  );
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/profile/components/api");

  useEffect(() => {
    if (userData) {
      if (userData.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: userData.message,
          },
        });
        router.push("/");
      } else if (userData.status !== 200) {
        setTimeout(() => {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: {
              type: "error",
              flashMessage: userData.message,
            },
          });
        }, 2000);
        router.refresh();
      }
    }
  }, [dispatch, isLoading, router, userData]);
  const [displayInput, setdisplayInput] = useState(false);
  const { data, trigger, reset, isMutating } = useSWRMutation(
    "/profile/components/twoFactorSendTokenData/Modal/send/api",
    fetchGet
  );

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
      } else if (data.status === 401) {
        setTimeout(() => {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: data.message },
          });
          reset();
        }, 2000);
        router.push("/");
      } else if (data.status === 400) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
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
  }, [data, dispatch, reset, router]);

  const closeForm = () => {
    dispatch({
      type: "ModalSendTokenTwoFactor/close",
    });
  };

  const displayButton = () => {
    if (isMutating === false) {
      return (
        <Switch
          checked={userData.body.twoFactor}
          onChange={(e) => {
            if (e.target.checked === true) {
              dispatch({
                type: "flash/clearFlashMessage",
              });
              trigger();
            } else {
              dispatch({
                type: "ModalComfirmDisableTwoFactor/open",
              });
            }
          }}
        />
      );
    } else if (isMutating === true) {
      return (
        <button disabled className={styles.modalTwoFactor__switch__load}>
          <span className={styles.modalTwoFactor__switch__load__span}>
            Chargement
          </span>

          <div className={styles.modalTwoFactor__switch__load__arc}>
            <div
              className={styles.modalTwoFactor__switch__load__arc__circle}
            ></div>
          </div>
        </button>
      );
    }
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
              <p className={styles.modalTwoFactor__p}>
                L&apos;authentification à deux facteurs est un moyen de
                sécuriser votre compte en plus de votre mot de passe. Lorsque
                vous vous connectez, vous devrez entrer votre mot de passe et un
                code à 8 chiffres qui vous sera alors envoyé dans votre boite
                mail.
              </p>
              {userData.body.twoFactor === true && (
                <p className={styles.modalTwoFactor__p}>
                  Si vous désactivez l&apos;authentification à deux facteurs,
                  vous devrez à nouveau la configurer pour la réactiver.
                </p>
              )}
              {userData.body.twoFactor === false && (
                <p className={styles.modalTwoFactor__p}>
                  Vous n&apos;avez pas la double authentification
                  d&apos;activée.
                </p>
              )}
              <div className={styles.modalTwoFactor__switch}>
                {displayButton()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalTwoFactorSendToken;
