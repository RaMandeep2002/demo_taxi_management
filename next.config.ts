import type { NextConfig } from "next";

const allowedDevOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://108.174.57.156"
  // Add other allowed development origins here
];

const nextConfig: NextConfig = {
  /* config options here */
  // Example: Expose allowedDevOrigins as a runtime config
  publicRuntimeConfig: {
    allowedDevOrigins,
  },
};

export default nextConfig;
