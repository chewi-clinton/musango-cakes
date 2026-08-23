import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";

export const metadata = { title: "Cakes | Musango Cakes & More" };

export default async function CakesPage() {
  const categories = await api.categories();
  const cakeCategories = categories.results.filter((c) => c.group === "cakes");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Cakes</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cakeCategories.map((c) => (
          <Link
            key={c.slug}
            href={`/cakes/${c.slug}`}
            className="rounded-xl border p-6 text-center font-medium hover:bg-black/5"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
