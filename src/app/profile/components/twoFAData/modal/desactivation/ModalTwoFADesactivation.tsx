import TabIndex from "@/app/components/tabIndex/TabIndex";
import Image from "@/app/components/image/Image";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ModalTwoFADesactivation.module.scss"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ModalTwoFADesactivation = ({ mutate, data: userData }: any) => {
    const dispatch = useDispatch()
    const closeForm = () => {
        dispatch({
            type: "ModalTwoFADesactivation/close"
        })
    }
    const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
    const router = useRouter()
    const { data, reset, trigger } = useSWRMutation("/profile/components/twoFAData/modal/desactivation/api", fetchPost)
    useEffect(() => {
        if (data) {
            if (data.status === 200) {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "success", flashMessage: data.message },
                });
                dispatch({
                    type: "ModalTwoFADesactivation/close"
                })
                globalMutate("/components/header/api");
                mutate({
                    ...userData,
                    body: {
                        ...userData.body,
                        isTwoFactorEnabled: !userData.body.isTwoFactorEnabled,
                    },
                },
                    {
                        revalidate: false,
                    })
                reset();
            } else if (data.status === 401) {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "error", flashMessage: data.message },
                });
                reset();
                globalMutate("/components/header/api");
                globalMutate("/components/header/ui/api");
                router.push("/");
            } else {
                dispatch({
                    type: "flash/storeFlashMessage",
                    payload: { type: "error", flashMessage: data.message },
                });
                reset();
            }

        }
    }, [data, dispatch, reset, router, mutate]);
    const { displayModalTwoFADesactivation } = useSelector((state: RootState) => state.ModalTwoFADesactivation)
    return (
        <>
            <TabIndex displayModal={displayModalTwoFADesactivation} />
            <AnimatePresence>
                {displayModalTwoFADesactivation === true && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.3 } }}
                            exit={{ opacity: 0 }}
                            className={styles.bg}
                            onClick={() => closeForm()}
                        />
                        <motion.div
                            className={styles.modalEditMainUserData}
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
                                className={styles.modalEditMainUserData__btn}
                                onClick={() => closeForm()}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <Image
                                    className={styles.modalEditMainUserData__btn__img}
                                    src="/assets/icone/xmark-solid.svg"
                                    alt="icone fermer modal"
                                    width={30}
                                    height={30}
                                ></Image>
                            </button>
                            <h2 className={`${styles.modalEditMainUserData__h1}`}>
                                Désactivation de la double authentification
                            </h2>
                            <p>Êtes vous sûre de vouloir desactivé la double authentification ?</p>

                            <div className={styles.modalEditMainUserData__btns}>
                                <button className={styles.modalEditMainUserData__btns__cancel} onClick={() => {
                                    dispatch({
                                        type: "ModalTwoFADesactivation/close"
                                    })
                                }}>Annuler</button>
                                <button className={styles.modalEditMainUserData__btns__confirm} onClick={() => {
                                    trigger({ csrfToken: csrfToken })
                                }}>Désactivé</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default ModalTwoFADesactivation