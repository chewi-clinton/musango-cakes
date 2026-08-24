import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import "./gallery-tokens.css";

export const metadata = { title: "Gallery | Musango Cakes & More" };

export default async function GalleryPage({ searchParams }) {
  const params = await searchParams;
  const [categories, itemsRes] = await Promise.all([
    api.galleryCategories(),
    api.galleryItems(params.category ? `?category=${params.category}` : ""),
  ]);

  return (
    <div className="musango-gallery">
      <div className="gallery-hero">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <p className="gallery-eyebrow text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Our Portfolio
          </p>
          <h1 className="text-4xl font-bold mb-4 gallery-heading">Gallery</h1>
          <p className="text-black/60">
            A look at the cakes and treats we&apos;ve loved creating. Click any
            design to start a custom order built around it.
          </p>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-8 flex flex-wrap justify-center gap-2">
          <Link
            href="/gallery"
            className={`text-sm px-4 py-1.5 rounded-full border font-medium ${
              !params.category ? "gallery-pill-active" : "hover:bg-black/5"
            }`}
          >
            All
          </Link>
          {categories.results?.map((c) => (
            <Link
              key={c.slug}
              href={`/gallery?category=${c.slug}`}
              className={`text-sm px-4 py-1.5 rounded-full border font-medium ${
                params.category === c.slug ? "gallery-pill-active" : "hover:bg-black/5"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {itemsRes.results?.map((item, i) => (
            <Link
              key={item.id}
              href={`/order?ref=gallery&refId=${item.id}&title=${encodeURIComponent(item.title)}&image=${encodeURIComponent(item.image)}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border gallery-card block"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform group-hover:scale-105"
                priority={i < 4}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium p-3">
                  Order something like this →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
