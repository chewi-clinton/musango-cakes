import { api } from "@/lib/api";

export default async function StaticPageBody({ slug, locale }) {
  let page = null;
  try {
    page = await api.staticPage(slug);
  } catch {
    page = null;
  }

  if (!page) {
    return <p className="text-black/60">This page hasn't been set up yet.</p>;
  }

  const title = locale === "fr" && page.title_fr ? page.title_fr : page.title_en;
  const body = locale === "fr" && page.body_fr ? page.body_fr : page.body_en;

  return (
    <article>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="prose max-w-none whitespace-pre-line text-black/80">{body}</div>
    </article>
  );
}
