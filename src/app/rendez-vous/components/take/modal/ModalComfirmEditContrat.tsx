"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ModalComfirmDeleteContrat.module.scss";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
//import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { RootState } from "@/app/redux/store";
import useGet from "../../../../components/hook/useGet";
import useSWRMutation from "swr/mutation";
import fetchPost from "../../../../../../src/app/components/fetch/FetchPost";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import Visibility from "@mui/icons-material/Visibility";
import Link from "next/link";
//import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { google } from "googleapis";
/* import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"; */
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
/* import { useDraw } from "../../../../components/hook/canva/useDraw";
import add from "../../../../../api/meeting/add";
import Places from "../../../../components/google/Places"; */
const lib: any = ["places"];

const ModalComfirmEditContrat = () => {
  const [allowContract, setAllowContract] = useState(false);
  const [allowContractError, setAllowContractError] = useState("");
  const [signatureError, setSignatureError] = useState("");
  const [city, setCity] = useState("");
  const [errorCity, setErrorCity] = useState("");
  const [validCity, setValidCity] = useState(false);
  const [allCity, setAllCity] = useState<any>(null);
  const [adresse, setAdresse] = useState("");
  const [sign, setSign] = useState(false);
  const [input, setInput] = useState("");
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
    libraries: lib,
  });

  useEffect(() => {
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
    };
    /* const autoComplete = new google.maps.places.autoComplete(input, options);
      console.log(autoComplete); */
  }, [input]);

  const [signatureRefContent, setSignatureRefContent] = useState("");
  const clearState = () => {
    setAllCity(null);
    setCity("");
    setValidCity(false);
    setAllowContract(false);
    setAllowContractError("");
    setSignatureError("");
    setErrorCity("");
    setSignatureRefContent("");
  };
  const {
    data: userData,
    mutate,
    isError,
    isLoading,
  } = useGet("/api/user/getUserProfile");

  const { data, trigger, reset, isMutating } = useSWRMutation(
    "/api/contract/avenant",
    fetchPost
  );
  useEffect(() => {
    if (data) {
      reset();
    }
  }, [data, reset, userData]);
  /* const { displayModalComfirmEditContrat } = useSelector(
    (state: RootState) => state.ModalComfirmEditContrat
  ); */
  /* useEffect(() => {
    const test = async () => {
      trigger({
        firstname: userData.body.firstname,
        lastname: userData.body.lastname,
      });
    };
    if (userData && displayModalComfirmEditContrat === true) {
      if (userData.status === 200) {
        test();
      }
    }
  }, [displayModalComfirmEditContrat, trigger, userData]); */
  const dispatch = useDispatch();
  const closeForm = () => {
    dispatch({
      type: "ModalComfirmDeleteContrat/close",
    });
  };
  /* const { canvasRef, onMouseDown, signatureRef, clear } = useDraw(
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
  }*/
  let content;
  if (isError) {
    content = <p>error</p>;
  } else if (isLoading) {
    content = <p>loading</p>;
  } else {
    if (userData) {
      if (userData.status === 200) {
        let link = `/assets/pdf/avenant-${userData.body.firstname}-${userData.body.lastname}.pdf`;

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
                    className={styles.contratModal__content__btnEdit}
                    onClick={() => {
                      const test = async () => {
                        let response = await fetch("/api/contract/create", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
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
                  <p>
                    En acceptant le contrat vous pourrez prendre rendez-vous
                  </p>
                  <button
                    className={styles.contratModal__content__btnEdit}
                    onClick={() => {
                      const fetchEdit = async () => {
                        /* triggerEdit({
                            formule: type,
                          }); */
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
                  <div className={`${styles.contratModal__content__cities}`}>
                    {" "}
                    {/* <Places
                      errorCity={errorCity}
                      setErrorCity={setErrorCity}
                      setAdresse={setAdresse}
                      setCity={setCity}
                    /> */}
                  </div>

                  <p>Vous pouvez signer contrat dans la parti ci-dessous</p>
                  <canvas
                    style={{
                      border: "1px solid black",
                      width: "300px",
                      height: "100px",
                    }}
                    /* ref={canvasRef}
                    onMouseDown={onMouseDown} */
                    width={300}
                    height={100}
                    className={styles.contratModal__content__canvas}
                  />
                  <div>
                    {/*  <input type="hidden" name="signature" ref={signatureRef} /> */}
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
                              //clear();
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
                          /* let data = signatureRef.current.value.replace(
                            /^data:image\/\w+;base64,/,
                            ""
                          ); */

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
        {/* {displayModalComfirmEditContrat === true && (
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
              <h1 className={styles.contratModal__h1}>
                Comfirmation de changement d&apos;offre
              </h1>
               <input
                  type="text"
                  name=""
                  id=""
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                />
              <p>Offre actuelle : {userData.body.typeMeeting.type} </p>
              <p>
                Votre offre actuelle sera supprimée et remplacée par
                l&apos;offre : unique.
              </p>
              <p>
                Pour changer d&apos;offre vous devez faire une avenant de votre
                contrat
              </p>
              {content}
            </motion.div>
          </>
        )} */}
      </AnimatePresence>
    </>
  );
};

export function Map() {
  const center = useMemo(() => ({ lat: 44, lng: 80 }), []);
  const [selected, setSelected] = useState<any>(null);
  const searchOptions = {
    componentRestrictions: { country: ["fr"] },
    types: ["city"],
  };
  return (
    <>
      <div>
        <PlacesAutocomplete
          setSelected={setSelected}
          searchOptions={searchOptions}
        />
        {/* <GooglePlacesAutocomplete
            autocompletionRequest={{
              componentRestrictions: { country: ["fr"] },
            }}
          /> */}
      </div>
    </>
  );
}

export const PlacesAutocomplete = ({ setSelected }: any) => {
  /* const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();
  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setSelected({ lat, lng });
    } catch (error) {
      //console.log("😱 Error: ", error);
    }
  };
  if (data.length > 0) {
    //console.log(data[0].terms[data[0].terms.length - 1]);
  } */
  //
  return (
    <>
      <div>
        {/*  <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="entrez votre ville"
        />
        <div>
          {status === "OK" &&
            data.map(
              ({ place_id, description, terms }: any) =>
                terms[terms.length - 1].value === "France" && (
                  <p key={place_id}>{description}</p>
                )
            )}
        </div> */}
      </div>
      {/* <Combobox style={{ position: "absolute", zIndex: "999" }}>
          <ComboboxInput
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disabled={!ready}
            placeholder="Entrez votre ville"
          />
          <ComboboxPopover style={{ position: "absolute", zIndex: "999" }}>
            <ComboboxList>
              {status === "OK" &&
                data.map(({ place_id, description }: any) => (
                  <ComboboxOption key={place_id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox> */}
    </>
  );
};

export default ModalComfirmEditContrat;
