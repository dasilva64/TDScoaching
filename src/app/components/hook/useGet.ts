import useSWR from "swr";

const fetchData = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

function useGet(url: string | null) {
  
  const { data, error, isLoading, mutate } = useSWR(url, (url) =>
    fetchData(url), {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
    }
  );
  return {
    data,
    isLoading,
    isError: error,
    mutate: mutate,
  };
}

export default useGet;
