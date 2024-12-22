import React from "react";
import NoScript from "../components/noscript/NoScript";
import styles from "./page.module.scss";
import prisma from "../lib/prisma";
import Image from "next/image";
import Paragraph from "./components/Paragraph";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Tous les articles - tdscoaching",
  description:
    "Retrouvez tous les articles de Thierry Da Silva, coach de vie, sur le développement personnel, le coaching professionnel, la relation de couple, la communication, l'équilibre vie professionnelle-vie personnelle, la confiance en soi et la gestion du stress.",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  keywords:
    "Développement personnel, Coaching professionnel, Relation de couple, Communication, Équilibre vie professionnelle-vie personnelle, Confiance en soi, Gestion du stress",
  author: "Thierry Da Silva",
  robots: "index, follow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};

/* const getData = unstable_cache(
  async () => {
    const getArticleData = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        created_at: true,
      },
    });

    if (!getArticleData) notFound();
    return getArticleData;
  },
  ["articles"],
  { revalidate: 3600, tags: ["articles"] }
); */
const getData = async () => {
  const getArticleData = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      image: true,
      created_at: true,
    },
  });

  if (!getArticleData) notFound();
  return getArticleData;
};

const page = async () => {
  const data = await getData();
  return (
    <>
      <NoScript />
      <main className={styles.blog}>
        <section className={styles.blog__article}>
          <h1 className={`${styles.blog__article__h2}`}>Tous les articles</h1>

          <div className={styles.blog__article__container}>
            {data &&
              data.map((e, index) => {
                return (
                  <div
                    key={index}
                    className={styles.blog__article__container__card}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                      src={`/assets/blog/${e.image}`}
                      width="0"
                      height="0"
                      sizes="100vw"
                      alt="Description of my image"
                    />
                    <div className={styles.blog__article__container__card__div}>
                      <h2
                        className={`${styles.blog__article__container__card__div__h2}`}
                      >
                        {e.title}
                      </h2>
                      <p
                        className={
                          styles.blog__article__container__card__div__date
                        }
                      >
                        <time
                          title={new Date(e.created_at).toLocaleString(
                            "FR-fr",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        >
                          {new Date(e.created_at).toLocaleString("FR-fr", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </p>
                      <Paragraph content={e.description} />
                      <Link
                        className={`modalOpen ${styles.blog__article__container__card__div__btn}`}
                        href={`/${e.slug}`}
                      >
                        Lire la suite
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </main>
    </>
  );
};

export default page;
