"use client";

import React, { useEffect } from "react";
import Load from "../load/Load";
import "../../redirection.scss";
import useSWR from "swr";
import fetchGet from "@/app/components/fetch/fetchGet";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import useSWRMutation from "swr/mutation";
import fetchPost from "@/app/components/fetch/FetchPost";
import { RootState } from "@/app/redux/store";
import { mutate as globalMutate } from "swr";

const Display = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const result = searchParams.get('result')
  const session_id = searchParams.get('session_id')
  const { data } = useSWR("/redirection-vers-rendez-vous/components/api", fetchGet, {
    revalidateOnFocus: false,
  });
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)
  const { trigger, data: dataStripe, reset } = useSWRMutation(`api/stripe?session_id=${session_id}`, fetchPost)
  useEffect(() => {
    if (dataStripe) {
      if (dataStripe.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataStripe.message },
        });
        reset()
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push('/')
      } else if (dataStripe.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataStripe.message },
        });
        reset()
        router.push('/rendez-vous')
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataStripe.message },
        });
        reset()
        router.push('/rendez-vous')
      }

    }
  }, [dataStripe])
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        if (result === "cancel") {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: data.message },
          });
          router.push('/rendez-vous')
        } else {
          if (csrfToken) {
            trigger({ csrfToken: csrfToken })
          }

        }

      }else if (data.status === 429) {
         dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push('/')
      }
    }
  }, [data, csrfToken, dispatch])
  return (
    <>

      <Load />
    </>
  );
};

export default Display;