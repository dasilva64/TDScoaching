import { useEffect, useState } from "react";
import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

function useAll() {
  //const [callFetch, setCallFetch] = useState<boolean>(false)
  const { data, error, isLoading } = useSWR(["/api/meeting/getAll"], ([url]) =>
    fetchWithToken(url)
  );

  /* useEffect(() => {
    if(data) {
      setCallFetch(true)
    }
  }, [data]) */
  return {
    data,
    isLoading,
    isError: error,
  };
}

export default useAll;
