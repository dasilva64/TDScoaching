import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

const useAllByUser = () => {
  const { data, isLoading, error } = useSWR(
    "/api/meeting/getAllByUser",
    (url) => fetchWithToken(url)
  );
  return {
    data,
    isLoading,
    isError: error,
  };
};

export default useAllByUser;
