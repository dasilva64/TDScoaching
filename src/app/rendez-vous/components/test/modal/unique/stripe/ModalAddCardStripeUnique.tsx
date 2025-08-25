import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import Image from "@/app/components/image/Image";
import styles from "./ModalAddCardStripe.module.scss"
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ModalAddCardStripeUnique = () => {
    const stripe = useStripe();
    const elements = useElements();
    const isStripeReady = stripe && elements;
    const [isLoading, setIsLoading] = useState(false)
    const { displayModalAddCardStripe } = useSelector((state: RootState) => state.ModalAddCardStripe)
    const dispatch = useDispatch<AppDispatch>();
    const closeModal = () => {
        dispatch({ type: "ModalAddCardStripe/close" });
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true)
        if (!stripe || !elements) return;

        const result = await stripe.confirmSetup({
            elements, // 👈 PaymentElement est géré automatiquement ici
            confirmParams: {
                return_url: 'https://tdscoaching.fr/redirection-vers-rendez-vous',
            },
        });

        if (result.error) {
            console.error(result.error.message);
            dispatch({
                type: "flash/storeFlashMessage",
                payload: {
                    type: "error",
                    flashMessage: result.error.message,
                },
            });
        }
        setIsLoading(false)


    };
    return (
        <>

            <TabIndex displayModal={displayModalAddCardStripe} />
            <AnimatePresence>
                {displayModalAddCardStripe === true && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.3 } }}
                            exit={{ opacity: 0 }}
                            className={styles.bg}
                            onClick={() => closeModal()}
                        />
                        <motion.div
                            className={styles.modalAddCardStripe}
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
                                className={styles.modalAddCardStripe__btn}
                                onClick={() => closeModal()}
                            >
                                <Image
                                    className={styles.modalAddCardStripe__btn__img}
                                    src="/assets/icone/xmark-solid.svg"
                                    alt="icone fermer modal"
                                    width={25}
                                    height={25}
                                ></Image>
                            </button>
                            <h2 className={`${styles.modalAddCardStripe__h1}`}>
                                Rendez-vous unique
                            </h2>
                            {!isStripeReady && (
                                <>
                                    <p>Chargement de Stripe...</p>
                                </>
                            )}
                            {isStripeReady && (
                                <>
                                    <form onSubmit={handleSubmit} className={styles.modalAddCardStripe__form}>
                                        <PaymentElement />

                                        {!isLoading && (
                                            <>
                                                <button className={styles.modalAddCardStripe__form__submit} type="submit" disabled={!stripe}>Enregistrer la carte pour ce paiement</button>
                                            </>
                                        )}
                                        {isLoading && (
                                            <>
                                                <button
                                                    disabled
                                                    className={
                                                        styles.modalAddCardStripe__form__submit__load
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.modalAddCardStripe__form__submit__load__span
                                                        }
                                                    >
                                                        Chargement
                                                    </span>

                                                    <div
                                                        className={
                                                            styles.modalAddCardStripe__form__submit__load__arc
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.modalAddCardStripe__form__submit__load__arc__circle
                                                            }
                                                        ></div>
                                                    </div>
                                                </button>
                                            </>
                                        )}

                                    </form>

                                </>
                            )}

                            <p onClick={() => {
                                dispatch({
                                    type: "ModalHelpPaiementRendezVous/open"
                                })
                            }} className={styles.modalAddCardStripe__help}>Pourquoi enregistrer ma carte ?</p>
                            <Link target="_blank" href={"/conditions-generales-de-vente"} className={styles.modalAddCardStripe__help}>Conditions générales de vente</Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default ModalAddCardStripeUnique