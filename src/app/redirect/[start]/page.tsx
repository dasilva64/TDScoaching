"use client";

import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import useCreate from "../../components/hook/meeting/useCreate";

const Page = () => {
  let ar = window?.location.pathname.split("/");
  const { isLog } = useSelector((state: RootState) => state.auth);
  let last = ar[ar.length - 1];
  useCreate(isLog, last, "http://localhost:8080/meeting");

  return null;
};

export default Page;
