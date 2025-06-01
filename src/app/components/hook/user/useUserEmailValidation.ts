import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useParams, usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";

const fetchUserEmailValidation = async (url: string, token: string, csrfToken: any) => {
  console.log(csrfToken)
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ token: token }),
  });
  let json = await response.json();
  return json;
};
const useUserEmailValidation = (token: string, csrfToken: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isLoading, error } = useSWR(csrfToken ?
    [`/email-validation/[token]/components/api`, token] : null,
    ([url, token]) => fetchUserEmailValidation(url, token, csrfToken)
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "success" },
        });
        router.push("/");
        mutate("/components/header/api");
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { flashMessage: data.message, type: "error" },
        });
        router.push("/");
      }
    }
  }, [data, dispatch, router]);
  return { data, isLoading, error };
};

export default useUserEmailValidation;
