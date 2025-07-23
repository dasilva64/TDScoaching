"use client";

import { RootState } from "@/app/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "@/app/components/image/Image";

const FlashMessage = () => {
  const { flashMessage } = useSelector((state: RootState) => state.flash);
  const dispatch = useDispatch();
  useEffect(() => {
    if (flashMessage && flashMessage[1].length > 0) {
      let timer = setTimeout(() => {
        dispatch({
          type: "flash/clearFlashMessage",
        });
      }, 10000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [dispatch, flashMessage]);
  return (
    <>
      <AnimatePresence>
        {flashMessage && flashMessage[1].length > 0 && (
          <>
            <motion.div
              className={`${`flash__modal__${flashMessage[0]}`} ${`flash__modal__standard`}`}
              initial={{ y: 200, x: "-50%", opacity: 0 }}
              animate={{
                y: -20,
                x: "-50%",
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{
                y: 200,
                x: "-50%",
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <Image
                className={`flash__modal__standard__img`}
                width={25}
                height={25}
                src="/assets/icone/circle-exclamation-solid.svg"
                alt="logo tdss coaching"
                priority={true}
              />
              {flashMessage[1]}{" "}
              <span
                onClick={() => {
                  dispatch({
                    type: "flash/clearFlashMessage",
                  });
                }}
                className={`${`flash__modal__standard__span`} ${`flash__modal__standard__span__${flashMessage[0]}`}`}
              >
                &times;
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FlashMessage;
