/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`

const nextConfig = {
  productionBrowserSourceMaps: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
           {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'Permissions-Policy',
            value: "camera=(), geolocation=(), microphone=()",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: "https://tdscoaching.fr",
          },
          {
            key: 'Vary',
            value: "Origin",
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: "Content-Type, Accept",
          },
          {
            key: 'Strict-Transport-Security',
            value: "max-age=63072000; includeSubDomains; preload",
          }
          
        ],
      },
    ]
  },
   /*  ]
  } */
    /* externals: {
        // only define the dependencies you are NOT using as externals!
        canvg: "canvg",
        html2canvas: "html2canvas",
        dompurify: "dompurify"
      } */
      
}

module.exports = nextConfig
