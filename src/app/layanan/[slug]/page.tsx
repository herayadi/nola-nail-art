import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Check, MessageCircle, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { services } from "@/data/dummyData";
import { buildWhatsAppUrl, COMMON_MESSAGES } from "@/lib/whatsapp";

// Generates static paths (SSG) for all dummy services
export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.id,
  }));
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.id === slug);

  if (!service) {
    notFound();
  }

  return (
    <div style={{ paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-4xl)" }}>
      
      {/* Breadcrumb */}
      <div className="container" style={{ marginBottom: "var(--space-lg)" }}>
        <div style={{ display: "flex", gap: "8px", fontSize: "0.875rem", color: "var(--color-gray-400)" }}>
          <Link href="/">Beranda</Link>
          <span>/</span>
          <Link href="/layanan">Layanan</Link>
          <span>/</span>
          <span style={{ color: "var(--color-dark)" }}>{service.name}</span>
        </div>
      </div>

      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-2xl)", alignItems: "start" }}>
          
          {/* Left: Image Hero */}
          <ScrollReveal animation="fadeIn">
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
              <Image 
                src={service.image} 
                alt={service.name}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </ScrollReveal>

          {/* Right: Content */}
          <div>
            <ScrollReveal animation="slideUp" delay={100}>
              <span style={{ color: "var(--color-accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.8125rem" }}>
                {service.category}
              </span>
              <h1 style={{ fontSize: "3rem", margin: "var(--space-xs) 0", lineHeight: 1.1 }}>
                {service.name}
              </h1>
              <p style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-gray-500)", marginBottom: "var(--space-xl)" }}>
                <Clock size={16} /> Estimasi pengerjaan: {service.duration}
              </p>
              
              <div style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--color-dark)", marginBottom: "var(--space-xl)" }}>
                Rp {service.price.toLocaleString("id-ID")} <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--color-gray-400)", fontFamily: "var(--font-body)" }}>/ mulai dari</span>
              </div>
              
              <p style={{ fontSize: "1.125rem", color: "var(--color-gray-600)", lineHeight: 1.7, marginBottom: "var(--space-2xl)" }}>
                {service.description}
              </p>
              
              <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-3xl)", flexWrap: "wrap" }}>
                <Link href="/booking" style={{ width: "100%", maxWidth: "250px" }}>
                  <Button fullWidth size="lg" style={{ boxShadow: "var(--shadow-card)" }}>
                    <Calendar size={18} /> Book Now
                  </Button>
                </Link>
                <a 
                  href={buildWhatsAppUrl(COMMON_MESSAGES.consultation)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ width: "100%", maxWidth: "250px" }}
                >
                  <Button fullWidth variant="secondary" size="lg">
                    <MessageCircle size={18} /> Konsultasi Dulu
                  </Button>
                </a>
              </div>
            </ScrollReveal>

            {/* Add-ons List */}
            {service.addons && service.addons.length > 0 && (
              <ScrollReveal animation="slideUp" delay={300} style={{ marginBottom: "var(--space-3xl)" }}>
                <h3 style={{ marginBottom: "var(--space-md)", borderBottom: "1px solid rgba(44, 37, 32, 0.05)", paddingBottom: "var(--space-sm)" }}>
                  Add-on Tersedia
                </h3>
                <ul style={{ listStyle: "none" }}>
                  {service.addons.map(addon => (
                    <li key={addon.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px dashed rgba(44, 37, 32, 0.1)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500 }}>
                        <Check size={16} color="var(--color-accent)" />
                        {addon.name}
                      </span>
                      <span style={{ color: "var(--color-gray-500)" }}>
                        + Rp {addon.price.toLocaleString("id-ID")}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            )}

            {/* FAQ Layanan Spesifik */}
            {service.faqs && service.faqs.length > 0 && (
              <ScrollReveal animation="slideUp" delay={400}>
                <Card elevated>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "var(--space-md)" }}>FAQ untuk {service.name}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                    {service.faqs.map((faq, idx) => (
                      <div key={idx}>
                        <h4 style={{ fontSize: "1rem", margin: "0 0 4px 0", color: "var(--color-dark)" }}>Q: {faq.question}</h4>
                        <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--color-gray-500)" }}>A: {faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </ScrollReveal>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
