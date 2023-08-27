"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./TwoFactorData.module.scss";
import { Switch } from "@mui/material";
import useUserGet from "@/app/components/hook/user/useUserGet";
import useSWRMutation from "swr/mutation";
import fetchEditSendTokenTwoFactor from "@/app/components/fetch/user/useEditTwoFactorSendToken";
import { mutate } from "swr";
import fetchGet from "@/app/components/fetch/user/fetchGet";

const TwoFactorData = () => {
  const dispatch = useDispatch();
  const { userData, isLoading, isError } = useUserGet();
  let restDate;
  if (userData?.body.twoFactorCode) {
    let limitDate = userData?.body.twoFactorCode.limitDate;
    let convertInDate = new Date(limitDate);
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());

    restDate = new Date(difference);
  }
  const { data, trigger } = useSWRMutation(
    "/api/user/sendTokenTwoFactor",
    fetchGet
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    const mutateTwoFactor = async () => {
      let copyTwoFactorCode = userData?.body.twoFactorCode;
      mutate(
        "/api/user/getUser",
        {
          ...data,
          body: {
            ...data.body,
            twoFactor: false,
            TwoFactorCode: copyTwoFactorCode,
          },
        },
        { revalidate: false }
      );
    };
    if (data && data.status === 200) {
      mutateTwoFactor();
    }
  }, [data, userData?.body.twoFactorCode]);
  let content;
  if (isError) {
    content = <div>error</div>;
  } else if (isLoading) {
    content = (
      <div className={styles.twoFactorData__loadData}>
        Chargement des données
        <div className={styles.twoFactorData__loadData__arc}>
          <div className={styles.twoFactorData__loadData__arc__circle}></div>
        </div>
      </div>
    );
  } else {
    if (userData) {
      content = (
        <>
          <h3 className={styles.twoFactorData__h3}>Double authentification</h3>
          <ul className={styles.twoFactorData__ul}>
            <li
              className={`${styles.twoFactorData__ul__li} ${styles.twoFactorData__ul__li__margin}`}
            >
              Two Factor :
            </li>
          </ul>
          <div className={styles.twoFactorData__div}>
            {userData?.body.twoFactor === false &&
              userData?.body.twoFactorCode && (
                <>
                  <p>
                    Vous avez déjà fait une demande de two factor, vous pouvez
                    refaire une demande dans{" "}
                    {Number(restDate?.getMinutes()) + 1} minutes{" "}
                  </p>
                  <button
                    className={styles.twoFactorData__div__button}
                    onClick={() => {
                      dispatch({
                        type: "form/openModalTwoFactor",
                      });
                    }}
                  >
                    Valider ma two factor auth
                  </button>
                </>
              )}
            {userData?.body.twoFactor === false &&
              !userData?.body.twoFactorCode && (
                <>
                  <p>
                    Activer cette option est recommendé pour une question de
                    sécurité
                  </p>
                  <Switch
                    defaultChecked={userData?.body.twoFactor}
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        trigger();
                        dispatch({
                          type: "form/openModalTwoFactor",
                        });
                      } else {
                      }
                    }}
                  />
                </>
              )}
            {userData?.body.twoFactor === true && (
              <>
                <p>
                  Votre authentification à double facteur est activé avec votre
                  numéro de téléphone
                </p>
                <Switch
                  defaultChecked={userData?.body.twoFactor}
                  onChange={(e) => {
                    e.preventDefault();
                    dispatch({
                      type: "form/openModalTwoFactorDisable",
                    });
                  }}
                />
              </>
            )}
          </div>
        </>
      );
    }
  }
  return (
    <>
      <>
        <div className={styles.twoFactorData}>{content}</div>
      </>
    </>
  );
};

export default TwoFactorData;
