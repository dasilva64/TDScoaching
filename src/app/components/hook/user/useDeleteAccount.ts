import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useParams, usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";

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

  const { data, isLoading, error } = useSWR(csrfToken ?
    [`/suppression-compte/[token]/components/api`, token] : null,
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
          if (pathname === "/profile" || pathname === "/utilisateurs" || pathname === "rendez-vous" || pathname === "historique-rendez-vous") {
            router.push("/");
          }
        }
        mutate("/components/header/ui/api");
        mutate("/components/header/api");
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
      }
    }
  }, [data, dispatch, pathname, router]);
  return { data, isLoading, error };
};

export default useDeleteAccount;
