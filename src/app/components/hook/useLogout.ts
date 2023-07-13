import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import useSWR from "swr"

const fetchWithToken = async (url: string) => {
    let response = await fetch(url, {
    });
    let json = await response.json();
    return json;
  };

function useLogout (userLogout: any, setUserLogout: any) {
const dispatch = useDispatch()
const router = useRouter()
const pathname = usePathname()
    const { data, error, isLoading } = useSWR(userLogout === true ?["http://localhost:3000/api/user/logout"] : null,
    ([url]) => fetchWithToken(url)
  );
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        setUserLogout(false)
        if (pathname === '/rendez-vous') {
          router.push('/')
        }
        dispatch({
            type: "auth/logout",
          });
      }
        
    }
  }, [data, dispatch, pathname, router, setUserLogout])

    return {
        user: data,
        isLoading,
        isError: error,
    }
}

export default useLogout

