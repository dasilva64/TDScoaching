import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";

const fetchUser = async (url: string, token: string) => {
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

const useGetOneByToken = (token: string) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isLoading, error, mutate } = useSWR(
    [`/rendez-vous/[token]/components/api`, token],
    ([url, token]) => fetchUser(url, token)
  );
  useEffect(() => {
     if (data) {
      if (data.status !== 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
        router.push("/");
      }
    } 
  }, [data, dispatch, router]);
  return { data, isLoading, error, mutate };
};

export default useGetOneByToken;
