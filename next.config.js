/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/* const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
` */

const nextConfig = {
  productionBrowserSourceMaps: true,
  /* async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Accept, Content-Type" },
        ],
      }, */
      /* {
        // matching all API routes
        source: "/",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://www.tdscoaching.fr" },
          { key: "Vary", value: "Origin" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Accept, Content-Type" },
        ]
      }, {
        source: "/qui-suis-je",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://www.tdscoaching.fr" },
          { key: "Vary", value: "Origin" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "Accept, Content-Type" },
        ]

      } */
   /*  ]
  } */
    /* externals: {
        // only define the dependencies you are NOT using as externals!
        canvg: "canvg",
        html2canvas: "html2canvas",
        dompurify: "dompurify"
      } */
}

module.exports = withBundleAnalyzer(nextConfig)
