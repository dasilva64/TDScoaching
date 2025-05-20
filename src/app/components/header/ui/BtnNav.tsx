"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "../header.module.scss";
import useGet from "../../hook/useGet";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const BtnNav = ({ name }: any) => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGet("/components/header/ui/api");
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (data) {
      if (data.isLoggedIn === false) {
        let regex = /\/utilisateur\/[0-9A-Za-z-]+/g;
        let regexTwo = /\/suppression-compte\/[0-9A-Za-z-]+/g;
        if (
          pathname === "/profile" ||
          pathname === "/utilisateurs" ||
          regex.test(pathname) ||
          regexTwo.test(pathname)
        ) {
          router.push("/");
        }
      }
    }
  }, [data, dispatch, pathname, router]);
  let content;
  if (isLoading) {
    content = null;
  }
  if (data) {
    if (data.isLoggedIn === false) {
      content = (
        <button
          className={`${styles.header__btn} ${styles.header__free} modalOpen`}
          onClick={() => {
            dispatch({ type: "ModalCalendarDiscoveryMeetingHeader/open" });
          }}
        >
          {name}
        </button>
      );
    } else {
      if (data.role === "ROLE_ADMIN") {
        content = null;
      } else if (data.role === "ROLE_USER") {
        if (data.discovery === true) {
          if (data.meeting === null) {
            content = (
              <>
              <Link tabIndex={0}
                className={`${styles.header__btn} ${styles.header__free} modalOpen`} href={"/rendez-vous"}>{name}</Link>
              {/* <button
                tabIndex={0}
                className={`${styles.header__btn} ${styles.header__free} modalOpen`}
                onClick={() => {
                  dispatch({
                    type: "ModalCalendarDiscoveryMeetingHeader/open",
                  });
                }}
              >
                {name}
              </button> */}
              
              </>
              
            );
          } else {
            content = null;
          }
        } else {
          content = null;
        }
      }
    }
  }
  return <>{content}</>;
};

export default BtnNav;
