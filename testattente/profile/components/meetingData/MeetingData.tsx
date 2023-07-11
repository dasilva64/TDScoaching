
import useUser from '../../../../components/hook/useUser'
import React from 'react'
import styles from './MeetingData.module.scss'

const MeetingData = () => {
  //const { user, isLoading, isError, mutate } = useUser(isLog);
  return (
    <>
        <>
          <div className={styles.meetingData}>
            <ul className={styles.meetingData__ul}>
              <li className={`${styles.meetingData__ul__li} ${styles.meetingData__ul__li__margin}`}>
                Rendez-vous : {"Aucun de rendez-vous programmé"}
              </li>
            </ul>
            <div className={styles.meetingData__div}>
              <button className={styles.meetingData__div__button}>Voir</button>
              <button className={styles.meetingData__div__button}>Prendre un Rendez-vous</button>
            </div>
          </div>
        </>
    </>
  )
}

export default MeetingData