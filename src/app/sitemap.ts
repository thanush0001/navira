import type { MetadataRoute } from "next";

const BASE_URL = "https://navira3d.in";

const productSlugs = [
  "tiger-head",
  "tiger-head-white",
  "tiger-head-black",
  "kambala",
  "aati-kalanje",
  "mudi-hakun",
  "ganesha",
  "custom-momentos",
  "pili-nalipun",
  "custom-3d-prints",
  "dharani-mandala",
  "appe-pili",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/shipping`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/returns`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const products: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/product/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...pages, ...products];
}