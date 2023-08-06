import { useEffect, useState } from "react";
import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

function useAllAfterNow() {
  const { data, error, isLoading, mutate }: any = useSWR<any>(
    "/api/meeting/getAllAfterNow",
    (url) => fetchWithToken(url)
  );
  return {
    allMeeting: data,
    isLoading,
    isError: error,
    mutateMeeting: mutate,
  };
}

export default useAllAfterNow;
