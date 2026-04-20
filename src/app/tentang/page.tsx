import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Sparkles, Palette, Gem, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildWhatsAppUrl, COMMON_MESSAGES } from "@/lib/whatsapp";

export const metadata = {
  title: "Tentang Kami | Nola Nail Art",
  description: "Cerita Nola Nail Art, visi estetika, dan tim profesional kami.",
};

export default function TentangPage() {
  const values = [
    { title: "Hygiene", icon: <ShieldCheck size={24} />, desc: "Kebersihan alat prioritas kami." },
    { title: "Detail", icon: <Sparkles size={24} />, desc: "Pengerjaan rapi & mendetail." },
    { title: "Custom", icon: <Palette size={24} />, desc: "Bebas berikan referensi style." },
    { title: "Premium", icon: <Gem size={24} />, desc: "Produk import tahan lama." }
  ];

  return (
    <div style={{ paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-4xl)" }}>
      {/* Hero Section About */}
      <section className="container">
        <ScrollReveal animation="slideUp" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto var(--space-4xl) auto" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "var(--space-md)" }}>Cerita Nola</h1>
          <p style={{ fontSize: "1.125rem", color: "var(--color-gray-500)", lineHeight: 1.8 }}>
            Berawal dari kecintaan terhadap seni lukis dan detail kecil, Nola Nail Art 
            didirikan dengan sebuah misi sederhana: menghadirkan *luxury nail care* yang bisa 
            diakses dengan mudah, diiringi atmosfer santai dan personal untuk setiap wanita.
          </p>
        </ScrollReveal>
        
        {/* Banner */}
        <ScrollReveal animation="fadeIn" delay={200} style={{ position: "relative", width: "100%", height: "400px", borderRadius: "var(--radius-xl)", overflow: "hidden", marginBottom: "var(--space-4xl)" }}>
          <Image 
            src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1200" 
            alt="Nola Studio" 
            fill 
            style={{ objectFit: "cover" }} 
          />
        </ScrollReveal>

        {/* Values Grid */}
        <div style={{ marginBottom: "var(--space-4xl)" }}>
          <h2 style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>Nilai Kebanggaan Kami</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-md)" }}>
            {values.map((v, idx) => (
              <ScrollReveal key={idx} animation="slideUp" delay={idx * 150}>
                <Card elevated style={{ textAlign: "center" }}>
                  <div style={{ 
                    display: "inline-flex", padding: "var(--space-sm)", borderRadius: "var(--radius-full)", 
                    backgroundColor: "var(--color-primary)", color: "var(--color-dark)", marginBottom: "var(--space-md)" 
                  }}>
                    {v.icon}
                  </div>
                  <h3>{v.title}</h3>
                  <p style={{ color: "var(--color-gray-500)", fontSize: "0.9375rem" }}>{v.desc}</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* CTA */}
        <ScrollReveal animation="scaleUp" style={{ textAlign: "center", padding: "var(--space-3xl)", backgroundColor: "var(--color-gray-50)", borderRadius: "var(--radius-lg)" }}>
          <h2 style={{ marginBottom: "var(--space-sm)" }}>Siap mempercantik harimu?</h2>
          <p style={{ color: "var(--color-gray-500)", marginBottom: "var(--space-xl)" }}>Jadwalkan kedatanganmu sekarang atau konsultasi desain impianmu secara langsung.</p>
          <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/booking">
              <Button>Book Now</Button>
            </Link>
            <a href={buildWhatsAppUrl(COMMON_MESSAGES.consultation)} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost"><MessageCircle size={18} /> Chat WhatsApp</Button>
            </a>
          </div>
        </ScrollReveal>

      </section>
    </div>
  );
}
