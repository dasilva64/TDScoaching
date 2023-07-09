import type { User } from "../interfaces";
import useSwr from "swr";
import Link from "next/link";
import prisma from "../lib/prisma";
import { InferGetStaticPropsType } from "next";
import styles from "./index.module.scss";
import Layout from "../components/Layout";

export async function getStaticProps() {
  const user = await prisma.user.findMany();
  return {
    props: {
      user,
    },
  };
}

export default function IndexPage({
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(user);
  return (
    <>
      <Layout>
        <main className={styles.home}>
          <h1 className={styles.home__h1}>
           home
          </h1>
          
        </main>
      </Layout>
    </>
  );
}
