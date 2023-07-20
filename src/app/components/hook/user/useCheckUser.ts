import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  let response = await fetch(url, {
    credentials: "include",
  });
  let json = await response.json();
  return json;
};

function useCheckUser(setUserClickLogout: any) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWR(
    ["http://localhost:8080/user/checkuserlog"],
    ([url]) => fetchWithToken(url)
  );
    
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "auth/login",
          payload: { email: data.body.email, role: "ROLE_USER" },
        });
      }
      /* if (data.status === 200) {
        dispatch({
          type: "auth/login",
          payload: { email: data.body.email, role: "ROLE_USER" },
        });
      } else if (data.status === 403) {
        dispatch({
          type: "auth/logout",
        });
        if (
          pathname === "/profile" ||
          pathname === "/rendez-vous" ||
          pathname === "/tous-les-utilisateurs"
        ) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: {
              type: "error",
              flashMessage: `Vous n'avez pas accès à la page ${pathname}, veuillez vous connecter`,
            },
          });
          router.push("/");
        }
      } else {
        setUserClickLogout(true);
        dispatch({
          type: "auth/logout",
        });
        if (
          pathname === "/profile" ||
          pathname === "/rendez-vous" ||
          pathname === "/tous-les-utilisateurs"
        ) {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: {
              type: "error",
              flashMessage: `Vous n'avez pas accès à la page ${pathname}, veuillez vous connecter`,
            },
          });
          router.push("/");
        }
      }*/
    } 
  }, [data, dispatch, pathname, router, setUserClickLogout]);
  return {
    lofsjdlk: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useCheckUser;
