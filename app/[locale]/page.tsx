import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import HeroBanner from '@/components/sections/HeroBanner'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import ServicesAndAbout from '@/components/sections/ServicesAndAbout'
import SeriesSection from "@/components/sections/SeriesSection"
import SectionDivider from '@/components/sections/SectionDivider'
import FlowerStandSection from '@/components/sections/FlowerStandSection'
import HeartFlowerSection from "@/components/sections/HeartFlowerSection"
import SplitScreenShowcase from "@/components/sections/SplitScreenShowcase"
import ProductModal from '@/components/ProductModal'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'SEO' })
  
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      type: 'website',
    },
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  return (
    <main className="min-h-screen">
      {/* Hero Banner - Client component for carousel animation */}
      <HeroBanner />

      {/* Product sections - Server fetches data, Client displays */}
      <FeaturedProducts locale={locale} />
      <FlowerStandSection locale={locale} />
      <SplitScreenShowcase locale={locale} />
      <HeartFlowerSection locale={locale} />

      {/* Static content - Fully server-side rendered */}
      <SeriesSection locale={locale} />
      <SectionDivider />
      <ServicesAndAbout locale={locale} />

      {/* Product Modal - Client component that reads URL params */}
      <ProductModal locale={locale} />
    </main>
  )
}
