import React, { cache } from "react";
import prisma from "../lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import validator from "validator";
import styles from "./page.module.scss";
import CommentGererLeStressEtLanxieteAuQuotidienConseilsPratiquesSomaire from "./components/comment-gerer-le-stress-et-l-anxiete-au-quotidien-conseils-pratiques/comment-gerer-le-stress-et-l-anxiete-au-quotidien-conseils-pratiques-somaire";
import CommentGererLeStressEtLanxieteAuQuotidienConseilsPratiques from "./components/comment-gerer-le-stress-et-l-anxiete-au-quotidien-conseils-pratiques/comment-gerer-le-stress-et-l-anxiete-au-quotidien-conseils-pratiques";
import Carrousel from "./components/carrousel/Carrousel";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const oneData: any = await getOne({ slug: params.slug });
  return {
    title: oneData.title,
    description: oneData.description,
    keywords:
      "Développement personnel, Coaching professionnel, Relation de couple, Communication, Équilibre vie professionnelle-vie personnelle, Confiance en soi, Gestion du stress",
    author: "Thierry Da Silva",
    icons: {
      icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
    },
    robots: "index, follow",
    other: {
      "google-site-verification": "Y4xZukc_t4Ow9fnxrPprO_4tGLfVZv972xeGF6znJNw",
    },
  };
}

const getOne = cache(async ({ slug }: { slug: string }) => {
  const article = await prisma.article.findUnique({
    where: { slug: validator.escape(slug) },
  });

  if (!article) notFound();
  return article;
});

const getLast = cache(async () => {
  const lastArticles = await prisma.article.findMany({
    where: {
      slug: {
        not: "comment-gerer-le-stress-et-l-anxiete-au-quotidien-conseils-pratiques",
      },
    },
    orderBy: { created_at: "desc" },
    take: 10,
  });

  if (!lastArticles) notFound();
  return lastArticles;
});

const page = async ({ params }: { params: { slug: string } }) => {
  const oneData: any = await getOne({ slug: params.slug });
  const lastData = await getLast();
  return (
    <>
      <main className={styles.article}>
        <div className={styles.article__banner}>
          <Image
            className={styles.article__banner__img}
            src={`/assets/blog/${oneData?.image}`}
            alt={oneData?.title}
            width={0}
            height={0}
            quality={100}
            sizes={"100vw"}
          />
        </div>
        <div id="introduction" className={styles.article__container}>
          <div className={styles.article__container__left}>
            <Link
              className={styles.article__container__left__link}
              href={"/blog"}
            >
              Retour vers les articles
            </Link>
            <p className={styles.article__container__left__author}>
              Ecrit par Thierry DA SILVA le{" "}
              <time title="August 28th, 2011">
                {oneData?.created_at.toLocaleString("FR-fr", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>
            <h1 className={`${styles.article__banner__h1}`}>
              {oneData?.title}
            </h1>

            <p className={styles.article__container__left__desc}>
              {oneData?.description}
            </p>
            <details className={`${styles.article__container__left__sommaire}`}>
              <summary className="modalOpen">Sommaire</summary>
              {oneData?.slug ===
                "comment-gerer-le-stress-et-l-anxiete-au-quotidien-conseils-pratiques" && (
                <CommentGererLeStressEtLanxieteAuQuotidienConseilsPratiquesSomaire
                  slug={oneData?.slug}
                />
              )}
            </details>
            {oneData?.slug ===
              "comment-gerer-le-stress-et-l-anxiete-au-quotidien-conseils-pratiques" && (
              <CommentGererLeStressEtLanxieteAuQuotidienConseilsPratiques />
            )}
            {/* <div className={styles.article__container__left__line}></div> */}
          </div>
          <div className={styles.article__container__left__footer}>
            <Image
              className={styles.article__container__left__footer__img}
              src="/assets/img/moi21.webp"
              alt="Thierry DA SILVA"
              width={0}
              height={0}
              sizes={"100vw"}
            />
            <p className={styles.article__container__left__footer__p}>
              Thierry DA SILVA est un passionné de la santé et du bien-être. Il
              partage ses conseils et astuces pour une vie plus saine et
              équilibrée.
            </p>
          </div>
          {lastData && lastData.length > 0 && (
            <>
              <div className={styles.article__last}>
                <h2 className={styles.article__last__title}>
                  Les derniers articles
                </h2>
                <div className={styles.article__last__container}>
                  <Carrousel data={lastData} />
                  {/* {lastData.map((e, index) => {
                    return (
                      <div key={index} className={styles.article__last__card}>
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
                        <div className={styles.article__last__card__div}>
                          <h3
                            className={`${styles.article__last__card__div__h2}`}
                          >
                            {e.title}
                          </h3>
                          <Paragraph content={e.description} />
                          <Link
                            className={`modalOpen ${styles.article__last__card__div__btn}`}
                            href={`/${e.slug}`}
                          >
                            Lire la suite
                          </Link>
                        </div>
                      </div>
                    );
                  })} */}
                </div>
              </div>
            </>
          )}

          {/* <div className={styles.article__container__right}></div> */}
        </div>
      </main>
    </>
  );
};

export default page;
