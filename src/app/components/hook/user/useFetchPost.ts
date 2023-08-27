import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import useSWR from "swr";

const fetchPost = async (url: string, token: string) => {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  });
  let json = await response.json();
  return json;
};

const useFetchPost = (token: string) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isLoading, error } = useSWR(
    [`/api/user/deleteAccount`, token],
    ([url, token]) => fetchPost(url, token)
  );
  return { data, isLoading, error };
};

export default useFetchPost;
