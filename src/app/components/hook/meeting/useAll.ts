import { useEffect, useState } from "react";
import useSWR from "swr";

const fetchWithToken = async () => {
  let response = await fetch("http://localhost:8080/meeting/all", {
    credentials: "include",
  });
  let json = await response.json();
  return json;
};

function useAll(isLog: boolean) {
  //const [callFetch, setCallFetch] = useState<boolean>(false)
  const { data, error, isLoading, mutate }: any = useSWR<any>(isLog === true ? "/api/all" : null, () =>
    fetchWithToken()
  );

  /* useEffect(() => {
    if(data) {
      setCallFetch(true)
    }
  }, [data]) */
  return {
    allMeeting: data,
    isLoading,
    isError: error,
    mutateMeeting: mutate,
  };
}

export default useAll;
