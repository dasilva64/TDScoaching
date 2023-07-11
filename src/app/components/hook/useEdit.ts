import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";

const fetchEdit = async (url: string, dataInput: string) => {
  let response = await fetch(url, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ data: dataInput }),
  });
  let json = await response.json();
  if (json.status === 401) {
    throw new Error(json.message);
  }
  return json;
};

function useEdit(
  isLog: boolean,
  dataInput: string,
  userClick: any,
  setUserClick: any,
  urlFetch: any
) {
  const dispatch = useDispatch()

  const { data, error, isLoading, mutate } = useSWR(
    isLog === true && userClick === true
      ? [urlFetch]
      : null,
    ([url]) => fetchEdit(url, dataInput)
  );
  useEffect(() => {
    if (data) {
      dispatch({
        type: "flash/storeFlashMessage",
        payload: { type: "error", flashMessage: data.message },
      });
      setUserClick(false);
    }
  }, [data, dispatch, setUserClick]);
  return {
    user: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useEdit;
