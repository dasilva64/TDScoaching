import React from "react";
import useSWR from "swr";

const fetchGet = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

const useFetchGet = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/user/check", (url) =>
    fetchGet(url)
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
};

export default useFetchGet;
