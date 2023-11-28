import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import styles from "./ContractModal.module.scss";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Link from "next/link";
import useGet from "@/app/components/hook/useGet";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import jsPDF from "jspdf";
import { useDraw } from "@/app/components/hook/canva/useDraw";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { mutate } from "swr";

const ContractModal = () => {
  const {
    data: userData,
    isLoading,
    isError,
  } = useGet("/api/user/getUserProfile");
  const { data, trigger, reset, isMutating } = useSWRMutation(
    "/api/contract/create",
    fetchPost
  );
  const {
    trigger: triggerEdit,
    data: dataEdit,
    reset: resetEdit,
    isMutating: setIsMutating,
  } = useSWRMutation("/api/user/editFormuleUser", fetchPost);
  const dispatch = useDispatch<AppDispatch>();
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
        closeForm();
        //clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataEdit.message },
        });
      } else if (dataEdit.status === 400) {
        /* dataEdit.message.forEach((element: any) => {
          if (element[0] === "formule") {
            setErrorMessageFormule(element[1]);
          }
        }); */
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
  const [city, setCity] = useState("");
  const [errorCity, setErrorCity] = useState("");
  const [validCity, setValidCity] = useState(false);
  const [allCity, setAllCity] = useState<any>(null);
  const [sign, setSign] = useState(false);
  const [signatureRefContent, setSignatureRefContent] = useState("");
  useEffect(() => {
    if (data) {
      reset();
    }
  }, [data, reset, userData]);
  const [number, setNumber] = React.useState("");
  const [total, setTotal] = React.useState<null | string>(null);

  const { displayModalContract, type } = useSelector(
    (state: RootState) => state.ModalContract
  );
  const clearState = () => {
    setAllCity(null);
    setCity("");
    setValidCity(false);
    setAllowContract(false);
    setAllowContractError("");
    setSignatureError("");
    setNumber("");
    setTotal(null);
    setErrorCity("");
    setSignatureRefContent("");
  };
  const closeForm = () => {
    clearState();
    dispatch({
      type: "ModalContract/close",
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
        type: type,
      });
    };
    if (userData && displayModalContract === true) {
      if (userData.status === 200) {
        test();
      }
    }
  }, [displayModalContract, trigger, type, userData]);

  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCity(e.target.value);
    const fetchMethod = async () => {
      if (e.target.value.length > 0) {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${e.target.value}&fields=departement&boost=population&limit=10`
        );
        const data = await response.json();
        setAllCity(data);
      } else if (e.target.value.length === 0) {
        setAllCity(null);
        setErrorCity("");
      }
    };
    fetchMethod();
  };
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
              <Link
                className={styles.contratModal__content__contract}
                href={link}
                target="_blank"
              >
                voir le contrat
              </Link>
              {sign === true && (
                <>
                  <p>
                    Vous pouvez reremplir le contrat en cliquant sur le bouton
                    ce-dessous
                  </p>
                  <button
                    onClick={() => {
                      const test = async () => {
                        let response = await fetch("/api/contract/create", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            type: type,
                          }),
                        });
                        let dataResponse = await response.json();
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
                  <button
                    onClick={() => {
                      const fetchEdit = async () => {
                        triggerEdit({
                          formule: type,
                        });
                      };
                      fetchEdit();
                    }}
                  >
                    Comfirmer le choix
                  </button>
                </>
              )}
              {sign === false && (
                <>
                  <div className={styles.contratModal__content__cities}>
                    <FormControl variant="standard" sx={{ width: "100%" }}>
                      <InputLabel
                        sx={{
                          color: "black",
                          "&.Mui-focused": {
                            color: "#1976d2",
                          },
                        }}
                        htmlFor="standard-adornment-email"
                      >
                        Ville
                      </InputLabel>
                      <Input
                        autoFocus
                        id="standard-adornment-email"
                        value={city}
                        placeholder={"Entrez votre ville"}
                        type={"text"}
                        onChange={(e) => {
                          handlerInput(e);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <LocationCityIcon
                              sx={{ color: "black" }}
                              aria-label="toggle email visibility"
                            >
                              <Visibility />
                            </LocationCityIcon>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errorCity}
                      </FormHelperText>
                    </FormControl>
                    {allCity !== null && (
                      <>
                        {allCity.length > 0 && (
                          <div
                            className={
                              styles.contratModal__content__cities__all
                            }
                          >
                            {allCity.map((city: any, index: number) => {
                              return (
                                <React.Fragment key={index}>
                                  <p
                                    className={
                                      styles.contratModal__content__cities__all__city
                                    }
                                    onClick={() => {
                                      setCity(city.nom);
                                      setValidCity(true);
                                      setErrorCity("");
                                      setAllCity(null);
                                    }}
                                  >
                                    {city.nom}
                                  </p>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        )}
                        {allCity.length === 0 && (
                          <div>
                            <p>Aucune ville trouvé</p>
                          </div>
                        )}
                      </>
                    )}
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
                          (signatureRefContent !== undefined && city.length > 0)
                        ) {
                          let data = signatureRef.current.value.replace(
                            /^data:image\/\w+;base64,/,
                            ""
                          );

                          const test = async () => {
                            let response = await fetch("/api/contract/edit", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                signature: data,
                                city: city,
                              }),
                            });
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
                          console.log(signatureRefContent);
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
                          if (city.length === 0) {
                            setErrorCity("Vous devez entrer une ville");
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
  return (
    <>
      <AnimatePresence>
        {displayModalContract === true && (
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

              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default ContractModal;
