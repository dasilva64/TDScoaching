export const dynamic = "force-dynamic"

import "./globals.scss";
import { Providers } from "./redux/provider";
import Header from "./components/header/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
