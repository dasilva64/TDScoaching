"use client";

import { Provider } from "react-redux";
import { storeUtilisateurs } from "../store/storeUtilisateurs";

export function ProviderUtilisateurs({ children }: any) {
  return (
    <Provider store={storeUtilisateurs}>
        {children}
    </Provider>
  );
}