import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className=" bg-[#d9d9d9]">
      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-[1140px] px-6 py-12">
        
        {/* GRID: LEFT / MIDDLE / RIGHT */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">

          {/* LEFT: Logo + Description */}
        <div className="space-y-4 flex flex-col items-center">
            <Image
                src="/logo.svg"
                alt="Company Logo"
                width={150}
                height={150}
                priority
            />

            <p className="text-sm text-gray-700 leading-relaxed text-center max-w-md">
                {t("description")}
            </p>
        </div>

        {/* MIDDLE: Contact Info */}
        <div className="space-y-4 text-sm text-gray-700 max-w-xs md:justify-self-center md:self-center">
        
        <div className="flex items-start gap-3">
            <span className="text-base leading-none">📞</span>
            <span>{t("phone")}: +852 9456 8292</span>
        </div>

        <div className="flex items-start gap-3">
            <span className="text-base leading-none">✉️</span>
            <span>{t("email")}: info@hy-florist.hk</span>
        </div>

        <div className="flex items-start gap-3">
            <span className="text-base leading-none">📍</span>
            <span className="leading-relaxed">
            {t("address")}:<br />
            {t("addressLine1")}<br />
            {t("addressLine2")}
            </span>
        </div>

        </div>

          {/* RIGHT: Google Map */}
          <div className="w-full h-[200px] md:h-[240px]">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=九龍%20紅磡%20必嘉街18號%20嘉麗閣%20地下3號舖&output=embed"
              className="h-full w-full border-0 rounded"
              loading="lazy"
            />
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-gray-800 py-4">
        <p className="text-center text-xs text-gray-300">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}

