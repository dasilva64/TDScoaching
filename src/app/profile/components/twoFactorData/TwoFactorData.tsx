"use client"

import useUser from '@/app/components/hook/useUser';
import { RootState } from '@/app/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';
import styles from './TwoFactorData.module.scss'

const TwoFactorData = () => {
    const { isLog } = useSelector((state: RootState) => state.auth);
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