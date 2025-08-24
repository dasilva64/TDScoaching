import styles from "./page.module.scss"
import Image from "../components/image/Image";
import Link from "next/link";
import Btn from "./components/Btn";

const page = ({ searchParams }: { searchParams: { destination?: string } }) => {
    const destination = searchParams.destination;
    return (
        <main className={styles.noAccess}>
            <div className={styles.noAccess__container}>
                <h1 className={styles.noAccess__container__h1}>401</h1>
                <h2 className={styles.noAccess__container__h2}>Accès non autorisé</h2>
                <div className={styles.noAccess__container__article}>
                    <Image
                        className={styles.noAccess__container__article__img}
                        src="/assets/icone/face-frown-regular.svg"
                        alt="404"
                        width={50}
                        height={50}
                    />
                    <p className={styles.noAccess__container__article__p}>
                        Oups ! Cette page est uniquement accessible après connexion.
                    </p>
                    <div className={styles.noAccess__container__article__box}>
                        <Link
                            className={styles.noAccess__container__article__box__link}
                            href={"/"}
                        >
                            Revenir sur la page d&apos;accueil
                        </Link>
                        <Btn destination={destination} />

                    </div>
                </div>
            </div>
        </main>
    );
}

export default page