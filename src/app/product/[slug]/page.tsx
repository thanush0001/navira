import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetails, { PRODUCTS } from "./ProductDetails";

const SITE_URL = "https://navira3d.in";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS[slug];

  if (!product) {
    return {
      title: "Product Not Found | NAVIRA",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${product.name} | 3D Printed Cultural Art | NAVIRA`;

  const description =
    `${product.description} Explore NAVIRA's culturally inspired 3D-printed art from Mangaluru, Karnataka.`;

  const productUrl = `${SITE_URL}/product/${slug}`;

  return {
    title,
    description,

    alternates: {
      canonical: productUrl,
    },

    openGraph: {
      type: "website",
      url: productUrl,
      siteName: "NAVIRA",
      title,
      description,
      images: product.image
        ? [
            {
              url: product.image,
              alt: product.name,
            },
          ]
        : [],
    },

    twitter: {
      card: product.image ? "summary_large_image" : "summary",
      title,
      description,
      ...(product.image
        ? {
            images: [product.image],
          }
        : {}),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  if (!PRODUCTS[slug]) {
    notFound();
  }

  return <ProductDetails slug={slug} />;
}