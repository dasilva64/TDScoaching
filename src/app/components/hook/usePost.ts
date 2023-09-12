import useSWR from "swr";

const fetchData = async (url: string) => {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let json = await response.json();
  return json;
};

function usePost(url: string) {
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

export default usePost;
