import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

function useGetAll() {

  const { data, error, isLoading, mutate } = useSWR(
    ["/api/user/getAll"],
    ([url]) => fetchWithToken(url)
  );

/*   useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "auth/login",
          payload: { email: data.body.email, role: "ROLE_USER" },
        });
      }
    }
  }, [data, dispatch, pathname, router]); */
  return {
    data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useGetAll;
