import fetchPost from "../../../../../src/app/components/fetch/FetchPost";
import Image from "next/image";
import { useCanvas } from "./CanvasContext";
import styles from "./Formule.module.scss";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import WhileInView from "@/app/components/framer/WhileInView";
import Button from "./components/Button";
import ButtonOpenNormal from "./components/ButtonOpenNormal";
/* import { useDraw } from "../../../components/hook/canva/useDraw";
import { rgb } from "pdf-lib";
import { Map } from "../take/modal/ModalComfirmDeleteContrat"; */

const Formule = () => {
  const [inputPseudo, setInputPseudo] = useState("");
  const [inputFormule, setInputFormule] = useState("");
  const [validFormuleInput, setValidFormuleInput] = useState(false);
  const [errorMessageFormule, setErrorMessageFormule] = useState("");
  const { trigger, data, reset, isMutating } = useSWRMutation(
    "/api/user/editFormuleUser",
    fetchPost
  );
  const dispatch = useDispatch();
  /* const clearState = () => {
    setInputFormule("");
    setInputPseudo("");
    setValidFormuleInput(false);
    setErrorMessageFormule("");
  }; */
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        mutate(
          "/api/user/getUserMeeting",
          {
            ...data,
            body: {
              ...data.body,
            },
          },
          { revalidate: false }
        );
        reset();
        //clearState();
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else if (data.status === 400) {
        data.message.forEach((element: any) => {
          if (element[0] === "formule") {
            setErrorMessageFormule(element[1]);
          }
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: data.message },
        });
      }
    }
  }, [data, dispatch, inputFormule, reset, setErrorMessageFormule]);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch({
      type: "flash/clearFlashMessage",
    });
    if (validFormuleInput === true) {
      if (inputPseudo.length === 0) {
        const fetchEdit = async () => {
          trigger({
            pseudo: inputPseudo,
            formule: inputFormule,
          });
        };
        fetchEdit();
      }
    } else {
      if (inputFormule === "long") {
        dispatch({
          type: "ModalSurMesure/open",
        });
      } else if (inputFormule === "flash") {
        dispatch({
          type: "ModalContract/open",
          payload: { type: "flash" },
        });
      } else {
        setErrorMessageFormule("Veuillez choisir une formule");
      }
    }
  };
  /* const { canvasRef, onMouseDown, clear } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: any) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = rgb(0, 0, 0);
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  } */
  return (
    <>
      <div className={styles.formule__info}>
        <Image
          className={styles.formule__info__img}
          src="/assets/icone/circle-exclamation-solid-black.svg"
          alt=""
          width={20}
          height={20}
        />
        <p>Vous n&apos;avez aucun rendez-vous à venir</p>
      </div>
      <div className={styles.formule__offre}>
        <h3 className={styles.formule__offre__title}>
          Selection d&apos;une offre
        </h3>
        <p className={styles.formule__offre__description}>
          Vous pouvez sélectionner une offre pour prendre d&apos;autre
          rendez-vous.
        </p>
        <div className={styles.formule__offre__content}>
          <div
            className={`${styles.formule__offre__content__card} ${styles.formule__offre__content__card__unique}`}
          >
            <p>Pack unique</p>
            <ul className={styles.formule__offre__content__card__ul}>
              <li className={styles.formule__offre__content__card__ul__li}>
                <Image
                  className={
                    styles.formule__offre__content__card__ul__li__icone
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/check-solid.svg"}
                  alt="bousole"
                />
                1 séances de coaching (<ButtonOpenNormal />)
              </li>
              <li className={styles.formule__offre__content__card__ul__li}>
                <Image
                  className={
                    styles.formule__offre__content__card__ul__li__icone
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/check-solid.svg"}
                  alt="bousole"
                />
                Sans engagement
              </li>
            </ul>
            <p className={styles.formule__offre__content__card__price}>
              100
              <span
                className={styles.formule__offre__content__card__price__sign}
              >
                €
              </span>
            </p>
          </div>
          <div
            className={`${styles.formule__offre__content__card} ${styles.formule__offre__content__card__flash}`}
          >
            <p>Pack flash</p>
            <ul className={styles.formule__offre__content__card__ul}>
              <li className={styles.formule__offre__content__card__ul__li}>
                <Image
                  className={
                    styles.formule__offre__content__card__ul__li__icone
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/check-solid.svg"}
                  alt="bousole"
                />
                3 séances de coaching (<ButtonOpenNormal />)
              </li>
              <li className={styles.formule__offre__content__card__ul__li}>
                <Image
                  className={
                    styles.formule__offre__content__card__ul__li__icone
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/check-solid.svg"}
                  alt="bousole"
                />
                1 bilan final offert
              </li>
            </ul>
            <p className={styles.formule__offre__content__card__price}>
              300
              <span
                className={styles.formule__offre__content__card__price__sign}
              >
                €
              </span>
            </p>
          </div>
          <div
            className={`${styles.formule__offre__content__card} ${styles.formule__offre__content__card__custom}`}
          >
            <p>Pack sur mesure</p>
            <ul className={styles.formule__offre__content__card__ul}>
              <li className={styles.formule__offre__content__card__ul__li}>
                <Image
                  className={
                    styles.formule__offre__content__card__ul__li__icone
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/check-solid.svg"}
                  alt="bousole"
                />
                Nombre de séances de coaching à définir (selon choix du client
                et problématique abordée) (<ButtonOpenNormal />)
              </li>
              <li className={styles.formule__offre__content__card__ul__li}>
                <Image
                  className={
                    styles.formule__offre__content__card__ul__li__icone
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/check-solid.svg"}
                  alt="bousole"
                />
                Points d’étape offerts (en fonction de la durée totale du
                coaching)
              </li>
              <li className={styles.formule__offre__content__card__ul__li}>
                <Image
                  className={
                    styles.formule__offre__content__card__ul__li__icone
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/check-solid.svg"}
                  alt="bousole"
                />
                1 bilan final offert
              </li>
              <li className={styles.formule__offre__content__card__ul__li}>
                <Image
                  className={
                    styles.formule__offre__content__card__ul__li__icone
                  }
                  width="30"
                  height="30"
                  priority={true}
                  src={"/assets/icone/check-solid.svg"}
                  alt="bousole"
                />
                Prix sur demande
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div style={{ width: "100%" }} className={styles.formule}>
      <h3 className={styles.formule__h3}>
        Choisir une formule pour pouvoir prendre un rendez-vous
      </h3>
      <div className={styles.formule__packs__container}>
        <WhileInView
          type="y"
          className={`${styles.formule__offre__content__card} ${styles.formule__offre__content__card__unique}`}
        >
          <h2 className={styles.formule__offre__content__card__h3}>
            Pack unique
          </h2>
          <ul className={styles.formule__offre__content__card__ul}>
            <li className={styles.formule__offre__content__card__ul__li}>
              <Image
                className={
                  styles.formule__offre__content__card__ul__li__icone
                }
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              1 séances de coaching (<ButtonOpenNormal />)
            </li>
            <li className={styles.formule__offre__content__card__ul__li}>
              <Image
                className={
                  styles.formule__offre__content__card__ul__li__icone
                }
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Sans engagement
            </li>
          </ul>
          <p className={styles.formule__offre__content__card__price}>
            100
            <span
              className={styles.formule__offre__content__card__price__sign}
            >
              €
            </span>
          </p>
          <div className={styles.formule__offre__content__card__divBtn}>
            <button
              className={styles.formule__offre__content__card__divBtn__select}
              onClick={() => {
                const fetchEdit = async () => {
                  trigger({
                    formule: "unique",
                  });
                };
                fetchEdit();
              }}
            >
              Choissir ce pack
            </button>
          </div>
        </WhileInView>
        <WhileInView
          type="y"
          className={`${styles.formule__offre__content__card} ${styles.formule__offre__content__card__flash}`}
        >
          <h2 className={styles.formule__offre__content__card__h3}>
            Pack flash
          </h2>
          <ul className={styles.formule__offre__content__card__ul}>
            <li className={styles.formule__offre__content__card__ul__li}>
              <Image
                className={
                  styles.formule__offre__content__card__ul__li__icone
                }
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              3 séances de coaching (<ButtonOpenNormal />)
            </li>
            <li className={styles.formule__offre__content__card__ul__li}>
              <Image
                className={
                  styles.formule__offre__content__card__ul__li__icone
                }
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              1 bilan final offert
            </li>
          </ul>
          <p className={styles.formule__offre__content__card__price}>
            300
            <span
              className={styles.formule__offre__content__card__price__sign}
            >
              €
            </span>
          </p>
          <div className={styles.formule__offre__content__card__divBtn}>
            <button
              className={styles.formule__offre__content__card__divBtn__select}
              onClick={() => {
                dispatch({
                  type: "ModalContract/open",
                  payload: { type: "flash" },
                });
              }}
            >
              Choissir ce pack
            </button>
          </div>
        </WhileInView>

        <WhileInView
          type="y"
          className={`${styles.formule__offre__content__card} ${styles.formule__offre__content__card__long}`}
        >
          <h2 className={styles.formule__offre__content__card__h3}>
            Pack sur mesure
          </h2>
          <ul className={styles.formule__offre__content__card__ul}>
            <li className={styles.formule__offre__content__card__ul__li}>
              <Image
                className={
                  styles.formule__offre__content__card__ul__li__icone
                }
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Nombre de séances de coaching à définir (selon choix du client et
              problématique abordée) (<ButtonOpenNormal />)
            </li>
            <li className={styles.formule__offre__content__card__ul__li}>
              <Image
                className={
                  styles.formule__offre__content__card__ul__li__icone
                }
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Points d’étape offerts (en fonction de la durée totale du
              coaching)
            </li>
            <li className={styles.formule__offre__content__card__ul__li}>
              <Image
                className={
                  styles.formule__offre__content__card__ul__li__icone
                }
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              1 bilan final offert
            </li>
            <li className={styles.formule__offre__content__card__ul__li}>
              <Image
                className={
                  styles.formule__offre__content__card__ul__li__icone
                }
                width="30"
                height="30"
                priority={true}
                src={"/assets/icone/check-solid.svg"}
                alt="bousole"
              />
              Prix sur demande
            </li>
          </ul>
          <div className={styles.formule__offre__content__card__divBtn}>
            <button
              className={styles.formule__offre__content__card__divBtn__select}
              onClick={() => {
                dispatch({
                  type: "ModalContract/open",
                  payload: { type: "custom" },
                });
              }}
            >
              Choissir ce pack
            </button>
          </div>
        </WhileInView>
      </div>
      
    </div> */}
    </>
  );
};

export default Formule;
