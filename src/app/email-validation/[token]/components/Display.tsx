"use client";

import React from "react";
import styles from "./Display.module.scss";
import useUserEmailValidation from "@/app/components/hook/user/useUserEmailValidation";
import { usePathname } from "next/navigation";

const Display = () => {
  const queryParam: any = usePathname();
  let token = queryParam.toString().split("/");
  const { data, isLoading, error } = useUserEmailValidation(token[2]);
  let content;
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  if (data) return <div>ok</div>;
  return <>{content}</>;
};

export default Display;
