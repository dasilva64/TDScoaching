"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useParams, usePathname } from "next/navigation";
import useSWR from "swr";

const fetchUserEmailValidation = async (url: string, token: string) => {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  });
  let json = await response.json();
  return json;
};
const useUserEmailValidation = (token: string) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    [`/api/user/emailValidation`, token],
    ([url, token]) => fetchUserEmailValidation(url, token)
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        router.push("/");
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
        router.push("/");
      }
    }
  }, [data, dispatch, router]);
  return { data, isLoading, error };
};

export default useUserEmailValidation;
