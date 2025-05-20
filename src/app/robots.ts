import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/profile",
        "/api",
        "/_next",
        "/static",
        "/public",
        "/dev",
        "/utilisateur",
        "/utilisateurs",
        "/reinitialisation-mot-de-passe/*",
        "/suppression-compte/*",
        "/réinitialisation-mot-de-passe",
        "/conditions-generales-utilisations",
        "/email-validation/*",
        "/mentions-legales",
        "/politique-de-confidentialite",
        "/rendez-vous",
        "/rendez-vous/*"
      ],
      allow: ["/", "/contact", "/tarif", "/qui-suis-je", "/coaching-de-vie", "/blog", "/comment-gerer-le-stress-et-l-anxiete-au-quotidien"],
    },
    sitemap: "https://www.tdscoaching.fr/sitemap.xml",
  };
}
