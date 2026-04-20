export const services = [
  {
    id: "nail-art",
    name: "Nail Art",
    description: "Dari minimal look sampai desain yang lebih bold, semua dibuat dengan detail yang bersih, halus, dan estetik.",
    shortDescription: "Dari minimal look sampai desain yang lebih bold.",
    price: 150000,
    duration: "1.5 - 2 jam",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    category: "Main Service",
    addons: [
      { id: "cuticle", name: "Cuticle Care", price: 25000 },
      { id: "gel-upgrade", name: "Gel Polish Upgrade", price: 50000 },
      { id: "glitter", name: "Glitter Accent", price: 20000 },
      { id: "french", name: "French Tips", price: 35000 }
    ],
    faqs: [
      { question: "Apakah bisa request desain khusus?", answer: "Tentu! Kamu bisa membawa referensi gambar dari Pinterest atau Instagram. Semakin cepat kamu konsultasi, hasil semakin maksimal." },
      { question: "Berapa lama tahannya?", answer: "Dengan perawatan normal, nail art kami bisa bertahan 3 hingga 4 minggu tanpa terkelupas." }
    ]
  },
  {
    id: "classic-manicure",
    name: "Classic Manicure",
    description: "Perawatan yang bikin kuku terlihat lebih sehat, tangan lebih rapi, dan hasil akhir lebih fresh. Cocok untuk daily look.",
    shortDescription: "Perawatan basic yang bikin kuku terlihat sehat.",
    price: 100000,
    duration: "45 - 60 menit",
    image: "https://images.unsplash.com/photo-1542840410-3092f99611a3?auto=format&fit=crop&q=80&w=800",
    isPopular: false,
    category: "Care",
    addons: [
      { id: "nail-repair", name: "Nail Repair", price: 30000 },
      { id: "spa", name: "Mini Spa Hand Scrub", price: 40000 }
    ],
    faqs: [
      { question: "Apakah sudah termasuk kuteks biasa?", answer: "Ya, sudah termasuk pilihan warna kuteks regular dari koleksi kami." }
    ]
  }
];

export const mockPortfolio = [
  { id: 1, img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600", category: "Elegant", title: "Soft Gloss" },
  { id: 2, img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=600", category: "Bridal", title: "Pearl White" },
  { id: 3, img: "https://images.unsplash.com/photo-1632832961559-0a5eb57ff0e2?auto=format&fit=crop&q=80&w=600", category: "Korean", title: "Blush Ombre" },
  { id: 4, img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600", category: "Glam", title: "Gold Flakes" },
  { id: 5, img: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=600", category: "Natural", title: "Clean Cut" },
  { id: 6, img: "https://images.unsplash.com/photo-1595868514936-31950d6fde2e?auto=format&fit=crop&q=80&w=600", category: "Bold", title: "Deep Burgundy" }
];

export const faqs = [
  {
    question: "Berapa lama nail art tahan?",
    answer: "Untuk gel polish, standarnya tahan 3-4 minggu. Namun, ketahanannya sangat tergantung pada aktivitas sehari-hari dan kondisi alami kuku kamu."
  },
  {
    question: "Aman tidak untuk kuku?",
    answer: "Sangat aman. Kami menggunakan teknik pengikisan yang tidak berlebihan dan memakai produk premium agar kukumu tetap sehat. Alat juga selalu disterilisasi setiap kali selesai dipakai."
  },
  {
    question: "Bisa custom design?",
    answer: "Tentu! Kamu bebas membawa desain referensi. Sangat direkomendasikan untuk mengirim desain tersebut saat booking agar tim kami bisa menyiapkan warnanya."
  },
  {
    question: "Home service atau di tempat?",
    answer: "Saat ini kami hanya melayani pengerjaan di studio untuk menjamin kenyamanan maksimal, pencahayaan terbaik, dan kehigienisan alat."
  },
  {
    question: "Area layanan di mana?",
    answer: "Studio kami berbasis di Jakarta Selatan. Detail lokasi dan petunjuk arah lengkap akan dikirimkan lewat WhatsApp setelah booking dikonfirmasi."
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sari A.",
    service: "Nail Art",
    rating: 5,
    text: "Hasilnya rapi banget dan tahan lama! Pasti balik lagi bulan depan.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 2,
    name: "Manda R.",
    service: "Bridal Nail Art",
    rating: 5,
    text: "Detail mutiaranya pas banget sama gaun nikahku. Thank you Nola!",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 3,
    name: "Kintan W.",
    service: "Classic Manicure",
    rating: 5,
    text: "Tempatnya bersih, wangi, dan pelayanannya super ramah. Very relaxing.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150"
  }
];
