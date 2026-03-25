'use client';

import Hero from '@/components/sections/Hero';
import Manifesto from '@/components/sections/Manifesto';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import LookBuilderTeaser from '@/components/sections/LookBuilderTeaser';
import Community from '@/components/sections/Community';
import Footer from '@/components/sections/Footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <FeaturedProducts />
      <LookBuilderTeaser />
      <Community />
      <Footer />
    </>
  );
}
