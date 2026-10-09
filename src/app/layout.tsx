import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import MobileBottomNav from "./MobileBottomNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://navira3d.in"),

  title: {
    default: "NAVIRA | 3D Printed Cultural Art & Custom 3D Prints",
    template: "%s | NAVIRA",
  },

  description:
    "Discover 3D-printed cultural sculptures, Tulu Nadu heritage art, Kambala-inspired creations, and custom 3D prints at NAVIRA in Mangaluru, Karnataka.",

  applicationName: "NAVIRA",

  openGraph: {
    type: "website",
    url: "https://navira3d.in",
    siteName: "NAVIRA",
    title: "NAVIRA | 3D Printed Cultural Art & Custom 3D Prints",
    description:
      "Explore cultural 3D-printed sculptures, heritage-inspired art, and custom 3D prints from NAVIRA in Mangaluru, Karnataka.",
    images: [
      {
        url: "/images/navira-logo.png",
        alt: "NAVIRA — Culture. Crafted. Created.",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}