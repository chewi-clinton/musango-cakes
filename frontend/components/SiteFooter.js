import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { FacebookIcon, InstagramIcon, XIcon } from "./SocialIcons";

export default async function SiteFooter() {
  let storeInfo = null;
  try {
    storeInfo = await api.storeInfo();
  } catch {
    storeInfo = null;
  }

  return (
    <footer className="border-t border-black/10 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="font-semibold mb-2">
            {storeInfo?.business_name || "Musango Cakes & More"}
          </p>
          <p className="text-black/60 flex items-center gap-1.5">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            {storeInfo?.address_text || "Douala, Cameroon"}
          </p>
          {storeInfo?.directions_url && (
            <a href={storeInfo.directions_url} className="text-black/60 underline">
              Get Directions
            </a>
          )}
        </div>

        <FooterLinks />

        <div>
          <p className="font-semibold mb-2">Follow</p>
          <div className="flex flex-col gap-2 text-black/60">
            {storeInfo?.instagram_url && (
              <a href={storeInfo.instagram_url} className="flex items-center gap-2">
                <InstagramIcon className="h-4 w-4" /> Instagram
              </a>
            )}
            {storeInfo?.facebook_url && (
              <a href={storeInfo.facebook_url} className="flex items-center gap-2">
                <FacebookIcon className="h-4 w-4" /> Facebook
              </a>
            )}
            {storeInfo?.x_url && (
              <a href={storeInfo.x_url} className="flex items-center gap-2">
                <XIcon className="h-4 w-4" /> X
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks() {
  const t = useTranslations("footer");
  return (
    <div className="flex flex-col gap-1 text-black/60">
      <Link href="/delivery">{t("delivery")}</Link>
      <Link href="/contact">{t("contact")}</Link>
      <Link href="/privacy-policy">{t("privacyPolicy")}</Link>
      <Link href="/terms">{t("terms")}</Link>
      <Link href="/refund-policy">{t("refundPolicy")}</Link>
    </div>
  );
}
