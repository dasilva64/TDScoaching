import React from "react";
import styles from "./page.module.scss";
import ContactForm from "./components/ContactForm";
import WhileInView from "../components/framer/WhileInView";
import Image from "next/image";

const Contact = () => {
  return (
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
        <WhileInView>
          <p className={styles.contact__main__p}>
            Veuillez renseigner le formulaire ci-dessous pour prendre
            rendez-vous, poser une question, ou tout autre demande. Je me ferai
            un plaisir de vous répondre au plus vite.
          </p>
        </WhileInView>
        <div className={styles.contact__main__container}>
          <WhileInView>
            <ul className={styles.contact__article__p}>
              <li>
                Mail :{" "}
                <a href="mailto:contact@tds-coachingdevie.fr">
                  contact@tds-coachingdevie.fr
                </a>
              </li>
              <li>
                Tel : <a href="tel:+33781673125"> 07 81 67 31 25</a>
              </li>
            </ul>
          </WhileInView>
          <WhileInView style={{ width: "60%" }}>
            <ContactForm />
          </WhileInView>
        </div>
      </section>
    </main>
  );
};

export default Contact;
