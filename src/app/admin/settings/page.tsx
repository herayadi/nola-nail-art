"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  MessageCircle,
  Clock,
  MapPin,
  Save,
  Loader2,
  Globe
} from "lucide-react";
import styles from "./settings.module.css";
import { useRouter } from "next/navigation";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("identity");
  const [formData, setFormData] = useState({
    studio_name: "Nola Nail Art",
    studio_address: "",
    studio_instagram: "",
    whatsapp_number: "",
    whatsapp_message: "",
    open_hour: "09:00",
    close_hour: "20:00",
    maintenance_mode: "false",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setFormData(prev => ({ ...prev, ...data }));
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Pengaturan berhasil disimpan!");
        router.refresh();
      }
    } catch (err) {
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>System Control</h1>
          <p className={styles.subtitle}>Fine-tune your studio's operational parameters and communication flows.</p>
        </div>
      </header>

      <div className={styles.settingsLayout}>
        <aside className={styles.sideNav}>
          <button 
            onClick={() => scrollToSection('identity')}
            className={`${styles.navItem} ${activeSection === 'identity' ? styles.navItemActive : ''}`}
          >
            <Globe size={18} />
            <span>Studio Identity</span>
          </button>
          <button 
            onClick={() => scrollToSection('communication')}
            className={`${styles.navItem} ${activeSection === 'communication' ? styles.navItemActive : ''}`}
          >
            <MessageCircle size={18} />
            <span>Communication</span>
          </button>
          <button 
            onClick={() => scrollToSection('operational')}
            className={`${styles.navItem} ${activeSection === 'operational' ? styles.navItemActive : ''}`}
          >
            <Clock size={18} />
            <span>Operational</span>
          </button>
          
          <div className="mt-auto pt-8">
            <div className="bg-admin-accent-soft p-6 rounded-[32px] border border-admin-accent/10">
              <div className="flex items-center gap-3 text-admin-accent mb-2">
                <Settings size={16} className="animate-spin-slow" />
                <span className="text-[10px] font-black uppercase tracking-widest">Core Version</span>
              </div>
              <div className="text-white font-black text-xl">v2.4.0</div>
              <div className="text-admin-text-muted text-[10px] mt-1 font-bold">PREMIUM ENGINE</div>
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-12">
            {/* Studio Identity */}
            <section id="identity" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <Globe size={32} />
                </div>
                <h2 className={styles.sectionTitle}>Studio Identity</h2>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Studio Name</label>
                  <input
                    type="text"
                    name="studio_name"
                    value={formData.studio_name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Instagram Username</label>
                  <div className="relative">
                    <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
                    <input
                      type="text"
                      name="studio_instagram"
                      value={formData.studio_instagram}
                      onChange={handleChange}
                      className={`${styles.input} pl-16`}
                      placeholder="@nola.nailart"
                    />
                  </div>
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Physical Address</label>
                  <div className="relative">
                    <MapPin size={24} className="absolute left-6 top-6 text-gray-500" />
                    <textarea
                      name="studio_address"
                      value={formData.studio_address}
                      onChange={handleChange}
                      className={`${styles.input} ${styles.textarea} pl-16`}
                      placeholder="Street name, Building, City..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Communication Hub */}
            <section id="communication" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <MessageCircle size={32} />
                </div>
                <h2 className={styles.sectionTitle}>Communication Hub</h2>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>WhatsApp Business Number</label>
                  <input
                    type="text"
                    name="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g. 62812345678"
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Default Booking Message</label>
                  <textarea
                    name="whatsapp_message"
                    value={formData.whatsapp_message}
                    onChange={handleChange}
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Halo Nola, saya ingin konfirmasi booking..."
                  />
                </div>
              </div>
            </section>

            {/* Operational Cycle */}
            <section id="operational" className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <Clock size={32} />
                </div>
                <h2 className={styles.sectionTitle}>Operational Cycle</h2>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Opening Time</label>
                  <input
                    type="time"
                    name="open_hour"
                    value={formData.open_hour}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Closing Time</label>
                  <input
                    type="time"
                    name="close_hour"
                    value={formData.close_hour}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </section>

            <div className={styles.footer}>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Committing Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={24} />
                    <span>Save All Configuration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

