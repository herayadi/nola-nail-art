"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, ArrowLeft, Calendar as CalendarIcon, Clock, Lock, Loader2 } from "lucide-react";
import styles from "./BookingWizard.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Steps definition
const STEPS = ["Layanan", "Add-on", "Jadwal", "Data Diri", "Konfirmasi"];

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Data State from API
  const [services, setServices] = useState<any[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

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

  // Fetch Services & TimeSlots
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resServices, resSlots] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/timeslots")
        ]);

        const dataServices = await resServices.json();
        const dataSlots = await resSlots.json();

        if (resServices.ok) setServices(dataServices);
        if (resSlots.ok) setAvailableTimeSlots(dataSlots);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived state
  const selectedService = services.find(s => s.id === selectedServiceId);
  
  // Derived available addons
  const availableAddons = selectedService?.addons || [];
  
  // Calculate total price
  const basePrice = selectedService?.price || 0;
  const addonsPrice = availableAddons
    .filter((a: any) => selectedAddons.includes(a.id))
    .reduce((sum: number, addon: any) => sum + addon.price, 0);
  const totalPrice = basePrice + addonsPrice;

  // Handlers
  const nextStep = () => {
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };
  
  const validateStep4 = () => {
    const phone = customerData.phone;
    let err = null;

    if (!phone.startsWith("08")) {
      err = "Nomor WhatsApp harus diawali dengan 08";
    } else if (phone.length > 13) {
      err = "Nomor WhatsApp maksimal 13 karakter";
    }

    if (err) {
      setPhoneError(err);
    } else {
      setPhoneError(null);
      nextStep();
    }
  };

  const prevStep = () => {
    setPhoneError(null);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id);
    setSelectedAddons([]); // reset addons when changing service
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    // 1. Client-side validation for phone
    if (!customerData.phone.startsWith("08")) {
      setError("Nomor WhatsApp harus diawali dengan 08");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 2. Save to database
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerData.name,
          customerPhone: customerData.phone,
          customerNotes: customerData.notes,
          selectedDate,
          timeSlot: selectedTime,
          totalPrice,
          serviceId: selectedServiceId,
          addonIds: selectedAddons,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan pesanan ke database.");
      }

      // 3. Build summary message for WhatsApp
      const lines = [
        `Halo Nola Nail Art! Saya ingin konfirmasi booking:`,
        ``,
        `*Nama:* ${customerData.name}`,
        `*Layanan:* ${selectedService?.name}`,
        `*Add-on:* ${selectedAddons.length > 0 ? availableAddons.filter((a: any) => selectedAddons.includes(a.id)).map((a: any) => a.name).join(", ") : "-"}`,
        `*Tanggal:* ${selectedDate}`,
        `*Jam:* ${selectedTime}`,
        `*Catatan:* ${customerData.notes || "-"}`,
        ``,
        `*Estimasi Total:* Rp ${totalPrice.toLocaleString("id-ID")}`
      ];
      
      const message = lines.join('\n');
      const waUrl = buildWhatsAppUrl(message);
      
      // 4. Redirect to WhatsApp
      window.open(waUrl, '_blank');
      
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // RENDER: STEP 1 - Services
  // ---------------------------------------------------------
  const renderStep1 = () => {
    if (loading) {
      return (
        <div className={styles.loadingState}>
          <Loader2 className={styles.spinner} />
          <p>Memuat daftar layanan...</p>
        </div>
      );
    }

    if (error && services.length === 0) {
      return (
        <div className={styles.errorState}>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      );
    }

    return (
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
  };

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
          {availableAddons.map((addon: any) => {
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

  // State for busy slots on selected date
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch Busy Slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchBusySlots = async () => {
      try {
        setLoadingSlots(true);
        const res = await fetch(`/api/bookings?date=${selectedDate}`);
        const data = await res.json();
        if (res.ok) {
          const times = data.map((b: any) => b.timeSlot);
          setBusySlots(times);
          // Auto-reset time if it becomes busy
          if (times.includes(selectedTime)) {
            setSelectedTime("");
          }
        }
      } catch (err) {
        console.error("Failed to fetch busy slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBusySlots();
  }, [selectedDate, selectedTime]);

  // ---------------------------------------------------------
  // RENDER: Modern Calendar Component
  // ---------------------------------------------------------
  const [viewDate, setViewDate] = useState(new Date());

  const ModernCalendar = () => {
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const calendarDays = [];
    
    // Previous month filler
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({ day: prevMonthDays - i, type: "prev", date: new Date(year, month - 1, prevMonthDays - i) });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ day: i, type: "current", date: new Date(year, month, i) });
    }
    
    // Next month filler
    const remainingSlots = 42 - calendarDays.length;
    for (let i = 1; i <= remainingSlots; i++) {
      calendarDays.push({ day: i, type: "next", date: new Date(year, month + 1, i) });
    }

    const isToday = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
      if (!selectedDate) return false;
      const [y, m, d] = selectedDate.split('-').map(Number);
      return date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y;
    };

    const isPast = (date: Date) => {
      const today = new Date();
      today.setHours(0,0,0,0);
      return date < today;
    };

    const handleDateClick = (date: Date) => {
      if (isPast(date)) return;
      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      setSelectedDate(formatted);
    };

    return (
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <span className={styles.currentMonth}>{months[month]} {year}</span>
          <div className={styles.calNav}>
            <button 
              type="button" 
              className={styles.calNavBtn} 
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              disabled={month === new Date().getMonth() && year === new Date().getFullYear()}
            >
              <ArrowLeft size={14} />
            </button>
            <button 
              type="button" 
              className={styles.calNavBtn} 
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className={styles.daysGrid}>
          {days.map(d => <div key={d} className={styles.weekdayLabel}>{d}</div>)}
          {calendarDays.map((d, idx) => {
            const past = isPast(d.date);
            const selected = isSelected(d.date);
            const today = isToday(d.date);
            
            return (
              <button
                key={idx}
                type="button"
                className={`
                  ${styles.dayBtn} 
                  ${d.type !== 'current' ? styles.otherMonth : ''} 
                  ${selected ? styles.selectedDay : ''} 
                  ${today ? styles.today : ''} 
                  ${past ? styles.disabledDay : ''}
                `}
                onClick={() => handleDateClick(d.date)}
                disabled={past}
              >
                {d.day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // RENDER: STEP 3 - Schedule
  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Pilih Jadwal</h2>
      <p className={styles.stepDesc}>Tentukan tanggal dan waktu kedatanganmu.</p>
      
      <div className={styles.formGroup}>
        <label className={styles.label}><CalendarIcon size={16}/> Pilih Tanggal</label>
        <ModernCalendar />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <Clock size={16}/> Waktu Tersedia 
          {loadingSlots && <Loader2 size={12} className={styles.spinner} style={{ marginLeft: '8px', display: 'inline' }} />}
        </label>
        <div className={styles.timeGrid}>
          {availableTimeSlots.map(slot => {
            const isBusy = busySlots.includes(slot.time);
            return (
              <button 
                key={slot.id}
                type="button"
                className={`${styles.timeSlot} ${selectedTime === slot.time ? styles.selectedTime : ""} ${isBusy ? styles.timeSlotBusy : ""}`}
                onClick={() => !isBusy && setSelectedTime(slot.time)}
                disabled={isBusy}
              >
                {slot.time}
                {isBusy && <span style={{ display: 'block', fontSize: '10px', opacity: 0.7 }}>Penuh</span>}
              </button>
            );
          })}
          {availableTimeSlots.length === 0 && !loading && (
            <p className={styles.emptyText}>Tidak ada jadwal tersedia.</p>
          )}
        </div>
      </div>
      
      <div className={styles.navButtons}>
        <Button variant="ghost" onClick={prevStep}><ArrowLeft size={16} /> Kembali</Button>
        <Button onClick={nextStep} disabled={!selectedDate || !selectedTime || loadingSlots} className={styles.nextBtn}>
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
          className={`${styles.input} ${phoneError ? styles.inputError : ""}`}
          value={customerData.phone}
          onChange={(e) => {
            setCustomerData(prev => ({...prev, phone: e.target.value}));
            if (phoneError) setPhoneError(null);
          }}
        />
        {phoneError && <span className={styles.fieldError}>{phoneError}</span>}
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
        <Button onClick={validateStep4} disabled={!customerData.name || !customerData.phone} className={styles.nextBtn}>
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
              ? availableAddons.filter((a: any) => selectedAddons.includes(a.id)).map((a: any) => a.name).join(", ") 
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
      
      {error && (
        <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div className={styles.navButtons}>
        <Button variant="ghost" onClick={prevStep} disabled={submitting}><ArrowLeft size={16} /> Ubah</Button>
        <Button 
          variant="primary" 
          onClick={handleConfirm} 
          fullWidth 
          className={styles.confirmBtn}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className={styles.spinner} /> Memproses...
            </>
          ) : (
            "Booking via WhatsApp"
          )}
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
