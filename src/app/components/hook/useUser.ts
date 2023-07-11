import { useEffect, useState } from "react";
import useSWR from "swr";
import { headers } from "next/headers";

const fetchWithToken = async () => {
    let response = await fetch("http://localhost:3000/api/user", {
      headers: {
        "Content-Type": "application/json",
        include: "credentials",
      },
    });
    let json = await response.json();
    return json;
};

function useUser() {
  const { data, error, isLoading, mutate }: any = useSWR<any>(
    "/api/user/get",
    () => fetchWithToken()
  );

  return {
    userData: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useUser;
