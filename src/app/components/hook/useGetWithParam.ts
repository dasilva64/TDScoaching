import useSWR from "swr";

const fetchData = async (url: string, param: string) => {
  let response = await fetch(
    url +
      "?" +
      new URLSearchParams({
        token: param,
      })
  );

  let json = await response.json();
  return json;
};

function useGetWithParam(url: string, param: string) {
  const { data, error, isLoading, mutate } = useSWR(
    [url, param],
    ([url, param]) => fetchData(url, param)
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useGetWithParam;
