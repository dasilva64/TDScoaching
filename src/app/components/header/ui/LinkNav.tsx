"use client";

import React from "react";
import styles from "../header.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LinkNav = ({ name, path }: any) => {
  const pathname = usePathname();
  return (
    <>
      <Link
        className={
          pathname == path
            ? `${styles.header__a} ${styles.active} modalOpen`
            : `${styles.header__a} modalOpen`
        }
        href={path}
      >
        {name}
      </Link>
    </>
  );
};

export default LinkNav;
