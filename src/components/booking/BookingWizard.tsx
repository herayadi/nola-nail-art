"use client";

import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, Calendar as CalendarIcon, Clock, Lock } from "lucide-react";
import styles from "./BookingWizard.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { services } from "@/data/dummyData";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Steps definition
const STEPS = ["Layanan", "Add-on", "Jadwal", "Data Diri", "Konfirmasi"];

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // State for Booking Data
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    notes: ""
  });

  // Derived state
  const selectedService = services.find(s => s.id === selectedServiceId);
  
  // Derived available addons
  const availableAddons = selectedService?.addons || [];
  
  // Calculate total price
  const basePrice = selectedService?.price || 0;
  const addonsPrice = availableAddons
    .filter(a => selectedAddons.includes(a.id))
    .reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = basePrice + addonsPrice;

  // Handlers
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id);
    setSelectedAddons([]); // reset addons when changing service
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    // Build summary message
    const lines = [
      `Halo Nola Nail Art! Saya ingin konfirmasi booking:`,
      ``,
      `*Nama:* ${customerData.name}`,
      `*Layanan:* ${selectedService?.name}`,
      `*Add-on:* ${selectedAddons.length > 0 ? availableAddons.filter(a => selectedAddons.includes(a.id)).map(a => a.name).join(", ") : "-"}`,
      `*Tanggal:* ${selectedDate}`,
      `*Jam:* ${selectedTime}`,
      `*Catatan:* ${customerData.notes || "-"}`,
      ``,
      `*Estimasi Total:* Rp ${totalPrice.toLocaleString("id-ID")}`
    ];
    
    const message = lines.join('\n');
    const waUrl = buildWhatsAppUrl(message);
    
    // Redirect to WhatsApp
    window.open(waUrl, '_blank');
  };

  // ---------------------------------------------------------
  // RENDER: STEP 1 - Services
  // ---------------------------------------------------------
  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Pilih Layanan</h2>
      <p className={styles.stepDesc}>Pilih perawatan yang kamu inginkan.</p>
      
      <div className={styles.servicesGrid}>
        {services.map(service => (
          <div 
            key={service.id}
            className={`${styles.selectCard} ${selectedServiceId === service.id ? styles.selectedCard : ""}`}
            onClick={() => handleServiceSelect(service.id)}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.serviceName}>{service.name}</h3>
              <div className={styles.radioOutline}>
                {selectedServiceId === service.id && <div className={styles.radioDot} />}
              </div>
            </div>
            <p className={styles.serviceMeta}>
              {service.duration} • Rp {service.price.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
      
      <div className={styles.navButtons}>
        <div /> {/* spacing */}
        <Button onClick={nextStep} disabled={!selectedServiceId} className={styles.nextBtn}>
          Lanjut <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // RENDER: STEP 2 - Add-ons
  // ---------------------------------------------------------
  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Pilih Add-on (Opsional)</h2>
      <p className={styles.stepDesc}>Tambahkan pelengkap untuk hasil yang lebih mempesona.</p>
      
      {availableAddons.length === 0 ? (
        <p className={styles.emptyText}>Tidak ada extra add-on untuk layanan ini.</p>
      ) : (
        <div className={styles.addonsList}>
          {availableAddons.map(addon => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <div 
                key={addon.id}
                className={`${styles.addonRow} ${isSelected ? styles.selectedAddon : ""}`}
                onClick={() => toggleAddon(addon.id)}
              >
                <div className={styles.checkboxOutline}>
                  {isSelected && <Check size={14} className={styles.checkIcon} />}
                </div>
                <div className={styles.addonInfo}>
                  <span className={styles.addonName}>{addon.name}</span>
                  <span className={styles.addonPrice}>+ Rp {addon.price.toLocaleString("id-ID")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className={styles.navButtons}>
        <Button variant="ghost" onClick={prevStep}><ArrowLeft size={16} /> Kembali</Button>
        <Button onClick={nextStep} className={styles.nextBtn}>Lanjut <ArrowRight size={16} /></Button>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // RENDER: STEP 3 - Schedule
  // ---------------------------------------------------------
  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Pilih Jadwal</h2>
      <p className={styles.stepDesc}>Tentukan tanggal dan waktu kedatanganmu.</p>
      
      <div className={styles.formGroup}>
        <label className={styles.label}><CalendarIcon size={16}/> Tanggal</label>
        <input 
          type="date" 
          className={styles.input}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]} // block past dates
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}><Clock size={16}/> Waktu Tersedia</label>
        <div className={styles.timeGrid}>
          {["09:00", "10:30", "13:00", "15:00", "16:30"].map(time => (
            <div 
              key={time}
              className={`${styles.timeSlot} ${selectedTime === time ? styles.selectedTime : ""}`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.navButtons}>
        <Button variant="ghost" onClick={prevStep}><ArrowLeft size={16} /> Kembali</Button>
        <Button onClick={nextStep} disabled={!selectedDate || !selectedTime} className={styles.nextBtn}>
          Lanjut <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // RENDER: STEP 4 - Data Diri
  // ---------------------------------------------------------
  const renderStep4 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Lengkapi Data</h2>
      <p className={styles.stepDesc}>Kami butuh ini untuk konfirmasi jadwalmu.</p>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Nama Lengkap *</label>
        <input 
          type="text" 
          placeholder="Cth: Sarah Wijaya"
          className={styles.input}
          value={customerData.name}
          onChange={(e) => setCustomerData(prev => ({...prev, name: e.target.value}))}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>No. WhatsApp *</label>
        <input 
          type="tel" 
          placeholder="Cth: 08123456789"
          className={styles.input}
          value={customerData.phone}
          onChange={(e) => setCustomerData(prev => ({...prev, phone: e.target.value}))}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Catatan (Opsional)</label>
        <textarea 
          placeholder="Jelaskan spesifik desain jika ada referensi / request tertentu."
          className={styles.textarea}
          rows={3}
          value={customerData.notes}
          onChange={(e) => setCustomerData(prev => ({...prev, notes: e.target.value}))}
        />
      </div>
      
      <div className={styles.navButtons}>
        <Button variant="ghost" onClick={prevStep}><ArrowLeft size={16} /> Kembali</Button>
        <Button onClick={nextStep} disabled={!customerData.name || !customerData.phone} className={styles.nextBtn}>
          Lanjut <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // RENDER: STEP 5 - Confirmation
  // ---------------------------------------------------------
  const renderStep5 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Konfirmasi Booking</h2>
      <p className={styles.stepDesc}>Periksa kembali ringkasan pemesanan di bawah.</p>
      
      <Card className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <span>Layanan:</span>
          <strong>{selectedService?.name}</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Add-on:</span>
          <span className={styles.textRight}>
            {selectedAddons.length > 0 
              ? availableAddons.filter(a => selectedAddons.includes(a.id)).map(a => a.name).join(", ") 
              : "-"}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span>Jadwal:</span>
          <strong>{selectedDate} @ {selectedTime}</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Pemesan:</span>
          <strong>{customerData.name} ({customerData.phone})</strong>
        </div>
        
        <div className={styles.summaryDivider} />
        
        <div className={styles.summaryTotalRow}>
          <span>Estimasi Total</span>
          <span className={styles.summaryPrice}>Rp {totalPrice.toLocaleString("id-ID")}</span>
        </div>
      </Card>
      
      <div className={styles.privacyMsg}>
        <Lock size={14}/> <span>Setelah konfirmasi, pesanan ini akan diarahkan ke WhatsApp untuk verifikasi final dan info deposit.</span>
      </div>
      
      <div className={styles.navButtons}>
        <Button variant="ghost" onClick={prevStep}><ArrowLeft size={16} /> Ubah</Button>
        <Button variant="primary" onClick={handleConfirm} fullWidth className={styles.confirmBtn}>
          Booking via WhatsApp
        </Button>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------
  return (
    <div className={`container ${styles.wrapper}`}>
      <ScrollReveal animation="fadeIn" className={styles.wizardContainer}>
        {/* Progress Indicator */}
        <div className={styles.progressHeader}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <div className={styles.stepsLabels}>
            {STEPS.map((step, idx) => (
              <span 
                key={step} 
                className={`${styles.stepLabel} ${idx <= currentStep ? styles.stepLabelActive : ""}`}
              >
                <span className={styles.stepDigit}>{idx + 1}</span>
                <span className={styles.stepText}>{step}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className={styles.wizardBody}>
          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && renderStep2()}
          {currentStep === 2 && renderStep3()}
          {currentStep === 3 && renderStep4()}
          {currentStep === 4 && renderStep5()}
        </div>
      </ScrollReveal>
    </div>
  );
}
