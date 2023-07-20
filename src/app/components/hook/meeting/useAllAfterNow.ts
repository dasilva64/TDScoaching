import { useEffect, useState } from "react";
import useSWR from "swr";

const fetchWithToken = async () => {
  let response = await fetch("/api/meeting/getAll", {
  });
  let json = await response.json();
  return json;
};

function useAllAfterNow() {
  //const [callFetch, setCallFetch] = useState<boolean>(false)
  const { data, error, isLoading, mutate }: any = useSWR<any>("/api/all", () =>
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

export default useAllAfterNow;
