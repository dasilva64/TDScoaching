import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useSWR, {mutate as mutateGlobal} from "swr";


const fetchUser = async (url: string, token: string, csrfToken: any) => {
  
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ token: token }),
  });

  let json = await response.json();
  return json;
};

const useGetOneByToken = (token: string, csrfToken: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, isLoading, error, mutate } = useSWR(csrfToken ? 
    [`/rendez-vous/[token]/components/api`, token] : null,
    ([url, token]) => fetchUser(url, token, csrfToken)
  );
  useEffect(() => {
     if (data) {
      if (data.status !== 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
       
        router.push("/");
      } else if (data.status === 200) {
        mutateGlobal('/components/header/api')
      }
    } 
  }, [data, dispatch, router]);
  return { data, isLoading, error, mutate };
};

export default useGetOneByToken;
