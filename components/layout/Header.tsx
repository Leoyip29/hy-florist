import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/layout/Navbar"

export default function Header() {
  return (
    <header className="sticky top-0 bg-white border-b z-50">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Company Logo"
            width={120}
            height={120}
            priority
          />
        </Link>

        <Navbar />
      </div>
    </header>
  )
}

