'use client'

import { useState } from 'react'
import { About } from '@/components/About'
import { Categories } from '@/components/Categories'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { Gallery } from '@/components/Gallery'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { WhyUs } from '@/components/WhyUs'
import type { CategoryId } from '@/content/site'

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | ''>('')

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories onSelectCategory={setSelectedCategory} />
        <Gallery />
        <About />
        <WhyUs />
        <Contact
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
