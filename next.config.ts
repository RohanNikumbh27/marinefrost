import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Static export is not used because this app has dynamic routes.
  // For Capacitor, use live reload during development with the dev server.
  // For production, deploy to a web server and configure Capacitor to use that URL.
  images: {
    unoptimized: true, // Still needed if you want to use remote images
  },
};

export default nextConfig;
