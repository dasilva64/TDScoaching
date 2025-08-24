import Footer from "../components/footer/footer";
import styles from "./page.module.scss"
import NoScript from "../components/noscript/NoScript";
import Link from "next/link";

export const metadata = {
    title: "Conditions générales de vente - tdscoaching",
    description:
        "Consultez les conditions générales de vente du site tdscoaching.fr.",
    icons: {
        icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
    },
    author: "Thierry Da Silva",
    robots: "noindex, nofollow",
    other: {
        "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
    },
};

export default function CGV() {
    return (
        <>
            <NoScript />

            <main className={styles.cgv}>
                <h1 className={styles.cgv__h1}>
                    Conditions générales de vente
                </h1>
                <h2 className={styles.cgv__h2}>Définitions</h2>
        <p className={styles.cgv__p}>
          <b>Client :</b> tout professionnel ou personne physique capable au
          sens des articles 1123 et suivants du Code civil, ou personne morale,
          qui visite le Site objet des présentes conditions générales.
        </p>
        <p className={styles.cgv__p}>
          <b>Prestations et Services :</b>{" "}
          <Link className={styles.cgv__link} href="https://tdscoaching.fr/">
            https://tdscoaching.fr/
          </Link>{" "}
          met à disposition des Clients :
        </p>
        <p className={styles.cgv__p}>
          <b>Contenu :</b> Ensemble des éléments constituants l’information
          présente sur le Site, notamment textes – images – vidéos.
        </p>
        <p className={styles.cgv__p}>
          <b>Informations clients :</b> Ci après dénommé « Information (s) » qui
          correspondent à l’ensemble des données personnelles susceptibles
          d’être détenues par{" "}
          <Link className={styles.cgv__link} href="https://tdscoaching.fr/">
            https://tdscoaching.fr/
          </Link>{" "}
          pour la gestion de votre compte et de la gestion de la relation
          client.
        </p>
        <p className={styles.cgv__p}>
          <b>Utilisateur :</b> Internaute se connectant, utilisant le site
          susnommé.
        </p>
        <p className={styles.cgv__p}>
          <b>Informations personnelles :</b> « Les informations qui permettent,
          sous quelque forme que ce soit, directement ou non,
          l&apos;identification des personnes physiques auxquelles elles
          s&apos;appliquent » (article 4 de la loi n° 78-17 du 6 janvier 1978).
        </p>
        <p className={styles.cgv__p}>
          Les termes « données à caractère personnel », « personne concernée »,
          « sous traitant » et « données sensibles » ont le sens défini par le
          Règlement Général sur la Protection des Données (RGPD : n° 2016-679)
        </p>
        <h2 className={styles.cgv__h2}>1. Présentation du site internet.</h2>
        <p className={styles.cgv__p}>
          En vertu de l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004
          pour la confiance dans l&apos;économie numérique, il est précisé aux
          utilisateurs du site internet{" "}
          <Link className={styles.cgv__link} href="https://tdscoaching.fr/">
            https://tdscoaching.fr/
          </Link>{" "}
          l&apos;identité des différents intervenants dans le cadre de sa
          réalisation et de son suivi:
        </p>
        <p className={styles.cgv__p}>
          <strong>Propriétaire</strong> : Thierry DA SILVA SEABRA –
          contact@tds-coachingdevie.fr
          <br />
          micro entreprise tds direct services – 5 rue jean zubietta 33400
          Talence - siret 843931304
          <br />
          <strong>Responsable publication</strong> : Thierry DA SILVA SEABRA –
          <br />
          Le responsable publication est une personne physique ou une personne
          morale.
          <br />
          <strong>Webmaster</strong> : Thomas DA SILVA SEABRA –
          thomas.dss@protonmail.com
          <br />
          <strong>Hébergeur</strong> : Vercel Inc – 440 N Barranca Ave #4133 –
          Covina, CA 91723
          <br />
          <strong>Délégué à la protection des données</strong> : Thomas DA SILVA
          SEABRA – thomas.dss@protonmail.com
        </p>
                <h2 className={styles.cgv__h2}>3. Description des prestations</h2>
                <p className={styles.cgv__p}>
                    TDS Coaching propose des prestations de coaching de vie à destination des particuliers. Trois offres sont disponibles :
                </p>
                <ul className={styles.cgv__ul}>
                    <li><strong>Offre Découverte</strong> : premier rendez-vous gratuit, sans engagement.</li>
                    <li><strong>Offre Unique</strong> : un rendez-vous individuel.</li>
                    <li><strong>Offre Flash</strong> : trois rendez-vous répartis selon les disponibilités du client.</li>
                    <li><strong>Offre Custom</strong> : offre personnalisée définie avec le client.</li>
                </ul>

                <h2 className={styles.cgv__h2}>4. Modalités de paiement</h2>
                <p className={styles.cgv__p}>
                    Le paiement est effectué via la plateforme sécurisée Stripe. Lors de la réservation, , nous créons (ou récupérons) un « customer » Stripe lié à votre adresse e-mail, puis générons un SetupIntent pour enregistrer votre carte bancaire de manière sécurisée en vue d’un paiement différé.  
Aucun montant n’est débité lors de l’enregistrement de la carte ; le prélèvement intervient uniquement après la prestation.
                </p>
                <p className={styles.cgv__p}>
                    Le client accepte expressément que sa carte soit enregistrée et utilisée pour un paiement différé. Aucune donnée bancaire n’est stockée sur le site ; Stripe est seul responsable du traitement des paiements. Pour plus d’informations, consulter la politique de sécurité de Stripe :{" "}
                    <Link className={styles.cgv__link} href="https://stripe.com/fr/privacy">
                        https://stripe.com/fr/privacy
                    </Link>{" "}
                    et{" "}
                    <Link className={styles.cgv__link} href="https://stripe.com/docs/security/stripe">
                        https://stripe.com/docs/security/stripe
                    </Link>.
                </p>

                <h2 className={styles.cgv__h2}>5. Politique de remboursement</h2>
                <p className={styles.cgv__p}>
                    Étant donné que le paiement est effectué uniquement après réalisation du rendez-vous, aucun remboursement n’est prévu sauf en cas de litige ou d’erreur manifeste. Toute demande de remboursement doit être formulée par écrit à l’adresse :{" "}
                    <Link className={styles.cgv__link} href="mailto:contact@tds-coachingdevie.fr">
                        contact@tds-coachingdevie.fr
                    </Link>.
                </p>
                <p className={styles.cgv__p}>
                    En cas d’annulation ou de report, le client doit prévenir au moins 24h avant le rendez-vous. Dans le cas contraire, la prestation pourra être considérée comme due.
                </p>

                <h2 className={styles.cgv__h2}>6. Données personnelles</h2>
                <p className={styles.cgv__p}>
                    Les données collectées sont utilisées uniquement dans le cadre de la prestation. Le client dispose d’un droit d’accès, de rectification et de suppression de ses données conformément au RGPD. Pour toute demande, contacter :{" "}
                    <Link className={styles.cgv__link} href="mailto:thomas.dss@protonmail.com">
                        thomas.dss@protonmail.com
                    </Link>.
                </p>

                <h2 className={styles.cgv__h2}>7. Litiges et juridiction compétente</h2>
                <p className={styles.cgv__p}>
                    En cas de litige, une solution amiable sera recherchée. À défaut, le tribunal compétent sera celui du lieu du siège social de l’entreprise, sauf disposition légale contraire.
                </p>

                <h2 className={styles.cgv__h2}>8. Acceptation des CGV</h2>
                <p className={styles.cgv__p}>
                    En validant une commande ou en enregistrant sa carte bancaire via Stripe, le client reconnaît avoir lu et accepté les présentes Conditions Générales de Vente.
                </p>

            </main>
            <Footer />
        </>
    );
}