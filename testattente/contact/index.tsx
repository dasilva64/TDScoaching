import React from "react";
import styles from "./index.module.scss";
import ContactForm from "./components/ContactForm";
import Layout from "../../components/layout/Layout";

const Contact = () => {
  return (
    <Layout>
      <main className={styles.contact}>
        <h1 className={styles.contact__h1}>Contact</h1>
        <div className={styles.contact__container}>
          <div className={styles.contact__article}>
            <h2 className={styles.contact__article__h2}>Mes coordonnées</h2>
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
          </div>
          <div className={styles.contact__article}>
            <h2 className={styles.contact__article__h2}>Me contacter</h2>
            <p className={styles.contact__article__p}>
              Veuillez renseigner le formulaire ci-dessous pour prendre
              rendez-vous, poser une question, ou tout autre demande. Je me
              ferai un plaisir de vous répondre au plus vite.
            </p>
            <ContactForm />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Contact;
