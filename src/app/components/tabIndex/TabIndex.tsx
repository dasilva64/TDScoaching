"use client";
import React, { useEffect } from "react";

const TabIndex = ({ displayModal }: any) => {
  useEffect(() => {
    if (displayModal === true) {
      let test = document.querySelectorAll(".modalOpen");
      test.forEach((tab) => {
        tab.setAttribute("tabindex", "-1");
      });
      let body = document.querySelector("body");
      if (body) body.style.overflow = "hidden";
    } else {
      let test = document.querySelectorAll(".modalOpen");
      test.forEach((tab) => {
        tab.setAttribute("tabindex", "0");
      });
      let body = document.querySelector("body");
      if (body) body.style.overflow = "auto";
    }
  }, [displayModal]);
  return null;
};

export default TabIndex;
