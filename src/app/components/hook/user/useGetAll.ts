import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

function useGetAll() {
  const { data, error, isLoading, mutate } = useSWR(
    ["/api/user/getAll"],
    ([url]) => fetchWithToken(url)
  );
  return {
    data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useGetAll;
