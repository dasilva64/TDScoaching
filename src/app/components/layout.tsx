import Head from "next/head";
import { LayoutProps } from "../../../.next/types/app/layout";
import Header from "./header/header";

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>My App</title>
      </Head>
      <Header />
      <main>{children}</main>
    </>
  );
}
