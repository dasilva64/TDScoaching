import "./globals.scss";
import { Inter } from "next/font/google";
import { Providers } from "./redux/provider";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
const inter = Inter({ subsets: ["latin"] });

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
