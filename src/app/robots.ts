import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/private/",
      allow: "/",
    },
    sitemap: "https://www.tdscoaching.fr/sitemap.xml",
  };
}
