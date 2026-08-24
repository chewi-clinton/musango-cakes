import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Quicksand } from "next/font/google";
import { routing } from "@/i18n/routing";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import { CartProvider } from "@/lib/CartContext";
import "../globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`h-full antialiased ${quicksand.variable}`}>
      <body className="min-h-full flex flex-col">
        <LocalBusinessJsonLd />
        <NextIntlClientProvider>
          <CartProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <WhatsAppFloatButton />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
