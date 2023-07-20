import useSWR from "swr";

const fetchWithToken = async () => {
  let response = await fetch("/api/user/getUser", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  let json = await response.json();
  return json;
};

function useUserGet() {
  const { data, error, isLoading, mutate }: any = useSWR<any>(
    "/api/user/getUser",
    () => fetchWithToken()
  );

  return {
    userData: data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useUserGet;
