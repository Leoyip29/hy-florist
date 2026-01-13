import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#d9d9d9]">
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
                我們相信，每一束花都有其獨特的意義，能夠完美傳遞出我們的心意和關懷。
                在這充滿挑戰的時代，我們承諾與你攜手同行，無論逆境或疫情，
                我們將一路相伴，讓關愛傳遞到每一個角落。
            </p>
        </div>

        {/* MIDDLE: Contact Info */}
        <div className="space-y-4 text-sm text-gray-700 max-w-xs md:justify-self-center md:self-center">
        
        <div className="flex items-start gap-3">
            <span className="text-base leading-none">📞</span>
            <span>電話：+852 9684 6901</span>
        </div>

        <div className="flex items-start gap-3">
            <span className="text-base leading-none">✉️</span>
            <span>電郵：info@hy-florist.hk</span>
        </div>

        <div className="flex items-start gap-3">
            <span className="text-base leading-none">📍</span>
            <span className="leading-relaxed">
            地址：九龍 紅磡 必嘉街18號<br />
            嘉麗閣 地下3號舖
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
          Copyright © 2026 Hyacinth Florist ｜風信子花店. All rights reserved.
        </p>
      </div>
    </footer>
  );
}






