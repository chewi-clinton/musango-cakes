import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import StoreLocationBlock from "@/components/StoreLocationBlock";
import FaqAccordion from "@/components/FaqAccordion";
import {
  Cake,
  Heart,
  GraduationCap,
  Baby,
  PartyPopper,
  Gift,
  CakeSlice,
  Croissant,
  Cookie,
} from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("home");
  return { title: t("title") };
}

const OCCASIONS = [
  { slug: "birthday", Icon: Cake, en: "Birthday", fr: "Anniversaire" },
  { slug: "wedding", Icon: Heart, en: "Wedding", fr: "Mariage" },
  { slug: "graduation", Icon: GraduationCap, en: "Graduation", fr: "Remise de diplôme" },
  { slug: "anniversary", Icon: Heart, en: "Anniversary", fr: "Anniversaire de mariage" },
  { slug: "baby-shower", Icon: Baby, en: "Baby Shower", fr: "Baby Shower" },
  { slug: "celebration", Icon: PartyPopper, en: "Celebration", fr: "Célébration" },
  { slug: "gift", Icon: Gift, en: "Gift", fr: "Cadeau" },
];

const TYPES = [
  { Icon: Cake, en: "Cakes", fr: "Gâteaux", href: "/cakes" },
  { Icon: CakeSlice, en: "Cupcakes", fr: "Cupcakes", href: "/shop?category=cupcakes" },
  { Icon: Croissant, en: "Pastries", fr: "Pâtisseries", href: "/pastries" },
  { Icon: Cookie, en: "Cookies", fr: "Biscuits", href: "/shop?category=cookies" },
  { Icon: Gift, en: "Gift Boxes", fr: "Coffrets Cadeaux", href: "/shop?category=gift-boxes" },
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

  let galleryPreview = [];
  try {
    const galleryRes = await api.galleryItems();
    galleryPreview = (galleryRes.results || []).slice(0, 4);
  } catch {
    galleryPreview = [];
  }

  const HOW_IT_WORKS =
    locale === "fr"
      ? [
          {
            title: "Parcourez ou dites-nous",
            text: "Regardez nos gâteaux et notre galerie, ou décrivez simplement ce que vous imaginez — occasion, style, budget.",
          },
          {
            title: "Partagez les détails",
            text: "Envoyez-nous la date, la taille et vos idées de design sur WhatsApp. On vous aide à choisir la saveur et la finition.",
          },
          {
            title: "Confirmez votre commande",
            text: "Vous recevez un prix clair et une date de retrait ou de livraison avant que rien ne soit finalisé.",
          },
        ]
      : [
          {
            title: "Browse or Tell Us",
            text: "Look through our cakes and gallery, or just describe what you're picturing — occasion, style, budget.",
          },
          {
            title: "Share the Details",
            text: "Send your date, size, and design ideas on WhatsApp. We'll help you land on the right flavor and finish.",
          },
          {
            title: "Confirm Your Order",
            text: "You'll get a clear price and a pickup or delivery date before anything is final.",
          },
        ];

  const FAQ_ITEMS =
    locale === "fr"
      ? [
          {
            q: "À combien de temps à l'avance dois-je commander ?",
            a: "Pour un gâteau personnalisé, comptez au moins 3 à 5 jours. Les commandes du jour même sont étudiées au cas par cas — demandez-nous sur WhatsApp.",
          },
          {
            q: "Livrez-vous partout à Douala ?",
            a: "Nous livrons dans plusieurs quartiers de Douala — voir notre page Livraison pour les zones actuellement desservies.",
          },
          {
            q: "Puis-je vous envoyer une photo de référence ?",
            a: "Bien sûr. Parcourez notre Galerie pour vous inspirer, ou envoyez-nous directement une photo sur WhatsApp.",
          },
          {
            q: "Comment puis-je payer ?",
            a: "Le paiement est organisé directement avec nous sur WhatsApp une fois votre commande confirmée.",
          },
        ]
      : [
          {
            q: "How far in advance should I order?",
            a: "For custom cakes, plan for at least 3–5 days' notice. Same-day orders are handled case by case — just ask us on WhatsApp.",
          },
          {
            q: "Do you deliver across Douala?",
            a: "We deliver to a number of Douala neighborhoods — see our Delivery page for the areas currently served.",
          },
          {
            q: "Can I send a reference photo?",
            a: "Absolutely — browse our Gallery for inspiration, or send us a photo directly on WhatsApp.",
          },
          {
            q: "How do I pay?",
            a: "Payment is arranged directly with us on WhatsApp once your order is confirmed.",
          },
        ];

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
        <h2 className="text-xl font-semibold mb-8 text-center">
          {locale === "fr" ? "Commander est simple" : "Ordering Your Cake Is Easy"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white text-sm font-semibold">
                {i + 1}
              </div>
              <p className="font-medium mb-1">{step.title}</p>
              <p className="text-sm text-black/60">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href={`https://wa.me/${whatsapp}`}
            className="inline-block rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-black/80"
          >
            {locale === "fr" ? "Commencer ma commande" : "Start Your Order"}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold mb-6">{t("occasionPrompt")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {OCCASIONS.map((o) => (
            <Link
              key={o.slug}
              href={`/shop?occasion=${o.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border p-4 hover:bg-black/5 text-center"
            >
              <o.Icon className="h-6 w-6" strokeWidth={1.5} />
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
              <type.Icon className="h-6 w-6" strokeWidth={1.5} />
              <span className="text-sm font-medium">{locale === "fr" ? type.fr : type.en}</span>
            </Link>
          ))}
        </div>
      </section>
      {galleryPreview.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">From Our Gallery</h2>
            <Link href="/gallery" className="text-sm font-medium underline">
              See the Full Gallery
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {galleryPreview.map((item) => (
              <Link
                key={item.id}
                href={`/order?ref=gallery&refId=${item.id}&title=${encodeURIComponent(item.title)}&image=${encodeURIComponent(item.image)}`}
                className="relative aspect-[4/5] rounded-xl overflow-hidden border block"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-xl font-semibold mb-6">
          {locale === "fr" ? "Questions fréquentes" : "Frequently Asked Questions"}
        </h2>
        <FaqAccordion items={FAQ_ITEMS} />
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-xl font-semibold mb-6">
          {locale === "fr" ? "Contact" : "Contact Us"}
        </h2>
        <p className="text-sm text-black/60 mb-2">
          {locale === "fr"
            ? "La façon la plus rapide de nous joindre est WhatsApp."
            : "The fastest way to reach us is WhatsApp."}
        </p>
        <a
          href={`https://wa.me/${whatsapp}`}
          className="inline-block rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-black/80 mb-2"
        >
          {locale === "fr" ? "Discuter sur WhatsApp" : "Chat on WhatsApp"}
        </a>
        <StoreLocationBlock />
      </section>
    </div>
  );
}
