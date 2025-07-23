"use client";

import { Provider } from "react-redux";
import { storeUtilisateur } from "../store/storeUtilisateur";

export function ProviderUtilisateur({ children }: any) {
  return (
    <Provider store={storeUtilisateur}>
        {children}
    </Provider>
  );
}