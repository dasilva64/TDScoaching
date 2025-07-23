"use client";

import { Provider } from "react-redux";
import { storeHistoriqueRendezVous } from "../store/storeHistoriqueRendezVous";

export function ProviderHistoriqueRendezVous({ children }: any) {
  return (
    <Provider store={storeHistoriqueRendezVous}>
        {children}
    </Provider>
  );
}