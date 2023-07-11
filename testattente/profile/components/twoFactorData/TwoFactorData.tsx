import useUser from '../../../../components/hook/useUser'
import React from 'react'
import styles from './TwoFactorData.module.scss'

const TwoFactorData = () => {
  const { userData, isLoading, isError, mutate } = useUser();
  return (
    <>
      {userData && (
        <>
          <div className={styles.twoFactorData}>
            <ul className={styles.twoFactorData__ul}>
              <li className={`${styles.twoFactorData__ul__li} ${styles.twoFactorData__ul__li__margin}`}>
                Two Factor : 
              </li>
            </ul>
            <div className={styles.twoFactorData__div}>
              <button className={styles.twoFactorData__div__button}>Modifier</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default TwoFactorData