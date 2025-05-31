import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useParams, usePathname } from "next/navigation";
import useSWR from "swr";

const fetchDeleteAccount = async (url: string, token: string, csrfToken: any) => {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ token: token }),
  });
  let json = await response.json();
  return json;
};
const useDeleteAccount = (token: string, csrfToken: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    [`/suppression-compte/[token]/components/api`, token],
    ([url, token]) => fetchDeleteAccount(url, token, csrfToken)
  );
  const pathname = usePathname();
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        if (pathname) {
          let split = pathname.split("/");
          if (split[1] === "utilisateur" || split[1] === "suppression-compte") {
            router.push("/");
          }
          if (pathname === "/profile" || pathname === "/utilisateurs") {
            router.push("/");
          }
        }
        dispatch({
          type: "csrfToken/store",
          payload: {
            csrfToken: data.csrfToken
          },
        });
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
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: {
            flashMessage: data.message,
            type: "error",
          },
        });
        router.push("/");
      }
    }
  }, [data, dispatch, pathname, router]);
  return { data, isLoading, error };
};

export default useDeleteAccount;
