"use client"

import { useDispatch } from "react-redux"
import styles from "./Btn.module.scss"

const Btn = ({destination}: any) => {
    
    const dispatch = useDispatch()
    const isValidDestination = () => {
    if (!destination) return false;

    const regex = /^\/utilisateur\/[0-9A-Za-z-]+$/;
    const regexTwo = /^\/suppression-compte\/[0-9A-Za-z-]+$/;

    return (
      destination.startsWith("/meetings") ||
      destination.startsWith("/meetingAdmin") ||
      destination === "/rendez-vous" ||
      destination.startsWith("/profile") ||
      destination.startsWith("/historique-rendez-vous") ||
      regex.test(destination) ||
      regexTwo.test(destination)
    );
  };
    return (
        <>
        <button className={styles.btn} onClick={() => {
            dispatch({
                type: "ModalLogin/open",
                payload: {destination: isValidDestination() ? destination : ""}
            })
        }}>Se connecter</button>
        </>
    )
}

export default Btn