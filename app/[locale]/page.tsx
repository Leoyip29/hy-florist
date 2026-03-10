import HeroSection from "@/components/sections/HeroSection"
import SeriesSection from "@/components/sections/SeriesSection"
import SectionDivider from "@/components/sections/SectionDivider"
import ServicesAndAbout from "@/components/sections/ServicesAndAbout"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SeriesSection />
      <SectionDivider />
      <ServicesAndAbout />
    </main>
  )
}