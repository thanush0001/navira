"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

const PRODUCTS: Record<string, Product> = {
  "tiger-head": {
    id: "tiger-head",
    name: "Tiger Head Sculpture",
    price: 2499,
    image: "/products/tiger-head-orange.png",
    description:
      "Cultural 3D-printed tiger head sculpture, crafted with character and attention to detail.",
  },

  "tiger-head-white": {
    id: "tiger-head-white",
    name: "White Tiger Head",
    price: 2499,
    image: "/products/tiger-head-white.png",
    description:
      "Striking white tiger head decorative sculpture, designed for distinctive display.",
  },

  "tiger-head-black": {
    id: "tiger-head-black",
    name: "Black Tiger Head",
    price: 2499,
    image: "/products/tiger-head-black.png",
    description:
      "Bold black tiger head decorative sculpture, crafted for a strong visual presence.",
  },

  kambala: {
    id: "kambala",
    name: "Kambala",
    price: 3499,
    image: "/products/kambla.png",
    description:
      "A 3D-printed tribute to the traditional Kambala sport of coastal Karnataka.",
  },

  "aati-kalanje": {
    id: "aati-kalanje",
    name: "Aati Kalanje",
    price: 2999,
    image: "/products/aati-kalange.png",
    description:
      "Traditional coastal Karnataka inspired creation, carefully 3D printed for display.",
  },

  "mudi-hakun": {
    id: "mudi-hakun",
    name: "Mudi Hakun",
    price: 2999,
    image: "/products/mudi-hakun.png",
    description:
      "Culturally inspired handcrafted 3D-printed piece with distinctive character.",
  },
};

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const { addToCart } = useCart();

  const slug = params.slug;
  const product = PRODUCTS[slug];

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // PRODUCT NOT FOUND
  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-6 text-[#171717]">
        <div className="text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
            NAVIRA 3D
          </p>

          <h1 className="font-serif text-4xl">
            Product Not Found
          </h1>

          <p className="mt-4 text-sm text-[#625d57]">
            The product you are looking for does not exist.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-8 bg-[#171717] px-8 py-4 text-[10px] font-medium tracking-[0.2em] text-white transition-opacity hover:opacity-80"
          >
            BACK TO SHOP
          </button>
        </div>
      </main>
    );
  }

  // DECREASE QUANTITY
  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
    setAdded(false);
  };

  // INCREASE QUANTITY
  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
    setAdded(false);
  };

  // ADD TO CART
  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
    });
    setAdded(true);
  };

  // BUY NOW
  const handleBuyNow = () => {
    addToCart({
      ...product,
      quantity,
    });
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717]">
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* PRODUCT IMAGE */}
          <div className="flex items-start justify-center">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-2xl bg-white">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain p-6 md:p-8"
                />
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#756b60]">
              NAVIRA 3D
            </p>

            <h1 className="font-serif text-4xl tracking-tight md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#625d57]">
              {product.description}
            </p>

            <p className="mt-7 text-2xl">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {/* QUANTITY */}
            <div className="mt-8">
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#756b60]">
                Quantity
              </p>

              <div className="flex h-12 w-32 items-center justify-between border border-black/20 bg-white px-4">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                  aria-label="Decrease quantity"
                  className="text-xl text-[#625d57] transition-opacity hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  −
                </button>

                <span className="min-w-6 text-center text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                  className="text-xl text-[#625d57] transition-opacity hover:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#171717] px-8 py-4 text-[10px] font-medium tracking-[0.2em] text-white transition-opacity hover:opacity-80"
              >
                {added ? "ADDED TO CART ✓" : "ADD TO CART"}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full border border-[#171717] px-8 py-4 text-[10px] font-medium tracking-[0.2em] transition-colors hover:bg-[#171717] hover:text-white"
              >
                BUY NOW
              </button>
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="mt-10 border-t border-black/10">
              <div className="border-b border-black/10 py-5">
                <p className="text-[10px] uppercase tracking-[0.2em]">
                  Product Details
                </p>

                <p className="mt-3 text-sm leading-6 text-[#625d57]">
                  Carefully designed and 3D printed for decorative
                  display. Each piece is produced with attention to
                  form and detail.
                </p>
              </div>

              <div className="border-b border-black/10 py-5">
                <p className="text-[10px] uppercase tracking-[0.2em]">
                  Shipping
                </p>

                <p className="mt-3 text-sm leading-6 text-[#625d57]">
                  Securely packaged and shipped to your doorstep.
                </p>
              </div>

              <div className="py-5">
                <p className="text-[10px] uppercase tracking-[0.2em]">
                  Custom Orders
                </p>

                <p className="mt-3 text-sm leading-6 text-[#625d57]">
                  Looking for a custom design or bulk order?
                </p>

                <a
                  href="https://wa.me/919480399248"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
                >
                  Contact us on WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
