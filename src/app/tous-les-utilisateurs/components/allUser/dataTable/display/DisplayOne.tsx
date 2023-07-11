import { RootState } from '@/app/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './Display.module.scss'

const DisplayOne = ({ i }: any) => {
  const dispatch = useDispatch();
    const { datas } = useSelector((state: RootState) => state.Array);
    const [keyAr, setKeyAr] = useState<any>([]);
    useEffect(() => {
      if (datas && datas.length > 0) {
        setKeyAr(Object.keys(datas[0]));
      }
    }, [datas]);
  
    const handlerClick = (i: number) => {
      dispatch({
        type: 'Array/changeDisplayModal',
        payload: {display: true, userData: datas[i]}
      })
    }

    return (
      <>
        {datas && datas.length > 0 && (
          <tr
            className={
              i === 0 ? styles.table__body__tr : styles.table__body__tr__border
            }
          >
            {keyAr &&
              keyAr.map((p: any, index: any) => {
                if (datas[i] !== undefined) {
                  if (i % 2 === 0) {
                    if (i === 0) {
                      if (p === keyAr[0]) {
                        return (
                          <td
                            className={`${styles.table__body__tr__td__even__first} ${styles.table__body__tr__td__border}`}
                            key={index}
                            onClick={() => {handlerClick(i)}}
                          > <div className={styles.table__body__tr__td__div}>{datas[i][p]}</div>
                            
                          </td>
                        );
                      }
                      return (
                        <td
                          className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td__border}`}
                          key={index}
                          onClick={() => {handlerClick(i)}}
                        >
                          <div className={styles.table__body__tr__td__div}>{datas[i][p]}</div>
                         
                        </td>
                      );
                    } else {
                      if (p === keyAr[0]) {
                        return (
                          <td
                            className={`${styles.table__body__tr__td__even__first} ${styles.table__body__tr__td}`}
                            key={index}
                            onClick={() => {handlerClick(i)}}
                          >
                            <div className={styles.table__body__tr__td__div}>{datas[i][p]}</div>
                          </td>
                        );
                      }
                      return (
                        <td
                          className={`${styles.table__body__tr__td__even} ${styles.table__body__tr__td}`}
                          key={index}
                          onClick={() => {handlerClick(i)}}
                        >
                          <div className={styles.table__body__tr__td__div}>{datas[i][p]}</div>
                        </td>
                      );
                    }
                  } else {
                    if (p === keyAr[0]) {
                      return (
                        <td
                          className={`${styles.table__body__tr__td__odd__first} ${styles.table__body__tr__td}`}
                          key={index}
                          onClick={() => {handlerClick(i)}}
                        >
                          <div className={styles.table__body__tr__td__div}>{datas[i][p]}</div>
                        </td>
                      );
                    }
                    return (
                      <td
                        className={`${styles.table__body__tr__td__odd} ${styles.table__body__tr__td}`}
                        key={index}
                        onClick={() => {handlerClick(i)}}
                      >
                        <div className={styles.table__body__tr__td__div}>{datas[i][p]}</div>
                      </td>
                    );
                  }
                } else {
                  return null;
                }
              })}
          </tr>
        )}
      </>
    );
}

export default DisplayOne