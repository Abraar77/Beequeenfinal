import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "BeeQueen of Kashmir — Premium Kashmiri Products",
    template: "%s | BeeQueen of Kashmir",
  },
  description:
    "Discover authentic Kashmiri products — pure saffron, premium dry fruits, traditional spices, and more. Farm to your table, direct from Kashmir.",
  keywords: ["Kashmir", "BeeQueen", "saffron", "dry fruits", "Kashmiri products", "authentic", "premium"],
  openGraph: {
    type: "website",
    siteName: "BeeQueen of Kashmir",
    title: "BeeQueen of Kashmir — Premium Kashmiri Products",
    description: "Authentic Kashmiri products delivered to your doorstep.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BeeQueen of Kashmir",
    description: "Premium Kashmiri products — direct from the Valley.",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="bg-dark-900 text-white antialiased" suppressHydrationWarning>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#fff",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#D4AF37", secondary: "#0A0A0A" },
            },
            error: {
              iconTheme: { primary: "#E91E8C", secondary: "#fff" },
            },
          }}
        />
        <AnnouncementBar />
        <Header />
        <CartDrawer />
        <main className="min-h-screen page-enter">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
