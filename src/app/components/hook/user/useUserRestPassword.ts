import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useParams, usePathname } from "next/navigation";
import useSWR from "swr";
import csrfToken from "@/app/redux/feature/csrfToken";

const fetchUserResetPassword = async (url: string, token: string) => {
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
const useUserResetPassword = (token: string) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    [`/reinitialisation-mot-de-passe/[token]/components/api/reset`, token],
    ([url, token]) => fetchUserResetPassword(url, token)
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        dispatch({
          type: "csrfToken/store",
          payload: { csrfToken: data.csrfToken },
        });
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

export default useUserResetPassword;
