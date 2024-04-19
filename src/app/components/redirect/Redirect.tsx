"use client";

import { AppDispatch } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const Redirect = ({ message }: { message: string }) => {
  console.log(message);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  dispatch({
    type: "flash/storeFlashMessage",
    payload: {
      type: "error",
      flashMessage: message,
    },
  });
  router.push("/");
  return null;
};

export default Redirect;
