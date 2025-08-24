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
import { RootState } from "@/app/redux/store/store";
import { mutate as globalMutate } from "swr";

const Display = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  //const result = searchParams.get('result')
  const setup_intent = searchParams.get('setup_intent')
  const { data } = useSWR("/redirection-vers-rendez-vous/components/api", fetchGet);
  const { csrfToken } = useSelector((state: RootState) => state.csrfToken)

  const { trigger: triggerCardStripe, data: dataCardStripe, reset: resetCardStripe } = useSWRMutation(`/redirection-vers-rendez-vous/components/api/cardStripe/`, fetchPost)
  useEffect(() => {
    if (dataCardStripe) {
      if (dataCardStripe.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataCardStripe.message },
        });
        resetCardStripe()
        globalMutate("/components/header/api");
        globalMutate("/components/header/ui/api");
        router.push('/')
      } else if (dataCardStripe.status === 200) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: dataCardStripe.message },
        });
        resetCardStripe()
        router.push('/rendez-vous')
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: dataCardStripe.message },
        });
        resetCardStripe()
        router.push('/rendez-vous')
      }

    }
  }, [dataCardStripe, dispatch, router, resetCardStripe])
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
         if (setup_intent) {
          if (csrfToken) {
            triggerCardStripe({ setup_intent: setup_intent, csrfToken: csrfToken })
          }

        }else {
          dispatch({
            type: "flash/storeFlashMessage",
            payload: { type: "success", flashMessage: "Mauvais parametre dans l'url" },
          });
          router.push('/')
        }

      }else if (data.status === 429) {
         dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "success", flashMessage: data.message },
        });
        router.push('/')
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
  }, [data, csrfToken, dispatch, router, triggerCardStripe, setup_intent])
  return (
    <>

      <Load />
    </>
  );
};

export default Display;