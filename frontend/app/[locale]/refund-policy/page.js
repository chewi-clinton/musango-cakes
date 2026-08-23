import StaticPageBody from "@/components/StaticPageBody";

export const metadata = { title: "Refund Policy | Musango Cakes & More" };

export default async function RefundPolicyPage({ params }) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <StaticPageBody slug="refund-policy" locale={locale} />
    </div>
  );
}
