import StaticPageBody from "@/components/StaticPageBody";

export const metadata = { title: "Privacy Policy | Musango Cakes & More" };

export default async function PrivacyPolicyPage({ params }) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <StaticPageBody slug="privacy-policy" locale={locale} />
    </div>
  );
}
