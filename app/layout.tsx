import type { Metadata } from "next";
import "./globals.css";
import PublicOnly from "@/components/PublicOnly";
import Header from "@/components/Header";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import { StoreConfigProvider } from "@/context/StoreConfigContext";
import ConfigReceiver from "@/components/ConfigReceiver";
import { Toaster } from "react-hot-toast";
import PageLoader from "@/components/PageLoader";

export const metadata: Metadata = {
  title: "Criados no Mato — Bonés Premium",
  description: "Nascidos nas raízes, criados no mato. Bonés e acessórios para quem vive o estilo country com autenticidade e orgulho.",
  keywords: "boné, boné country, boné cowboy, criados no mato, boné premium, moda country, boiadeiro",
  openGraph: {
    title: "Criados no Mato — Bonés Premium",
    description: "Nascidos nas raízes, criados no mato.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <CartProvider>
          <StoreConfigProvider>
            <ConfigReceiver />

            {/* Public-only effects (hidden on /admin) */}
            <PublicOnly>
              <PageLoader />
              <CustomCursor />
              <SmoothScroll>
                <Header />
                <main>{children}</main>
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    style: {
                      background: "#1A1612",
                      color: "#F5EDD8",
                      border: "1px solid rgba(200,146,42,0.3)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.875rem",
                    },
                  }}
                />
              </SmoothScroll>
            </PublicOnly>

            {/* Admin pages — bare, no effects, no wrapper */}
            <PublicOnly invert>
              {children}
            </PublicOnly>
          </StoreConfigProvider>
        </CartProvider>
      </body>
    </html>
  );
}
