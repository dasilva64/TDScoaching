import { lazy } from "react";
import "./globals.scss";
import { Inter } from "next/font/google";
import { Providers } from "./redux/provider";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import { CanvasProvider } from "./rendez-vous/components/formule/CanvasContext";
//const Header = lazy(() => import("./components/header/header"));
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CanvasProvider>
      <html lang="fr">
        <body className={inter.className}>
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </body>
      </html>
    </CanvasProvider>
  );
}
