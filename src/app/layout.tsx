import "./globals.scss";
import { Providers } from "./redux/provider";
import Footer from "./components/footer/footer";
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
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
