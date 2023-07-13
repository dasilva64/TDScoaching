import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";

const fetchUserEmailValidation = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};
const useUserEmailValidation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
 /*  const { token } = useParams();
  const { data } = useSWR(
    `http://localhost:8080/user/email-validation/${token}`,
    fetchUserEmailValidation
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
  }, [data, dispatch, router]); */
  //return data;
  return null
};

export default useUserEmailValidation;
