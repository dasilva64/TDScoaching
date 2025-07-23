"use client";

import { Provider } from "react-redux";
import { storeTarif } from "../store/storeTarif";

export function ProviderTarif({ children }: any) {
  return (
    <Provider store={storeTarif}>
        {children}
    </Provider>
  );
}
