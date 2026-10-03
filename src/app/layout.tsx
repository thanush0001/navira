import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import MobileBottomNav from "./MobileBottomNav";

export const metadata: Metadata = {
  title: "Navira 3D",
  description:
    "Culturally inspired 3D printed heritage pieces.",
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