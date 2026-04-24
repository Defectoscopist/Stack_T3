import "~/styles/globals.css";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "~/components/shared/Header";
import { Footer } from "~/components/shared/Footer";
import { Providers } from "~/app/providers";

export const metadata: Metadata = {
  title: "Brand - Премиальная бытовая техника",
  description: "Премиальная бытовая техника, продуманная до мелочей.",
  keywords: "кофемашины, блендеры, пылесосы, соковыжималки, женская техника, аксессуары",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body >
        <TRPCReactProvider>
          <Providers>
            <Header />
              {children}
            <Footer />
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}