import Hero from "@/components/home/Hero";
import SocialProof from "@/components/home/SocialProof";
import Services from "@/components/home/Services";
import Portfolio from "@/components/home/Portfolio";
import WhyNola from "@/components/home/WhyNola";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import HowToBook from "@/components/home/HowToBook";
import FAQ from "@/components/home/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Services />
      <Portfolio />
      <WhyNola />
      <Pricing />
      <Testimonials />
      <HowToBook />
      <FAQ />
    </>
  );
}
