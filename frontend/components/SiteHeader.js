"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/cakes", label: t("cakes") },
    { href: "/pastries", label: t("pastries") },
    { href: "/shop", label: t("shop") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header className="border-b border-black/10 sticky top-0 bg-white z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo-header.png" alt="Musango Cakes & More" width={301} height={72} className="h-11 w-auto" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium hover:opacity-70">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher locale={locale} pathname={pathname} />
          <Link
            href="/order"
            className="rounded-full bg-black text-white text-sm font-medium px-4 py-2 hover:bg-black/80"
          >
            {t("orderNow")}
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-black/10 px-4 py-3 flex flex-col gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/order" className="text-sm font-semibold" onClick={() => setOpen(false)}>
            {t("orderNow")}
          </Link>
          <LanguageSwitcher locale={locale} pathname={pathname} />
        </nav>
      )}
    </header>
  );
}

function LanguageSwitcher({ locale, pathname }) {
  const other = locale === "en" ? "fr" : "en";
  return (
    <Link href={pathname} locale={other} className="text-sm font-medium border rounded-full px-3 py-1">
      {other.toUpperCase()}
    </Link>
  );
}
