import useSWR from "swr";

const fetchWithToken = async (url: string) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

function useAll() {
  const { data, error, isLoading } = useSWR(["/api/meeting/getAll"], ([url]) =>
    fetchWithToken(url)
  );
  return {
    data,
    isLoading,
    isError: error,
  };
}

export default useAll;
