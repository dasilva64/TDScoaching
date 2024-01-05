import "./globals.scss";
import { Inter } from "next/font/google";
import { Providers } from "./redux/provider";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import { Analytics } from "@vercel/analytics/react";
import Home from "./page";
//import { CanvasProvider } from "../../test/app/rendez-vous/components/formule/CanvasContext";
//const Header = lazy(() => import("./components/header/header"));
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Coach de vie c'est quoi ? - tdscoaching",
  description:
    "Le coaching de vie, c’est quoi ? Vous êtes en quête de bien-être ? Etes-vous prêt à libérer tout votre potentiel ? Comment puis-je vous aider ?",
  icons: {
    icon: "./assets/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
/* <CanvasProvider> */
/* </CanvasProvider> */
