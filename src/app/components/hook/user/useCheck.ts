import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

function useCheck() {
  const { data, error, isLoading, mutate } = useSWR("/api/user/check", (url) =>
    fetchWithToken(url)
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useCheck;
