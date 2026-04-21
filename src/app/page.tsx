import Hero from "@/components/home/Hero";
import SocialProof from "@/components/home/SocialProof";
import Services from "@/components/home/Services";
import Portfolio from "@/components/home/Portfolio";
import WhyNola from "@/components/home/WhyNola";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import HowToBook from "@/components/home/HowToBook";
import FAQ from "@/components/home/FAQ";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const services = await prisma.service.findMany({
    orderBy: { id: "asc" },
  });
  const portfolio = await prisma.portfolio.findMany({
    orderBy: { createdAt: "desc" },
  });
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
  const faqsData = await prisma.faq.findMany({
    where: { serviceId: null },
  });

  return (
    <>
      <Hero />
      <SocialProof />
      <Services services={services} />
      <Portfolio portfolio={portfolio} />
      <WhyNola />
      <Pricing services={services} />
      <Testimonials testimonials={testimonials} />
      <HowToBook />
      <FAQ faqs={faqsData} />
    </>
  );
}
