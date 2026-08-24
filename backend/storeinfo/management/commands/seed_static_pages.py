from django.core.management.base import BaseCommand

from storeinfo.models import StaticPage

# Originally-written copy for Musango Cakes & More — not copied from any source site.
# Business specifics (exact address, hours, policy terms) are placeholders pending
# real details from the business owner.
PAGES = [
    {
        "slug": "about",
        "title_en": "About Musango Cakes & More",
        "title_fr": "À propos de Musango Cakes & More",
        "body_en": (
            "Musango Cakes & More bakes custom cakes and pastries from Douala, "
            "Cameroon. We make birthday cakes, wedding cakes, and everyday treats "
            "for the moments that matter — built around real conversations with "
            "each customer rather than a fixed catalogue.\n\n"
            "Every order starts with a chat on WhatsApp: tell us what you're "
            "celebrating, and we'll help you choose the size, flavor, and design "
            "that fits.\n\n"
            "[Placeholder — replace with the real story of Musango Cakes & More: "
            "who's behind it, when it started, what makes it different.]"
        ),
        "body_fr": (
            "Musango Cakes & More confectionne des gâteaux et pâtisseries sur "
            "mesure à Douala, au Cameroun. Nous réalisons des gâteaux "
            "d'anniversaire, des gâteaux de mariage et des douceurs du quotidien "
            "pour les moments qui comptent — en discutant directement avec chaque "
            "client plutôt qu'en proposant un catalogue figé.\n\n"
            "Chaque commande commence par une conversation sur WhatsApp : "
            "dites-nous ce que vous célébrez, et nous vous aiderons à choisir la "
            "taille, la saveur et le design qui vous conviennent.\n\n"
            "[Espace réservé — à remplacer par l'histoire réelle de Musango Cakes "
            "& More.]"
        ),
    },
    {
        "slug": "contact",
        "title_en": "Contact Us",
        "title_fr": "Contactez-nous",
        "body_en": (
            "We're open 24/7. The fastest way to reach us is WhatsApp, but "
            "you're welcome to call or email too."
        ),
        "body_fr": (
            "Nous sommes ouverts 24h/24 et 7j/7. Le moyen le plus rapide de nous "
            "joindre est WhatsApp, mais vous pouvez aussi appeler ou envoyer un "
            "email."
        ),
    },
    {
        "slug": "delivery",
        "title_en": "Delivery in Douala",
        "title_fr": "Livraison à Douala",
        "body_en": (
            "We deliver across Douala and offer pickup for customers who prefer "
            "to collect their order directly. Delivery fees and timing depend on "
            "your neighborhood and how far in advance you order — same-day orders "
            "are handled case by case.\n\n[Placeholder — confirm the delivery "
            "zones actually served, fees, and standard lead times.]"
        ),
        "body_fr": (
            "Nous livrons dans tout Douala et proposons un retrait en boutique "
            "pour les clients qui préfèrent récupérer leur commande directement. "
            "Les frais et délais de livraison dépendent de votre quartier et du "
            "délai de commande — les commandes du jour même sont étudiées au cas "
            "par cas.\n\n[Espace réservé — confirmer les zones de livraison "
            "réellement desservies, les frais et les délais standards.]"
        ),
    },
    {
        "slug": "locations-douala",
        "title_en": "Musango Cakes & More in Douala",
        "title_fr": "Musango Cakes & More à Douala",
        "body_en": (
            "Musango Cakes & More is based near Rondpoint Dakar in Douala, "
            "Cameroon, serving customers across the city with cakes and "
            "pastries for birthdays, weddings, and everyday celebrations."
        ),
        "body_fr": (
            "Musango Cakes & More est basé près du Rondpoint Dakar à Douala, "
            "au Cameroun, et sert les clients de toute la ville avec des "
            "gâteaux et pâtisseries pour les anniversaires, mariages et "
            "célébrations du quotidien."
        ),
    },
    {
        "slug": "privacy-policy",
        "title_en": "Privacy Policy",
        "title_fr": "Politique de confidentialité",
        "body_en": (
            "We collect only the information needed to process your order — "
            "your name, phone number, and delivery details you share with us "
            "directly, mainly over WhatsApp. We don't sell your information to "
            "third parties.\n\n[Placeholder — full privacy policy to be finalized "
            "with the business owner.]"
        ),
        "body_fr": (
            "Nous collectons uniquement les informations nécessaires au "
            "traitement de votre commande — votre nom, numéro de téléphone et "
            "les détails de livraison que vous nous communiquez directement, "
            "principalement via WhatsApp. Nous ne vendons pas vos informations à "
            "des tiers.\n\n[Espace réservé — politique de confidentialité "
            "complète à finaliser.]"
        ),
    },
    {
        "slug": "terms",
        "title_en": "Terms & Conditions",
        "title_fr": "Conditions générales",
        "body_en": (
            "Orders are confirmed once details (size, flavor, design, date, and "
            "delivery or pickup) are agreed over WhatsApp. Payment is arranged "
            "directly with Musango Cakes & More.\n\n[Placeholder — full terms to "
            "be finalized with the business owner.]"
        ),
        "body_fr": (
            "Les commandes sont confirmées une fois les détails (taille, saveur, "
            "design, date, livraison ou retrait) convenus via WhatsApp. Le "
            "paiement est organisé directement avec Musango Cakes & More.\n\n"
            "[Espace réservé — conditions complètes à finaliser.]"
        ),
    },
    {
        "slug": "refund-policy",
        "title_en": "Refund Policy",
        "title_fr": "Politique de remboursement",
        "body_en": (
            "Because every cake is made to order, cancellation and refund terms "
            "depend on how close to the delivery date a change is requested. "
            "Contact us on WhatsApp as soon as possible if there's an issue with "
            "your order.\n\n[Placeholder — full refund policy to be finalized "
            "with the business owner.]"
        ),
        "body_fr": (
            "Chaque gâteau étant réalisé sur commande, les conditions "
            "d'annulation et de remboursement dépendent du délai avant la date "
            "de livraison. Contactez-nous sur WhatsApp dès que possible en cas "
            "de problème avec votre commande.\n\n[Espace réservé — politique de "
            "remboursement complète à finaliser.]"
        ),
    },
]


class Command(BaseCommand):
    help = "Seed originally-written static/legal pages for Musango Cakes & More."

    def handle(self, *args, **options):
        for page in PAGES:
            obj, created = StaticPage.objects.update_or_create(
                slug=page["slug"], defaults=page
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} page: {obj}")
