"use client";

import { Provider } from "react-redux";
import { storeRendezVous } from "../store/storeRendezVous";

export function ProviderRendezVous({ children }: any) {
  return (
    <Provider store={storeRendezVous}>
        {children}
    </Provider>
  );
}