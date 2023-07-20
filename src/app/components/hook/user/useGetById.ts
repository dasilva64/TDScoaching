import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";

const fetchWithToken = async (url: string, id: string) => {
  let response = await fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });
  let json = await response.json();
  return json;
};

function useGetById(id: string) {

  const { data, error, isLoading, mutate } = useSWR(
    ["/api/user/getById", id],
    ([url, id]) => fetchWithToken(url, id)
  );
  return {
    data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useGetById;