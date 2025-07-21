"use client";

import fetchPost from "@/app/components/fetch/FetchPost";
import { AppDispatch, RootState } from "@/app/redux/store";
import { rgb } from "pdf-lib";
import { AnimatePresence, motion, px } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ModalContract.module.scss";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import Places from "../../google/Places";
import { useDraw } from "@/app/components/hook/canva/useDraw";
import { useRouter } from "next/navigation";
import { mutate as globalMutate } from "swr";

const ModalContract = ({ mutate }: any) => {
  const router = useRouter()
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)

  const dispatch = useDispatch<AppDispatch>();
  const [allowContract, setAllowContract] = useState(false);
  const [allowContractError, setAllowContractError] = useState("");
  const [validAllow, setValidAllow] = useState(false);
  const [signatureError, setSignatureError] = useState("");
  const [validSignature, setValidSignature] = useState(false);
  const [adresse, setAdresse] = useState("");
  const [city, setCity] = useState("");
  const [errorCity, setErrorCity] = useState("");
  const [validCity, setValidCity] = useState(false);
  const [signatureRefContent, setSignatureRefContent] = useState("");
  const [dateSignature, setDateSignature] = useState("")

  const { displayModalContractRendezVous, typeModalContractRendezVous, statusModalContractRendezVous } =
    useSelector((state: RootState) => state.ModalContractRendezVous);
  const clearState = () => {
    setAdresse("");
    setDateSignature("")
    setAllowContract(false);
    setAllowContractError("");
    setSignatureError("");
    setErrorCity("");
    setValidAllow(false);
    setValidCity(false);
    setValidSignature(false);
    setSignatureRefContent("");
  };
  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalContractRendezVous/close",
    });
  };
  const { canvasRef, onMouseDown, signatureRef, clear } = useDraw(
    drawLine,
    setSignatureRefContent,
    setSignatureError,
    setDateSignature,
    setValidSignature
  );
  const inputRef: any = React.useRef();
  useEffect(() => {
    if (displayModalContractRendezVous === true) {
      if (inputRef && inputRef.current) {
        inputRef.current.addEventListener("keydown", (e: any) => {
          if (e.key === "Enter") {
            e.srcElement.click();
            e.preventDefault();
          }
        });
      }
    }
  }, [displayModalContractRendezVous]);
  function drawLine({ prevPoint, currentPoint, ctx }: any) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = rgb(0, 0, 0);
    const lineWidth = 2;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
  }
  const { data: dataSee, trigger: triggerSee, reset: resetSee, isMutating: isMutatingSee } = useSWRMutation("/rendez-vous/components/test/modal/contract/api/see/", fetchPost)
  useEffect(() => {
    if (dataSee) {
      if (dataSee.status === 200) {
        resetSee();
        window.open(dataSee.body, '_ blank')
      } else if (dataSee.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: dataSee.message,
          },
        });
        resetSee();
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push("/")
      } else {
        resetSee();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: dataSee.message,
          },
        });
      }
    }
  }, [dataSee, dispatch, resetSee, router])
  const { data: dataAdd, trigger: triggerAdd, reset: resetAdd, isMutating: isMutatingAdd } = useSWRMutation("/rendez-vous/components/test/modal/contract/api/edit/", fetchPost)
  useEffect(() => {
    if (dataAdd) {
      if (dataAdd.status === 200) {
        mutate()
        dispatch({
          type: "ModalContractRendezVous/close",
        });
        dispatch({
          type: "ModalContractRecapRendezVous/open",
          payload: {
            type: typeModalContractRendezVous,
          },
        });
        clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "success",
            flashMessage: dataAdd.message,
          },
        });
        resetAdd()
      } else if (dataAdd.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            type: "error",
            flashMessage: dataAdd.message,
          },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push("/");
      }
      else {
        if (dataAdd.type === "validation") {
          dataAdd.message.forEach((element: string) => {
            if (element[0] === "signature") {
              setSignatureError(element[1]);
    setValidSignature(false);
            }
            if (element[0] === "city" || element[0] === "adresse") {
              setErrorCity(element[1]);
              setValidCity(false);
            }
            if (element[0] === "typeOffre") {
              dispatch({
                type: "flash/storeFlashMessage",
                payload: { type: "error", flashMessage: "Le type de l'offre est introuvable, veuillez réessayer" },
              });
            }
          });
          resetAdd();
        } else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "error", flashMessage: dataAdd.message },
          });
          resetAdd();
        }
      }
    }
  }, [dataAdd, dispatch, mutate, resetAdd, router, typeModalContractRendezVous])
  let content = (
    <>
      <div className={styles.contratModal__content}>
        <>
          {isMutatingSee === false && (

            <button
              onClick={() => {
                const fetchContract = async () => {
                  triggerSee({
                    typeOffre: typeModalContractRendezVous,
                    csrfToken: csrfToken
                  })
                }
                fetchContract()
              }}
              className={styles.contratModal__content__contract}>
              Voir le contrat
            </button>

          )}
          {isMutatingSee && (
            <button
              disabled
              className={styles.contratModal__content__contract__load}
            >
              <span
                className={
                  styles.contratModal__content__contract__load__span
                }
              >
                Chargement
              </span>

              <div
                className={
                  styles.contratModal__content__contract__load__arc
                }
              >
                <div
                  className={
                    styles.contratModal__content__contract__load__arc__circle
                  }
                ></div>
              </div>
            </button>
          )}

        </>
        <div className={styles.contratModal__content__line}></div>
        {typeModalContractRendezVous === "flash" && (
          <>
            <p>Vous devez entrer votre adresse postal et signé pour commencer l&apos;offre.</p>
            <div className={styles.contratModal__content__cities}>
              <Places
                errorCity={errorCity}
                setErrorCity={setErrorCity}
                setAdresse={setAdresse}
                setCity={setCity}
                setValidCity={setValidCity}
              />
            </div>

            <p>Vous pouvez signer le contrat dans la parti ci-dessous</p>
            <canvas
              ref={canvasRef}
              onMouseDown={onMouseDown}
              width="250px"
              height="100px"
              className={styles.contratModal__content__canvas}
            />
            {dateSignature !== "" && (
              <p>Signé le {new Date(dateSignature).toLocaleString("fr", { day: "numeric", month: "long", year: "numeric" })} à {new Date(dateSignature).toLocaleString("fr", { hour: "numeric", minute: "numeric", second: "numeric" })}</p>
            )}

            <div>
              <input type="hidden" name="signature" ref={signatureRef} />
            </div>
            {signatureRefContent !== "" &&
              signatureRefContent !== undefined && (
                <>
                  <div>
                    <button
                      className={
                        styles.contratModal__content__canvas__btnClearSignature
                      }
                      onClick={() => {
                        clear();
                      }}
                    >
                      Supprimer la signature
                    </button>
                  </div>
                </>
              )}
            <p className={styles.contratModal__content__signature__error}>{signatureError}</p>
            <div className={styles.contratModal__content__allow}>
              <div className={styles.contratModal__content__allow__div}>
                <label
                  className={styles.contratModal__content__allow__div__label}
                  htmlFor="remenber"
                >
                  Lu et approuvé
                </label>
                <input
                  ref={inputRef}
                  className={styles.contratModal__content__allow__div__checkbox}
                  type="checkbox"
                  name="legal"
                  id="legal"
                  onChange={(e) => {
                    setAllowContract(e.target.checked);
                    if (e.target.checked === false) {
                      setAllowContractError(
                        "Vous devez accepter les conditions"
                      );
                      setValidAllow(false)
                    } else {
                      setValidAllow(true)
                      setAllowContractError("");
                    }
                  }}
                />
              </div>
              <div className={styles.contratModal__content__allow__div__error}>
                {allowContractError}
              </div>
            </div>

            <div>
              {!isMutatingAdd && (
                <button
                  className={styles.contratModal__content__submit}
                  onClick={() => {
                    dispatch({
                      type: "flash/clearFlashMessage",
                    });
                    if (validAllow && validCity && validSignature) {
                      triggerAdd({
                        signature: signatureRef.current.value,
                        adresse: adresse,
                        city: city,
                        csrfToken: csrfToken,
                        typeOffre: typeModalContractRendezVous,


                      })
                    } else {
                      if (validAllow === false) {
                        setAllowContractError("Vous devez accepter les conditions");
                      }
                      if (validCity === false) {
                        setErrorCity("Vous devez entrer une adresse");
                      }
                      if (validSignature === false) {
                        setSignatureError("Vous devez signer le contrat");
                      }
                    }
                    /* if (
                      (allowContract === true &&
                        Boolean(signatureRefContent) &&
                        adresse.length > 0)
                    ) {
                      triggerAdd({
                        signature: signatureRef.current.value,
                        adresse: adresse,
                        city: city,
                        csrfToken: csrfToken,
                        typeOffre: typeModalContractRendezVous,


                      })
                    } else {
                      if (allowContract === false) {
                        setAllowContractError(
                          "Vous devez accepter les conditions"
                        );
                      }
                      if (
                        signatureRefContent === "" ||
                        signatureRefContent === undefined
                      ) {
                        setSignatureError("Vous devez signer le contrat");
                      }
                      if (adresse.length === 0) {
                        setErrorCity("Vous devez entrer une adresse");
                      }
                    } */
                  }}
                >
                  Ajouter les élements au contrat
                </button>
              )}
              {isMutatingAdd && (
                <>
                  <button
                    disabled
                    className={styles.contratModal__content__submit__load}
                  >
                    <span
                      className={
                        styles.contratModal__content__submit__load__span
                      }
                    >
                      Chargement
                    </span>

                    <div
                      className={
                        styles.contratModal__content__submit__load__arc
                      }
                    >
                      <div
                        className={
                          styles.contratModal__content__submit__load__arc__circle
                        }
                      ></div>
                    </div>
                  </button>
                </>
              )}

            </div>
          </>
        )}
        {/* {sign === false && typeModalContractRendezVous === "custom" && (
                <>
                  <AnimatePresence>
                    {validSeance === false && (
                      <motion.div
                        style={{
                          height: "205px",
                          position: "absolute",
                          top: "80px",
                          width: "100%",
                        }}
                        initial={{ y: 200, x: "0", opacity: 0 }}
                        animate={{
                          y: "0",
                          x: "0",
                          opacity: 1,
                          transition: { duration: 0.7, delay: 0.9 },
                        }}
                        exit={{
                          y: 200,
                          x: "0",
                          opacity: 0,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <p>
                          Sélectionner le nombre de séance pour votre formule
                        </p>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: "100%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Nombre de séance
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={nbSeance}
                            onChange={(e) => {
                              if (e.target.value !== "") {
                                setNbSeance(e.target.value.toString());
                                setNbSeanceError("");
                                setTotalPrice(Number(e.target.value) * 100);
                                setValidSeance(true);
                              } else {
                                setNbSeance(e.target.value.toString());
                                setNbSeanceError(
                                  "Vous devez choisir le nombre de séance"
                                );
                              }
                            }}
                            label="Age"
                            placeholder="Sélectionner le nombre de séance"
                          >
                            <MenuItem key={"6"} value={6}>
                              6
                            </MenuItem>
                            <MenuItem key={"9"} value={9}>
                              9
                            </MenuItem>
                            <MenuItem key={"12"} value={12}>
                              12
                            </MenuItem>
                            <MenuItem key={"15"} value={15}>
                              15
                            </MenuItem>
                            <MenuItem key={"18"} value={18}>
                              18
                            </MenuItem>
                            <MenuItem key={"21"} value={21}>
                              21
                            </MenuItem>
                          </Select>
                          <FormHelperText>{nbSeanceError}</FormHelperText>
                        </FormControl>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {validSeance === true && (
                      <motion.div
                        className={styles.contratModal__content__price}
                        initial={{
                          y: 200,
                          opacity: 0,
                          transform: "translateX(-50%)",
                        }}
                        animate={{
                          y: "0",
                          opacity: 1,
                          transition: { duration: 0.7, delay: 0.9 },
                        }}
                        exit={{
                          y: 200,
                          opacity: 0,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <h1 className={styles.contratModal__content__price__h1}>
                          Pack {nbSeance} séances
                        </h1>
                        <div
                          className={
                            styles.contratModal__content__price__content
                          }
                        >
                          {Object.entries(etape).map(
                            ([k, v]: any, index: any) => {
                              return Number(k) === Number(nbSeance) ? (
                                <React.Fragment key={index}>
                                  {" "}
                                  <Image
                                    className={
                                      styles.contratModal__content__price__content__icone
                                    }
                                    width="20"
                                    height="20"
                                    priority={true}
                                    src={"/assets/icone/check-solid.svg"}
                                    alt="bousole"
                                  />
                                  <p
                                    className={
                                      styles.contratModal__content__price__content__text
                                    }
                                  >
                                    Point d&apos;étape offfert : {v}
                                  </p>
                                </React.Fragment>
                              ) : (
                                <React.Fragment key={index}></React.Fragment>
                              );
                            }
                          )}
                        </div>
                        <div
                          className={
                            styles.contratModal__content__price__content
                          }
                        >
                          {" "}
                          <Image
                            className={
                              styles.contratModal__content__price__content__icone
                            }
                            width="20"
                            height="20"
                            priority={true}
                            src={"/assets/icone/check-solid.svg"}
                            alt="bousole"
                          />
                          <p
                            className={
                              styles.contratModal__content__price__content__text
                            }
                          >
                            bilan offert
                          </p>
                        </div>
                        <div
                          className={
                            styles.contratModal__content__price__content
                          }
                        >
                          <p
                            className={
                              styles.contratModal__content__price__content__price
                            }
                          >
                            {totalPrice}
                          </p>
                          <Image
                            className={
                              styles.contratModal__content__price__content__icone__left
                            }
                            width="20"
                            height="20"
                            priority={true}
                            src={"/assets/icone/euro-sign-solid-white.svg"}
                            alt="bousole"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setNbSeance("");
                            setNbSeanceError("");
                            setValidSeance(false);
                          }}
                        >
                          changer de pack
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    <motion.div
                      variants={variants}
                      animate={validSeance === true ? "high" : "small"}
                      className={`${styles.contratModal__content__cities}`}
                    >
                      <Places
                        errorCity={errorCity}
                        setErrorCity={setErrorCity}
                        setAdresse={setAdresse}
                        setCity={setCity}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <p>Vous pouvez signer contrat dans la parti ci-dessous</p>
                  <canvas
                    style={{
                      border: "1px solid black",
                      width: "300px",
                      height: "100px",
                    }}
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    width={300}
                    height={100}
                    className={styles.contratModal__content__canvas}
                  />
                  <div>
                    <input type="hidden" name="signature" ref={signatureRef} />
                  </div>
                  {signatureRefContent !== "" &&
                    signatureRefContent !== undefined && (
                      <>
                        <div>
                          <button
                            className={
                              styles.contratModal__content__canvas__btnClearSignature
                            }
                            onClick={() => {
                              clear();
                            }}
                          >
                            Supprimer la signature
                          </button>
                        </div>
                      </>
                    )}
                  <p style={{ color: "red" }}>{signatureError}</p>
                  <FormControl>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e: any) => {
                              setAllowContract(e.target.checked);
                              if (e.target.checked === false) {
                                setAllowContractError(
                                  "Vous devez accepter les conditions"
                                );
                              } else {
                                setAllowContractError("");
                              }
                            }}
                          />
                        }
                        label="Lu et approuvé"
                      />
                    </FormGroup>
                    <FormHelperText style={{ color: "red" }}>
                      {allowContractError}
                    </FormHelperText>
                  </FormControl>

                  <div>
                    <button
                      style={{
                        background: "aqua",
                        borderRadius: "10px",
                        border: "none",
                        padding: "10px",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (typeModalContractRendezVous === "custom") {
                          if (
                            (allowContract === true &&
                              signatureRefContent !== "") ||
                            (signatureRefContent !== undefined &&
                              adresse.length > 0 &&
                              nbSeance !== "")
                          ) {
                            let data = signatureRef.current.value.replace(
                              /^data:image\/\w+;base64,/,
                              ""
                            );

                            const test = async () => {
                              let response = await fetch(
                                "/rendez-vous/components/test/modal/contract/api/edit/",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    signature: data,
                                    adresse: adresse,
                                    city: city,
                                  }),
                                }
                              );
                              let dataResponse = await response.json();
                              if (dataResponse.status === 200) {
                                setSign(true);
                                clearState();
                              } else {
                                dispatch({
                                  type: "flash/storeFlashMessage",
                                  payload: {
                                    type: "error",
                                    flashMessage: dataResponse.message,
                                  },
                                });
                              }
                            };

                            test();
                          } else {
                            if (allowContract === false) {
                              setAllowContractError(
                                "Vous devez accepter les conditions"
                              );
                            }
                            if (
                              signatureRefContent === "" ||
                              signatureRefContent === undefined
                            ) {
                              setSignatureError("Vous devez signer le contrat");
                            }
                            if (adresse.length === 0) {
                              setErrorCity("Vous devez entrer une adresse");
                            }
                            if (nbSeance === "") {
                              setNbSeanceError(
                                "Vous devez choisir le nombre de séance"
                              );
                            }
                          }
                        } else if (typeModalContractRendezVous === "flash") {
                          if (
                            (allowContract === true &&
                              signatureRefContent !== "") ||
                            (signatureRefContent !== undefined &&
                              adresse.length > 0)
                          ) {
                            let data = signatureRef.current.value.replace(
                              /^data:image\/\w+;base64,/,
                              ""
                            );

                            const test = async () => {
                              let response = await fetch(
                                "/rendez-vous/components/test/modal/contract/api/edit/",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    signature: data,
                                    adresse: adresse,
                                    city: city,
                                  }),
                                }
                              );
                              let dataResponse = await response.json();
                              if (dataResponse.status === 200) {
                                setSign(true);
                                clearState();
                              } else {
                                dispatch({
                                  type: "flash/storeFlashMessage",
                                  payload: {
                                    type: "error",
                                    flashMessage: dataResponse.message,
                                  },
                                });
                              }
                            };

                            test();
                          } else {
                            if (allowContract === false) {
                              setAllowContractError(
                                "Vous devez accepter les conditions"
                              );
                            }
                            if (
                              signatureRefContent === "" ||
                              signatureRefContent === undefined
                            ) {
                              setSignatureError("Vous devez signer le contrat");
                            }
                            if (adresse.length === 0) {
                              setErrorCity("Vous devez entrer une adresse");
                            }
                          }
                        }
                      }}
                    >
                      Ajouter les élements au contrat
                    </button>
                  </div>
                </>
              )} */}
      </div>
    </>
  )
  return (
    <>
      <AnimatePresence>
        {displayModalContractRendezVous === true && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              className={styles.bg}
              onClick={() => closeForm()}
            />
            <motion.div
              className={styles.contratModal}
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
              <div className={styles.contratModal__top}>
                <button
                  className={styles.contratModal__top__back}
                  type="button"
                  onClick={() => {
                    clearState();
                    dispatch({
                      type: "ModalContractRendezVous/close",
                    });
                    dispatch({
                      type: "ModalFormuleAddRendezVous/open",
                      payload: {
                        type: typeModalContractRendezVous,
                      },
                    });
                  }}
                >
                  Retour au détails de l&apos;offre
                </button>
                <button
                  type="button"
                  className={styles.contratModal__top__close}
                  onClick={() => closeForm()}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Image
                    className={styles.contratModal__top__close__img}
                    src="/assets/icone/xmark-solid.svg"
                    alt="icone fermer modal"
                    width={25}
                    height={25}
                  ></Image>
                </button>
              </div>
              <h1 className={styles.contratModal__h1}>Création du contract</h1>
              {statusModalContractRendezVous === "reprendre" && (
                <>
                  <p>Vous avez commencé une démarche de souscription. Il vous reste à signer et confirmer pour poursuivre.</p>
                </>
              )}
              {/*  <p>L’adresse IP peut servir comme élément complémentaire pour prouver l’origine de la signature, mais elle n’est pas obligatoire. Elle est utile si tu veux ajouter un niveau de traçabilité ou te prémunir contre des contestations.Et l’insérer dans le PDF ou le stocker en base à part. Dans le contrat, tu peux l’afficher discrètement :
                “Adresse IP de signature : 123.45.67.89 (horodatée)”
                 À noter : si tu récupères cette IP, indique-le dans tes CGU ou une note discrète en bas du contrat, histoire d’être transparent.</p>
              <p> */}
              <p>Ce document est une prévisualisation personnalisée. Aucun engagement n’est pris tant que vous n’avez pas signé et confirmé.</p>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalContract;
