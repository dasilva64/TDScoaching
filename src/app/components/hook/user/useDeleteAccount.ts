import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useParams, usePathname } from "next/navigation";
import useSWR from "swr";

const fetchDeleteAccount = async (url: string, token: string) => {
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
const useDeleteAccount = (token: string) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    [`/api/user/deleteAccount`, token],
    ([url, token]) => fetchDeleteAccount(url, token)
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "auth/logout",
        });
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            flashMessage: "Votre compte à été supprimer",
            type: "success",
          },
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        router.push("/");
      }
    }
  }, [data, dispatch, router]);
  return { data, isLoading, error };
};

export default useDeleteAccount;
