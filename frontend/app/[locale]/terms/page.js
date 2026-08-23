import StaticPageBody from "@/components/StaticPageBody";

export const metadata = { title: "Terms & Conditions | Musango Cakes & More" };

export default async function TermsPage({ params }) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <StaticPageBody slug="terms" locale={locale} />
    </div>
  );
}
