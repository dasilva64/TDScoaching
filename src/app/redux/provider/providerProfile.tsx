"use client";

import { Provider } from "react-redux";
import { storeProfile } from "../store/storeProfile";

export function ProviderProfile({ children }: any) {
  return (
    <Provider store={storeProfile}>
        {children}
    </Provider>
  );
}
