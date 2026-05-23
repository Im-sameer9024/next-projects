import type { NextConfig } from "next";

const getOrigin = (value?: string) => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const connectSources = [
  "'self'",
  "https://api.puter.com",
  getOrigin(process.env.NEXT_PUBLIC_API_URL),
].filter(Boolean);

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com", // DiceBear ✅
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  headers: () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: `connect-src ${connectSources.join(" ")};`,
        },
      ],
    },
  ],
};

export default nextConfig;
