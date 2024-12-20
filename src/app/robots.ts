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
      ],
      allow: ["/", "/contact", "/tarif", "/qui-suis-je", "/coaching-de-vie", "/blog", "/comment-gerer-le-stress-et-l-anxiete-au-quotidien-conseils-pratiques"],
    },
    sitemap: "https://www.tdscoaching.fr/sitemap.xml",
  };
}
