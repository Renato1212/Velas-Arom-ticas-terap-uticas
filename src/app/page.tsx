import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Benefits } from "@/components/sections/benefits";
import { BestSellers } from "@/components/sections/best-sellers";
import { Story } from "@/components/sections/story";
import { Ingredients } from "@/components/sections/ingredients";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { Press } from "@/components/sections/press";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Benefits />
      <BestSellers />
      <Story />
      <Ingredients />
      <HowItWorks />
      <Testimonials />
      <Press />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  );
}
