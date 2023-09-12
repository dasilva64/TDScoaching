import useSWR from "swr";

const fetchData = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

function useGet(url: string) {
  const { data, error, isLoading, mutate } = useSWR(url, (url) =>
    fetchData(url)
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useGet;
