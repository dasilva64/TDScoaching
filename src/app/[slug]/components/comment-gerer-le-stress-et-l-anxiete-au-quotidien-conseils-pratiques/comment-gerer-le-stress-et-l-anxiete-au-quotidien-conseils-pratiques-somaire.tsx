import Link from "next/link";
import React from "react";
import styles from "./comment-gerer-le-stress-et-l-anxiete-au-quotidien-conseils-pratiques-somaire.module.scss";

const CommentGererLeStressEtLanxieteAuQuotidienConseilsPratiquesSomaire = ({
  slug,
}: {
  slug: string;
}) => {
  return (
    <ul className={styles.ul}>
      <li>
        <Link
          className={styles.ul__li__link}
          href={`/${slug}#lesOriginesDuStress`}
        >
          Les origines du stress
        </Link>
      </li>
      <li>
        <Link
          className={styles.ul__li__link}
          href={`/${slug}#lesEffetsDuStressSurLeCorpsEtLEsprit`}
        >
          Les effets du stress sur le corps et l’esprit
        </Link>
      </li>
      <li className={styles.ul__li}>
        <Link
          className={styles.ul__li__link}
          href={`/${slug}#lesStratégiesDeGestionDuStress`}
        >
          Les stratégies de gestion du stress
        </Link>
        <ul className={styles.ul__li__ul}>
          <li className={styles.ul__li__ul__li}>
            <Link
              className={styles.ul__li__ul__li__link}
              href={`/${slug}#adopterUneApprochePréventive`}
            >
              Adopter une approche préventive
            </Link>
          </li>
          <li className={styles.ul__li__ul__li}>
            <Link
              className={styles.ul__li__ul__li__link}
              href={`/${slug}#techniquesDeRelaxationEtDeMéditation`}
            >
              Techniques de relaxation et de méditation
            </Link>
          </li>
          <li className={styles.ul__li__ul__li}>
            <Link
              className={styles.ul__li__ul__li__link}
              href={`/${slug}#changerDePerspective`}
            >
              Changer de perspective
            </Link>
          </li>
          <li className={styles.ul__li__ul__li}>
            <Link
              className={styles.ul__li__ul__li__link}
              href={`/${slug}#demanderDeLAide`}
            >
              Demander de l’aide
            </Link>
          </li>
        </ul>
      </li>
      <li>
        <Link className={styles.ul__li__link} href={`/${slug}#conclusion`}>
          Conclusion
        </Link>
      </li>
    </ul>
  );
};

export default CommentGererLeStressEtLanxieteAuQuotidienConseilsPratiquesSomaire;
