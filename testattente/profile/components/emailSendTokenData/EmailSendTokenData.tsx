
import React from "react";
import styles from "./EmailSendTokenData.module.scss";

const EmailData = () => {
  let restDate;
/*   if (editEmail) {
    let limitDate = editEmail[1];
    let convertInDate = new Date(limitDate);
    let difference = Math.abs(convertInDate.getTime() - new Date().getTime());
    restDate = new Date(difference);
  } */

  return (
    <>
      <>
        <div className={styles.emailData}>
          <ul className={styles.emailData__ul}>
            <li
              className={`${styles.emailData__ul__li} ${styles.emailData__ul__li__margin}`}
            >
              email : {"emailUser"}
            </li>
          </ul>
          <div className={styles.emailData__div}>
            {/* {editEmail && (
              <>
                <p>
                  Vous avez déjà fait une demande de changement de mail, vous
                  pouvez refaire une demande dans {restDate?.getUTCMinutes()} min{" "}
                </p>
                <button
                  onClick={() => {
                    console.log('test')
                    dispatch({
                      type: "form/openModalEditValidEmailData",
                    });
                  }}
                  className={styles.emailData__div__button}
                >
                  Valider l'addresse {editEmail[0]}
                </button>
              </>
            )}
            {!editEmail && (
              <button
                onClick={() => {
                  dispatch({
                    type: "form/openModalEditEmailSendData",
                  });
                }}
                className={styles.emailData__div__button}
              >
                Modifier
              </button>
            )} */}
          </div>
        </div>
      </>
    </>
  );
};

export default EmailData;
