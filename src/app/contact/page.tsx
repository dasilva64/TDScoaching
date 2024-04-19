import React from "react";
import styles from "./page.module.scss";
import ContactForm from "./components/ContactForm";
import Image from "next/image";
export const metadata = {
  title: "Contactez votre coach de vie - tdscoaching",
  description:
    "Vous pouvez me contacter par mail : contact@tds-coachingdevie.fr ou par téléphone : 0781673125",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  keywords:
    "Développement personnel, Coaching professionnel, Relation de couple, Communication, Équilibre vie professionnelle-vie personnelle, Confiance en soi, Gestion du stress",
  author: "Thierry Da Silva",
  robots: "index, follow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};

import localFont from "next/font/local";
import NoScript from "../components/noscript/NoScript";
const Parisienne = localFont({
  src: "../Parisienne-Regular.ttf",
  display: "swap",
});

const Contact = () => {
  return (
    <>
      <NoScript />

      <main className={styles.contact}>
        <div className={styles.contact__bg}>
          <Image
            className={styles.contact__bg__img}
            width="0"
            height="400"
            sizes="100vw"
            priority={true}
            src={"/assets/test/sunlight.jpg"}
            alt="bousole"
          />
        </div>
        <section className={styles.contact__main}>
          <h1 className={`${styles.contact__main__h1} ${Parisienne.className}`}>
            Contact
          </h1>
          <div className={styles.contact__main__container__content}>
            <div className={styles.contact__main__container__content__card}>
              <p className={styles.contact__main__container__content__card__p}>
                <strong>Adresse email :</strong>
                <a
                  className={`${styles.contact__main__container__content__card__link} modalOpen`}
                  href="mailto:contact@tds-coachingdevie.fr"
                >
                  {" "}
                  contact@tds-coachingdevie.fr
                </a>
              </p>
            </div>
            <div className={styles.contact__main__container__content__card}>
              <p>
                <strong>Téléphone :</strong>
                <a
                  className={`${styles.contact__main__container__content__card__link} modalOpen`}
                  href="tel:+33781673125"
                >
                  {" "}
                  0781673125
                </a>
              </p>
            </div>
          </div>
          <p className={styles.contact__main__p}>
            Veuillez renseigner le formulaire ci-dessous pour prendre
            rendez-vous, poser une question, ou tout autre demande. Je me ferai
            un plaisir de vous répondre au plus vite.
          </p>
          <div className={styles.contact__main__container}>
            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
