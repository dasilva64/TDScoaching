/** @type {import('next').NextConfig} */
const nextConfig = {
  /* webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  }, */
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  images: {
  minimumCacheTTL: 31536000, // Cache de 1 an
},
   async headers() {
     return [
      /*{
      source: "/api/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "private, no-store, no-cache, must-revalidate",
        },
      ],
    },
    {
      source: "/(profile|rendez-vous|meetings|suppression-compte|utilisateur|utilisateurs|historique-rendez-vous|email-validation|reinitialisation-mot-de-passe)",
      headers: [
        {
          key: "Cache-Control",
          value: "private, no-store, no-cache, must-revalidate",
        },
      ],
    },
    {
      source: "/(index|contact|tarif|blog|coaching-de-vie|conditions-generales-utilisations|mentions-legales|politique-de-confidentialite|qui-suis-je|tarif)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600, must-revalidate",
        },
      ],
    }, */
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
          key: "Cache-Control",
          value: "public, max-age=3600, must-revalidate",
        },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=()",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://tdscoaching.fr",
          },
          {
            key: "Vary",
            value: "Origin",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Accept",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  /*  ]
  } */
  /* externals: {
        // only define the dependencies you are NOT using as externals!
        canvg: "canvg",
        html2canvas: "html2canvas",
        dompurify: "dompurify"
      } */
};

module.exports = nextConfig;
