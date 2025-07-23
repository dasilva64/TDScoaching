"use client";

import { useEffect, useState } from "react";
import styles from "./goTop.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { RootState } from "@/app/redux/store";
import { useSelector } from "react-redux";

const GoTop = () => {
  const [displayGoTop, setDisplayGoTop] = useState<boolean>(false);
  const goTop = () => {
    const html = document.querySelector("html");
    html?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (document) {
      if (document.documentElement.scrollTop > 50) {
        setDisplayGoTop(true);
      }
      document.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 50) {
          setDisplayGoTop(true);
        } else {
          setDisplayGoTop(false);
        }
      });
    }
  }, []);
  const { flashMessage } = useSelector((state: RootState) => state.flash);
  const { displayModalLogin } = useSelector(
    (state: RootState) => state.ModalLogin
  );
  const { displayModalForgot } = useSelector(
    (state: RootState) => state.ModalForgot
  );
  /* const { displayModalDiscovery } = useSelector(
    (state: RootState) => state.ModalDiscovery
  );
  const { displayModalNormal } = useSelector(
    (state: RootState) => state.ModalNormal
  ); */
  const { displayModalRegister } = useSelector(
    (state: RootState) => state.ModalRegister
  );
  /* const { displayModalEditFirstname } = useSelector(
    (state: RootState) => state.ModalEditFirstname
  );

  const { displayModalEditLastname } = useSelector(
    (state: RootState) => state.ModalEditLastname
  );
  const { displayModalEditPassword } = useSelector(
    (state: RootState) => state.ModalEditPassword
  );
  const { displayModalSendTokenEmail } = useSelector(
    (state: RootState) => state.ModalSendTokenEmail
  );
  const { displayModalEditEmail } = useSelector(
    (state: RootState) => state.ModalEditEmail
  ); */
  const { displayModalNav } = useSelector((state: RootState) => state.ModalNav);
  const { displayModalNavAdmin } = useSelector(
    (state: RootState) => state.ModalNavAdmin
  );
  const { displayModalNavUser } = useSelector(
    (state: RootState) => state.ModalNavUser
  );
 /*  const { displayModalDeleteAccount } = useSelector(
    (state: RootState) => state.ModalDeleteAccount
  );
  const { displayModalCancelEmail } = useSelector(
    (state: RootState) => state.ModalCancelEmail
  ); */
  const { isActive } = useSelector((state: RootState) => state.menu);

  //rendez-vous/token
  /* const { displayModalConfirmDiscoveryMeetingRendezVousToken } = useSelector(
    (state: RootState) => state.ModalConfirmDiscoveryMeetingRendezVousToken
  );
  const { displayModalDeleteDiscoveryMeetingRendezVousToken } = useSelector(
    (state: RootState) => state.ModalDeleteDiscoveryMeetingRendezVousToken
  );
  const { displayModalCalendarEditDiscoveryMeetingRendezVousToken } =
    useSelector(
      (state: RootState) =>
        state.ModalCalendarEditDiscoveryMeetingRendezVousToken
    ); */
  const DisplayDiv = () => {
    if (
      displayModalLogin === true ||
      displayModalRegister === true ||
      /* displayModalEditFirstname === true ||
      displayModalEditLastname === true ||
      displayModalEditPassword === true ||
      displayModalSendTokenEmail === true ||
      displayModalEditEmail === true ||
      displayModalDeleteAccount === true || */
      displayModalForgot === true ||
      /* displayModalNormal === true ||
      displayModalDiscovery === true || */
      displayModalNavAdmin === true ||
      displayModalNav === true ||
      displayModalNavUser === true ||
      //displayModalCancelEmail === true ||
      isActive === true
    ) {
      return <></>;
    } else {
      return (
        <motion.button
          className={`${
            flashMessage && flashMessage[1].length > 0
              ? styles.top__flash
              : styles.top__noFlash
          } modalOpen`}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            goTop();
          }}
          aria-label="goTop"
          initial={{ y: 20, x: "-50%", opacity: 0 }}
          animate={{
            y: "-50%",
            x: "-50%",
            opacity: 1,
            transition: { duration: 0.3 },
          }}
          exit={{
            y: 20,
            x: "-50%",
            opacity: 0,
            transition: { duration: 0.3 },
          }}
        ></motion.button>
      );
    }
  };

  return (
    <>
      <AnimatePresence>
        {displayGoTop === true && <>{DisplayDiv()}</>}
      </AnimatePresence>
    </>
  );
};

export default GoTop;
