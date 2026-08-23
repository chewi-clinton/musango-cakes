import Image from "next/image";
import { Playfair_Display, Manrope } from "next/font/google";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import "./gallery-tokens.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata = { title: "Gallery | Musango Cakes & More" };

export default async function GalleryPage({ searchParams }) {
  const params = await searchParams;
  const [categories, itemsRes] = await Promise.all([
    api.galleryCategories(),
    api.galleryItems(params.category ? `?category=${params.category}` : ""),
  ]);

  return (
    <div className={`musango-gallery ${playfair.variable} ${manrope.variable}`}>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-6 gallery-heading">Gallery</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/gallery"
            className={`text-sm px-3 py-1.5 rounded-full border ${
              !params.category ? "bg-black text-white" : "hover:bg-black/5"
            }`}
          >
            All
          </Link>
          {categories.results?.map((c) => (
            <Link
              key={c.slug}
              href={`/gallery?category=${c.slug}`}
              className={`text-sm px-3 py-1.5 rounded-full border ${
                params.category === c.slug ? "bg-black text-white" : "hover:bg-black/5"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {itemsRes.results?.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
