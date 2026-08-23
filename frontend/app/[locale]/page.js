import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

export async function generateMetadata() {
  const t = await getTranslations("home");
  return { title: t("title") };
}

const OCCASIONS = [
  { slug: "birthday", emoji: "🎂", en: "Birthday", fr: "Anniversaire" },
  { slug: "wedding", emoji: "💍", en: "Wedding", fr: "Mariage" },
  { slug: "graduation", emoji: "🎓", en: "Graduation", fr: "Remise de diplôme" },
  { slug: "anniversary", emoji: "❤️", en: "Anniversary", fr: "Anniversaire de mariage" },
  { slug: "baby-shower", emoji: "👶", en: "Baby Shower", fr: "Baby Shower" },
  { slug: "celebration", emoji: "🎉", en: "Celebration", fr: "Célébration" },
  { slug: "gift", emoji: "🎁", en: "Gift", fr: "Cadeau" },
];

const TYPES = [
  { emoji: "🎂", en: "Cakes", fr: "Gâteaux", href: "/cakes" },
  { emoji: "🧁", en: "Cupcakes", fr: "Cupcakes", href: "/shop?category=cupcakes" },
  { emoji: "🥐", en: "Pastries", fr: "Pâtisseries", href: "/pastries" },
  { emoji: "🍪", en: "Cookies", fr: "Biscuits", href: "/shop?category=cookies" },
  { emoji: "🎁", en: "Gift Boxes", fr: "Coffrets Cadeaux", href: "/shop?category=gift-boxes" },
];

export default async function HomePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("home");
  let storeInfo = null;
  try {
    storeInfo = await api.storeInfo();
  } catch {
    storeInfo = null;
  }
  const whatsapp = storeInfo?.whatsapp_number?.replace(/\D/g, "") || "";

  let featured = [];
  try {
    const productsRes = await api.products();
    featured = (productsRes.results || []).slice(0, 8);
  } catch {
    featured = [];
  }
  const heroImage = featured.find((p) => p.cover_image)?.cover_image;

  return (
    <div>
      <section className="relative">
        <div className="relative h-[70vh] min-h-[420px] w-full">
          {heroImage && (
            <Image
              src={heroImage.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl">
              {t("h1")}
            </h1>
            <p className="mt-4 text-lg text-white/85 max-w-xl">{t("subtitle")}</p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <a
                href={`https://wa.me/${whatsapp}`}
                className="rounded-full bg-white text-black px-6 py-3 font-medium hover:bg-white/90"
              >
                {t("ctaPrimary")}
              </a>
              <Link
                href="/cakes"
                className="rounded-full border border-white text-white px-6 py-3 font-medium hover:bg-white/10"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-xl font-semibold mb-6">Featured Products</h2>
          <ProductGrid products={featured} />
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold mb-6">{t("occasionPrompt")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {OCCASIONS.map((o) => (
            <Link
              key={o.slug}
              href={`/shop?occasion=${o.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border p-4 hover:bg-black/5 text-center"
            >
              <span className="text-2xl">{o.emoji}</span>
              <span className="text-sm font-medium">{locale === "fr" ? o.fr : o.en}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold mb-6">{t("typePrompt")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TYPES.map((type) => (
            <Link
              key={type.href}
              href={type.href}
              className="flex flex-col items-center gap-2 rounded-xl border p-4 hover:bg-black/5 text-center"
            >
              <span className="text-2xl">{type.emoji}</span>
              <span className="text-sm font-medium">{locale === "fr" ? type.fr : type.en}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
