import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildWhatsAppUrl, COMMON_MESSAGES } from "@/lib/whatsapp";

const InstagramIcon = ({ size = 24, className = "", color = "currentColor", style }: { size?: number; className?: string; color?: string; style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const metadata = {
  title: "Kontak | Nola Nail Art",
  description: "Hubungi kami atau kunjungi studio Nola Nail Art di Jakarta Selatan.",
};

export default function KontakPage() {
  return (
    <div style={{ paddingTop: "var(--space-4xl)", paddingBottom: "var(--space-4xl)" }}>
      <section className="container">
        
        <ScrollReveal animation="slideUp" style={{ textAlign: "center", marginBottom: "var(--space-3xl)" }}>
          <span style={{ color: "var(--color-accent)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Hubungi Kami</span>
          <h1 style={{ fontSize: "3rem", margin: "var(--space-sm) 0" }}>Kami Siap Membantu</h1>
        </ScrollReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-xl)", marginBottom: "var(--space-4xl)" }}>
          
          <ScrollReveal animation="fadeIn" delay={100}>
            <Card elevated style={{ height: "100%", padding: "var(--space-2xl)" }}>
              <h2 style={{ marginBottom: "var(--space-xl)" }}>Informasi Studio</h2>
              
              <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                <MapPin color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>Alamat Lengkap</h4>
                  <p style={{ color: "var(--color-gray-500)", margin: 0, fontSize: "0.9375rem" }}>
                    Jl. Kecantikan Estetika No. 123<br/>
                    Kebayoran Baru, Jakarta Selatan 12345
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                <Clock color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>Jam Operasional</h4>
                  <p style={{ color: "var(--color-gray-500)", margin: 0, fontSize: "0.9375rem" }}>
                    Selasa - Minggu: 09:00 - 18:00<br/>
                    Senin: Libur
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                <Phone color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>Nomor Telepon / WA</h4>
                  <p style={{ color: "var(--color-gray-500)", margin: 0, fontSize: "0.9375rem" }}>
                    +62 851-6169-9605
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-2xl)" }}>
                <InstagramIcon size={24} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>Social Media</h4>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-gray-500)", fontSize: "0.9375rem", textDecoration: "underline" }}>
                    @nolanailart
                  </a>
                </div>
              </div>

              <a href={buildWhatsAppUrl(COMMON_MESSAGES.general)} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" fullWidth style={{ border: "1px solid var(--color-whatsapp)", backgroundColor: "rgba(37, 211, 102, 0.05)" }}>
                  <MessageCircle size={18} color="var(--color-whatsapp)" /> 
                  <span style={{ color: "var(--color-whatsapp)"}}>Chat WhatsApp Sekarang</span>
                </Button>
              </a>
            </Card>
          </ScrollReveal>

          <ScrollReveal animation="fadeIn" delay={300}>
            <div style={{ width: "100%", height: "100%", minHeight: "400px", backgroundColor: "var(--color-gray-100)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              {/* Dummy iframe for Map */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24056230948!2d106.74100653139366!3d-6.229746430335028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14d30079f01%3A0x2e74f2341fff266d!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </div>
  );
}
