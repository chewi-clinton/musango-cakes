import StaticPageBody from "@/components/StaticPageBody";

export const metadata = { title: "About | Musango Cakes & More" };

export default async function AboutPage({ params }) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <StaticPageBody slug="about" locale={locale} />
    </div>
  );
}
