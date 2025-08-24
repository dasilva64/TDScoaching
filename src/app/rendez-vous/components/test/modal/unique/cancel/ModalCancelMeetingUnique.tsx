import fetchDelete from "@/app/components/fetch/FetchDelete";
import TabIndex from "@/app/components/tabIndex/TabIndex";
import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ModalCancelMeetingUnique.module.scss"
import Image from "@/app/components/image/Image";
import useSWRMutation from "swr/mutation";
import { mutate as globalMutate } from "swr";

const ModalCancelMeetingUnique = ({ mutate, offre, userData }: any) => {
    const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
    const router = useRouter()
    const { displayModalCancelMeetingRendezVous, typeModalCancelMeetingRendezVous } = useSelector(
        (state: RootState) => state.ModalCancelMeetingRendezVous
    );
    const dispatch = useDispatch();

    const { trigger: triggerUnique, data: dataUnique, reset: resetUnique, isMutating: isMutatingUnique } = useSWRMutation(
        "/rendez-vous/components/test/modal/unique/cancel/api/",
        fetchDelete
    );
    useEffect(() => {
        if (dataUnique) {
            if (dataUnique.status === 401) {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "error", flashMessage: dataUnique.message },
                });
                dispatch({
                    type: "ModalCancelMeetingRendezVous/close",
                });
                resetUnique();
                globalMutate("/components/header/api");
                globalMutate("/components/header/ui/api");
                router.push(`/acces-refuse?destination=rendez-vous`)
            } else if (dataUnique.status === 200) {
                const header = document.getElementById("header");
                if (!header) return;
                header.style.top = "0px";
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "success", flashMessage: dataUnique.message },
                });
                dispatch({
                    type: "ModalCancelMeetingRendezVous/close",
                });
                resetUnique();
                globalMutate("/components/header/api");
                const { meeting } = dataUnique.body;
                mutate(
                    {
                        ...userData,
                        body: {
                            ...userData.body,
                            meeting: null,
                            offre: null,
                            meetings: userData.body.meetings.filter((m: any) => m.id !== meeting.id),
                            meetingsByUser: userData.body.meetingsByUser
                                ? userData.body.meetingsByUser.filter((m: any) => m.id !== meeting.id)
                                : null,
                        },
                    },
                    { revalidate: false }
                );
            } else {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "error", flashMessage: dataUnique.message },
                });
                resetUnique();
            }
        }
    }, [dataUnique, dispatch, mutate, resetUnique, router, userData]);

    const closeForm = () => {
        dispatch({
            type: "ModalCancelMeetingRendezVous/close",
        });
    };
    return (
        <>
            <TabIndex displayModal={displayModalCancelMeetingRendezVous} />
            <AnimatePresence>
                {displayModalCancelMeetingRendezVous === true && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.3 } }}
                            exit={{ opacity: 0 }}
                            className={styles.bg}
                            onClick={() => closeForm()}
                        />
                        <motion.div
                            className={styles.modalCancelMeetingUnique}
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
                                className={styles.modalCancelMeetingUnique__btn}
                                onClick={() => closeForm()}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <Image
                                    className={styles.modalCancelMeetingUnique__btn__img}
                                    src="/assets/icone/xmark-solid.svg"
                                    alt="arrow-left"
                                    width={30}
                                    height={30}
                                ></Image>
                            </button>
                            <h1 className={styles.modalCancelMeetingUnique__h1}>
                                Annulation du rendez-vous
                            </h1>
                            {offre.payment && (
                                <>
                                    <p>Votre paiement va été annulé.</p>
                                    <p>Rassurez-vous, aucun prélèvement ne sera effectué sur votre compte bancaire.</p>
                                </>
                            )}
                            <p>Êtes vous sûre de vouloir annuler votre rendez-vous ?</p>
                            <div className={styles.modalCancelMeetingUnique__div}>
                                {isMutatingUnique === false && (
                                    <button
                                        className={styles.modalCancelMeetingUnique__div__btn}
                                        onClick={() => {
                                            const fetchDeleteeeting = async () => {
                                                dispatch({
                                                    type: "flash/clearFlashMessage",
                                                });
                                                triggerUnique({ csrfToken: csrfToken });


                                            };
                                            fetchDeleteeeting();
                                        }}
                                    >
                                        Oui, annuler
                                    </button>
                                )}
                                {isMutatingUnique === true && (
                                    <button
                                        disabled
                                        className={styles.modalCancelMeetingUnique__div__btn__load}
                                    >
                                        <span className={styles.modalCancelMeetingUnique__div__btn__load__span}>
                                            Chargement
                                        </span>

                                        <div className={styles.modalCancelMeetingUnique__div__btn__load__arc}>
                                            <div
                                                className={
                                                    styles.modalCancelMeetingUnique__div__btn__load__arc__circle
                                                }
                                            ></div>
                                        </div>
                                    </button>
                                )}
                                <button
                                    className={styles.modalCancelMeetingUnique__div__btn}
                                    onClick={() => {
                                        dispatch({
                                            type: "ModalCancelMeetingRendezVous/close",
                                        });
                                    }}
                                >
                                    Non, quitter
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default ModalCancelMeetingUnique