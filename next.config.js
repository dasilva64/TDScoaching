/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  productionBrowserSourceMaps: true,
  async headers() {
    return [
      {
        // matching all API routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://www.tdscoaching.fr" },
          { key: "Content-Security-Policy", value: "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self'; font-src 'self'" },
          { key: "Vary", value: "Origin" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
    /* externals: {
        // only define the dependencies you are NOT using as externals!
        canvg: "canvg",
        html2canvas: "html2canvas",
        dompurify: "dompurify"
      } */
}

module.exports = withBundleAnalyzer(nextConfig)
