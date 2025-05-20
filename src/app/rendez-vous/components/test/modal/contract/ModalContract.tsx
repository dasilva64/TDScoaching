/* "use client";

import fetchPost from "@/app/components/fetch/FetchPost";
import useGet from "@/app/components/hook/useGet";
import { AppDispatch, RootState } from "@/app/redux/store";
import { Document, Page, pdfjs } from "react-pdf";
import {
  SelectChangeEvent,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mutate } from "swr";
import styles from "./ModalContract.module.scss";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import Places from "../../google/Places";
import { useDraw } from "@/app/components/hook/canva/useDraw";

 pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString(); 

const fetchBlob = async (url: string, { arg }: { arg: any }) => {
  let response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(arg),
  });
  let json = await response.blob();
  return json;
};

const variants = {
  high: { marginTop: "250px", transition: { duration: 0.7, delay: 0.9 } },
  small: { marginTop: "100px", transition: { duration: 0.7, delay: 0.9 } },
};

const etape: any = { 6: 1, 9: 2, 12: 3, 15: 4, 18: 5, 21: 6 };

const ModalContract = () => {
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/rendez-vous/components/test/modal/contract/api/");
  const { data, trigger, reset, isMutating } = useSWRMutation(
    "/rendez-vous/components/test/modal/contract/api/create/",
    fetchBlob
  );
  const dispatch = useDispatch<AppDispatch>();
  const {
    trigger: triggerEdit,
    data: dataEdit,
    reset: resetEdit,
    isMutating: setIsMutating,
  } = useSWRMutation("/api/user/editFormuleUser", fetchPost);
  
  useEffect(() => {
    if (dataEdit) {
      if (dataEdit.status === 200) {
        mutate(
          "/api/user/getUserMeeting",
          {
            ...dataEdit,
            body: {
              ...dataEdit.body,
            },
          },
          { revalidate: false }
        );
        resetEdit();
        clearState();
        dispatch({
          type: "ModalContract/close",
        });

        //clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataEdit.message },
        });
      } else if (dataEdit.status === 400) {
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataEdit.message },
        });
      }
    }
  }, [dataEdit, dispatch, resetEdit]); 
  const [allowContract, setAllowContract] = useState(false);
  const [allowContractError, setAllowContractError] = useState("");
  const [signatureError, setSignatureError] = useState("");
  const [adresse, setAdresse] = useState("");
  const [city, setCity] = useState("");
  const [errorCity, setErrorCity] = useState("");
  const [validCity, setValidCity] = useState(false);
  const [allCity, setAllCity] = useState<any>(null);
  const [sign, setSign] = useState(false);
  const [nbSeance, setNbSeance] = useState("");
  const [validSeance, setValidSeance] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nbSeanceError, setNbSeanceError] = useState("");
  const [signatureRefContent, setSignatureRefContent] = useState("");
  useEffect(() => {
    if (data) {
      reset();
    }
  }, [data, reset, userData]);
  const [number, setNumber] = React.useState("");
  const [total, setTotal] = React.useState<null | string>(null);

  const { displayModalContractRendezVous, typeModalContractRendezVous } =
    useSelector((state: RootState) => state.ModalContractRendezVous);
  const clearState = () => {
    setAllCity(null);
    setAdresse("");
    //setNbSeance("");
    setTotalPrice(0);
    setValidCity(false);
    setAllowContract(false);
    setAllowContractError("");
    setSignatureError("");
    setNumber("");
    setNbSeanceError("");
    setTotal(null);
    setErrorCity("");
    setSignatureRefContent("");
  };
  const closeForm = () => {
    clearState();
     dispatch({
      type: "ModalContractRendezVous/close",
    }); 
  };
  const handleChange = (event: SelectChangeEvent) => {
    setNumber(event.target.value as string);
    let price: number = Number(event.target.value) * 100;
    setTotal(price.toString());
  };
  const { canvasRef, onMouseDown, signatureRef, clear } = useDraw(
    drawLine,
    setSignatureRefContent,
    setSignatureError
  );
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
  useEffect(() => {
    const test = async () => {
      trigger({
        firstname: userData.body.firstname,
        lastname: userData.body.lastname,
        type: typeModalContractRendezVous,
      });
    };
    if (userData && displayModalContractRendezVous === true) {
      if (userData.status === 200) {
        test();
      }
    }
  }, [
    displayModalContractRendezVous,
    trigger,
    typeModalContractRendezVous,
    userData,
  ]);

  const [pdfUrl, setPdfUrl] = useState<any>(null);
  let content;
  if (isError) {
    content = <p>error</p>;
  } else if (isLoading) {
    content = <p>loading</p>;
  } else {
    if (userData) {
      if (userData.status === 200) {
        let link = `/assets/pdf/contrat-${userData.body.firstname}-${userData.body.lastname}.pdf`;

        if (isMutating === false) {
          content = (
            <div className={styles.contratModal__content}>
              {pdfUrl && (
                <>
                  <Link
                    className={styles.contratModal__content__contract}
                    href={pdfUrl}
                    target="_blank"
                  >
                    voir le contrat
                  </Link>
                </>
              )}

              {sign === true && (
                <>
                  <p>
                    Vous pouvez reremplir le contrat en cliquant sur le bouton
                    ce-dessous
                  </p>
                  <button
                    className={styles.contratModal__content__btnEdit}
                    onClick={() => {
                      const test = async () => {
                        let response = await fetch(
                          "/rendez-vous/components/test/modal/contract/api/create/",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              type: typeModalContractRendezVous,
                            }),
                          }
                        );
                        let dataResponse = await response.blob();
                        const pdfUrl = URL.createObjectURL(
                          dataResponse ?? new Blob([])
                        ); // Crée une URL pour l'afficher
                        setPdfUrl(pdfUrl);
                        setSign(false);
                        clearState();
                          if (dataResponse.status === 200) {
                          setSign(false);
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
                    }}
                  >
                    Modifier le contrat
                  </button>
                  <p>
                    En acceptant le contrat vous pourrez prendre rendez-vous
                  </p>
                  <button
                    className={styles.contratModal__content__btnEdit}
                    onClick={() => {
                      const fetchEdit = async () => {
                         if (typeModalContractRendezVous === "flash") {
                          triggerEdit({
                            formule: typeModalContractRendezVous,
                          });
                        } else if (typeModalContractRendezVous === "custom") {
                          triggerEdit({
                            formule: typeModalContractRendezVous,
                            nbSeance: nbSeance,
                          });
                        } 
                      };
                      fetchEdit();
                    }}
                  >
                    Confirmer le choix
                  </button>
                </>
              )}
              {sign === false && typeModalContractRendezVous === "flash" && (
                <>
                  <div className={styles.contratModal__content__cities}>
                    <Places
                      errorCity={errorCity}
                      setErrorCity={setErrorCity}
                      setAdresse={setAdresse}
                      setCity={setCity}
                    />
                  </div>

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
                            let dataResponse = await response.blob();
                            const pdfUrl = URL.createObjectURL(
                              dataResponse ?? new Blob([])
                            ); // Crée une URL pour l'afficher
                            setPdfUrl(pdfUrl);
                            setSign(true);
                            clearState();
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
                      }}
                    >
                      Ajouter les élements au contrat
                    </button>
                  </div>
                </>
              )}
              {sign === false && typeModalContractRendezVous === "custom" && (
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
              )}
            </div>
          );
        }
      }
    }
  }
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  useEffect(() => {
    const test = async () => {
      //const pdfBlob = await data.data.data.blob(); // Récupère le PDF comme Blob
      const pdfUrl = URL.createObjectURL(data ?? new Blob([])); // Crée une URL pour l'afficher
      setPdfUrl(pdfUrl);
    };
    if (data) {
      test();
    }
  }, [data]);
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
                  Retour à la connection
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
                    width={30}
                    height={30}
                  ></Image>
                </button>
              </div>
               <button
                className={styles.contratModal__btn}
                onClick={() => closeForm()}
              >
                <Image
                  className={styles.contratModal__btn__img}
                  src="/assets/icone/xmark-solid.svg"
                  alt="arrow-left"
                  width={30}
                  height={30}
                ></Image>
              </button>
              <h1 className={styles.contratModal__h1}>Signature du contract</h1>
              <p>
                En prenant une formule flash ou sur mesure vous devez lire et
                signer un contrat
              </p>
               <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  customTextRenderer={false}
                />
              </Document>
              <p>
                Page {pageNumber} of {numPages}
              </p>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalContract; */
