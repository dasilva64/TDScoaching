import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/private/",
      allow: ["/", "/contact", "/tarif", "/qui-suis-je", "/coaching-de-vie"],
    },
    sitemap: "https://www.tdscoaching.fr/sitemap.xml",
  };
}
