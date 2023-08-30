import React from "react";
import styles from "./page.module.scss";
import ContactForm from "./components/ContactForm";
import Image from "next/image";

const Contact = () => {
  return (
    <>
      <noscript
        style={{
          width: "100%",
          padding: "20px 0",
          background: "red",
          position: "fixed",
          bottom: "0",
          left: "0",
          zIndex: "999",
          color: "white",
          textAlign: "center",
        }}
      >
        Veuillez activer JavaScript pour profiter pleinement de notre site.
      </noscript>
      <main className={styles.contact}>
        <section className={styles.contact__bg}>
          <Image
            className={styles.contact__bg__img}
            width="0"
            height="400"
            sizes="100vw"
            priority={true}
            src={"/assets/img/avenue.jpg"}
            alt="bousole"
          />
        </section>
        <section className={styles.contact__main}>
          <h1 className={styles.contact__main__h1}>Contact</h1>
          <p className={styles.contact__main__p}>
            Veuillez renseigner le formulaire ci-dessous pour prendre
            rendez-vous, poser une question, ou tout autre demande. Je me ferai
            un plaisir de vous répondre au plus vite.
          </p>
          <div className={styles.contact__main__container}>
            <div className={styles.contact__main__container__content}>
              <div className={styles.contact__main__container__content__card}>
                <p>
                  <strong>Adresse email :</strong>
                  <a
                    className={
                      styles.contact__main__container__content__card__link
                    }
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
                    className={
                      styles.contact__main__container__content__card__link
                    }
                    href="tel:+33781673125"
                  >
                    {" "}
                    0781673125
                  </a>
                </p>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
