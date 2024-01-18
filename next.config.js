/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
    /* externals: {
        // only define the dependencies you are NOT using as externals!
        canvg: "canvg",
        html2canvas: "html2canvas",
        dompurify: "dompurify"
      } */
}

module.exports = nextConfig
