import { Fuel, Shapes } from "lucide-react";
import Image from "next/image";
import { siIcloud, siInstagram, siJio, siNetflix, siWhatsapp } from "simple-icons";

const brandAssets: Record<string, string> = {
  "Amazon Prime": "/moneyflow/brands/prime-video.svg",
  "Prime": "/moneyflow/brands/prime-video.svg",
  Blinkit: "/moneyflow/brands/blinkit.svg",
  Zepto: "/moneyflow/brands/zepto.svg",
  PNB: "/moneyflow/brands/pnb.svg",
  "Bank of Baroda (BOB)": "/moneyflow/brands/bank-of-baroda.png",
};

const vectorBrands: Record<string, { path: string; color: string }> = {
  Netflix: { path: siNetflix.path, color: "#E50914" },
  Instagram: { path: siInstagram.path, color: "#C13584" },
  WhatsApp: { path: siWhatsapp.path, color: "#25D366" },
  iCloud: { path: siIcloud.path, color: "#4B93DA" },
  "Jio Finance": { path: siJio.path, color: "#165DAD" },
};

export const hasBrandIcon = (name: string) => Boolean(brandAssets[name] || vectorBrands[name]);

export function BrandIcon({ name, size = 22 }: { name: string; size?: number }) {
  const asset = brandAssets[name];
  if (asset) return <Image className="mf-brand-icon" src={asset} alt="" width={size} height={size} unoptimized />;

  const brand = vectorBrands[name];
  if (brand) return <svg className="mf-brand-icon" width={size} height={size} viewBox="0 0 24 24" fill={brand.color} aria-hidden="true"><path d={brand.path} /></svg>;

  if (name === "Petrol") return <Fuel size={size} aria-hidden="true" />;
  if (name === "Misc") return <Shapes size={size} aria-hidden="true" />;
  return null;
}
