import "./globals.scss";
import { Inter } from "next/font/google";
import { Providers } from "./redux/provider";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Coach de vie c'est quoi ? - tdscoaching",
  description:
    "Le coaching de vie, c’est quoi ? Vous êtes en quête de bien-être ? Etes-vous prêt à libérer tout votre potentiel ? Comment puis-je vous aider ?",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
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
        </Providers>
      </body>
    </html>
  );
}
