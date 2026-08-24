import { Link } from "@/i18n/navigation";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = { title: "FAQ | Musango Cakes & More" };

const FAQ_EN = [
  {
    q: "How far in advance should I order?",
    a: "For custom cakes, plan for at least 3–5 days' notice. Same-day orders are handled case by case — just ask us on WhatsApp.",
  },
  {
    q: "Do you deliver across Douala?",
    a: "We deliver to a number of Douala neighborhoods — see our Delivery page for the areas currently served, and pickup is always available too.",
  },
  {
    q: "Can I send a reference photo?",
    a: "Absolutely — browse our Gallery for inspiration and click any design to start an order around it, or just send us a photo directly on WhatsApp.",
  },
  {
    q: "How do I pay?",
    a: "Payment is arranged directly with us on WhatsApp once your order and price are confirmed.",
  },
  {
    q: "Do you make custom cakes for any occasion?",
    a: "Yes — birthdays, weddings, graduations, baby showers, and more. Tell us what you're celebrating and we'll help you plan it.",
  },
  {
    q: "Can I order cupcakes or pastries in bulk?",
    a: "Yes, just let us know the quantity and date you need them by when you reach out on WhatsApp.",
  },
];

const FAQ_FR = [
  {
    q: "À combien de temps à l'avance dois-je commander ?",
    a: "Pour un gâteau personnalisé, comptez au moins 3 à 5 jours. Les commandes du jour même sont étudiées au cas par cas — demandez-nous sur WhatsApp.",
  },
  {
    q: "Livrez-vous partout à Douala ?",
    a: "Nous livrons dans plusieurs quartiers de Douala — voir notre page Livraison pour les zones desservies. Le retrait en boutique est aussi toujours possible.",
  },
  {
    q: "Puis-je vous envoyer une photo de référence ?",
    a: "Bien sûr — parcourez notre Galerie pour vous inspirer et cliquez sur un design pour démarrer une commande, ou envoyez-nous directement une photo sur WhatsApp.",
  },
  {
    q: "Comment puis-je payer ?",
    a: "Le paiement est organisé directement avec nous sur WhatsApp une fois la commande et le prix confirmés.",
  },
  {
    q: "Faites-vous des gâteaux personnalisés pour toute occasion ?",
    a: "Oui — anniversaires, mariages, remises de diplôme, baby showers, et plus encore. Dites-nous ce que vous célébrez.",
  },
  {
    q: "Puis-je commander des cupcakes ou pâtisseries en grande quantité ?",
    a: "Oui, indiquez-nous simplement la quantité et la date souhaitées lorsque vous nous contactez sur WhatsApp.",
  },
];

export default async function FaqPage({ params }) {
  const { locale } = await params;
  const items = locale === "fr" ? FAQ_FR : FAQ_EN;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">
        {locale === "fr" ? "Questions fréquentes" : "Frequently Asked Questions"}
      </h1>
      <FaqAccordion items={items} />
      <p className="mt-8 text-sm text-black/60">
        {locale === "fr" ? "D'autres questions ? " : "Still have questions? "}
        <Link href="/contact" className="underline font-medium">
          {locale === "fr" ? "Contactez-nous" : "Get in touch"}
        </Link>
      </p>
    </div>
  );
}
