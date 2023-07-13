import { useEffect, useState } from "react";
import useSWR from "swr";
import { headers } from "next/headers";

const fetchWithToken = async () => {
    let response = await fetch("/api/user/getUserRole", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    let json = await response.json();
    return json;
};

function useUserGetRole() {
  
  const { data, error, isLoading, mutate }: any = useSWR<any>(
    "/api/user/getUserRole",
    () => fetchWithToken()
  );
  return {
    userDataRole: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useUserGetRole;
