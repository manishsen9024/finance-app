import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Paisa · Finance Tracker",
    short_name: "Paisa",
    description: "Your personal finance tracker — income, expenses, savings at a glance.",
    lang: "en",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#eef2ff",
    theme_color: "#eef2ff",
    orientation: "portrait",
    categories: ["finance", "productivity", "personal"],
    prefer_related_applications: false,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}