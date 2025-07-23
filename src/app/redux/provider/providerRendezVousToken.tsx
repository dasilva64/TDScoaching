"use client";

import { Provider } from "react-redux";
import { storeRendezVousToken } from "../store/storeRendezVousToken";

export function ProviderRendezVousToken({ children }: any) {
  return (
    <Provider store={storeRendezVousToken}>
        {children}
    </Provider>
  );
}