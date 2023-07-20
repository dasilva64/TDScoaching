import React from 'react'
import styles from './page.module.scss'
import AllMeeting from './components/AllMeeting';

const page = () => {
    return (
        <main className={styles.allMeeting}>
          <h1 className={styles.allMeeting__h1}>Dashboard</h1>
          <div className={styles.allMeeting__container}>
            <div className={styles.allMeeting__article}>
              <h2 className={styles.allMeeting__article__h2}>Tous les rendez-vous</h2>
              <div>
                <AllMeeting />
              </div>
            </div>
          </div>
        </main>
      );
}

export default page