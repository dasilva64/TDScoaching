import React from "react";
import styles from "./page.module.scss";
import ContactForm from "./components/ContactForm";
import WhileInView from "../components/framer/WhileInView";

const Contact = () => {
  return (
    <main className={styles.contact}>
      <WhileInView>
        <h1 className={styles.contact__h1}>Contact</h1>
      </WhileInView>
      <div className={styles.contact__container}>
        <div className={styles.contact__article}>
          <WhileInView>
            <h2 className={styles.contact__article__h2}>Mes coordonnées</h2>
          </WhileInView>
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
        </div>
        <div className={styles.contact__article}>
          <WhileInView>
            <h2 className={styles.contact__article__h2}>Me contacter</h2>
          </WhileInView>
          <WhileInView>
            <div className={styles.contact__article__div}>
              <WhileInView>
                <p className={styles.contact__article__div__p}>
                  Veuillez renseigner le formulaire ci-dessous pour prendre
                  rendez-vous, poser une question, ou tout autre demande. Je me
                  ferai un plaisir de vous répondre au plus vite.
                </p>
              </WhileInView>
              <WhileInView>
                <ContactForm />
              </WhileInView>
            </div>
          </WhileInView>
        </div>
      </div>
    </main>
  );
};

export default Contact;
