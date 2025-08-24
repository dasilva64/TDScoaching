import fetchPost from "@/app/components/fetch/FetchPost";
import Input from "@/app/components/input/Input";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mutate as globalMutate } from "swr";
import Image from "@/app/components/image/Image";
import styles from "./ModalCardDataActivation.module.scss"
import useSWRMutation from "swr/mutation";

const ModalCardDataActivation = ({ mutate, data: userData }: any) => {
    const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
    const dispatch = useDispatch()
    const [codeInput, setCodeInput] = useState<string>("");
    const [validCodeInput, setValidCodeInput] = useState<boolean>(false);
    const [errorMessageCode, setErrorMessageCode] = useState<string>("");
    const [inputPseudo, setInputPseudo] = useState<string>("");
    const clearState = () => {
        setCodeInput("");
        setValidCodeInput(false);
        setErrorMessageCode("");
    };
    const { displayModalSaveCardActivation } = useSelector((state: RootState) => state.ModalSaveCardActivation)

    const closeForm = () => {
        clearState()
        dispatch({
            type: "ModalSaveCardActivation/close",
        });
    }
    const { trigger, data, reset, isMutating } = useSWRMutation(
        "/profile/components/cardData/modal/activation/api",
        fetchPost
    );
    const router = useRouter()
    useEffect(() => {
        if (data) {
            if (data.status === 200) {
                mutate({
                    ...userData,
                    body: {
                        ...userData.body,
                        saveCard: true,
                    },
                },
                    {
                        revalidate: false,
                    })
                dispatch({
                    type: "ModalSaveCardActivation/close"
                })
                globalMutate("/components/header/api");
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "success", flashMessage: data.message },
                });
                clearState();
                reset();
            } else if (data.status === 401) {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "error", flashMessage: data.message },
                });
                reset();
                globalMutate("/components/header/api");
                globalMutate("/components/header/ui/api");
                router.push(`/acces-refuse?destination=profile`);
            } else {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "error", flashMessage: data.message },
                });
                reset();
            }
        }
    }, [data, dispatch, reset, router, mutate, userData.body.newEmail, userData]);

    return (
        <>
            <TabIndex displayModal={displayModalSaveCardActivation} />
            <AnimatePresence>
                {displayModalSaveCardActivation === true && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.3 } }}
                            exit={{ opacity: 0 }}
                            className={styles.bg}
                            onClick={() => closeForm()}
                        />
                        <motion.div
                            className={styles.modalEditEmailSendData}
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
                                type="button"
                                className={styles.modalEditEmailSendData__btn}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    closeForm();
                                }}
                            >
                                <Image
                                    className={styles.modalEditEmailSendData__btn__img}
                                    src="/assets/icone/xmark-solid.svg"
                                    alt="icone fermer modal"
                                    width={30}
                                    height={30}
                                ></Image>
                            </button>
                            <h2 className={`${styles.modalEditEmailSendData__h1}`}>
                                Activer la sauvegarde de la carte
                            </h2>
                            <p>
                                Étes vous sûre de vouloir enregistrer votre carte pour les prochains paiement ?
                            </p>
                            <div className={`${styles.modalEditEmailSendData__actions}`}>
                                {isMutating && (
                                    <>
                                        <button
                                            disabled
                                            className={
                                                styles.modalEditEmailSendData__actions__load
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.modalEditEmailSendData__actions__load__span
                                                }
                                            >
                                                Chargement
                                            </span>

                                            <div
                                                className={
                                                    styles.modalEditEmailSendData__actions__load__arc
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.modalEditEmailSendData__actions__load__arc__circle
                                                    }
                                                ></div>
                                            </div>
                                        </button>
                                    </>
                                )}
                                {!isMutating && (
                                    <>
                                        <button onClick={() => {
                                            trigger({csrfToken: csrfToken})
                                        }} className={`${styles.modalEditEmailSendData__actions__yes}`}>Oui, enregistrer</button>
                                    </>
                                )}

                                <button className={`${styles.modalEditEmailSendData__actions__no}`} onClick={() => {
                                    dispatch({
                                        type: "ModalSaveCardActivation/close",
                                    });
                                }}>Non, quitter</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default ModalCardDataActivation