import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";

const fetchCreate = async (url: string, last: string) => {
  let response = await fetch(url, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ start: last }),
  });
  let json = await response.json();
  if (json.status === 401) {
    throw new Error(json.message);
  }
  return json;
};

function useCreate(isLog: boolean, last: string, urlFetch: any) {
  const dispatch = useDispatch();
  const {push} = useRouter()

  const { data, error, isLoading, mutate } = useSWR(
    isLog === true ? [urlFetch] : null,
    ([url]) => fetchCreate(url, last)
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({ type: "user/editGet" });
        push("/rendez-vous");
      }
    }
  }, [data, dispatch, push]);
  return {
    user: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useCreate;
