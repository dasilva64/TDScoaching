"use client"

import Link from "next/link"
import styles from "./Rappel.module.scss"
import { usePathname } from "next/navigation"

const Rappel = ({ meeting, offre, typeOffre }: any) => {
    const pathname = usePathname()
    return (
        <>
            {(pathname !== "/rendez-vous" && pathname !== "/redirection-vers-rendez-vous") && (
                <>
                    {offre && meeting === "not_confirmed" && (
                        <><div className={styles.container}>
                            <p>Attention, votre RDV n&apos;est pas encore confirmé !</p>
                            <Link className={styles.container__btn} href={"/rendez-vous"}>Voir le rendez-vous</Link>
                        </div></>
                    )}
                    {offre === false && typeOffre !== "unique" && (
                        <><div className={styles.container}>
                            <p>Attention, votre offre n&apos;est pas encore confirmé !</p>
                            <Link className={styles.container__btn} href={"/rendez-vous"}>Voir votre offre</Link>
                        </div></>
                    )}

                    {offre === false && typeOffre === "unique" && (
                        <><div className={styles.container}>
                            <p>Attention, vous devez ajouter votre carte pour confirmer votre rendez-vous !</p>
                            <Link className={styles.container__btn} href={"/rendez-vous"}>Voir votre offre</Link>
                        </div></>
                    )}


                </>
            )}

        </>
    )
}

export default Rappel